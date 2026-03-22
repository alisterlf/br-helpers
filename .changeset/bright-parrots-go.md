---
'br-helpers': patch
---

Refactor CLI commands and update package dependencies

- Refactored the CLI command structure in `bin/br-helpers` to use a more modular approach.
  - Introduced a `commandDefinitions` object to define commands (cpf, cnpj, cep, phone, identifier)
  - Each command now has its own `analyze` or `execute` function for processing input.
  - Removed yargs dependency and replaced it with a custom argument parser.
  - Improved help rendering for commands and options.

- Updated the version in `package-lock.json` and `package.json` from 3.0.2 to 3.1.2.
  - Removed yargs from dependencies as it is no longer needed.
  - Cleaned up unused dependencies from the lock file to reduce bloat.

- Added a new test suite in `src/cli.spec.ts` to ensure CLI functionality:
  - Tests for global help display.
  - Tests for CPF command output in JSON format.
  - Tests for handling invalid CPF input.
  - Tests for the identifier command output.

These changes enhance the maintainability of the CLI tool and improve user experience by providing
clearer command definitions and outputs.
