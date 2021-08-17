import { Shared } from './shared';
export class Phone {
  static #areaCodes = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
  ];
  static #isValidLength(phone: string): boolean {
    const clearPhone = Shared.getOnlyNumbers(phone);
    return clearPhone.length >= 10 && clearPhone.length <= 11;
  }
  static #isValidDDD(phone: string): boolean {
    const clearPhone = Shared.getOnlyNumbers(phone);
    return Phone.#areaCodes.includes(+clearPhone.substring(0, 2));
  }
  static isValid(phone: string): boolean {
    return Shared.isValidValue(phone) && this.#isValidLength(phone) && this.#isValidDDD(phone);
  }
  static format(phone: string): string {
    const dashLocation = phone.length === 10 ? 6 : 7;
    return Shared.format(phone, [
      [0, '('],
      [2, ') '],
      [dashLocation, '-'],
    ]);
  }
}