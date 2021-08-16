import { Shared } from './shared';

export class Cpf {
  static isValid(cpf: string): boolean {
    const cpfLength = 11;
    return Shared.isCpfOrCnpjValid(cpf, cpfLength);
  }

  static format(cpf: string): string {
    return Shared.format(cpf, [
      [2, '.'],
      [5, '.'],
      [8, '-'],
    ]);
  }
}
