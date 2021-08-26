import { getOnlyNumbersFromString } from './shared';

export class CpfAndCnpj {
  static #isAllTheSameDigits(digits: string): boolean {
    return !digits.split('').some((digit) => digit !== digits[0]);
  }
  static #calcChecker(digits: string): string {
    const len = digits.length;
    const lenWithoutChecker = this.#getLenWithoutChecker(len);
    const sum = this.#sumDigits(digits, len);
    const sumDivisionRemainder = sum % 11;
    const checker = sumDivisionRemainder < 2 ? 0 : 11 - sumDivisionRemainder;
    if (len === lenWithoutChecker) {
      return this.#calcChecker(`${digits}${checker}`);
    }
    return `${digits[len - 1]}${checker}`;
  }
  static #getLenWithoutChecker(len: number): number {
    return len < 11 ? 9 : 12;
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
  static isValid(digits: string, correctDigitsLength: number): boolean {
    const cleanDigits = getOnlyNumbersFromString(digits);
    if (cleanDigits.length !== correctDigitsLength || this.#isAllTheSameDigits(cleanDigits)) {
      return false;
    }
    const digitsWithoutChecker = cleanDigits.substring(0, correctDigitsLength - 2);
    const digitsChecker = cleanDigits.substring(correctDigitsLength - 2, correctDigitsLength);
    const calculatedChecker = this.#calcChecker(digitsWithoutChecker);
    return digitsChecker === calculatedChecker;
  }
}
