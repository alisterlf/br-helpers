import { CpfAndCnpj, DocumentAnalysis } from './cpf-and-cnpj';

export type CpfAnalysis = DocumentAnalysis;

export class Cpf {
  static parse(cpf: unknown): CpfAnalysis {
    return CpfAndCnpj.parse(cpf, 'cpf');
  }

  static isValid(cpf: unknown): boolean {
    return this.parse(cpf).valid;
  }

  static format(cpf: unknown): string {
    return this.parse(cpf).formatted;
  }
}
