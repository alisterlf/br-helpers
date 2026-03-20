import { Digits, MaskSlot } from './digits';

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

export class BrazilianIdentifierEngine {
  static parse(input: unknown, document: DocumentKind): DocumentAnalysis {
    const digits = Digits.from(input);
    const digitsValue = digits.value;
    const spec = this.#getSpec(document);

    return {
      raw: input,
      digits: digitsValue,
      valid: this.#isValidDigits(digitsValue, spec),
      formatted: digits.mask(spec.formatSlots),
    };
  }

  static isValid(input: unknown, document: DocumentKind): boolean {
    const digits = Digits.from(input);
    return this.#isValidDigits(digits.value, this.#getSpec(document));
  }

  static format(input: unknown, document: DocumentKind): string {
    const digits = Digits.from(input);
    return digits.mask(this.#getSpec(document).formatSlots);
  }

  static #getSpec(document: DocumentKind): DocumentSpec {
    return documentSpecs[document];
  }

  static #isAllTheSameDigits(digits: string): boolean {
    if (digits.length === 0) {
      return false;
    }

    const firstDigit = digits[0];
    for (let idx = 1; idx < digits.length; idx += 1) {
      if (digits[idx] !== firstDigit) {
        return false;
      }
    }

    return true;
  }

  static #getDigitAt(digits: string, idx: number): number {
    return digits.charCodeAt(idx) - 48;
  }

  static #calcChecker(digits: string, digitsLength: number, extraDigit?: number): number {
    const effectiveLength = extraDigit === undefined ? digitsLength : digitsLength + 1;
    const weight = this.#getCheckerWeights(effectiveLength);
    let sum = 0;

    for (let idx = 0; idx < digitsLength; idx += 1) {
      const offsetValue = weight - idx >= 2 ? 0 : 8;
      sum += this.#getDigitAt(digits, idx) * (weight + offsetValue - idx);
    }

    if (extraDigit !== undefined) {
      const idx = digitsLength;
      const offsetValue = weight - idx >= 2 ? 0 : 8;
      sum += extraDigit * (weight + offsetValue - idx);
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  static #getCheckerWeights(len: number): number {
    return len < 11 ? len + 1 : len - 7;
  }

  static #isValidDigits(cleanDigits: string, spec: DocumentSpec): boolean {
    if (cleanDigits.length !== spec.digitsLength || this.#isAllTheSameDigits(cleanDigits)) {
      return false;
    }

    const firstCheckerIndex = spec.digitsWithoutCheckerLength;
    const firstChecker = this.#calcChecker(cleanDigits, firstCheckerIndex);
    if (firstChecker !== this.#getDigitAt(cleanDigits, firstCheckerIndex)) {
      return false;
    }

    const secondChecker = this.#calcChecker(cleanDigits, firstCheckerIndex, firstChecker);
    return secondChecker === this.#getDigitAt(cleanDigits, firstCheckerIndex + 1);
  }
}
