import { format, getOnlyNumbersFromString, isValidValue } from './shared';
export class Cep {
  static isValid(cep: string): boolean {
    const isValid = isValidValue(cep);
    const cepLength = 8;
    return isValid && getOnlyNumbersFromString(cep).length === cepLength;
  }

  static format(cep: string): string {
    return format(cep, [[5, '-']]);
  }
}
