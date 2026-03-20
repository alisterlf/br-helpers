import { Digits } from './digits';

describe('Digits', () => {
  it('should normalize dirty input without mutating mask slots', () => {
    const slots: Array<[number, string]> = [
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ];

    expect(Digits.from('137.686.636-63').value).toBe('13768663663');
    expect(Digits.from('13768663663').mask(slots)).toBe('137.686.636-63');
    expect(slots).toEqual([
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ]);
    expect(Digits.from('13768663663').mask(slots)).toBe('137.686.636-63');
  });
});
