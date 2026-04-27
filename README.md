# G.S.E.I (Gestão Sustentável de Equipamentos de Informática)

Solução para reaproveitamento seguro e sustentável de equipamentos de informática obsoletos na Petrobras, garantindo segurança da informação, conformidade regulatória, capacitação de colaboradores e responsabilidade socioambiental.

## Conceito Completo
O conceito detalhado do projeto está disponível em [CONCEITO_PROJETO.md](./CONCEITO_PROJETO.md).

## Estrutura do Projeto
- `API/`: Backend .NET 10 C# (ASP.NET Core, EF Core, PostgreSQL, JWT, Swagger)
- `Bd/`: Scripts e diagramas de schema PostgreSQL
- `front-end/`: Frontend Next.js 16 React (TypeScript, Tailwind)

## Branches (Gitflow)
main, develop, Release, Feature, Hotfix

## Como Executar
### Frontend (diretório `front-end/`)
```bash
npm run dev  # localhost:3000
npm run build
npm run start
npm run lint
```

### Backend (diretório `API/`)
```bash
dotnet run
dotnet build
dotnet ef database update  # requer ferramenta dotnet-ef
```

## Links Úteis
- [GitHub Project](https://github.com/Felipe-Pinheiro-Lopes/G.S.E.I/projects)
- [Documentação do Next.js 16](front-end/node_modules/next/dist/docs/) (atenção para breaking changes)
