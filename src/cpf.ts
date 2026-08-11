import { BrazilianDocument } from './brazilian-document';
import type { NumericDocumentAnalysis } from './brazilian-document';
import { NumericIdentifier } from './identifiers';
import type { Identifier } from './identifiers';

export type CpfAnalysis = NumericDocumentAnalysis;

class CpfDocument extends BrazilianDocument<CpfAnalysis> {
  constructor() {
    super({
      baseLength: 9,
      maskSlots: [
        [3, '.'],
        [6, '.'],
        [9, '-'],
      ],
      allowsLetters: false,
    });
  }

  protected createIdentifier(input: unknown): Identifier {
    return NumericIdentifier.from(input);
  }

  protected normalizeValue(input: unknown): string {
    return NumericIdentifier.normalizeValue(input);
  }

  protected createAnalysis(raw: unknown, value: string, valid: boolean, formatted: string): CpfAnalysis {
    return { raw, digits: value, valid, formatted };
  }
}

const cpfDocument = new CpfDocument();

export class Cpf {
  static parse(cpf: unknown): CpfAnalysis {
    return cpfDocument.parse(cpf);
  }

  static isValid(cpf: unknown): boolean {
    return cpfDocument.isValid(cpf);
  }

  static format(cpf: unknown): string {
    return cpfDocument.format(cpf);
  }
}
