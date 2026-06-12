export type MaskSlot = [position: number, symbol: string];

function isDigitCode(code: number): boolean {
  return code >= 48 && code <= 57;
}

function isUppercaseAlphanumericCode(code: number): boolean {
  return isDigitCode(code) || (code >= 65 && code <= 90);
}

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

  static normalizeValue(input: unknown): string {
    const text = this.normalizeInput(input);
    const length = text.length;
    let idx = 0;

    while (idx < length && isUppercaseAlphanumericCode(text.charCodeAt(idx))) {
      idx += 1;
    }

    if (idx === length) {
      return text;
    }

    let result = text.slice(0, idx);
    for (; idx < length; idx += 1) {
      const code = text.charCodeAt(idx);

      if (isUppercaseAlphanumericCode(code)) {
        result += text[idx];
      } else if (code >= 97 && code <= 122) {
        result += String.fromCharCode(code - 32);
      } else if (code >= 128) {
        return text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      }
    }

    return result;
  }
}

export class NumericIdentifier extends Identifier {
  private constructor(value: string) {
    super(value);
  }

  static from(input: unknown): NumericIdentifier {
    return new NumericIdentifier(this.normalizeValue(input));
  }

  static normalizeValue(input: unknown): string {
    const text = this.normalizeInput(input);
    const length = text.length;
    let idx = 0;

    while (idx < length && isDigitCode(text.charCodeAt(idx))) {
      idx += 1;
    }

    if (idx === length) {
      return text;
    }

    let result = text.slice(0, idx);
    for (; idx < length; idx += 1) {
      if (isDigitCode(text.charCodeAt(idx))) {
        result += text[idx];
      }
    }

    return result;
  }
}
