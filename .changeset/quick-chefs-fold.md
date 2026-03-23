---
'br-helpers': patch
---

Update formatMask properties to readonly in Cep and Phone classes

- Changed #formatMask in Cep class to readonly for better encapsulation.
- Updated #mobileMaskSlots and #landlineMaskSlots in Phone class to readonly
  to ensure they are not modified after initialization.
- Adjusted import order in Phone class for consistency.
