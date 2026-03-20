import { NumericIdentifier } from './digits';
export class Cep {
  static #formatMask: ReadonlyArray<[number, string]> = [[5, '-']];

  static isValid(cep: string): boolean {
    const hasValue = !!cep || typeof cep === 'string';
    const cepLength = 8;
    return hasValue && NumericIdentifier.from(cep).length === cepLength;
  }

  static format(cep: string): string {
    return NumericIdentifier.from(cep).applyMask(this.#formatMask);
  }
}
