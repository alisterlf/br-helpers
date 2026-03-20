export type MaskSlot = [position: number, symbol: string];

export abstract class Identifier {
  readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }

  get length(): number {
    return this.value.length;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  get digits(): string {
    return this.value.replace(/\D/g, '');
  }

  format(maskSlots: ReadonlyArray<MaskSlot>): string {
    const valueLength = this.value.length;
    let result = '';
    let start = 0;

    for (let idx = 0; idx < maskSlots.length; idx += 1) {
      const [position, symbol] = maskSlots[idx];

      if (position >= valueLength) {
        break;
      }

      result += this.value.slice(start, position) + symbol;
      start = position;
    }

    return result + this.value.slice(start);
  }

  protected static normalizeInput(input: unknown): string {
    if (typeof input !== 'string' && typeof input !== 'number' && typeof input !== 'bigint') {
      return '';
    }

    return String(input);
  }
}

export class AlphanumericIdentifier extends Identifier {
  private constructor(value: string) {
    super(value);
  }

  static from(input: unknown): AlphanumericIdentifier {
    return new AlphanumericIdentifier(this.normalizeValue(input));
  }

  protected static normalizeValue(input: unknown): string {
    return this.normalizeInput(input)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
  }
}

export class NumericIdentifier extends Identifier {
  private constructor(value: string) {
    super(value);
  }

  static from(input: unknown): NumericIdentifier {
    return new NumericIdentifier(this.normalizeValue(input));
  }

  protected static normalizeValue(input: unknown): string {
    return this.normalizeInput(input).replace(/\D/g, '');
  }
}
