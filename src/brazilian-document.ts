import { Modulo11CheckDigitCalculator } from './check-digit-calculator';
import { DocumentMask } from './document-mask';
import type { Identifier, MaskSlot } from './identifiers';

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

type BrazilianDocumentOptions = {
  baseLength: number;
  maskSlots: ReadonlyArray<MaskSlot>;
  allowsLetters: boolean;
};

export abstract class BrazilianDocument<TAnalysis extends DocumentAnalysisBase> {
  protected readonly baseLength: number;
  protected readonly totalLength: number;
  protected readonly allowsLetters: boolean;
  protected readonly mask: DocumentMask;
  protected readonly checkDigitCalculator: Modulo11CheckDigitCalculator;

  protected constructor(options: BrazilianDocumentOptions) {
    this.baseLength = options.baseLength;
    this.totalLength = options.baseLength + 2;
    this.allowsLetters = options.allowsLetters;
    this.mask = new DocumentMask(options.maskSlots);
    this.checkDigitCalculator = new Modulo11CheckDigitCalculator(options.baseLength);
  }

  parse(input: unknown): TAnalysis {
    const identifier = this.createIdentifier(input);
    const value = identifier.value;

    return this.createAnalysis(input, value, this.isValidValue(value), identifier.format(this.mask.slots));
  }

  isValid(input: unknown): boolean {
    if (typeof input === 'string') {
      const canonicalResult = this.validateCanonicalString(input);

      if (canonicalResult !== undefined) {
        return canonicalResult;
      }
    }

    return this.isValidValue(this.normalizeValue(input));
  }

  format(input: unknown): string {
    return this.createIdentifier(input).format(this.mask.slots);
  }

  protected abstract createIdentifier(input: unknown): Identifier;

  protected abstract normalizeValue(input: unknown): string;

  protected abstract createAnalysis(raw: unknown, value: string, valid: boolean, formatted: string): TAnalysis;

  /**
   * Validates canonical string inputs in a single pass, without allocating a
   * normalized copy. Returns undefined when the input needs the lenient
   * normalize-then-validate path (unexpected characters or mask positions).
   */
  private validateCanonicalString(text: string): boolean | undefined {
    const { baseLength, totalLength, allowsLetters, checkDigitCalculator } = this;
    const { firstWeights, secondWeights, extraDigitWeight } = checkDigitCalculator;
    const maskPositionBitmap = this.mask.positionBitmap;
    const maskSymbolCodeTable = this.mask.symbolCodeTable;
    const textLength = text.length;

    let firstSum = 0;
    let secondSum = 0;
    let charIndex = 0;
    let firstCharCode = 0;
    let hasDistinctCharacters = false;

    for (let idx = 0; idx < textLength; idx += 1) {
      let code = text.charCodeAt(idx);

      if (code >= 48 && code <= 57) {
        // Digit: falls through to the check digit handling below.
      } else if (code < 128 && maskSymbolCodeTable[code] === 1) {
        if (((maskPositionBitmap >>> charIndex) & 1) === 1) {
          continue;
        }

        return undefined;
      } else if (allowsLetters && code >= 65 && code <= 90) {
        // Uppercase letter: falls through to the check digit handling below.
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
        firstSum += characterValue * firstWeights[charIndex];
        secondSum += characterValue * secondWeights[charIndex];
      } else if (charIndex === baseLength) {
        const firstCheckDigit = checkDigitCalculator.checkDigitFor(firstSum);

        if (characterValue !== firstCheckDigit) {
          return false;
        }

        secondSum += firstCheckDigit * extraDigitWeight;
      } else if (characterValue !== checkDigitCalculator.checkDigitFor(secondSum)) {
        return false;
      }

      charIndex += 1;
    }

    return charIndex === totalLength && hasDistinctCharacters;
  }

  private isValidValue(value: string): boolean {
    if (value.length !== this.totalLength) {
      return false;
    }

    if (this.hasOnlyRepeatedCharacters(value)) {
      return false;
    }

    return this.hasValidCheckDigits(value);
  }

  private hasOnlyRepeatedCharacters(value: string): boolean {
    const firstCharacter = value[0];

    for (let idx = 1; idx < value.length; idx += 1) {
      if (value[idx] !== firstCharacter) {
        return false;
      }
    }

    return true;
  }

  private checksumValueAt(value: string, idx: number): number {
    return value.charCodeAt(idx) - 48;
  }

  private hasValidCheckDigits(value: string): boolean {
    const { baseLength, checkDigitCalculator } = this;
    const { firstWeights, secondWeights, extraDigitWeight } = checkDigitCalculator;
    let firstSum = 0;
    let secondSum = 0;

    for (let idx = 0; idx < baseLength; idx += 1) {
      const characterValue = this.checksumValueAt(value, idx);
      firstSum += characterValue * firstWeights[idx];
      secondSum += characterValue * secondWeights[idx];
    }

    const firstCheckDigit = checkDigitCalculator.checkDigitFor(firstSum);
    if (this.checksumValueAt(value, baseLength) !== firstCheckDigit) {
      return false;
    }

    secondSum += firstCheckDigit * extraDigitWeight;
    const secondCheckDigit = checkDigitCalculator.checkDigitFor(secondSum);

    return this.checksumValueAt(value, baseLength + 1) === secondCheckDigit;
  }
}
