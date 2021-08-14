export class CpfAndCnpj {
  static isCpfValid(cpf: string): boolean {
    const cpfLength = 11;
    return this.#isValid(cpf, cpfLength);
  }

  static isCnpjValid(cnpj: string): boolean {
    const cpfLength = 14;
    return this.#isValid(cnpj, cpfLength);
  }

  static formatCpf(cpf: string): string {
    const correctDigitsLength = 11;
    const firstDotPosition = 2;
    const secondDotPosition = 5;
    const slashPosition = -1;
    const dashPosition = 8;
    return this.#format(cpf, correctDigitsLength, firstDotPosition, secondDotPosition, slashPosition, dashPosition);
  }

  static formatCnpj(cnpj: string): string {
    const correctDigitsLength = 14;
    const firstDotPosition = 1;
    const secondDotPosition = 4;
    const slashPosition = 7;
    const dashPosition = 11;
    return this.#format(cnpj, correctDigitsLength, firstDotPosition, secondDotPosition, slashPosition, dashPosition);
  }

  static #format(
    digits: string,
    correctDigitsLength: number,
    firstDotPosition: number,
    secondDotPosition: number,
    slashPosition: number,
    dashPosition: number,
  ): string {
    const cleanDigits = this.#getOnlyNumbers(digits);
    return cleanDigits
      .slice(0, correctDigitsLength)
      .split('')
      .reduce((acc, digit, idx) => {
        const result = `${acc}${digit}`;
        if (idx !== digits.length - 1) {
          if (idx === firstDotPosition || idx === secondDotPosition) {
            return `${result}.`;
          }
          if (idx === slashPosition) {
            return `${result}/`;
          }
          if (idx === dashPosition) {
            return `${result}-`;
          }
        }
        return result;
      }, '');
  }

  static #isValid(digits: string, correctDigitsLength: number): boolean {
    const cleanDigits = this.#getOnlyNumbers(digits);
    if (cleanDigits.length !== correctDigitsLength || this.#isAllTheSameDigits(cleanDigits)) {
      return false;
    }
    const digitsWithoutChecker = cleanDigits.substring(0, correctDigitsLength - 2);
    const digitsChecker = cleanDigits.substring(correctDigitsLength - 2, correctDigitsLength);
    const calculatedChecker = this.#calcChecker(digitsWithoutChecker);
    return digitsChecker === calculatedChecker;
  }

  static #getOnlyNumbers(digits: string): string {
    return digits.replace(/\D/g, '');
  }

  static #isAllTheSameDigits(digits: string): boolean {
    return !digits.split('').some((digit) => digit !== digits[0]);
  }

  static #calcChecker(digits: string): string {
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
      return this.#calcChecker(`${digits}${checker}`);
    }

    return `${digits[digitsLength - 1]}${checker}`;
  }
}
