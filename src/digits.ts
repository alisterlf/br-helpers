export type MaskSlot = [position: number, symbol: string];

export abstract class NormalizedIdentifier {
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

  applyMask(slots: ReadonlyArray<MaskSlot>): string {
    const valueLength = this.value.length;
    let result = '';
    let start = 0;

    for (let idx = 0; idx < slots.length; idx += 1) {
      const [position, symbol] = slots[idx];

      if (position >= valueLength) {
        break;
      }

      result += this.value.slice(start, position) + symbol;
      start = position;
    }

    return result + this.value.slice(start);
  }

  protected static normalizeSource(input: unknown): string {
    if (typeof input !== 'string' && typeof input !== 'number' && typeof input !== 'bigint') {
      return '';
    }

    return String(input).toUpperCase();
  }
}

export class AlphanumericIdentifier extends NormalizedIdentifier {
  private constructor(value: string) {
    super(value);
  }

  static from(input: unknown): AlphanumericIdentifier {
    return new AlphanumericIdentifier(this.normalizeAlphanumericValue(input));
  }

  protected static normalizeAlphanumericValue(input: unknown): string {
    return this.normalizeSource(input).replace(/[^A-Z0-9]/g, '');
  }
}

export class NumericIdentifier extends NormalizedIdentifier {
  private constructor(value: string) {
    super(value);
  }

  static from(input: unknown): NumericIdentifier {
    return new NumericIdentifier(this.normalizeNumericValue(input));
  }

  protected static normalizeNumericValue(input: unknown): string {
    return this.normalizeSource(input).replace(/\D/g, '');
  }
}
