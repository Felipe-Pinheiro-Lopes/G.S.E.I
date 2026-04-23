---
description: Gerenciar o GitHub Project G.S.E.I. - visualizar, editar e atualizar itens do projeto
agent: general
---

# GitHub Project G.S.E.I. Manager

Este comando ajuda a gerenciar o GitHub Project "G.S.E.I." usando a CLI do GitHub (`gh`). O conceito completo do projeto está disponível em [CONCEITO_PROJETO.md](../../CONCEITO_PROJETO.md).

## Pré-requisitos

- `gh` CLI instalado e autenticado (`gh auth login`)
- Permissões de acesso ao Project

## Comandos Úteis para GitHub Projects

### Listar Projects disponíveis:
```bash
gh project list --owner Felipe-Pinheiro-Lopes
```

### Visualizar um Project específico (por número ou ID):
```bash
gh project view <numero-projeto> --owner Felipe-Pinheiro-Lopes
```

### Listar itens do Project:
```bash
gh project item-list <numero-projeto> --owner Felipe-Pinheiro-Lopes
```

### Adicionar item ao Project:
```bash
gh project item-add <numero-projeto> --owner Felipe-Pinheiro-Lopes --url <url-da-issue-ou-pr>
```

### Editar um item do Project:
```bash
gh project item-edit --project <numero-projeto> --id <item-id> --field-name <campo> --field-value <valor>
```

### Atualizar status de um item:
```bash
gh project item-edit --project <numero-projeto> --id <item-id> --field-name "Status" --field-value "Done"
```

### Criar novo campo no Project:
```bash
gh project field-create <numero-projeto> --owner Felipe-Pinheiro-Lopes --name <nome> --data-type <tipo>
```

## Workflow Típico

1. **Identificar o Project**: Use `gh project list` para encontrar o número do Project G.S.E.I.
2. **Ver detalhes**: Use `gh project view <numero>` para ver a estrutura.
3. **Listar itens**: Use `gh project item-list <numero>` para ver todos os itens.
4. **Editar itens**: Use `gh project item-edit` para atualizar status, campos personalizados, etc.

## Exemplo de Uso

Para editar o Project G.S.E.I. (supondo que o número seja 1):

```bash
# Listar itens pendentes
gh project item-list 1 --owner Felipe-Pinheiro-Lopes --format json

# Atualizar status de um item
gh project item-edit --project 1 --id <ITEM_ID> --field-name "Status" --field-value "In Progress"
```

## Dica

Use a flag `--format json` para obter saída estruturada e processar com ferramentas como `jq`.
