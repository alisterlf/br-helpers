import { Shared } from './shared';

export class Cnpj {
  static isValid(cnpj: string): boolean {
    const cpfLength = 14;
    return Shared.isCpfOrCnpjValid(cnpj, cpfLength);
  }

  static format(cnpj: string): string {
    return Shared.format(cnpj, [
      [1, '.'],
      [4, '.'],
      [7, '/'],
      [11, '-'],
    ]);
  }
}
