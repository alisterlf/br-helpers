import { BrazilianDocumentEngine } from './brazilian-document-engine';
import type { AlphanumericDocumentAnalysis } from './brazilian-document-engine';

export type CnpjAnalysis = AlphanumericDocumentAnalysis;

export class Cnpj {
  static parse(cnpj: unknown): CnpjAnalysis {
    return BrazilianDocumentEngine.parse(cnpj, 'cnpj');
  }

  static isValid(cnpj: unknown): boolean {
    return BrazilianDocumentEngine.isValid(cnpj, 'cnpj');
  }

  static format(cnpj: unknown): string {
    return BrazilianDocumentEngine.format(cnpj, 'cnpj');
  }
}
