import { Cpf } from './cpf';

describe('Cpf', () => {
  describe('parse', () => {
    it('Should return normalized CPF analysis', () => {
      expect(Cpf.parse('137.686.636-63')).toEqual({
        raw: '137.686.636-63',
        digits: '13768663663',
        valid: true,
        formatted: '137.686.636-63',
      });
    });
  });

  describe('format', () => {
    it('Should return CPF with dots and dash', () => {
      expect(Cpf.format('13768663663')).toBe('137.686.636-63');
    });

    it('Should format incomplete CPF input while typing', () => {
      expect(Cpf.format('1376866366')).toBe('137.686.636-6');
    });
  });
  it('Should return false to an empty string', () => {
    expect(Cpf.isValid('')).toBeFalsy();
  });

  it('Should return true to a valid CPF starting with 0', () => {
    expect(Cpf.isValid('06325112733')).toBeTruthy();
  });

  it('Should return true to a valid CPF just with digits', () => {
    expect(Cpf.isValid('13768663663')).toBeTruthy();
  });

  it('Should return true to a valid CPF with separator -', () => {
    expect(Cpf.isValid('137686636-63')).toBeTruthy();
  });

  it('Should return true to a valid CPF with separator - and .', () => {
    expect(Cpf.isValid('137.686.636-63')).toBeTruthy();
  });

  it('Should return false when is not a valid CPF just with digits', () => {
    expect(Cpf.isValid('06487598710')).toBeFalsy();
  });

  it('Should return false when is not a valid CPF with separator -', () => {
    expect(Cpf.isValid('064875987-10')).toBeFalsy();
  });

  it('Should return false when is not a valid CPF with separator - and .', () => {
    expect(Cpf.isValid('064.875.987-10')).toBeFalsy();
  });

  it('Should return false when is mixing digits and letter', () => {
    expect(Cpf.isValid('a064.875.987-10')).toBeFalsy();
  });

  it('Should return false to special characters', () => {
    expect(Cpf.isValid('0&.*00.00a-00')).toBeFalsy();
  });

  it('Should return false is 11 repeat digits', () => {
    expect(Cpf.isValid('00000000000')).toBeFalsy();
  });

  it('Checker 1 = 0', () => {
    expect(Cpf.isValid('76381842202')).toBeTruthy();
  });

  it('Checker 1 > 1', () => {
    expect(Cpf.isValid('125.828.106-65')).toBeTruthy();
  });

  it('Checker 2 = 0', () => {
    expect(Cpf.isValid('433.787.588-30')).toBeTruthy();
  });

  it('Checker 2 > 1', () => {
    expect(Cpf.isValid('855.178.021-25')).toBeTruthy();
  });

  describe('isValid - lenient input', () => {
    it('Should ignore spaces around and between digits', () => {
      expect(Cpf.isValid(' 137 686 636 63 ')).toBeTruthy();
    });

    it('Should ignore separators at unusual positions', () => {
      expect(Cpf.isValid('1.3.7.6.8.6.6.3.6.6.3')).toBeTruthy();
    });

    it('Should ignore doubled separators', () => {
      expect(Cpf.isValid('137..686..636--63')).toBeTruthy();
    });

    it('Should ignore letters mixed into a valid CPF', () => {
      expect(Cpf.isValid('a13768663663')).toBeTruthy();
    });

    it('Should accept numeric input', () => {
      expect(Cpf.isValid(13768663663)).toBeTruthy();
    });
  });
});
