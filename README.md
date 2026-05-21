# G.S.E.I - Gestão Sustentável de Equipamentos de Informática

Sistema completo para reaproveitamento seguro de equipamentos de informática obsoletos da Petrobras, com foco em sustentabilidade, segurança da informação (data wiping), compliance regulatório, capacitação de funcionários e responsabilidade social.

## Visão Geral do Projeto

O G.S.E.I gerencia todo o ciclo de vida de equipamentos de TI descontinuados:
- Cadastro e inventário
- Triagem técnica com laudo
- Decisão de destino (Reuso interno, Doação para instituições, Descarte seguro)
- Eliminação segura de dados
- Gestão de doações e solicitações de instituições parceiras
- Dashboard gerencial com indicadores

## Credenciais de Acesso (Ambiente de Desenvolvimento)

- **Email**: admin@petrobras.com.br
- **Senha**: Admin@123

## Stack Tecnológico

### Backend
- **.NET 10** / ASP.NET Core 10 (Minimal APIs + Controllers)
- Entity Framework Core 9 + PostgreSQL (Npgsql)
- Autenticação JWT
- Swagger / OpenAPI
- Migrations com EF Core

### Frontend
- **Next.js 16** (App Router + Server Components)
- TypeScript (strict)
- Tailwind CSS
- React Hook Form + Zod (validação)
- Axios para consumo da API

### Banco de Dados
- PostgreSQL (instância remota em desenvolvimento)
- Tabelas principais: Equipamentos, Triagens, Users, Instituicoes, Solicitacoes, ItemSolicitacao

## Estrutura do Projeto

```
G.S.E.I/
├── API/                  # Backend .NET 10
│   ├── Controllers/      # Auth, Dashboard, Equipamentos, Triagem, Users, etc.
│   ├── Models/           # Entidades (records)
│   ├── DTOs/             # Data Transfer Objects
│   ├── Data/             # AppDbContext + Migrations
│   └── ...
├── front-end/            # Frontend Next.js 16
│   ├── src/app/Screens/  # Dashboard, Inventario, Triagem, Doacoes, Login...
│   ├── src/components/   # UI reutilizáveis (StatCard, ParetoChart, etc.)
│   └── src/services/     # api.ts (Axios instance)
├── Bd/                   # Scripts SQL e diagramas do banco
├── Diagrama/             # Diagramas de fluxo de processos
└── README.md
```

## Principais Funcionalidades Implementadas

- **Autenticação** completa com JWT
- **Dashboard Gerencial**:
  - KPIs (total inventário, fila de triagem, doações, descartes, processados no turno)
  - Gráfico Pareto de defeitos (baseado em laudos reais)
  - Últimas atualizações do sistema
  - Frequência de tipos de equipamentos
- **Gestão de Equipamentos** (CRUD completo + mudança de status + aprovação para doação)
- **Triagem Técnica** com checklist, laudo técnico e definição de destino
- **Gestão de Usuários** (incluindo atualização de foto e senha)
- **Instituições** e **Solicitações de Doação** com prioridade
- **Data Wiping** implícito no fluxo de descarte

## Como Executar o Projeto

### 1. Backend (.NET)

```powershell
cd API
dotnet restore
dotnet ef database update          # Aplica migrations no banco remoto
dotnet watch run                   # Roda em http://localhost:5145
```

**Swagger**: http://localhost:5145/swagger

### 2. Frontend (Next.js)

```powershell
cd front-end
npm install
npm run dev                        # Roda em http://localhost:3000
```

## Workflow de Desenvolvimento (GitFlow)

- `main` → Produção estável
- `develop` → Integração
- `feature/*` → Novas funcionalidades
- `hotfix/*` → Correções urgentes

## Status Atual (Maio 2026)

- Backend e Frontend integrados e funcionais
- Schema do banco atualizado (colunas `AprovadoPor` e `LaudoDescarte` adicionadas)
- Dashboard e Inventário estáveis
- Autenticação e autorização operacionais

## Contribuição

Siga o fluxo GitFlow e crie Pull Requests para `develop`.

---

**Projeto desenvolvido para Petrobras - 2026**
