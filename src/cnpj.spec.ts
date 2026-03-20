import { Cnpj } from './cnpj';

describe('Cnpj', () => {
  describe('parse', () => {
    it('Should return normalized CNPJ analysis', () => {
      expect(Cnpj.parse('26.149.878/0001-87')).toEqual({
        raw: '26.149.878/0001-87',
        value: '26149878000187',
        valid: true,
        formatted: '26.149.878/0001-87',
      });
    });

    it('Should normalize lowercase alphanumeric CNPJ to uppercase', () => {
      expect(Cnpj.parse('12abc34501de35')).toEqual({
        raw: '12abc34501de35',
        value: '12ABC34501DE35',
        valid: true,
        formatted: '12.ABC.345/01DE-35',
      });
    });
  });

  describe('format', () => {
    it('Should return CNPJ with dots, slash and dash', () => {
      expect(Cnpj.format('26149878000187')).toBe('26.149.878/0001-87');
    });

    it('Should format incomplete CNPJ input while typing', () => {
      expect(Cnpj.format('2614987800018')).toBe('26.149.878/0001-8');
    });

    it('Should format lowercase alphanumeric CNPJ with uppercase letters', () => {
      expect(Cnpj.format('12abc34501de35')).toBe('12.ABC.345/01DE-35');
    });

    it('Should format incomplete alphanumeric CNPJ input while typing', () => {
      expect(Cnpj.format('12ABC34501DE')).toBe('12.ABC.345/01DE');
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

  it('Should return true to a valid alphanumeric CNPJ', () => {
    expect(Cnpj.isValid('12ABC34501DE35')).toBeTruthy();
  });

  it('Should return true to a valid alphanumeric CNPJ typed in lowercase', () => {
    expect(Cnpj.isValid('12abc34501de35')).toBeTruthy();
  });

  it('Should return true to another valid alphanumeric CNPJ', () => {
    expect(Cnpj.isValid('1345C3A5000106')).toBeTruthy();
  });

  it('Should return true to an all-letter valid alphanumeric CNPJ', () => {
    expect(Cnpj.isValid('ABCDEFGHIJKL80')).toBeTruthy();
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

  it('Should return false to an invalid alphanumeric CNPJ', () => {
    expect(Cnpj.isValid('a1.775.044/0001-31')).toBeFalsy();
  });

  it('Should return false to special characters', () => {
    expect(Cnpj.isValid('*1.775.044/0001-31')).toBeFalsy();
  });

  it('Should return false is 14 repeat digits', () => {
    expect(Cnpj.isValid('00000000000000')).toBeFalsy();
  });

  it('Should return false to an alphanumeric CNPJ with invalid check digits', () => {
    expect(Cnpj.isValid('12ABC34501DE36')).toBeFalsy();
  });

  it('Should return false when the first check digit is a letter', () => {
    expect(Cnpj.isValid('12ABC34501DEP5')).toBeFalsy();
  });

  it('Should return false when the second check digit is a letter', () => {
    expect(Cnpj.isValid('12ABC34501DE3P')).toBeFalsy();
  });

  it('Should return false to an alphanumeric CNPJ that is too short', () => {
    expect(Cnpj.isValid('12ABC34501DE3')).toBeFalsy();
  });

  it('Should return false to an alphanumeric CNPJ that is too long', () => {
    expect(Cnpj.isValid('12ABC34501DE350')).toBeFalsy();
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
