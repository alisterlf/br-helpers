#BR Helpers

## Installation

```bash
npm install --save br-helpers
```

## Usage

To use one of our utilities you just need to import the required class as in the example below:

```javascript
import { Cpf } from 'br-helpers';

Cpf.isValid('637.696.840-60'); // true
```

### Formatação & Validação

#### CEP

```javascript
import { Cep } from 'br-helpers';

Cep.isValid('01311-200'); // true
Cep.isFormat('01311200'); // 01311-200
```

#### CNPJ

```javascript
import { Cnpj } from 'br-helpers';

Cnpj.isValid('40010217000105'); // true
Cnpj.isFormat('40010217000105'); // 40.010.217/0001-05
```

#### CPF

```javascript
import { Cpf } from 'br-helpers';

Cpf.isValid('637.696.840-60'); // true
Cpf.isFormat('63769684060'); // 637.696.840-60
```

#### Telefone fixo e celular

```javascript
import { Phone } from 'br-helpers';

Phone.isValid('00979837935'); // false
Phone.isFormat('11979837935'); // (11) 97983-7935

Phone.isValid('(11) 4221-9784'); // true
Phone.isFormat('1142219784'); // (11) 4221-9784
```
