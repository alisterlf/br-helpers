import { CpfAndCnpj } from './cep-and-cnpj';
import { format, isValidValue } from './shared';
export class Cpf {
  static isValid(cpf: string): boolean {
    const isValid = isValidValue(cpf);
    const cpfLength = 11;
    return isValid && CpfAndCnpj.isValid(cpf, cpfLength);
  }

  static format(cpf: string): string {
    return format(cpf, [
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ]);
  }
}
