import { format, getOnlyNumbersFromString, isValidValue } from './shared';
export class Phone {
  static #areaCodes = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
  ];
  static #mobileValidFirstNumber = [6, 7, 8, 9];
  static #landlineValidFirstNumber = [2, 3, 4, 5];
  static #isValidLength(phone: string): boolean {
    return phone.length >= 10 && phone.length <= 11;
  }
  static #isValidDDD(phone: string): boolean {
    return Phone.#areaCodes.includes(+phone.substring(0, 2));
  }
  static #isFirstNumberValid(phone: string): boolean {
    let isValid = false;
    if (phone.length === 11) {
      isValid = this.#mobileValidFirstNumber.includes(+phone[2]);
    } else if (phone.length === 10) {
      isValid = this.#landlineValidFirstNumber.includes(+phone[2]);
    }
    return isValid;
  }
  static isValid(phone: string): boolean {
    if (!isValidValue(phone)) return false;
    const clearPhone = getOnlyNumbersFromString(phone);
    return this.#isValidLength(clearPhone) && this.#isValidDDD(clearPhone) && this.#isFirstNumberValid(clearPhone);
  }
  static format(phone: string): string {
    const dashLocation = phone.length === 10 ? 6 : 7;
    return format(phone, [
      [0, '('],
      [2, ') '],
      [dashLocation, '-'],
    ]);
  }
}
