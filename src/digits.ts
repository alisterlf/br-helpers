export type MaskSlot = [position: number, symbol: string];

export class Digits {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static from(input: unknown): Digits {
    return new Digits(String(input).replace(/\D/g, ''));
  }

  get length(): number {
    return this.value.length;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  mask(symbols: ReadonlyArray<MaskSlot>): string {
    let symbolIndex = 0;
    let result = '';

    for (let idx = 0; idx < this.value.length; idx += 1) {
      while (symbols[symbolIndex] && idx === symbols[symbolIndex][0]) {
        result += symbols[symbolIndex][1];
        symbolIndex += 1;
      }
      result += this.value[idx];
    }

    return result;
  }
}
