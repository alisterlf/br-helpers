export function getAlphanumericFromString(digits: string): string {
  return digits.replace(/[^A-Z0-9]/g, '');
}

export function format(digits: string, symbols: Array<[position: number, symbol: string]>): string {
  const cleanDigits = getAlphanumericFromString(digits);
  return cleanDigits.split('').reduce((acc, digit, idx) => {
    let result = acc;
    if (symbols[0] && idx === symbols[0][0]) {
      result = `${result}${symbols.shift()?.[1]}`;
    }
    return `${result}${digit}`;
  }, '');
}
export function isValidValue(value: string): boolean {
  return !!value && typeof value === 'string';
}
