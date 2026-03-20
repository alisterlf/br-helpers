import { Digits } from './digits';
export class Cep {
  static isValid(cep: string): boolean {
    const hasValue = !!cep || typeof cep === 'string';
    const cepLength = 8;
    return hasValue && Digits.from(cep).length === cepLength;
  }

  static format(cep: string): string {
    return Digits.from(cep).mask([[5, '-']]);
  }
}
