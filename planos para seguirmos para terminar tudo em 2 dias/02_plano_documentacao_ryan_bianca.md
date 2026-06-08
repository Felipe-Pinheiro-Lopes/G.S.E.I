# Plano de Trabalho - Documentacao (Ryan & Bianca)
**Responsaveis:** Ryan & Bianca  
**Prazo:** 2 dias  
**Professores:** Prof Glauco (Eng. Software), Prof Cainã (Linguagem de Programacao - apoio em docs)

## Objetivo
Produzir toda a documentacao textual do projeto: README expandido, PRD, Wiki, e revisoes de linguagem.

## Tarefas

### 1. README.md Profissional (Eng. Software)
Revisar e expandir o README atual em `README.md` para incluir:
- **Badges** (build, licenca, cobertura)
- **Arquitetura minima C4**: Contexto + Container + Component (1 nivel cada)
- **Decisoes tecnicas (ADR)**: Por que ASP.NET Core 10? Por que Next.js 16? Por que PostgreSQL?
- **Como rodar localmente**: passos detalhados de backend e frontend
- **Como contribuir**: fluxo GitFlow, padrao de commit, Code Review
- **Deploy em producao**: URLs dos ambientes, variaveis de ambiente necessarias
- **Estrutura do projeto**: arvore de diretorios com descricao de cada pasta
- Links para: PRD, Wiki, Diagramas, Banner e Artigo

### 2. PRD - Product Requirements Document
Criar `docs/PRD.md` contendo:
- Visao do produto (problema, solucao, publico-alvo)
- Personas (minimo 2)
- Backlog de funcionalidades priorizadas (Must/Should/Could/Wont)
- Regras de negocio detalhadas (ex.: quem pode aprovar doacao? quem pode descartar?)
- Criterios de aceite por feature (Given/When/Then)
- Roadmap (entregas passadas e futuras)
- Riscos e mitigações

Template sugerido: usar estrutura do PRD do Google ou da 280 Group.

### 3. Wiki do GitHub
Estruturar a Wiki do repositorio (`G.S.E.I/wiki`) ao menos com:
- **Home**: indice com links para todas as paginas
- **Arquitetura**: diagramas C4, ADRs, stack tecnologico
- **API Reference**: resumo dos endpoints principais, autenticacao, exemplos de request/response
- ** Banco de Dados**: link para dicionario e MLD produzidos pelo Enrico
- **Padroes de Codigo**: convencoes de commit, nomenclatura, estrutura de pastas
- **FAQ**: duvidas frequentes e solucoes

### 4. Apoio em Linguagem de Programacao (Prof Cainã)
- Revisar a parte textual e gramatical dos exemplos de codigo que o Felipe ira inserir nos docs.
- Garantir clareza e consistencia nos comentarios.

### 5. Revisoes Corretivas no README.md
Apos Felipe ajustar o README (C4, ADRs, deploy), revisar:
- Clarity tecnica
- Gramatica e ortografia
- Coerencia com o sistema real

### 6. Entregas
| Arquivo | Local | Descricao |
|---------|-------|-----------|
| README.md | raiz | README expandido e profissional |
| PRD.md | docs/PRD.md | Product Requirements Document completo |
| Wiki/Home.md | Wiki | Pagina inicial da Wiki |
| Wiki/Arquitetura.md | Wiki | Arquitetura e ADRs |
| Wiki/API-Reference.md | Wiki | Documentacao da API |
| Wiki/Padroes.md | Wiki | Convencoes do Time |
| Wiki/FAQ.md | Wiki | FAQ |

## Observacoes
- Ryan e Bianca devem trabalhar em paralelo, divisao sugerida: Bianca foca no PRD e Ryan na Wiki + revisao do README.
- Am椋s revisam o trabalho um do outro antes de subir.
- Manter padrao de headings (H2/H3) e tom tecnicos, mas acessiveis.
