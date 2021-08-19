import { Cpf } from './cpf';

describe('Cpf', () => {
  describe('format', () => {
    it('Should return CPF with dots and dash', () => {
      expect(Cpf.format('13768663663')).toBe('137.686.636-63');
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
});
