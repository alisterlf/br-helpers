import { Shared } from './shared';
export class Cpf {
  static isValid(cpf: string): boolean {
    const isValidValue = Shared.isValidValue(cpf);
    const cpfLength = 11;
    return isValidValue && Shared.isCpfOrCnpjValid(cpf, cpfLength);
  }

  static format(cpf: string): string {
    return Shared.format(cpf, [
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ]);
  }
}
