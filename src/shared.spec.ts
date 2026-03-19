import { Digits, format, getOnlyNumbersFromString, isValidValue } from './shared';

describe('Digits', () => {
  it('should normalize dirty input without mutating mask slots', () => {
    const slots: Array<[number, string]> = [
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ];

    expect(Digits.from('137.686.636-63').value).toBe('13768663663');
    expect(format('13768663663', slots)).toBe('137.686.636-63');
    expect(slots).toEqual([
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ]);
    expect(format('13768663663', slots)).toBe('137.686.636-63');
  });

  it('should keep compatibility helpers working', () => {
    expect(getOnlyNumbersFromString('(11) 97983-7935')).toBe('11979837935');
    expect(isValidValue('')).toBe(true);
    expect(isValidValue(null)).toBe(false);
  });
});
