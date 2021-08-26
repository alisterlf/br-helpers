import { CpfAndCnpj } from './cpf-and-cnpj';
import { format, isValidValue } from './shared';

export class Cnpj {
  static isValid(cnpj: string): boolean {
    const isValid = isValidValue(cnpj);
    const cpfLength = 14;
    return isValid && CpfAndCnpj.isValid(cnpj, cpfLength);
  }

  static format(cnpj: string): string {
    return format(cnpj, [
      [2, '.'],
      [5, '.'],
      [8, '/'],
      [12, '-'],
    ]);
  }
}
