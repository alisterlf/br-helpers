# RFC: Replace shallow shared helpers with a deep digits core

Status: implemented in v2.

## Problem

Before this refactor, the package exported a shared utility layer that multiple public helpers coordinated with directly.

- `getOnlyNumbersFromString`, `format`, and `isValidValue` were reused by nearly every domain helper
- The helpers were generic, but correctness depended on each caller choosing the right ordering and mask positions
- The shallow shared API kept behavior split across both sides of the boundary

This creates architectural friction:

- Small changes to input handling or masking fan out across the package
- Domain modules are shallow because they offload core text behavior to generic utilities
- The exported shared layer is part of the public API, so internal cleanup needs a compatibility story

## Proposed Interface

Introduce a deep `Digits` value object as the shared core and expose it directly as the package boundary for digit normalization and masking.

```ts
type MaskSlot = [position: number, symbol: string];

class Digits {
  static from(input: unknown): Digits;

  readonly value: string;
  readonly length: number;

  mask(slots: ReadonlyArray<MaskSlot>): string;
  isEmpty(): boolean;
}
```

Usage example:

```ts
const digits = Digits.from('(11) 97983-7935');

digits.value;
digits.mask([
  [0, '('],
  [2, ') '],
  [7, '-'],
]);
```

What complexity this hides internally:

- normalization and coercion rules
- immutable masking mechanics
- empty-value semantics
- future shared text behavior without forcing every domain helper to coordinate raw primitives

## Dependency Strategy

- **Category**: In-process
- The deepened module remains a pure value object with no I/O
- Domain modules depend directly on `Digits` instead of going through compatibility wrappers

## Testing Strategy

- **New boundary tests to write**: `Digits.from`, `mask`, and empty-value behavior with clean and dirty input
- **Old tests to delete**: repeated format-focused assertions that currently exist only because each domain helper has to coordinate the shallow shared API itself
- **Test environment needs**: none

## Implementation Recommendations

- Make the shared layer own normalization behavior completely instead of splitting it between helpers and callers
- Stop mutating caller-provided mask data inside formatting behavior
- Remove compatibility wrappers in v2 so the package exposes the deeper boundary directly
- Reduce direct cross-module helper choreography and test the deep core at its boundary
