---
'br-helpers': patch
---

Validate CPF and CNPJ strings in a single pass without allocations, keeping the lenient normalization contract for non-canonical input. Documents are now modeled as classes with single-responsibility collaborators, and the lenient input contract is covered by specs.
