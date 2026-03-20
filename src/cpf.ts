import { BrazilianIdentifierEngine } from './brazilian-identifier-engine';
import type { DocumentAnalysis } from './brazilian-identifier-engine';

export type CpfAnalysis = DocumentAnalysis;

export class Cpf {
  static parse(cpf: unknown): CpfAnalysis {
    return BrazilianIdentifierEngine.parse(cpf, 'cpf');
  }

  static isValid(cpf: unknown): boolean {
    return BrazilianIdentifierEngine.isValid(cpf, 'cpf');
  }

  static format(cpf: unknown): string {
    return BrazilianIdentifierEngine.format(cpf, 'cpf');
  }
}
