import type { MaskSlot, NormalizedIdentifier } from './digits';
import { AlphanumericIdentifier, NumericIdentifier } from './digits';

type DocumentKind = 'cpf' | 'cnpj';
type AnalysisKey = 'digits' | 'value';
type IdentifierFactory = { from(input: unknown): NormalizedIdentifier };
type CheckerWeights = {
  first: readonly number[];
  second: readonly number[];
  extraDigit: number;
};

type DocumentSpec<TKey extends AnalysisKey> = {
  analysisKey: TKey;
  identifierFactory: IdentifierFactory;
  formatSlots: ReadonlyArray<MaskSlot>;
  baseLength: number;
  normalizedPattern: RegExp;
  checkerWeights: CheckerWeights;
};

type DocumentSpecMap = {
  cpf: DocumentSpec<'digits'>;
  cnpj: DocumentSpec<'value'>;
};

function getCheckerStartWeight(effectiveLength: number): number {
  return effectiveLength < 11 ? effectiveLength + 1 : effectiveLength - 7;
}

function getCheckerWeight(startWeight: number, idx: number): number {
  return startWeight - idx >= 2 ? startWeight - idx : startWeight + 8 - idx;
}

function buildCheckerWeights(baseLength: number): CheckerWeights {
  const firstStartWeight = getCheckerStartWeight(baseLength);
  const secondStartWeight = getCheckerStartWeight(baseLength + 1);

  return {
    first: Array.from({ length: baseLength }, (_, idx) => getCheckerWeight(firstStartWeight, idx)),
    second: Array.from({ length: baseLength }, (_, idx) => getCheckerWeight(secondStartWeight, idx)),
    extraDigit: getCheckerWeight(secondStartWeight, baseLength),
  };
}

const documentSpecs: DocumentSpecMap = {
  cpf: {
    analysisKey: 'digits',
    identifierFactory: NumericIdentifier,
    baseLength: 9,
    formatSlots: [
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ],
    normalizedPattern: /^\d{11}$/,
    checkerWeights: buildCheckerWeights(9),
  },
  cnpj: {
    analysisKey: 'value',
    identifierFactory: AlphanumericIdentifier,
    baseLength: 12,
    formatSlots: [
      [2, '.'],
      [5, '.'],
      [8, '/'],
      [12, '-'],
    ],
    normalizedPattern: /^[A-Z0-9]{12}\d{2}$/,
    checkerWeights: buildCheckerWeights(12),
  },
};

type BaseDocumentAnalysis = {
  raw: unknown;
  valid: boolean;
  formatted: string;
};

export type NumericDocumentAnalysis = BaseDocumentAnalysis & {
  digits: string;
};

export type AlphanumericDocumentAnalysis = BaseDocumentAnalysis & {
  value: string;
};

export class BrazilianIdentifierEngine {
  static parse(input: unknown, document: 'cpf'): NumericDocumentAnalysis;
  static parse(input: unknown, document: 'cnpj'): AlphanumericDocumentAnalysis;
  static parse(input: unknown, document: DocumentKind): NumericDocumentAnalysis | AlphanumericDocumentAnalysis {
    const spec = this.#getSpec(document);
    const identifier = spec.identifierFactory.from(input);
    const value = identifier.value;

    return {
      raw: input,
      [spec.analysisKey]: value,
      valid: this.#isValidNormalizedValue(value, spec),
      formatted: identifier.applyMask(spec.formatSlots),
    } as NumericDocumentAnalysis | AlphanumericDocumentAnalysis;
  }

  static isValid(input: unknown, document: DocumentKind): boolean {
    const spec = this.#getSpec(document);
    return this.#isValidNormalizedValue(spec.identifierFactory.from(input).value, spec);
  }

  static format(input: unknown, document: DocumentKind): string {
    const spec = this.#getSpec(document);
    return spec.identifierFactory.from(input).applyMask(spec.formatSlots);
  }

  static #getSpec<TDocument extends DocumentKind>(document: TDocument): DocumentSpecMap[TDocument] {
    return documentSpecs[document];
  }

  static #isAllTheSameCharacters(value: string): boolean {
    const firstCharacter = value[0];
    for (let idx = 1; idx < value.length; idx += 1) {
      if (value[idx] !== firstCharacter) {
        return false;
      }
    }

    return true;
  }

  static #getCharacterValue(value: string, idx: number): number {
    return value.charCodeAt(idx) - 48;
  }

  static #isValidNormalizedValue<TKey extends AnalysisKey>(value: string, spec: DocumentSpec<TKey>): boolean {
    const { baseLength, normalizedPattern } = spec;
    if (value.length !== baseLength + 2 || !normalizedPattern.test(value)) {
      return false;
    }

    if (this.#isAllTheSameCharacters(value)) {
      return false;
    }

    const base = value.slice(0, baseLength);
    return value.slice(baseLength) === this.#calculateCheckDigits(base, spec);
  }

  static #calculateCheckDigits<TKey extends AnalysisKey>(base: string, spec: DocumentSpec<TKey>): string {
    const { baseLength, checkerWeights } = spec;
    let firstSum = 0;
    let secondSum = 0;

    for (let idx = 0; idx < baseLength; idx += 1) {
      const characterValue = this.#getCharacterValue(base, idx);
      firstSum += characterValue * checkerWeights.first[idx];
      secondSum += characterValue * checkerWeights.second[idx];
    }

    const firstDigit = this.#getCheckDigit(firstSum);
    secondSum += firstDigit * checkerWeights.extraDigit;
    const secondDigit = this.#getCheckDigit(secondSum);

    return `${firstDigit}${secondDigit}`;
  }

  static #getCheckDigit(sum: number): number {
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }
}
