export class Shared {
  static #getCheckerWeights(len: number): number {
    return len < 11 ? len + 1 : len - 7;
  }
  static #getLenWithoutChecker(len: number): number {
    return len < 11 ? 9 : 12;
  }
  static #sumCpfOrCnpj(digits: string): number {
    const digitsLength = digits.length;
    const weight = this.#getCheckerWeights(digitsLength);
    return digits.split('').reduce((acc, digit, idx) => {
      const offsetValue = weight - idx >= 2 ? 0 : 8;
      return acc + +digit * (weight + offsetValue - idx);
    }, 0);
  }
  static #calcCpfOrCnpjChecker(digits: string): string {
    const len = digits.length;
    const lenWithoutChecker = this.#getLenWithoutChecker(len);
    const sum = this.#sumCpfOrCnpj(digits);
    const sumDivisionRemainder = sum % 11;
    const checker = sumDivisionRemainder < 2 ? 0 : 11 - sumDivisionRemainder;
    if (len === lenWithoutChecker) {
      return this.#calcCpfOrCnpjChecker(`${digits}${checker}`);
    }
    return `${digits[len - 1]}${checker}`;
  }
  static isValidValue(value: string): boolean {
    return !!value || typeof value === 'string';
  }
  static format(digits: string, symbols: Array<[number, string]>): string {
    const cleanDigits = this.getOnlyNumbers(digits);
    return cleanDigits.split('').reduce((acc, digit, idx) => {
      if (symbols[0] && idx === symbols[0][0]) {
        return `${acc}${symbols.shift()[1]}${digit}`;
      }
      return `${acc}${digit}`;
    }, '');
  }
  static isCpfOrCnpjValid(digits: string, correctDigitsLength: number): boolean {
    const cleanDigits = this.getOnlyNumbers(digits);
    if (cleanDigits.length !== correctDigitsLength || this.isAllTheSameDigits(cleanDigits)) {
      return false;
    }
    const digitsWithoutChecker = cleanDigits.substring(0, correctDigitsLength - 2);
    const digitsChecker = cleanDigits.substring(correctDigitsLength - 2, correctDigitsLength);
    const calculatedChecker = this.#calcCpfOrCnpjChecker(digitsWithoutChecker);
    return digitsChecker === calculatedChecker;
  }
  static getOnlyNumbers(digits: string): string {
    return String(digits).replace(/\D/g, '');
  }
  static isAllTheSameDigits(digits: string): boolean {
    return !digits.split('').some((digit) => digit !== digits[0]);
  }
}
