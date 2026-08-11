import { BrazilianDocument } from './brazilian-document';
import type { AlphanumericDocumentAnalysis } from './brazilian-document';
import { AlphanumericIdentifier } from './identifiers';
import type { Identifier } from './identifiers';

export type CnpjAnalysis = AlphanumericDocumentAnalysis;

class CnpjDocument extends BrazilianDocument<CnpjAnalysis> {
  constructor() {
    super({
      baseLength: 12,
      maskSlots: [
        [2, '.'],
        [5, '.'],
        [8, '/'],
        [12, '-'],
      ],
      allowsLetters: true,
    });
  }

  protected createIdentifier(input: unknown): Identifier {
    return AlphanumericIdentifier.from(input);
  }

  protected normalizeValue(input: unknown): string {
    return AlphanumericIdentifier.normalizeValue(input);
  }

  protected createAnalysis(raw: unknown, value: string, valid: boolean, formatted: string): CnpjAnalysis {
    return { raw, value, valid, formatted };
  }
}

const cnpjDocument = new CnpjDocument();

export class Cnpj {
  static parse(cnpj: unknown): CnpjAnalysis {
    return cnpjDocument.parse(cnpj);
  }

  static isValid(cnpj: unknown): boolean {
    return cnpjDocument.isValid(cnpj);
  }

  static format(cnpj: unknown): string {
    return cnpjDocument.format(cnpj);
  }
}
