import { Cep } from './cep';
describe('format', () => {
  it('should format CEP with mask', () => {
    expect(Cep.format('')).toBe('');
    expect(Cep.format('0')).toBe('0');
    expect(Cep.format('01')).toBe('01');
    expect(Cep.format('010')).toBe('010');
    expect(Cep.format('0100')).toBe('0100');
    expect(Cep.format('01001')).toBe('01001');
    expect(Cep.format('010010')).toBe('01001-0');
    expect(Cep.format('0100100')).toBe('01001-00');
    expect(Cep.format('01001000')).toBe('01001-000');
  });
});

describe('isValid', () => {
  describe('should return false', () => {
    it('when it is an empty string', () => {
      expect(Cep.isValid('')).toBe(false);
    });
    it('when it is null', () => {
      expect(Cep.isValid(null as any)).toBe(false);
    });
    it('when it is undefined', () => {
      expect(Cep.isValid(undefined as any)).toBe(false);
    });
    it(`when length is greater than 8`, () => {
      expect(Cep.isValid('123456789')).toBe(false);
    });
    it('when is array', () => {
      expect(Cep.isValid([] as any)).toBe(false);
    });
    it('when is object', () => {
      expect(Cep.isValid({} as any)).toBe(false);
    });
    it('when is boolean', () => {
      expect(Cep.isValid(true as any)).toBe(false);
      expect(Cep.isValid(false as any)).toBe(false);
    });
  });
  describe('should return true', () => {
    it('when is a cep valid without mask', () => {
      expect(Cep.isValid('92500000')).toBe(true);
    });
    it('when is a cep valid with mask', () => {
      expect(Cep.isValid('92500-000')).toBe(true);
    });
  });
});
