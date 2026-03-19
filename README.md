# BR Helpers

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=alisterlf_br-helpers&metric=alert_status)](https://sonarcloud.io/dashboard?id=alisterlf_br-helpers)
[![Node.js CI status](https://github.com/alisterlf/br-helpers/workflows/Node.js%20CI/badge.svg)](https://github.com/alisterlf/br-helpers/actions)
[![Codecov](https://codecov.io/gh/alisterlf/br-helpers/graph/badge.svg)](https://codecov.io/gh/alisterlf/br-helpers)
![MIT License](https://img.shields.io/static/v1.svg?label=📜%20License&message=MIT&color=informational)
![npm](https://img.shields.io/npm/v/br-helpers?color=brightgreen)
![npm bundle size](https://img.shields.io/bundlephobia/min/br-helpers)

## Instalação

```bash
npm install --save br-helpers
```

## Uso

Para usar basta importar a classe e chamar o método, como o exemplo abaixo:

```javascript
import { Cpf } from 'br-helpers';

Cpf.isValid('637.696.840-60'); // true
```

`Cpf`, `Cnpj` e `Phone` agora tambem expoem `parse`, que retorna os digitos normalizados, o valor formatado e o status de validacao.

### Formatação & Validação

#### CEP

```javascript
import { Cep } from 'br-helpers';

Cep.isValid('01311-200'); // true
Cep.format('01311200'); // 01311-200
```

#### CNPJ

```javascript
import { Cnpj } from 'br-helpers';

Cnpj.isValid('40010217000105'); // true
Cnpj.format('40010217000105'); // 40.010.217/0001-05
```

```javascript
const cnpj = Cnpj.parse('40.010.217/0001-05');

cnpj.valid; // true
cnpj.digits; // 40010217000105
cnpj.formatted; // 40.010.217/0001-05
```

#### CPF

```javascript
import { Cpf } from 'br-helpers';

Cpf.isValid('637.696.840-60'); // true
Cpf.format('63769684060'); // 637.696.840-60
```

```javascript
const cpf = Cpf.parse('637.696.840-60');

cpf.valid; // true
cpf.digits; // 63769684060
cpf.formatted; // 637.696.840-60
```

#### Telefone fixo e celular

```javascript
import { Phone } from 'br-helpers';

Phone.isValid('00979837935'); // false
Phone.format('11979837935'); // (11) 97983-7935

Phone.isValid('(11) 4221-9784'); // true
Phone.format('1142219784'); // (11) 4221-9784
```

```javascript
const phone = Phone.parse('(11) 97983-7935');

phone.valid; // true
phone.kind; // mobile
phone.ddd; // 11
phone.digits; // 11979837935
phone.formatted; // (11) 97983-7935
```
