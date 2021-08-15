import { Shared } from './shared';

export class Cpf {
  static isValid(cpf: string): boolean {
    const cpfLength = 11;
    return Shared.isValid(cpf, cpfLength);
  }

  static format(cpf: string): string {
    const firstDotPosition = 2;
    const secondDotPosition = 5;
    const slashPosition = -1;
    const dashPosition = 8;
    return Shared.format(cpf, firstDotPosition, secondDotPosition, slashPosition, dashPosition);
  }
}
