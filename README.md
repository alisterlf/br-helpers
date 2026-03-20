# br-helpers

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=alisterlf_br-helpers&metric=alert_status)](https://sonarcloud.io/dashboard?id=alisterlf_br-helpers)
[![Node.js CI](https://github.com/alisterlf/br-helpers/actions/workflows/node.js.yml/badge.svg)](https://github.com/alisterlf/br-helpers/actions/workflows/node.js.yml)
[![Codecov](https://codecov.io/gh/alisterlf/br-helpers/graph/badge.svg)](https://codecov.io/gh/alisterlf/br-helpers)
[![npm](https://img.shields.io/npm/v/br-helpers?color=brightgreen)](https://www.npmjs.com/package/br-helpers)
[![Bundle size](https://img.shields.io/bundlephobia/min/br-helpers)](https://bundlephobia.com/package/br-helpers)
[![License](https://img.shields.io/badge/license-MIT-informational.svg)](./License.md)

Biblioteca para validar, formatar, analisar e normalizar identificadores brasileiros em projetos JavaScript e TypeScript.

## O que o pacote oferece

- `Cpf`: validacao, formatacao progressiva e analise completa.
- `Cnpj`: validacao, formatacao e analise de CNPJ numerico e alfanumerico.
- `Cep`: validacao estrutural e formatacao.
- `Phone`: validacao de DDD, deteccao de linha fixa ou celular e `parse`.
- `NumericIdentifier` e `AlphanumericIdentifier`: normalizacao reutilizavel para regras customizadas.
- `Identifier` e `MaskSlot`: primitives para construir mascaras e abstrair novos helpers.
- CLI `br-helpers`: comandos para terminal com saida em texto ou JSON.
- Exportacoes raiz e por subpath para consumo pontual.

## Instalacao

```bash
npm install br-helpers
```

Para instalar a CLI globalmente:

```bash
npm install -g br-helpers
```

Tambem funciona com `yarn add br-helpers` ou `pnpm add br-helpers`.

## Compatibilidade

- Node.js: suporte oficial a `>= 20`.
- Modulos: build CommonJS e ESM publicadas no mesmo pacote.
- Subpaths: `br-helpers/cpf`, `br-helpers/cnpj`, `br-helpers/cep`, `br-helpers/phone` e `br-helpers/identifiers`.
- CI: cobertura validada em `Node.js 20`, `22` e `24`.
- Polyfills: o pacote nao injeta polyfills automaticamente.

## Inicio rapido

```ts
import { Cep, Cnpj, Cpf, Phone } from 'br-helpers';
import { NumericIdentifier } from 'br-helpers/identifiers';

Cpf.isValid('137.686.636-63'); // true
Cnpj.format('12abc34501de35'); // '12.ABC.345/01DE-35'
Cep.format('01311200'); // '01311-200'
Phone.parse('(11) 97983-7935').kind; // 'mobile'
NumericIdentifier.from('CPF: 137.686.636-63').value; // '13768663663'
```

Se voce preferir importar apenas um helper:

```ts
import { Cnpj } from 'br-helpers/cnpj';
import { AlphanumericIdentifier } from 'br-helpers/identifiers';
```

Em CommonJS:

```js
const { Cep, Cnpj, Cpf, Phone } = require('br-helpers');
const { NumericIdentifier } = require('br-helpers/identifiers');
```

## API resumida

| Export | API principal | Quando usar |
| --- | --- | --- |
| `Cpf` | `parse`, `isValid`, `format` | CPF com ou sem mascara. |
| `Cnpj` | `parse`, `isValid`, `format` | CNPJ numerico legado e alfanumerico. |
| `Cep` | `isValid`, `format` | CEP com validacao estrutural de 8 digitos. |
| `Phone` | `parse`, `isValid`, `format` | Telefone com DDD e deteccao de tipo da linha. |
| `NumericIdentifier` | `from`, `value`, `digits`, `length`, `isEmpty`, `format` | Regras estritamente numericas. |
| `AlphanumericIdentifier` | `from`, `value`, `digits`, `length`, `isEmpty`, `format` | Regras alfanumericas em maiusculo. |
| `Identifier` | `value`, `digits`, `length`, `isEmpty`, `format` | Classe base abstrata para extensoes. |
| `MaskSlot` | `[position, symbol]` | Tipo para descrever mascaras customizadas. |
| `CpfAnalysis`, `CnpjAnalysis`, `PhoneAnalysis`, `PhoneKind` | Tipos exportados | Tipagem de retorno e composicao em TypeScript. |

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
Cnpj.isValid('12abc34501de35'); // true
Cnpj.isValid('26.149.878/0001-88'); // false

Cnpj.format('26149878000187'); // '26.149.878/0001-87'
Cnpj.format('12abc34501de35'); // '12.ABC.345/01DE-35'
Cnpj.format('12ABC34501DE'); // '12.ABC.345/01DE'

const cnpj = Cnpj.parse('12abc34501de35');

cnpj.raw; // '12abc34501de35'
cnpj.value; // '12ABC34501DE35'
cnpj.valid; // true
cnpj.formatted; // '12.ABC.345/01DE-35'
```

`Cnpj` aceita o formato numerico legado e o novo formato alfanumerico. Letras minusculas sao normalizadas para maiusculas, e os dois ultimos caracteres continuam sendo digitos verificadores.

### CEP

```ts
import { Cep } from 'br-helpers';

Cep.isValid('01311-200'); // true
Cep.isValid('123'); // false

Cep.format('01311200'); // '01311-200'
Cep.format('0131120'); // '01311-20'
```

`Cep.isValid` valida apenas a estrutura do valor normalizado. Ele nao consulta existencia real do CEP.

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

`phone.kind` pode retornar `'mobile'`, `'landline'` ou `null` enquanto o numero ainda nao permite identificacao.

### NumericIdentifier

```ts
import { NumericIdentifier, type MaskSlot } from 'br-helpers/identifiers';

const cpfMask: MaskSlot[] = [
  [3, '.'],
  [6, '.'],
  [9, '-'],
];

const numeric = NumericIdentifier.from('CPF: 137.686.636-63');

numeric.value; // '13768663663'
numeric.length; // 11
numeric.isEmpty(); // false
numeric.digits; // '13768663663'
numeric.format(cpfMask); // '137.686.636-63'
```

### AlphanumericIdentifier

```ts
import { AlphanumericIdentifier, type MaskSlot } from 'br-helpers/identifiers';

const cnpjMask: MaskSlot[] = [
  [2, '.'],
  [5, '.'],
  [8, '/'],
  [12, '-'],
];

const identifier = AlphanumericIdentifier.from('12abc345/01de-35');

identifier.value; // '12ABC34501DE35'
identifier.length; // 14
identifier.isEmpty(); // false
identifier.digits; // '123450135'
identifier.format(cnpjMask); // '12.ABC.345/01DE-35'
```

### Formatacao progressiva

Os metodos `format` podem ser usados durante a digitacao.

```ts
import { Cep, Cnpj, Cpf, Phone } from 'br-helpers';

Cpf.format('137686'); // '137.686'
Cnpj.format('12ABC34501'); // '12.ABC.345/01'
Cep.format('0131120'); // '01311-20'
Phone.format('119798'); // '(11) 9798'
```

## CLI

O pacote publica o binario `br-helpers` com os comandos `cpf`, `cnpj`, `cep`, `phone` e `identifier`.

```bash
npx br-helpers cpf 13768663663
npx br-helpers cnpj 12abc34501de35 --output json
npx br-helpers phone "(11) 97983-7935" --field digits
npx br-helpers cep 01311200 --field formatted
npx br-helpers identifier "CPF: 137.686.636-63"
```

### Opcoes da CLI

- `--field` ou `-f`: retorna apenas um campo especifico.
- `--output` ou `-o`: alterna entre `text` e `json`.
- `cpf`, `cnpj`, `cep` e `phone` encerram com codigo `0` quando o valor eh valido e `2` quando eh invalido.
- `identifier` sempre encerra com codigo `0`.

### Exemplo de saida JSON

```bash
npx br-helpers cnpj 12abc34501de35 --output json
```

```json
{
  "raw": "12abc34501de35",
  "value": "12ABC34501DE35",
  "valid": true,
  "formatted": "12.ABC.345/01DE-35"
}
```

## Tipos de retorno

```ts
type CpfAnalysis = {
  raw: unknown;
  digits: string;
  valid: boolean;
  formatted: string;
};

type CnpjAnalysis = {
  raw: unknown;
  value: string;
  valid: boolean;
  formatted: string;
};

type PhoneAnalysis = {
  raw: unknown;
  digits: string;
  ddd: string | null;
  kind: 'mobile' | 'landline' | null;
  valid: boolean;
  formatted: string;
};

type MaskSlot = [position: number, symbol: string];
```

## Migrando do v2 para o v3

- `Digits` foi substituido por `NumericIdentifier` e `AlphanumericIdentifier`.
- `Digits.from(value).mask(mask)` agora vira `NumericIdentifier.from(value).format(mask)`.
- `import { Digits } from 'br-helpers/digits'` agora vira `import { NumericIdentifier, AlphanumericIdentifier } from 'br-helpers/identifiers'`.
- `Cnpj.parse(...).digits` agora vira `Cnpj.parse(...).value`.
- O `Cnpj` passa a aceitar e normalizar letras no corpo do documento.

Os detalhes completos da mudanca estao em [CHANGELOG.md](./CHANGELOG.md).

## TypeScript

O pacote publica declaracoes de tipo junto com a build em `dist`, entao autocomplete e inferencia funcionam sem configuracao extra.

## Licenca

[MIT](./License.md)
