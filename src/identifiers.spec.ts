import { AlphanumericIdentifier, NumericIdentifier } from './identifiers';

describe('AlphanumericIdentifier', () => {
  it('should normalize alphanumeric input and keep shared mask behavior', () => {
    const slots: Array<[number, string]> = [
      [2, '.'],
      [5, '.'],
      [8, '/'],
      [12, '-'],
    ];

    const identifier = AlphanumericIdentifier.from('12abc345/01de-35');

    expect(identifier.value).toBe('12ABC34501DE35');
    expect(identifier.digits).toBe('123450135');
    expect(identifier.format(slots)).toBe('12.ABC.345/01DE-35');
    expect(slots).toEqual([
      [2, '.'],
      [5, '.'],
      [8, '/'],
      [12, '-'],
    ]);
  });
});

describe('NumericIdentifier', () => {
  it('should normalize dirty input without mutating mask slots', () => {
    const slots: Array<[number, string]> = [
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ];

    expect(NumericIdentifier.from('137.686.636-63').value).toBe('13768663663');
    expect(NumericIdentifier.from('13768663663').format(slots)).toBe('137.686.636-63');
    expect(slots).toEqual([
      [3, '.'],
      [6, '.'],
      [9, '-'],
    ]);
    expect(NumericIdentifier.from('13768663663').format(slots)).toBe('137.686.636-63');
  });

  it('should report when the normalized value is empty', () => {
    expect(NumericIdentifier.from('').isEmpty()).toBe(true);
    expect(NumericIdentifier.from('CPF: 137.686.636-63').isEmpty()).toBe(false);
  });

  it('should keep digits-only normalization even when letters are present', () => {
    const identifier = NumericIdentifier.from('12ABC34501DE35');

    expect(identifier.value).toBe('123450135');
    expect(identifier.digits).toBe('123450135');
  });
});
