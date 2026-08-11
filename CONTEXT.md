# br-helpers Context

This context names the Brazilian identifier concepts supported by the package so validation, formatting, analysis, normalization, and CLI behavior stay aligned.

## Language

**CPF**:
A Brazilian individual taxpayer identifier with 9 base digits and 2 check digits.
_Avoid_: personal document, individual id

**CNPJ**:
A Brazilian business taxpayer identifier with 12 base characters and 2 numeric check digits.
_Avoid_: company document, business id

**CEP**:
A Brazilian postal code represented as 8 digits.
_Avoid_: postal id, zip

**Telefone**:
A Brazilian phone number composed of a **DDD** and a subscriber number.
_Avoid_: phone string, number

**DDD**:
The two-digit Brazilian area code at the start of a **Telefone**.
_Avoid_: area, region code

**Linha movel**:
A **Telefone** whose subscriber number has 9 digits and starts in the mobile range.
_Avoid_: mobile phone, cellphone

**Linha fixa**:
A **Telefone** whose subscriber number has 8 digits and starts in the landline range.
_Avoid_: landline phone, fixed phone

**Identificador**:
A normalized value used as the basis for validation, formatting, and analysis.
_Avoid_: raw value, sanitized string

**Normalizacao**:
The single pass that turns raw input into an **Identificador**: digits are kept, letters are kept uppercased when the Identificador is alphanumeric, and every other character is dropped. Already normalized input is returned unchanged.
_Avoid_: sanitization, cleanup, stripping

**Mascara**:
The punctuation pattern applied to an **Identificador** for display.
_Avoid_: formatter, pattern

**Digito verificador**:
A trailing digit derived from the preceding **Identificador** characters to detect invalid CPF or CNPJ values.
_Avoid_: checker digit, checksum

**Comando CLI**:
A terminal entrypoint that exposes one package helper through text or JSON output.
_Avoid_: script action, terminal route

## Relationships

- A **CPF** has exactly 2 **Digitos verificadores**.
- A **CNPJ** has exactly 2 **Digitos verificadores**.
- A **Telefone** has exactly one **DDD**.
- A **Telefone** is either a **Linha movel**, a **Linha fixa**, or not identifiable yet.
- A **Mascara** is applied to an **Identificador**.
- **Normalizacao** produces the **Identificador** before any **Mascara** or **Digito verificador** logic runs.
- Validation scans an **Identificador** in a single pass and rejects at the first failing rule: unexpected length, repeated characters, or **Digitos verificadores**.
- A **Comando CLI** exposes one helper for CPF, CNPJ, CEP, telefone, or identificadores.

## Constraints

- `isValid` is the hot path measured by the public benchmark: it must not use regex, create `Identifier` instances, or allocate intermediate objects.
- **Normalizacao** must return already normalized input as is, without allocation; non-ASCII input may take a slower path that preserves Unicode uppercase semantics.
- No character pattern check is needed after **Normalizacao**: a computed **Digito verificador** is always 0-9, so a letter in one of the last two slots can never match.
- Performance changes are only accepted after a branch-vs-main run of [br-helpers-benchmark](https://github.com/alisterlf/br-helpers-benchmark) in both variant orders, with `isValid`, `format`, and `parse` equivalence confirmed over the full datasets.

## Example dialogue

> **Dev:** "When a user enters a CNPJ with letters, do we keep lowercase characters in the Identificador?"
> **Domain expert:** "No. The CNPJ Identificador is uppercase before we apply the Mascara or calculate the Digitos verificadores."

> **Dev:** "Should `isValid` test the Identificador with a regex like `/^\d{11}$/` before the Digitos verificadores?"
> **Domain expert:** "No. After Normalizacao the value only contains valid characters, and a letter in a Digito verificador slot can never match a computed digit."

## Flagged ambiguities

- "number" can mean raw input, an **Identificador**, or a **Telefone**; use the specific term.
- "format" can mean applying a **Mascara** or producing CLI text; use **Mascara** for identifier punctuation.
- "clean", "sanitize", and "strip" all refer to **Normalizacao**; use the specific term.
