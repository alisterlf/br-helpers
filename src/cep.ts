import { Shared } from './shared';
export class Cep {
  static isValid(cep: string): boolean {
    const isValidValue = Shared.isValidValue(cep);
    const cepLength = 8;
    return isValidValue && Shared.getOnlyNumbers(cep).length === cepLength;
  }

  static format(cep: string): string {
    return Shared.format(cep, [[5, '-']]);
  }
}
