# RFC: Replace shallow shared helpers with a deep digits core

## Problem

The package exports a shared utility layer that multiple public helpers coordinate with directly.

- `getOnlyNumbersFromString`, `format`, and `isValidValue` are reused by nearly every domain helper
- The helpers are generic, but correctness depends on each caller choosing the right ordering and mask positions
- The shared formatter mutates the symbol list that callers pass in, which keeps behavior split across both sides of the boundary

This creates architectural friction:

- Small changes to input handling or masking fan out across the package
- Domain modules are shallow because they offload core text behavior to generic utilities
- The exported shared layer is part of the public API, so internal cleanup needs a compatibility story

## Proposed Interface

Introduce a deep `Digits` value object as the internal core, then keep the current shared exports as thin deprecated adapters during migration.

```ts
type MaskSlot = [position: number, symbol: string];

class Digits {
  static from(input: unknown): Digits;

  readonly value: string;
  readonly length: number;

  mask(slots: ReadonlyArray<MaskSlot>): string;
  isEmpty(): boolean;
}

function getOnlyNumbersFromString(input: unknown): string; // compatibility adapter
function format(input: unknown, slots: ReadonlyArray<MaskSlot>): string; // compatibility adapter
function isValidValue(input: unknown): boolean; // compatibility adapter
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
- Legacy exports remain as adapters until a later breaking release removes them

## Testing Strategy

- **New boundary tests to write**: `Digits.from`, `mask`, and empty-value behavior with clean and dirty input
- **Old tests to delete**: repeated format-focused assertions that currently exist only because each domain helper has to coordinate the shallow shared API itself
- **Test environment needs**: none

## Implementation Recommendations

- Make the shared layer own normalization behavior completely instead of splitting it between helpers and callers
- Stop mutating caller-provided mask data inside formatting behavior
- Preserve package compatibility by keeping existing exports as wrappers while domain modules migrate to the deep core
- Once migration is complete, reduce direct cross-module helper choreography and test the deep core at its boundary
