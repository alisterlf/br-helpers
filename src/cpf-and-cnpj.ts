import { Digits, MaskSlot } from './shared';

type DocumentKind = 'cpf' | 'cnpj';

type DocumentSpec = {
  digitsLength: number;
  digitsWithoutCheckerLength: number;
  formatSlots: ReadonlyArray<MaskSlot>;
};

const documentSpecs: Record<DocumentKind, DocumentSpec> = {
  cpf: {
    digitsLength: 11,
    digitsWithoutCheckerLength: 9,
    formatSlots: [
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ],
  },
  cnpj: {
    digitsLength: 14,
    digitsWithoutCheckerLength: 12,
    formatSlots: [
      [2, '.'],
      [5, '.'],
      [8, '/'],
      [12, '-'],
    ],
  },
};

export type DocumentAnalysis = {
  raw: unknown;
  digits: string;
  valid: boolean;
  formatted: string;
};

export class CpfAndCnpj {
  static parse(input: unknown, document: DocumentKind): DocumentAnalysis {
    const digits = Digits.from(input);
    const spec = this.#getSpec(document);

    return {
      raw: input,
      digits: digits.value,
      valid: this.#isValidDigits(digits.value, spec),
      formatted: digits.mask(spec.formatSlots),
    };
  }

  static isValid(input: unknown, document: DocumentKind): boolean {
    return this.parse(input, document).valid;
  }

  static format(input: unknown, document: DocumentKind): string {
    return this.parse(input, document).formatted;
  }

  static #getSpec(document: DocumentKind): DocumentSpec {
    return documentSpecs[document];
  }

  static #isAllTheSameDigits(digits: string): boolean {
    return digits.length > 0 && !digits.split('').some((digit) => digit !== digits[0]);
  }

  static #calcChecker(digits: string, spec: DocumentSpec): string {
    const len = digits.length;
    const sum = this.#sumDigits(digits, len);
    const sumDivisionRemainder = sum % 11;
    const checker = sumDivisionRemainder < 2 ? 0 : 11 - sumDivisionRemainder;
    if (len === spec.digitsWithoutCheckerLength) {
      return this.#calcChecker(`${digits}${checker}`, spec);
    }
    return `${digits[len - 1]}${checker}`;
  }

  static #sumDigits(digits: string, digitsLength: number): number {
    const weight = this.#getCheckerWeights(digitsLength);
    return digits.split('').reduce((acc, digit, idx) => {
      const offsetValue = weight - idx >= 2 ? 0 : 8;
      return acc + +digit * (weight + offsetValue - idx);
    }, 0);
  }
  static #getCheckerWeights(len: number): number {
    return len < 11 ? len + 1 : len - 7;
  }

  static #isValidDigits(cleanDigits: string, spec: DocumentSpec): boolean {
    if (cleanDigits.length !== spec.digitsLength || this.#isAllTheSameDigits(cleanDigits)) {
      return false;
    }
    const digitsWithoutChecker = cleanDigits.substring(0, spec.digitsWithoutCheckerLength);
    const digitsChecker = cleanDigits.substring(spec.digitsWithoutCheckerLength, spec.digitsLength);
    const calculatedChecker = this.#calcChecker(digitsWithoutChecker, spec);
    return digitsChecker === calculatedChecker;
  }
}
