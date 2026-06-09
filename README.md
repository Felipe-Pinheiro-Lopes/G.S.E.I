# G.S.E.I - Gestão Sustentável de Equipamentos de Informática

Sistema completo para reaproveitamento seguro de equipamentos de informática obsoletos, com foco em sustentabilidade, segurança da informação (data wiping), compliance regulatório, capacitação de funcionários e responsabilidade social. Desenvolvido para a **I Mostra UniSENAI** do curso de Análise e Desenvolvimento de Sistemas (1º Semestre).

---

## 📌 Visão Geral do Projeto

O G.S.E.I gerencia todo o ciclo de vida de equipamentos de TI descontinuados:
* **Cadastro e Inventário**: Controle detalhado de entradas e status dos ativos.
* **Triagem Técnica**: Checklists e laudos técnicos estruturados com definição de destino.
* **Decisão de Destino**: Reuso interno, doação para instituições parceiras ou descarte ecológico.
* **Eliminação Segura de Dados (Data Wiping)**: Garantia de conformidade com a LGPD e descarte sem vazamento de dados.
* **Gestão de Doações**: Controle de solicitações com regras de priorização para instituições cadastradas.
* **Dashboard Gerencial**: Indicadores de produtividade, gráficos de frequência e análise de Pareto para defeitos.

---

## 🔑 Credenciais de Acesso (Ambiente de Desenvolvimento)

* **Email**: `admin@petrobras.com.br`
* **Senha**: `Admin@123`

---

## 🛠️ Stack Tecnológico

[Link do projeto](https://github.com/users/Felipe-Pinheiro-Lopes/projects/2)

### Backend (.NET)
* **ASP.NET Core 10** (Minimal APIs + Controllers)
* Entity Framework Core 9 com PostgreSQL (Npgsql)
* Autenticação via **JWT (JSON Web Tokens)**
* Injeção de dependência e Log Estruturado com `ILogger`
* Documentação de API com Swagger/OpenAPI e comentários XML

### Frontend (Next.js)
* **Next.js 16** (App Router + React Server Components)
* TypeScript (Modo Estrito)
* Tailwind CSS para estilização e responsividade móvel
* React Hook Form + Zod para validações dinâmicas de formulários
* Axios para integração robusta com o barramento de APIs
* **Vitest** + **React Testing Library** para testes automatizados

---

## 📂 Estrutura de Diretórios do Projeto

```text
G.S.E.I/
├── API/                          # Backend em C# .NET 10
│   ├── Controllers/              # Controladores REST com summaries XML
│   ├── Models/                   # Entidades de domínio e esquemas de dados
│   ├── DTOs/                     # Data Transfer Objects para requests/responses
│   ├── Data/                     # Contexto do EF Core (AppDbContext) e Migrations
│   ├── appsettings.json          # Configuração base e CORS dinâmico
│   ├── appsettings.Development.json # Segredo JWT para desenvolvimento local
│   └── appsettings.Production.json  # Placeholder JWT para deployments em produção
├── front-end/                    # Frontend em Next.js 16
│   ├── src/app/Screens/          # Páginas (Dashboard, Inventario, Triagem, Doacoes, Login)
│   ├── src/components/           # Componentes UI reutilizáveis e responsivos
│   ├── src/services/             # api.ts (Instância configurada do Axios)
│   ├── src/__tests/              # Testes unitários automatizados (Button, Login)
│   └── next.config.ts            # Configurações de otimização de build
├── docs/                         # Documentação técnica e acadêmica
│   └── codigo-exemplos.md        # Exemplos comentados de loops, condicionais e modularização
├── Bd/                           # Modelagem lógica e física do banco de dados
├── Diagrama/                     # Diagramas de caso de uso e processos de triagem
└── README.md                     # Documentação de introdução
```

---

## 📚 Documentação Técnica e Wiki

* **[Wiki do Repositório](https://github.com/Felipe-Pinheiro-Lopes/G.S.E.I/wiki)**: Contém guias completos de arquitetura, manuais de deploy, modelagem do banco de dados e padrões de design.
* **[Exemplos de Lógica e Estrutura de Código](file:///c:/Users/Felipe%20Lopes/Desktop/Aulas/1%20Semestre/PI/G.S.E.I/docs/codigo-exemplos.md)**: Guia didático sobre o uso de Estruturas Condicionais, Loops (Iterações) e Modularização implementados no projeto (Requisito da disciplina de Linguagem de Programação).

---

## 🧪 Testes Automatizados

O frontend possui uma suíte de testes unitários configurada utilizando **Vitest** e **React Testing Library**.

Para rodar os testes:
```powershell
cd front-end
npm run test
```

Os arquivos de teste encontram-se estruturados em:
* **[Button.test.tsx](file:///c:/Users/Felipe%20Lopes/Desktop/Aulas/1%20Semestre/PI/G.S.E.I/front-end/src/__tests/Button.test.tsx)**: Validação de renderização de variantes visuais e eventos de clique do botão genérico.
* **[login.test.tsx](file:///c:/Users/Felipe%20Lopes/Desktop/Aulas/1%20Semestre/PI/G.S.E.I/front-end/src/__tests/login.test.tsx)**: Validação dos inputs e do fluxo de exibição de erros na tela de login.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Requisitos Prévios
* .NET SDK 10.0 instalado.
* Node.js v18 ou superior instalado.

### 2. Rodando o Backend (API)
Navegue até a pasta da API, restaure as dependências e execute o servidor:
```powershell
cd API
dotnet restore
dotnet watch run
```
* **Swagger Interface (OpenAPI)**: A documentação interativa de endpoints estará disponível em [http://localhost:5145/swagger](http://localhost:5145/swagger).
* **Configuração de CORS**: As rotas de origem permitidas são gerenciadas dinamicamente via chave `"Cors:AllowedOrigins"` no arquivo [appsettings.json](file:///c:/Users/Felipe%20Lopes/Desktop/Aulas/1%20Semestre/PI/G.S.E.I/API/appsettings.json).

### 3. Rodando o Frontend (Web)
Navegue até a pasta do frontend, instale as dependências e inicie o servidor de desenvolvimento:
```powershell
cd front-end
npm install
npm run dev
```
* A aplicação web estará acessível em [http://localhost:3000](http://localhost:3000).

---

## 📈 Status do Projeto
* **Backend**: Estável, compilado com 0 erros/avisos, JWT seguro isolado por ambiente, suporte a proxy reverso e documentação XML inserida.
* **Frontend**: Estável, responsivo e adaptável a telas móveis (tabelas e gráficos), e integridade assegurada pelo build de produção Next.js.
* **Banco de Dados**: Migrations aplicadas com sucesso no servidor de banco de dados do projeto.

---

**Desenvolvido como projeto integrador para a I Mostra UniSENAI — 2026**
