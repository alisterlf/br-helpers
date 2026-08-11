import type { Identifier, MaskSlot } from './identifiers';
import { AlphanumericIdentifier, NumericIdentifier } from './identifiers';

type DocumentType = 'cpf' | 'cnpj';
type AnalysisValueKey = 'digits' | 'value';
type IdentifierConstructor = {
  from(input: unknown): Identifier;
  normalizeValue(input: unknown): string;
};
type CheckDigitWeights = {
  first: readonly number[];
  second: readonly number[];
  extraDigit: number;
};

type DocumentDefinition<TKey extends AnalysisValueKey> = {
  resultKey: TKey;
  identifierConstructor: IdentifierConstructor;
  maskSlots: ReadonlyArray<MaskSlot>;
  baseLength: number;
  checkDigitWeights: CheckDigitWeights;
  allowsLetters: boolean;
  maskPositionBitmap: number;
};

type DocumentDefinitionMap = {
  cpf: DocumentDefinition<'digits'>;
  cnpj: DocumentDefinition<'value'>;
};

function getCheckerStartWeight(effectiveLength: number): number {
  return effectiveLength < 11 ? effectiveLength + 1 : effectiveLength - 7;
}

function getCheckerWeight(startWeight: number, idx: number): number {
  return startWeight - idx >= 2 ? startWeight - idx : startWeight + 8 - idx;
}

function buildCheckDigitWeights(baseLength: number): CheckDigitWeights {
  const firstStartWeight = getCheckerStartWeight(baseLength);
  const secondStartWeight = getCheckerStartWeight(baseLength + 1);

  return {
    first: Array.from({ length: baseLength }, (_, idx) => getCheckerWeight(firstStartWeight, idx)),
    second: Array.from({ length: baseLength }, (_, idx) => getCheckerWeight(secondStartWeight, idx)),
    extraDigit: getCheckerWeight(secondStartWeight, baseLength),
  };
}

function buildMaskPositionBitmap(maskSlots: ReadonlyArray<MaskSlot>): number {
  let bitmap = 0;

  for (const [position] of maskSlots) {
    bitmap |= 1 << position;
  }

  return bitmap;
}

function computeCheckDigit(sum: number): number {
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Validates canonical string inputs in a single pass, without allocating a
 * normalized copy. Returns undefined when the input needs the lenient
 * normalize-then-validate path (unexpected characters or mask positions).
 */
function validateCanonicalString(text: string, definition: DocumentDefinition<AnalysisValueKey>): boolean | undefined {
  const { baseLength, allowsLetters, maskPositionBitmap } = definition;
  const { first, second, extraDigit } = definition.checkDigitWeights;
  const totalLength = baseLength + 2;
  const textLength = text.length;

  let firstSum = 0;
  let secondSum = 0;
  let charIndex = 0;
  let firstCharCode = 0;
  let hasDistinctCharacters = false;

  for (let idx = 0; idx < textLength; idx += 1) {
    let code = text.charCodeAt(idx);

    if (code >= 48 && code <= 57) {
      // Digit: falls through to the checksum handling below.
    } else if (code === 45 || code === 46 || (code === 47 && allowsLetters)) {
      if (((maskPositionBitmap >>> charIndex) & 1) === 1) {
        continue;
      }

      return undefined;
    } else if (allowsLetters && code >= 65 && code <= 90) {
      // Uppercase letter: falls through to the checksum handling below.
    } else if (allowsLetters && code >= 97 && code <= 122) {
      code -= 32;
    } else {
      return undefined;
    }

    if (charIndex >= totalLength) {
      return false;
    }

    if (charIndex === 0) {
      firstCharCode = code;
    } else if (code !== firstCharCode) {
      hasDistinctCharacters = true;
    }

    const characterValue = code - 48;

    if (charIndex < baseLength) {
      firstSum += characterValue * first[charIndex];
      secondSum += characterValue * second[charIndex];
    } else if (charIndex === baseLength) {
      const firstDigit = computeCheckDigit(firstSum);

      if (characterValue !== firstDigit) {
        return false;
      }

      secondSum += firstDigit * extraDigit;
    } else if (characterValue !== computeCheckDigit(secondSum)) {
      return false;
    }

    charIndex += 1;
  }

  return charIndex === totalLength && hasDistinctCharacters;
}

const cpfMaskSlots: ReadonlyArray<MaskSlot> = [
  [3, '.'],
  [6, '.'],
  [9, '-'],
];

const cnpjMaskSlots: ReadonlyArray<MaskSlot> = [
  [2, '.'],
  [5, '.'],
  [8, '/'],
  [12, '-'],
];

const documentDefinitions: DocumentDefinitionMap = {
  cpf: {
    resultKey: 'digits',
    identifierConstructor: NumericIdentifier,
    baseLength: 9,
    maskSlots: cpfMaskSlots,
    checkDigitWeights: buildCheckDigitWeights(9),
    allowsLetters: false,
    maskPositionBitmap: buildMaskPositionBitmap(cpfMaskSlots),
  },
  cnpj: {
    resultKey: 'value',
    identifierConstructor: AlphanumericIdentifier,
    baseLength: 12,
    maskSlots: cnpjMaskSlots,
    checkDigitWeights: buildCheckDigitWeights(12),
    allowsLetters: true,
    maskPositionBitmap: buildMaskPositionBitmap(cnpjMaskSlots),
  },
};

type DocumentAnalysisBase = {
  raw: unknown;
  valid: boolean;
  formatted: string;
};

export type NumericDocumentAnalysis = DocumentAnalysisBase & {
  digits: string;
};

export type AlphanumericDocumentAnalysis = DocumentAnalysisBase & {
  value: string;
};

export class BrazilianDocumentEngine {
  static parse(input: unknown, document: 'cpf'): NumericDocumentAnalysis;
  static parse(input: unknown, document: 'cnpj'): AlphanumericDocumentAnalysis;
  static parse(input: unknown, document: DocumentType): NumericDocumentAnalysis | AlphanumericDocumentAnalysis {
    const definition = this.#getDefinition(document);
    const identifier = definition.identifierConstructor.from(input);
    const value = identifier.value;
    const valid = this.#isValidValue(value, definition);
    const formatted = identifier.format(definition.maskSlots);

    if (definition.resultKey === 'digits') {
      return { raw: input, digits: value, valid, formatted };
    }

    return { raw: input, value, valid, formatted };
  }

  static isValid(input: unknown, document: DocumentType): boolean {
    const definition = this.#getDefinition(document);

    if (typeof input === 'string') {
      const canonicalResult = validateCanonicalString(input, definition);

      if (canonicalResult !== undefined) {
        return canonicalResult;
      }
    }

    return this.#isValidValue(definition.identifierConstructor.normalizeValue(input), definition);
  }

  static format(input: unknown, document: DocumentType): string {
    const definition = this.#getDefinition(document);
    return definition.identifierConstructor.from(input).format(definition.maskSlots);
  }

  static #getDefinition<TDocument extends DocumentType>(document: TDocument): DocumentDefinitionMap[TDocument] {
    return documentDefinitions[document];
  }

  static #hasOnlyRepeatedCharacters(value: string): boolean {
    const firstCharacter = value[0];
    for (let idx = 1; idx < value.length; idx += 1) {
      if (value[idx] !== firstCharacter) {
        return false;
      }
    }

    return true;
  }

  static #getChecksumValue(value: string, idx: number): number {
    return value.charCodeAt(idx) - 48;
  }

  static #isValidValue<TKey extends AnalysisValueKey>(value: string, definition: DocumentDefinition<TKey>): boolean {
    if (value.length !== definition.baseLength + 2) {
      return false;
    }

    if (this.#hasOnlyRepeatedCharacters(value)) {
      return false;
    }

    return this.#hasValidCheckDigits(value, definition);
  }

  static #hasValidCheckDigits<TKey extends AnalysisValueKey>(value: string, definition: DocumentDefinition<TKey>): boolean {
    const { baseLength, checkDigitWeights } = definition;
    let firstSum = 0;
    let secondSum = 0;

    for (let idx = 0; idx < baseLength; idx += 1) {
      const characterValue = this.#getChecksumValue(value, idx);
      firstSum += characterValue * checkDigitWeights.first[idx];
      secondSum += characterValue * checkDigitWeights.second[idx];
    }

    const firstDigit = computeCheckDigit(firstSum);
    if (this.#getChecksumValue(value, baseLength) !== firstDigit) {
      return false;
    }

    secondSum += firstDigit * checkDigitWeights.extraDigit;
    const secondDigit = computeCheckDigit(secondSum);

    return this.#getChecksumValue(value, baseLength + 1) === secondDigit;
  }
}
