# Changelog

## 3.1.1

### Patch Changes

- cc2b075: Updated the static method #isValidValue to improve validation logic.

## 3.1.0

### Minor Changes

- 98b4cae: # chore: harden CI/CD and automate releases

  ## Summary
  - harden the CI and release workflows by pinning third-party actions, running the Node support matrix on pushes to main, broadening CodeQL coverage, and waiting for the Sonar quality gate
  - replace the old release-triggered npm publish flow with a Changesets-based release PR flow that updates package versions automatically after merge to main
  - publish to npm from the existing trusted publisher workflow file using OIDC, keep the prd environment approval for real publishes, and create a matching GitHub release tag automatically
  - replace the Dependabot auto-merge workflow with a metadata-only pull_request_target workflow that enables auto-merge under branch protection
  - document the new contributor flow so user-facing changes add a changeset instead of editing package.json or CHANGELOG.md manually

  ## Validation
  - npm test
  - npm run build
  - npx changeset --help
  - npx prettier --check .github/workflows/npm-publish.yml package.json Contributing.md .changeset/config.json .changeset/README.md

  ## Repo settings applied
  - set default GitHub Actions workflow permissions to
    ead
  - protected main with required status checks: Analyze (javascript), Coverage (Node 24), CI (Node 20), CI (Node 22), and CI (Node 24)
  - required 1 approving review on main, dismissed stale reviews, enabled conversation resolution, enforced admins, and required linear history
  - added a required reviewer gate to the prd environment

All notable changes to this project will be documented in this file.

This changelog starts with `v3.0.1`, the first release that documents breaking changes explicitly in-repo. Earlier versions are still available through git tags and GitHub releases.

## [3.0.2] - 2026-03-20

### Fixed

- Fixed identifier normalization so numeric helpers no longer force an unnecessary uppercase conversion and lowercase alphanumeric CNPJ input is still normalized correctly.
- Reduced temporary string allocations during CPF and CNPJ check-digit validation by comparing computed check digits directly against the original normalized value.

### Changed

- Minified the published JavaScript build output while keeping source maps.

### References

- Previous release: `v3.0.1`
- Compare: `https://github.com/alisterlf/br-helpers/compare/v3.0.1...v3.0.2`

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
