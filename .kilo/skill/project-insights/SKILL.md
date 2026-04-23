---
name: project-insights
description: This skill should be used when generating or editing project insights for GitHub Projects. It provides workflows for analyzing project data, generating progress reports, and updating project insights.
---

# Project Insights Skill

Gerar e editar insights de projetos GitHub, incluindo métricas de progresso, análise de velocity, e relatórios de status. O conceito completo do projeto G.S.E.I. está disponível em [CONCEITO_PROJETO.md](../../CONCEITO_PROJETO.md).

## Quando Usar

- Usuário solicita insights sobre o projeto G.S.E.I.
- Necessidade de gerar relatórios de progresso do GitHub Project.
- Análise de métricas do projeto (velocity, burndown, etc.).
- Atualização de campos personalizados no Project baseado em análise.

## Workflow para Gerar Insights

### 1. Coletar Dados do Project

```bash
# Listar todos os itens com formato JSON
gh project item-list <PROJECT_NUMBER> --owner Felipe-Pinheiro-Lopes --format json > project_data.json
```

### 2. Analisar Dados

To analyze project data:
- Ler o arquivo `project_data.json` usando a ferramenta Read
- Identificar padrões: itens concluídos vs em andamento
- Calcular métricas: percentual de conclusão, distribuição por status
- Identificar gargalos: itens parados, prioritários pendentes

### 3. Gerar Relatório de Insights

Criar um relatório estruturado contendo:

```markdown
# Project Insights - G.S.E.I.
Data: YYYY-MM-DD

## Resumo Executivo
- Total de itens: X
- Concluídos: X (XX%)
- Em andamento: X
- Pendentes: X

## Métricas de Progresso
- Velocity média: X itens/semana
- Itens bloqueados: X
- Tendência: [acelerando/estável/desacelerando]

## Gargalos Identificados
- [Listar itens ou áreas problemáticas]

## Recomendações
- [Sugestões baseadas na análise]
```

### 4. Atualizar o Project (Opcional)

To update items based on insights:

```bash
# Atualizar campo de insight em um item
gh project item-edit --project <PROJECT_NUMBER> --id <ITEM_ID> --field-name "Insight" --field-value "<insight-text>"
```

## Estrutura de Dados do GitHub Project

Um item do Project JSON típicamente contém:
- `id`: ID único do item
- `title`: Título do item
- `status`: Status atual (ex: "Todo", "In Progress", "Done")
- `assignees`: Responsáveis
- `labels`: Etiquetas
- Campos personalizados configurados no Project

## Exemplo de Análise

```bash
# Extrair status de todos os itens
gh project item-list 1 --owner Felipe-Pinheiro-Lopes --format json | jq '[.items[].status] | group_by(.) | map({status: .[0], count: length})'
```

## Dicas

- Use `jq` para processar JSON no Bash
- Salve dados brutos antes de analisar para referência
- Insights devem ser acionáveis, não apenas descritivos
- Considere tendências temporais ao analisar velocity
