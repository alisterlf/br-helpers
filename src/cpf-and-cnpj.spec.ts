import { CpfAndCnpj } from './cpf-and-cnpj';

describe('Cpf and Cnpj', () => {
  describe('Cpf', () => {
    describe('format', () => {
      it('Should return CPF with dots and dash', () => {
        expect(CpfAndCnpj.formatCpf('13768663663')).toBe('137.686.636-63');
      });
    });
    it('Should return false to an empty string', () => {
      expect(CpfAndCnpj.isCpfValid('')).toBeFalsy();
    });

    it('Should return true to a valid CPF starting with 0', () => {
      expect(CpfAndCnpj.isCpfValid('06325112733')).toBeTruthy();
    });

    it('Should return true to a valid CPF just with digits', () => {
      expect(CpfAndCnpj.isCpfValid('13768663663')).toBeTruthy();
    });

    it('Should return true to a valid CPF with separator -', () => {
      expect(CpfAndCnpj.isCpfValid('137686636-63')).toBeTruthy();
    });

    it('Should return true to a valid CPF with separator - and .', () => {
      expect(CpfAndCnpj.isCpfValid('137.686.636-63')).toBeTruthy();
    });

    it('Should return false when is not a valid CPF just with digits', () => {
      expect(CpfAndCnpj.isCpfValid('06487598710')).toBeFalsy();
    });

    it('Should return false when is not a valid CPF with separator -', () => {
      expect(CpfAndCnpj.isCpfValid('064875987-10')).toBeFalsy();
    });

    it('Should return false when is not a valid CPF with separator - and .', () => {
      expect(CpfAndCnpj.isCpfValid('064.875.987-10')).toBeFalsy();
    });

    it('Should return false when is mixing digits and letter', () => {
      expect(CpfAndCnpj.isCpfValid('a064.875.987-10')).toBeFalsy();
    });

    it('Should return false to special caracters', () => {
      expect(CpfAndCnpj.isCpfValid('0&.*00.00a-00')).toBeFalsy();
    });

    it('Should return false is 11 repeat digits', () => {
      expect(CpfAndCnpj.isCpfValid('00000000000')).toBeFalsy();
    });

    it('Verificador 1 = 0', () => {
      expect(CpfAndCnpj.isCpfValid('76381842202')).toBeTruthy();
    });

    it('Verificador 1 > 1', () => {
      expect(CpfAndCnpj.isCpfValid('125.828.106-65')).toBeTruthy();
    });

    it('Verificador 2 = 0', () => {
      expect(CpfAndCnpj.isCpfValid('433.787.588-30')).toBeTruthy();
    });

    it('Verificador 2 > 1', () => {
      expect(CpfAndCnpj.isCpfValid('855.178.021-25')).toBeTruthy();
    });
  });
  describe('Cnpj', () => {
    describe('format', () => {
      it('Should return CNPJ with dots, slash and dash', () => {
        expect(CpfAndCnpj.formatCnpj('26149878000187')).toBe('26.149.878/0001-87');
      });
    });

    it('Should return true to a valid CNPJ starting with 0', () => {
      expect(CpfAndCnpj.isCnpjValid('06860123000189')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ just with digits', () => {
      expect(CpfAndCnpj.isCnpjValid('26533854000127')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with separator -', () => {
      expect(CpfAndCnpj.isCnpjValid('261498780001-87')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with separator - and /', () => {
      expect(CpfAndCnpj.isCnpjValid('26149878/0001-87')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with separator - and / and .', () => {
      expect(CpfAndCnpj.isCnpjValid('26.149.878/0001-87')).toBeTruthy();
    });

    it('Should return false when is not a valid CNPJ just with digits', () => {
      expect(CpfAndCnpj.isCnpjValid('06860123000188')).toBeFalsy();
    });

    it('Should return false when is not a valid CNPJ with separator -', () => {
      expect(CpfAndCnpj.isCnpjValid('068601230001-88')).toBeFalsy();
    });

    it('Should return false when is not a valid CNPJ with separator - and / and .', () => {
      expect(CpfAndCnpj.isCnpjValid('26.149.878/0001-88')).toBeFalsy();
    });

    it('Should return false when is mixing digits and letter', () => {
      expect(CpfAndCnpj.isCnpjValid('a1.775.044/0001-31')).toBeFalsy();
    });

    it('Should return false to special caracters', () => {
      expect(CpfAndCnpj.isCnpjValid('*1.775.044/0001-31')).toBeFalsy();
    });

    it('Should return false is 14 repeat digits', () => {
      expect(CpfAndCnpj.isCnpjValid('00000000000000')).toBeFalsy();
    });

    it('Should return true to a valid CNPJ with first checker = 0', () => {
      expect(CpfAndCnpj.isCnpjValid('04.096.776/0001-08')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with first checker 1 >= 1', () => {
      expect(CpfAndCnpj.isCnpjValid('29.613.398/0001-13')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with second checker = 0', () => {
      expect(CpfAndCnpj.isCnpjValid('35.661.025/0001-10')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with second checker 2 >= 1', () => {
      expect(CpfAndCnpj.isCnpjValid('53.638.687/0001-51')).toBeTruthy();
    });
  });
});
