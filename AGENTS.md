# AGENTS.md

## Project Overview
G.S.E.I (Gestão Sustentável de Equipamentos de Informática): Solution for reuse of obsolete IT equipment at Petrobras, ensuring data security, regulatory compliance, employee training and social responsibility. Full concept available at [CONCEITO_PROJETO.md](./CONCEITO_PROJETO.md).

## Structure
- `API/`: .NET 10 C# backend (ASP.NET Core, EF Core, PostgreSQL, JWT, Swagger)
- `Bd/`: PostgreSQL schema scripts and diagrams
- `front-end/`: Next.js 16 React frontend (TypeScript, Tailwind)
- Gitflow branches: main, develop, Release, Feature, Hotfix

## Next.js 16 Warning
Breaking changes from older versions. Read `front-end/node_modules/next/dist/docs/` before coding.

## Commands
### Frontend (run from `front-end/`)
- `npm run dev` (localhost:3000), `build`, `start`, `lint`
- No test scripts configured.

### Backend (run from `API/`)
- `dotnet run`, `dotnet build`
- `dotnet ef database update` (requires `dotnet-ef` tool)
- No test scripts configured.

## Aliases
- Frontend: `@/*` maps to `front-end/*` (configured in `front-end/tsconfig.json`)
