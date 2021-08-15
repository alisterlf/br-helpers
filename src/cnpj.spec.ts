import { Cnpj } from './cnpj';

describe('Cnpj', () => {
  describe('format', () => {
    it('Should return CNPJ with dots, slash and dash', () => {
      expect(Cnpj.format('26149878000187')).toBe('26.149.878/0001-87');
    });
  });

  it('Should return true to a valid CNPJ starting with 0', () => {
    expect(Cnpj.isValid('06860123000189')).toBeTruthy();
  });

  it('Should return true to a valid CNPJ just with digits', () => {
    expect(Cnpj.isValid('26533854000127')).toBeTruthy();
  });

  it('Should return true to a valid CNPJ with separator -', () => {
    expect(Cnpj.isValid('261498780001-87')).toBeTruthy();
  });

  it('Should return true to a valid CNPJ with separator - and /', () => {
    expect(Cnpj.isValid('26149878/0001-87')).toBeTruthy();
  });

  it('Should return true to a valid CNPJ with separator - and / and .', () => {
    expect(Cnpj.isValid('26.149.878/0001-87')).toBeTruthy();
  });

  it('Should return false when is not a valid CNPJ just with digits', () => {
    expect(Cnpj.isValid('06860123000188')).toBeFalsy();
  });

  it('Should return false when is not a valid CNPJ with separator -', () => {
    expect(Cnpj.isValid('068601230001-88')).toBeFalsy();
  });

  it('Should return false when is not a valid CNPJ with separator - and / and .', () => {
    expect(Cnpj.isValid('26.149.878/0001-88')).toBeFalsy();
  });

  it('Should return false when is mixing digits and letter', () => {
    expect(Cnpj.isValid('a1.775.044/0001-31')).toBeFalsy();
  });

  it('Should return false to special caracters', () => {
    expect(Cnpj.isValid('*1.775.044/0001-31')).toBeFalsy();
  });

  it('Should return false is 14 repeat digits', () => {
    expect(Cnpj.isValid('00000000000000')).toBeFalsy();
  });

  it('Should return true to a valid CNPJ with first checker = 0', () => {
    expect(Cnpj.isValid('04.096.776/0001-08')).toBeTruthy();
  });

  it('Should return true to a valid CNPJ with first checker 1 >= 1', () => {
    expect(Cnpj.isValid('29.613.398/0001-13')).toBeTruthy();
  });

  it('Should return true to a valid CNPJ with second checker = 0', () => {
    expect(Cnpj.isValid('35.661.025/0001-10')).toBeTruthy();
  });

  it('Should return true to a valid CNPJ with second checker 2 >= 1', () => {
    expect(Cnpj.isValid('53.638.687/0001-51')).toBeTruthy();
  });
});
