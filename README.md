#BR Helpers

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

#### CPF

```javascript
import { Cpf } from 'br-helpers';

Cpf.isValid('637.696.840-60'); // true
Cpf.format('63769684060'); // 637.696.840-60
```

#### Telefone fixo e celular

```javascript
import { Phone } from 'br-helpers';

Phone.isValid('00979837935'); // false
Phone.format('11979837935'); // (11) 97983-7935

Phone.isValid('(11) 4221-9784'); // true
Phone.format('1142219784'); // (11) 4221-9784
```
