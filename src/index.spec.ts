import { CpfCnpjUtils } from '.';

describe('Cpf and Cnpj Utils', () => {
  describe('Cpf', () => {
    describe('format', () => {
      it('Should return CPF with dots and dash', () => {
        expect(CpfCnpjUtils.formatCpf('13768663663')).toBe('137.686.636-63');
      });
    });
    it('Should return false to an empty string', () => {
      expect(CpfCnpjUtils.isCpfValid('')).toBeFalsy();
    });

    it('Should return true to a valid CPF starting with 0', () => {
      expect(CpfCnpjUtils.isCpfValid('06325112733')).toBeTruthy();
    });

    it('Should return true to a valid CPF just with digits', () => {
      expect(CpfCnpjUtils.isCpfValid('13768663663')).toBeTruthy();
    });

    it('Should return true to a valid CPF with separator -', () => {
      expect(CpfCnpjUtils.isCpfValid('137686636-63')).toBeTruthy();
    });

    it('Should return true to a valid CPF with separator - and .', () => {
      expect(CpfCnpjUtils.isCpfValid('137.686.636-63')).toBeTruthy();
    });

    it('Should return false when is not a valid CPF just with digits', () => {
      expect(CpfCnpjUtils.isCpfValid('06487598710')).toBeFalsy();
    });

    it('Should return false when is not a valid CPF with separator -', () => {
      expect(CpfCnpjUtils.isCpfValid('064875987-10')).toBeFalsy();
    });

    it('Should return false when is not a valid CPF with separator - and .', () => {
      expect(CpfCnpjUtils.isCpfValid('064.875.987-10')).toBeFalsy();
    });

    it('Should return false when is mixing digits and letter', () => {
      expect(CpfCnpjUtils.isCpfValid('a064.875.987-10')).toBeFalsy();
    });

    it('Should return false to special caracters', () => {
      expect(CpfCnpjUtils.isCpfValid('0&.*00.00a-00')).toBeFalsy();
    });

    it('Should return false is 11 repeat digits', () => {
      expect(CpfCnpjUtils.isCpfValid('00000000000')).toBeFalsy();
    });

    it('Verificador 1 = 0', () => {
      expect(CpfCnpjUtils.isCpfValid('76381842202')).toBeTruthy();
    });

    it('Verificador 1 > 1', () => {
      expect(CpfCnpjUtils.isCpfValid('125.828.106-65')).toBeTruthy();
    });

    it('Verificador 2 = 0', () => {
      expect(CpfCnpjUtils.isCpfValid('433.787.588-30')).toBeTruthy();
    });

    it('Verificador 2 > 1', () => {
      expect(CpfCnpjUtils.isCpfValid('855.178.021-25')).toBeTruthy();
    });
  });
  describe('Cnpj', () => {
    describe('format', () => {
      it('Should return CNPJ with dots, slash and dash', () => {
        expect(CpfCnpjUtils.formatCnpj('26149878000187')).toBe('26.149.878/0001-87');
      });
    });

    it('Should return true to a valid CNPJ starting with 0', () => {
      expect(CpfCnpjUtils.isCnpjValid('06860123000189')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ just with digits', () => {
      expect(CpfCnpjUtils.isCnpjValid('26533854000127')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with separator -', () => {
      expect(CpfCnpjUtils.isCnpjValid('261498780001-87')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with separator - and /', () => {
      expect(CpfCnpjUtils.isCnpjValid('26149878/0001-87')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with separator - and / and .', () => {
      expect(CpfCnpjUtils.isCnpjValid('26.149.878/0001-87')).toBeTruthy();
    });

    it('Should return false when is not a valid CNPJ just with digits', () => {
      expect(CpfCnpjUtils.isCnpjValid('06860123000188')).toBeFalsy();
    });

    it('Should return false when is not a valid CNPJ with separator -', () => {
      expect(CpfCnpjUtils.isCnpjValid('068601230001-88')).toBeFalsy();
    });

    it('Should return false when is not a valid CNPJ with separator - and / and .', () => {
      expect(CpfCnpjUtils.isCnpjValid('26.149.878/0001-88')).toBeFalsy();
    });

    it('Should return false when is mixing digits and letter', () => {
      expect(CpfCnpjUtils.isCnpjValid('a1.775.044/0001-31')).toBeFalsy();
    });

    it('Should return false to special caracters', () => {
      expect(CpfCnpjUtils.isCnpjValid('*1.775.044/0001-31')).toBeFalsy();
    });

    it('Should return false is 14 repeat digits', () => {
      expect(CpfCnpjUtils.isCnpjValid('00000000000000')).toBeFalsy();
    });

    it('Should return true to a valid CNPJ with first checker = 0', () => {
      expect(CpfCnpjUtils.isCnpjValid('04.096.776/0001-08')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with first checker 1 >= 1', () => {
      expect(CpfCnpjUtils.isCnpjValid('29.613.398/0001-13')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with second checker = 0', () => {
      expect(CpfCnpjUtils.isCnpjValid('35.661.025/0001-10')).toBeTruthy();
    });

    it('Should return true to a valid CNPJ with second checker 2 >= 1', () => {
      expect(CpfCnpjUtils.isCnpjValid('53.638.687/0001-51')).toBeTruthy();
    });
  });
});
