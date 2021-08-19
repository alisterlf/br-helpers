export function getOnlyNumbersFromString(digits: string): string {
  return String(digits).replace(/\D/g, '');
}

export function format(digits: string, symbols: Array<[position: number, symbol: string]>): string {
  const cleanDigits = getOnlyNumbersFromString(digits);
  return cleanDigits.split('').reduce((acc, digit, idx) => {
    let result = acc;
    if (symbols[0] && idx === symbols[0][0]) {
      result = `${result}${symbols.shift()[1]}`;
    }
    return `${result}${digit}`;
  }, '');
}
export function isValidValue(value: string): boolean {
  return !!value || typeof value === 'string';
}
