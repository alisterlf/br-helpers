# Changelog

All notable changes to this project will be documented in this file.

This changelog starts with `v3.0.1`, the first release that documents breaking changes explicitly in-repo. Earlier versions are still available through git tags and GitHub releases.

## [3.0.1] - 2026-03-20

### Breaking changes

- Replaced the legacy `Digits` API with `NumericIdentifier` and `AlphanumericIdentifier`.
- Renamed the low-level subpath export from `br-helpers/digits` to `br-helpers/identifiers`.
- Renamed `Digits#mask(...)` to `Identifier#format(...)`.
- Changed `Cnpj.parse()` to return `value` instead of `digits` so alphanumeric CNPJ values can be represented without data loss.

### Added

- Added support for alphanumeric CNPJ validation, parsing, and formatting.
- Added reusable low-level primitives: `Identifier`, `NumericIdentifier`, `AlphanumericIdentifier`, and `MaskSlot`.
- Added a `br-helpers` CLI with commands for `cpf`, `cnpj`, `cep`, `phone`, and `identifier`.
- Added JSON and text output modes plus field filtering in the CLI.
- Added dedicated package subpath exports for `cep`, `cnpj`, `cpf`, `phone`, and `identifiers`.

### Changed

- Refactored CPF and CNPJ handling into a shared `BrazilianDocumentEngine`.
- Normalized lowercase alphanumeric CNPJ input to uppercase before validation and formatting.
- Kept progressive formatting behavior across CPF, CNPJ, CEP, and phone helpers.
- Updated the README to cover the full public API, CLI usage, subpath imports, and migration notes.

### Migration guide

Before:

```ts
import { Digits } from 'br-helpers/digits';

const digits = Digits.from('12abc345/01de-35');
digits.mask([
  [2, '.'],
  [5, '.'],
  [8, '/'],
  [12, '-'],
]);
```

After:

```ts
import { AlphanumericIdentifier, NumericIdentifier } from 'br-helpers/identifiers';

const cnpj = AlphanumericIdentifier.from('12abc345/01de-35');
cnpj.format([
  [2, '.'],
  [5, '.'],
  [8, '/'],
  [12, '-'],
]);

const cpf = NumericIdentifier.from('CPF: 137.686.636-63');
cpf.format([
  [3, '.'],
  [6, '.'],
  [9, '-'],
]);
```

Before:

```ts
const result = Cnpj.parse('12abc34501de35');
result.digits;
```

After:

```ts
const result = Cnpj.parse('12abc34501de35');
result.value;
```

### References

- Previous stable release: `v2.0.0`
- Compare: `https://github.com/alisterlf/br-helpers/compare/v2.0.0...v3.0.0`
