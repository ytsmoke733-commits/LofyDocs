# Comandos Essenciais do Git

## Configuração Inicial

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

## Fluxo Básico

| Comando | Descrição |
|---------|-----------|
| `git init` | Inicia um repositório |
| `git add .` | Adiciona arquivos ao stage |
| `git commit -m "mensagem"` | Cria um commit |
| `git push` | Envia para o remoto |
| `git pull` | Atualiza do remoto |

## Branchs

```bash
# Criar branch
git checkout -b minha-feature

# Mudar de branch
git checkout main

# Merge
git merge minha-feature
```

## Resolver conflitos

1. Faça `git pull`
2. Edite os arquivos com conflito (marcados com `<<<<<<<`)
3. `git add` + `git commit`

---

*Documentação gerada para exemplo.*
