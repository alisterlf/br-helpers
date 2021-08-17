import { Phone } from './phone';

describe('Phone', () => {
  describe('format', () => {
    it('Should return a formatted phone number', () => {
      expect(Phone.format('1179837935')).toBe('(11) 7983-7935');
    });
    it('Should return a formatted mobile phone number', () => {
      expect(Phone.format('11979837935')).toBe('(11) 97983-7935');
    });
  });
  describe('isValid', () => {
    describe('Should return false', () => {
      it('when is a mobile phone with mask and code state invalid', () => {
        expect(Phone.isValid('00979837935')).toBeFalsy();
      });
      it('when is a landline with mask and code state invalid', () => {
        expect(Phone.isValid('0079837935')).toBeFalsy();
      });
      it('when is a phone number don´t match mobile ou landline length', () => {
        expect(Phone.isValid('079837935')).toBeFalsy();
      });
    });
    describe('Should return true', () => {
      it('when is a mobile phone with valid code state', () => {
        expect(Phone.isValid('11979837935')).toBeTruthy();
      });
      it('when is a landline with mask with valid code state', () => {
        expect(Phone.isValid('1179837935')).toBeTruthy();
      });
      it('when is a mobile phone without mask', () => {
        expect(Phone.isValid('11979837935')).toBeTruthy();
      });
      it('when is a landline phone without mask', () => {
        expect(Phone.isValid('1179837935')).toBeTruthy();
      });
      it('when is a mobile phone with mask', () => {
        expect(Phone.isValid('(11) 97983-7935')).toBeTruthy();
      });
      it('when is a landline phone with mask', () => {
        expect(Phone.isValid('(11) 7983-7935')).toBeTruthy();
      });
    });
  });
});
