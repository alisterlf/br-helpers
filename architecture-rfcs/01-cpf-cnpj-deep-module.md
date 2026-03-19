# RFC: Deepen CPF and CNPJ into spec-backed document modules

## Problem

The CPF and CNPJ flows are conceptually single features but their behavior is split across thin wrappers and a generic checker engine.

- `Cpf` and `Cnpj` currently own only length constants and mask layouts
- The check-digit algorithm lives elsewhere and still depends on caller-supplied length
- Input normalization and value-shape checks are delegated to generic shared helpers

This creates architectural friction:

- Understanding one document type requires bouncing between multiple modules
- The seam between wrapper, checker engine, and shared helpers is where integration risk lives
- Adding another document type or evolving the validation rules would spread changes across the same cluster again

## Proposed Interface

Keep the current public ergonomics, but make `parse` the real boundary and let `isValid` and `format` become convenience wrappers over it.

```ts
type DocumentAnalysis = {
  raw: unknown;
  digits: string;
  valid: boolean;
  formatted: string;
};

class Cpf {
  static parse(input: unknown): DocumentAnalysis;
  static isValid(input: unknown): boolean;
  static format(input: unknown): string;
}

class Cnpj {
  static parse(input: unknown): DocumentAnalysis;
  static isValid(input: unknown): boolean;
  static format(input: unknown): string;
}
```

Usage example:

```ts
const cpf = Cpf.parse('137.686.636-63');

cpf.valid;
cpf.digits;
cpf.formatted;

Cpf.isValid('137.686.636-63');
Cnpj.format('26149878000187');
```

What complexity this hides internally:

- input normalization
- repeated-digit rejection
- check-digit calculation
- per-document length and mask rules
- shared behavior captured once in a private document-spec engine

## Dependency Strategy

- **Category**: In-process
- The deepened module stays fully in memory and pure
- Internals can share a private document-spec engine, but callers interact with document-specific boundaries rather than the generic checker

## Testing Strategy

- **New boundary tests to write**: `parse`, `isValid`, and `format` behavior for masked and unmasked input, invalid check digits, repeated digits, and leading-zero cases
- **Old tests to delete**: wrapper-shaped CPF/CNPJ tests that only prove delegation to the checker and shared helpers
- **Test environment needs**: none

## Implementation Recommendations

- Make each public document type own its full behavior contract
- Hide the checker algorithm behind a spec-driven internal core instead of exposing length as a caller concern
- Add `parse` as the durable boundary for richer behavior while preserving existing static helpers
- Treat formatting, normalization, and validation as one concept per document type rather than three collaborating modules
