import { Shared } from './shared';

export class Cnpj {
  static isValid(cnpj: string): boolean {
    const cpfLength = 14;
    return Shared.isValid(cnpj, cpfLength);
  }

  static format(cnpj: string): string {
    const firstDotPosition = 1;
    const secondDotPosition = 4;
    const slashPosition = 7;
    const dashPosition = 11;
    return Shared.format(cnpj, firstDotPosition, secondDotPosition, slashPosition, dashPosition);
  }
}
