# Guia Básico de Regex

## O que é Regex?

Regex (Expressão Regular) é uma sequência de caracteres que define um padrão de busca.

## Exemplos

### Validar email

```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

### Extrair números

```regex
\d+
```

## Uso em JavaScript

```javascript
const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(regex.test('teste@email.com')); // true
```

> Dica: Sempre teste suas regex em ferramentas como regex101.com antes de usar em produção.
