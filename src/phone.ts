import type { MaskSlot } from './identifiers';
import { NumericIdentifier } from './identifiers';

export type PhoneKind = 'mobile' | 'landline';

export type PhoneAnalysis = {
  raw: unknown;
  digits: string;
  ddd: string | null;
  kind: PhoneKind | null;
  valid: boolean;
  formatted: string;
};

export class Phone {
  private static readonly areaCodes = new Set([
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
  ]);
  private static readonly mobileMaskSlots: ReadonlyArray<MaskSlot> = [
    [0, '('],
    [2, ') '],
    [7, '-'],
  ];
  private static readonly landlineMaskSlots: ReadonlyArray<MaskSlot> = [
    [0, '('],
    [2, ') '],
    [6, '-'],
  ];

  private static isValidLength(phone: string): boolean {
    return phone.length >= 10 && phone.length <= 11;
  }

  private static getDdd(phone: string): string | null {
    return phone.length >= 2 ? phone.substring(0, 2) : null;
  }

  private static isDigitInRange(digit: string | undefined, start: string, end: string): boolean {
    return digit !== undefined && digit >= start && digit <= end;
  }

  private static getKind(phone: string): PhoneKind | null {
    const firstNumber = phone[2];

    if (phone.length === 11) {
      return this.isDigitInRange(firstNumber, '6', '9') ? 'mobile' : null;
    }
    if (phone.length === 10) {
      return this.isDigitInRange(firstNumber, '2', '5') ? 'landline' : null;
    }
    return null;
  }

  private static isValidDdd(ddd: string | null): boolean {
    return ddd !== null && this.areaCodes.has(+ddd);
  }

  private static getMaskSlots(length: number): ReadonlyArray<MaskSlot> {
    return length === 10 ? this.landlineMaskSlots : this.mobileMaskSlots;
  }

  private static hasValue(value: unknown): boolean {
    return !!value || typeof value === 'string';
  }

  private static isValidPhone(value: unknown, digits: string, ddd: string | null, kind: PhoneKind | null): boolean {
    return this.hasValue(value) && this.isValidLength(digits) && this.isValidDdd(ddd) && kind !== null;
  }

  static parse(phone: unknown): PhoneAnalysis {
    const digits = NumericIdentifier.from(phone);
    const ddd = this.getDdd(digits.value);
    const kind = this.getKind(digits.value);

    return {
      raw: phone,
      digits: digits.value,
      ddd,
      kind,
      valid: this.isValidPhone(phone, digits.value, ddd, kind),
      formatted: digits.format(this.getMaskSlots(digits.length)),
    };
  }

  static isValid(phone: unknown): boolean {
    const digits = NumericIdentifier.normalizeValue(phone);
    const ddd = this.getDdd(digits);
    const kind = this.getKind(digits);
    return this.isValidPhone(phone, digits, ddd, kind);
  }

  static format(phone: unknown): string {
    const digits = NumericIdentifier.from(phone);
    return digits.format(this.getMaskSlots(digits.length));
  }
}
