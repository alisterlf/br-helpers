export class Shared {
  static format(digits: string, firstDotPosition: number, secondDotPosition: number, slashPosition: number, dashPosition: number): string {
    const cleanDigits = this.getOnlyNumbers(digits);
    return cleanDigits.split('').reduce((acc, digit, idx) => {
      const result = `${acc}${digit}`;
      switch (idx) {
        case firstDotPosition:
        case secondDotPosition:
          return `${result}.`;
        case slashPosition:
          return `${result}/`;
        case dashPosition:
          return `${result}-`;
        default:
          return result;
      }
    }, '');
  }

  static isValid(digits: string, correctDigitsLength: number): boolean {
    const cleanDigits = this.getOnlyNumbers(digits);
    if (cleanDigits.length !== correctDigitsLength || this.isAllTheSameDigits(cleanDigits)) {
      return false;
    }
    const digitsWithoutChecker = cleanDigits.substring(0, correctDigitsLength - 2);
    const digitsChecker = cleanDigits.substring(correctDigitsLength - 2, correctDigitsLength);
    const calculatedChecker = this.calcChecker(digitsWithoutChecker);
    return digitsChecker === calculatedChecker;
  }

  static getOnlyNumbers(digits: string): string {
    return digits.replace(/\D/g, '');
  }

  static isAllTheSameDigits(digits: string): boolean {
    return !digits.split('').some((digit) => digit !== digits[0]);
  }

  static calcChecker(digits: string): string {
    const digitsLength = digits.length;
    const digitsLengthWithoutChecker = digitsLength < 11 ? 9 : 12;
    const weight = digitsLength < 11 ? digitsLength + 1 : digitsLength - 7;

    const sum = digits.split('').reduce((acc, digit, idx) => {
      const offsetValue = weight - idx >= 2 ? 0 : 8;
      return acc + +digit * (weight + offsetValue - idx);
    }, 0);

    const sumDivisionRemainder = sum % 11;
    const checker = sumDivisionRemainder < 2 ? 0 : 11 - sumDivisionRemainder;

    if (digitsLength === digitsLengthWithoutChecker) {
      return this.calcChecker(`${digits}${checker}`);
    }

    return `${digits[digitsLength - 1]}${checker}`;
  }
}
