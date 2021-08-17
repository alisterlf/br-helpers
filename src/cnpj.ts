import { Shared } from './shared';

export class Cnpj {
  static isValid(cnpj: string): boolean {
    const isValidValue = Shared.isValidValue(cnpj);
    const cpfLength = 14;
    return isValidValue && Shared.isCpfOrCnpjValid(cnpj, cpfLength);
  }

  static format(cnpj: string): string {
    return Shared.format(cnpj, [
      [2, '.'],
      [5, '.'],
      [8, '/'],
      [12, '-'],
    ]);
  }
}
