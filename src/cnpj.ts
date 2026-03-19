import { CpfAndCnpj, DocumentAnalysis } from './cpf-and-cnpj';

export type CnpjAnalysis = DocumentAnalysis;

export class Cnpj {
  static parse(cnpj: unknown): CnpjAnalysis {
    return CpfAndCnpj.parse(cnpj, 'cnpj');
  }

  static isValid(cnpj: unknown): boolean {
    return this.parse(cnpj).valid;
  }

  static format(cnpj: unknown): string {
    return this.parse(cnpj).formatted;
  }
}
