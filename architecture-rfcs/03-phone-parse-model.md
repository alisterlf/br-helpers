# RFC: Deepen phone handling around a parsed phone model

## Problem

Phone handling is one cohesive domain, but the current API surfaces it as two flat statics.

- The module owns normalization, DDD validation, phone-kind inference, and formatting
- The DDD registry and numbering rules are private implementation details with no parsed representation at the boundary
- Future capabilities such as exposing phone type or area code would likely add more statics instead of deepening the model

This creates architectural friction:

- The public interface hides too little of the concept because callers cannot interact with a parsed phone
- Internal branches and formatting choices are tightly coupled but only indirectly tested through helper-style methods
- Extending behavior risks growing a utility surface instead of a coherent domain object

## Proposed Interface

Keep the simple helpers, but make `parse` the main boundary and let `isValid` and `format` delegate to it.

```ts
type PhoneKind = 'mobile' | 'landline';

type PhoneAnalysis = {
  raw: unknown;
  digits: string;
  ddd: string | null;
  kind: PhoneKind | null;
  valid: boolean;
  formatted: string;
};

class Phone {
  static parse(input: unknown): PhoneAnalysis;
  static isValid(input: unknown): boolean;
  static format(input: unknown): string;
}
```

Usage example:

```ts
const phone = Phone.parse('(11) 97983-7935');

phone.valid;
phone.kind;
phone.ddd;
phone.formatted;
```

What complexity this hides internally:

- input normalization
- DDD lookup
- mobile versus landline inference
- length validation
- format selection based on parsed phone kind

## Dependency Strategy

- **Category**: In-process
- All behavior stays pure and local
- The parsed model becomes the only place that understands numbering rules

## Testing Strategy

- **New boundary tests to write**: `parse`, `isValid`, and `format` behavior for mobile and landline numbers, invalid DDDs, invalid lengths, and invalid leading digits
- **Old tests to delete**: branch-shaped helper tests that only prove internal rule coordination indirectly
- **Test environment needs**: none

## Implementation Recommendations

- Model phone parsing as a single domain operation, not a loose set of validations plus formatting
- Preserve the current easy entrypoints for common callers, but route them through `parse`
- Keep the numbering rules and DDD registry entirely behind the parsed phone boundary
- Prefer additive migration so callers can adopt richer parsed behavior without breaking existing `Phone.isValid` and `Phone.format` use
