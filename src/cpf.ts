import { BrazilianDocumentEngine } from './brazilian-document-engine';
import type { NumericDocumentAnalysis } from './brazilian-document-engine';

export type CpfAnalysis = NumericDocumentAnalysis;

export class Cpf {
  static parse(cpf: unknown): CpfAnalysis {
    return BrazilianDocumentEngine.parse(cpf, 'cpf');
  }

  static isValid(cpf: unknown): boolean {
    return BrazilianDocumentEngine.isValid(cpf, 'cpf');
  }

  static format(cpf: unknown): string {
    return BrazilianDocumentEngine.format(cpf, 'cpf');
  }
}
