import { BrazilianIdentifierEngine } from './brazilian-identifier-engine';
import type { AlphanumericDocumentAnalysis } from './brazilian-identifier-engine';

export type CnpjAnalysis = AlphanumericDocumentAnalysis;

export class Cnpj {
  static parse(cnpj: unknown): CnpjAnalysis {
    return BrazilianIdentifierEngine.parse(cnpj, 'cnpj');
  }

  static isValid(cnpj: unknown): boolean {
    return BrazilianIdentifierEngine.isValid(cnpj, 'cnpj');
  }

  static format(cnpj: unknown): string {
    return BrazilianIdentifierEngine.format(cnpj, 'cnpj');
  }
}
