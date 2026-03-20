# br-helpers

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=alisterlf_br-helpers&metric=alert_status)](https://sonarcloud.io/dashboard?id=alisterlf_br-helpers)
[![Node.js CI](https://github.com/alisterlf/br-helpers/actions/workflows/node.js.yml/badge.svg)](https://github.com/alisterlf/br-helpers/actions/workflows/node.js.yml)
[![Codecov](https://codecov.io/gh/alisterlf/br-helpers/graph/badge.svg)](https://codecov.io/gh/alisterlf/br-helpers)
[![npm](https://img.shields.io/npm/v/br-helpers?color=brightgreen)](https://www.npmjs.com/package/br-helpers)
[![Bundle size](https://img.shields.io/bundlephobia/min/br-helpers)](https://bundlephobia.com/package/br-helpers)
[![License](https://img.shields.io/badge/license-MIT-informational.svg)](./License.md)

Biblioteca para validar, formatar e analisar identificadores brasileiros em projetos JavaScript e TypeScript.

O pacote expõe helpers para:

- CPF
- CNPJ
- CEP
- Telefone fixo e celular
- Normalização numérica e alfanumérica com `NumericIdentifier` e `AlphanumericIdentifier`

## Por que usar

- Aceita entrada com ou sem máscara.
- Remove automaticamente caracteres de máscara e outros separadores.
- Permite formatação progressiva durante a digitação.
- Retorna análises prontas com `parse`, incluindo valor normalizado e status de validação.
- Funciona bem em projetos JavaScript e TypeScript.

## Instalação

```bash
npm install br-helpers
```

Também funciona com `yarn add br-helpers` ou `pnpm add br-helpers`.

## Compatibilidade

- Node.js: suporte oficial a `Node.js >= 20`.
- CommonJS: a build CJS usa target `node20`.
- Browser: a build ESM usa target `ES2015`.
- CI: a biblioteca eh validada em `Node.js 20`, `22` e `24`.
- Polyfills: o pacote nao injeta polyfills automaticamente. Se o ambiente nao tiver APIs modernas como `Set`, a aplicação consumidora precisa fornecer os polyfills necessários.

## Início rápido

```ts
import { Cep, Cnpj, Cpf, Phone } from 'br-helpers';

Cpf.isValid('137.686.636-63'); // true
Cnpj.format('26149878000187'); // '26.149.878/0001-87'
Cep.format('01311200'); // '01311-200'
Phone.format('11979837935'); // '(11) 97983-7935'
```

Se você estiver em CommonJS:

```js
const { Cep, Cnpj, Cpf, Phone } = require('br-helpers');
```

## API disponível

| Helper | Métodos | Descrição |
| --- | --- | --- |
| `Cpf` | `isValid`, `format`, `parse` | Validação, formatação progressiva e análise de CPF. |
| `Cnpj` | `isValid`, `format`, `parse` | Validação, formatação progressiva e análise de CNPJ numérico e alfanumérico. |
| `Cep` | `isValid`, `format` | Validação estrutural e formatação de CEP. |
| `Phone` | `isValid`, `format`, `parse` | Validação de DDD, tipo da linha e máscara para telefone. |
| `AlphanumericIdentifier` | `from`, `format` | Utilitário genérico para normalizar identificadores alfanuméricos e aplicar máscaras. |
| `NumericIdentifier` | `from`, `format` | Utilitário genérico para normalização estritamente numérica. |

## Exemplos

### CPF

```ts
import { Cpf } from 'br-helpers';

Cpf.isValid('137.686.636-63'); // true
Cpf.isValid('000.000.000-00'); // false

Cpf.format('13768663663'); // '137.686.636-63'
Cpf.format('1376866366'); // '137.686.636-6'

const cpf = Cpf.parse('137.686.636-63');

cpf.raw; // '137.686.636-63'
cpf.digits; // '13768663663'
cpf.valid; // true
cpf.formatted; // '137.686.636-63'
```

### CNPJ

```ts
import { Cnpj } from 'br-helpers';

Cnpj.isValid('26.149.878/0001-87'); // true
Cnpj.isValid('12ABC34501DE35'); // true
Cnpj.isValid('26.149.878/0001-88'); // false

Cnpj.format('26149878000187'); // '26.149.878/0001-87'
Cnpj.format('12abc34501de35'); // '12.ABC.345/01DE-35'

const cnpj = Cnpj.parse('12abc34501de35');

cnpj.raw; // '12abc34501de35'
cnpj.value; // '12ABC34501DE35'
cnpj.valid; // true
cnpj.formatted; // '12.ABC.345/01DE-35'
```

O helper `Cnpj` aceita tanto o formato numérico legado quanto o novo formato alfanumérico. Letras minúsculas são normalizadas para maiúsculas.

### CEP

```ts
import { Cep } from 'br-helpers';

Cep.isValid('01311-200'); // true
Cep.isValid('123'); // false

Cep.format('01311200'); // '01311-200'
Cep.format('0131120'); // '01311-20'
```

`Cep.isValid` valida a estrutura do valor normalizado, ou seja, se ele possui 8 dígitos. Ele não verifica se o CEP realmente existe.

### Telefone

```ts
import { Phone } from 'br-helpers';

Phone.isValid('(11) 97983-7935'); // true
Phone.isValid('(11) 4983-7935'); // true
Phone.isValid('00979837935'); // false

Phone.format('11979837935'); // '(11) 97983-7935'
Phone.format('1149837935'); // '(11) 4983-7935'
Phone.format('11979837'); // '(11) 97983-7'

const phone = Phone.parse('(11) 97983-7935');

phone.raw; // '(11) 97983-7935'
phone.digits; // '11979837935'
phone.ddd; // '11'
phone.kind; // 'mobile'
phone.valid; // true
phone.formatted; // '(11) 97983-7935'
```

O campo `kind` pode retornar:

- `'mobile'` para celular
- `'landline'` para telefone fixo
- `null` quando o número ainda não permite identificação

### AlphanumericIdentifier

`AlphanumericIdentifier` é útil quando você quer reaproveitar a normalização alfanumérica e aplicar máscaras próprias.

```ts
import { AlphanumericIdentifier } from 'br-helpers';

const identifier = AlphanumericIdentifier.from('12abc345/01de-35');

identifier.value; // '12ABC34501DE35'
identifier.length; // 14
identifier.isEmpty(); // false
identifier.digits; // '123450135'
identifier.format([
  [2, '.'],
  [5, '.'],
  [8, '/'],
  [12, '-'],
]); // '12.ABC.345/01DE-35'
```

### NumericIdentifier

`NumericIdentifier` é útil quando você quer uma normalização estritamente numérica.

```ts
import { NumericIdentifier } from 'br-helpers';

const numericIdentifier = NumericIdentifier.from('CPF: 137.686.636-63');

numericIdentifier.value; // '13768663663'
numericIdentifier.length; // 11
numericIdentifier.isEmpty(); // false
numericIdentifier.digits; // '13768663663'
numericIdentifier.format([
  [3, '.'],
  [6, '.'],
  [9, '-'],
]); // '137.686.636-63'
```

## Formatação progressiva

Os métodos `format` de `Cpf`, `Cnpj`, `Cep` e `Phone` podem ser usados durante a digitação. Isso é útil em formulários, porque a máscara é aplicada mesmo quando o valor ainda está incompleto.

```ts
import { Cpf, Phone } from 'br-helpers';

Cpf.format('137686'); // '137.686'
Phone.format('119798'); // '(11) 9798'
```

## Formato de retorno do `parse`

`Cpf.parse` retorna:

```ts
type CpfAnalysis = {
  raw: unknown;
  digits: string;
  valid: boolean;
  formatted: string;
};
```

`Cnpj.parse` retorna:

```ts
type CnpjAnalysis = {
  raw: unknown;
  value: string;
  valid: boolean;
  formatted: string;
};
```

`Phone.parse` retorna:

```ts
type PhoneAnalysis = {
  raw: unknown;
  digits: string;
  ddd: string | null;
  kind: 'mobile' | 'landline' | null;
  valid: boolean;
  formatted: string;
};
```

## TypeScript

O pacote publica declarações de tipo junto com a build em `dist`, então autocomplete e inferência funcionam sem configuração extra em projetos TypeScript.

## Licença

[MIT](./License.md)
