import type { Identifier, MaskSlot } from './identifiers';
import { AlphanumericIdentifier, NumericIdentifier } from './identifiers';

type DocumentType = 'cpf' | 'cnpj';
type AnalysisValueKey = 'digits' | 'value';
type IdentifierConstructor = { from(input: unknown): Identifier };
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
  valuePattern: RegExp;
  checkDigitWeights: CheckDigitWeights;
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

const documentDefinitions: DocumentDefinitionMap = {
  cpf: {
    resultKey: 'digits',
    identifierConstructor: NumericIdentifier,
    baseLength: 9,
    maskSlots: [
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ],
    valuePattern: /^\d{11}$/,
    checkDigitWeights: buildCheckDigitWeights(9),
  },
  cnpj: {
    resultKey: 'value',
    identifierConstructor: AlphanumericIdentifier,
    baseLength: 12,
    maskSlots: [
      [2, '.'],
      [5, '.'],
      [8, '/'],
      [12, '-'],
    ],
    valuePattern: /^[A-Z0-9]{12}\d{2}$/,
    checkDigitWeights: buildCheckDigitWeights(12),
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

    return {
      raw: input,
      [definition.resultKey]: value,
      valid: this.#isValidValue(value, definition),
      formatted: identifier.format(definition.maskSlots),
    } as NumericDocumentAnalysis | AlphanumericDocumentAnalysis;
  }

  static isValid(input: unknown, document: DocumentType): boolean {
    const definition = this.#getDefinition(document);
    return this.#isValidValue(definition.identifierConstructor.from(input).value, definition);
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
    const { baseLength, valuePattern } = definition;
    if (value.length !== baseLength + 2 || !valuePattern.test(value)) {
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

    const firstDigit = this.#getCheckDigit(firstSum);
    if (this.#getChecksumValue(value, baseLength) !== firstDigit) {
      return false;
    }

    secondSum += firstDigit * checkDigitWeights.extraDigit;
    const secondDigit = this.#getCheckDigit(secondSum);

    return this.#getChecksumValue(value, baseLength + 1) === secondDigit;
  }

  static #getCheckDigit(sum: number): number {
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }
}
