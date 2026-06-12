# Product Requirements Document

## 1. Visão do Produto

*   **Problema que o sistema resolve:** A gestão de equipamentos de informática obsoletos em grandes organizações como a Petrobras pode ser complexa, envolvendo questões de sustentabilidade, segurança de dados (data wiping), conformidade regulatória e responsabilidade social. A falta de um processo claro pode levar ao descarte inadequado, riscos de segurança e perda de oportunidades de doação ou reuso.
*   **Solução proposta:** O G.S.E.I (Gestão Sustentável de Equipamentos de Informática) é um sistema web que visa gerenciar o ciclo de vida de equipamentos de informática obsoletos. Ele abrange desde a triagem técnica, passando pela garantia de segurança de dados (data wiping implícito no fluxo de descarte), até a destinação final, seja ela doação, reuso ou descarte sustentável. O sistema também inclui funcionalidades de gestão de usuários, instituições para doação e solicitação de equipamentos.
*   **Objetivos do negócio:**
    *   Promover a sustentabilidade através do reaproveitamento seguro de equipamentos.
    *   Garantir a segurança da informação através de processos de data wiping.
    *   Assegurar o compliance regulatório em relação ao descarte de ativos de TI.
    *   Facilitar a doação de equipamentos para instituições, promovendo responsabilidade social.
    *   Otimizar a gestão de inventário de equipamentos obsoletos.
*   **Público-alvo:**
    *   Administradores de sistemas e TI responsáveis pela gestão de ativos.
    *   Equipes de sustentabilidade e responsabilidade social corporativa.
    *   Usuários internos que necessitam de equipamentos.
    *   Instituições (ONGs, escolas, etc.) que podem receber doações de equipamentos.
    *   Equipes de triagem técnica.

## 2. Personas

*   **Persona 1: Ana Silva - Administradora de TI**
    *   **Perfil:** Profissional de TI com 10 anos de experiência, responsável pela infraestrutura e gestão de ativos de hardware na Petrobras.
    *   **Objetivos:** Garantir a segurança dos dados em equipamentos obsoletos, otimizar o processo de descarte/doação, manter o inventário de TI atualizado e em conformidade com as políticas da empresa.
    *   **Dores:** Processos manuais lentos e propensos a erros, dificuldade em rastrear o status e a destinação final dos equipamentos, preocupação com a segurança de dados em equipamentos descartados, falta de visibilidade sobre o impacto das doações.
    *   **Como o sistema ajuda:** Automatiza o fluxo de triagem e destinação, garante o data wiping (implícito no fluxo de descarte), fornece um dashboard com KPIs para monitoramento e relatórios, e facilita a gestão de usuários e permissões.
*   **Persona 2: Carlos Pereira - Gestor de Sustentabilidade**
    *   **Perfil:** Profissional focado em iniciativas de sustentabilidade e responsabilidade social corporativa.
    *   **Objetivos:** Aumentar a taxa de equipamentos reaproveitados/doados, reduzir o impacto ambiental do descarte de TI, fortalecer a imagem da empresa através de ações sociais.
    *   **Dores:** Dificuldade em encontrar instituições confiáveis para doação, falta de dados concretos sobre o impacto ambiental e social das ações de descarte, processos de doação pouco transparentes.
    *   **Como o sistema ajuda:** Facilita a gestão de instituições e solicitações de doação, fornece dados sobre equipamentos doados e descartados de forma sustentável, e contribui para relatórios de sustentabilidade com métricas claras.

## 3. Escopo do Produto

### Escopo Atual (Funcionalidades Implementadas)

*   **Autenticação e Autorização:**
    *   Sistema completo de autenticação com JWT (JSON Web Tokens). (Confirmado por código: `Program.cs`, `TokenService.cs`, `UserController.cs`)
    *   Registro de usuários (rota `/register` pública). (Confirmado por código: `UserController.cs`)
    *   Login de usuários com verificação de credenciais e geração de token. (Confirmado por código: `UserController.cs`, `TokenService.cs`)
    *   Hashing de senha com BCrypt. (Confirmado por código: `UserController.cs`, `API.csproj`)
    *   Gerenciamento de perfis de usuário (Admin, User) com controle de acesso via `[Authorize(Roles = "...")]`. (Confirmado por código: `UserController.cs`, `TokenService.cs`)
*   **Gestão de Usuários:**
    *   CRUD (Create, Read, Update, Delete) para usuários. (Confirmado por código: `UserController.cs`)
    *   Listagem e obtenção de usuários por ID restrita a Admins. (Confirmado por código: `UserController.cs`)
    *   Atualização de informações de usuário (Nome, Email, Telefone, Data de Nascimento, Role). (Confirmado por código: `UserController.cs`, `UserUpdateDto.cs`)
    *   Atualização de senha. (Mencionado no README, confirmado pelo `UserUpdateDto` ter campo `Senha?` e lógica de hash/verify no `UserController.cs`)
    *   Atualização de foto de usuário. (Mencionado no README, mas não explicitamente encontrado no código inspecionado).
*   **Dashboard Gerencial:**
    *   Exibição de KPIs (total de inventário, fila de triagem, doações, descartes, processados no turno). (Mencionado no README)
    *   Gráfico de Pareto de defeitos. (Mencionado no README)
    *   Visualização das últimas atualizações do sistema. (Mencionado no README)
    *   Frequência de tipos de equipamentos. (Mencionado no README)
*   **Gestão de Equipamentos:**
    *   CRUD (Create, Read, Update, Delete) para equipamentos. (Mencionado no README)
    *   Mudança de status do equipamento. (Mencionado no README)
    *   Aprovação de equipamentos para doação. (Mencionado no README)
*   **Triagem Técnica:**
    *   Checklist para triagem. (Mencionado no README)
    *   Registro de laudo técnico. (Mencionado no README)
    *   Definição do destino do equipamento (doação, descarte, etc.). (Mencionado no README)
*   **Gestão de Instituições e Doações:**
    *   CRUD para instituições. (Mencionado no README)
    *   Criação de solicitações de doação com prioridade. (Mencionado no README)
*   **Segurança de Dados:**
    *   Data wiping implícito no fluxo de descarte. (Mencionado no README como requisito de processo).
*   **Tecnologias e Arquitetura:**
    *   API RESTful implementada em ASP.NET Core. (Confirmado por código)
    *   Banco de dados PostgreSQL com Entity Framework Core. (Confirmado por código: `AppDbContext.cs`, `Program.cs`, `API.csproj`, Migrations)
    *   Documentação da API com Swagger/OpenAPI. (Confirmado por código: `Program.cs`)
    *   Configuração de CORS para `http://localhost:3000`. (Confirmado por código: `Program.cs`)

### Escopo Futuro (Potenciais Funcionalidades / Ideias)

*   **Funcionalidades de Workflow Avançadas:** Automação de aprovações, notificações por e-mail/sistema.
*   **Relatórios Avançados:** Geração de relatórios customizáveis sobre inventário, doações, descartes e impacto ambiental/social.
*   **Módulo de Inventário Detalhado:** Campos adicionais para especificações técnicas, número de série, localização física, etc.
*   **Funcionalidades de Auditoria:** Rastreamento detalhado de ações realizadas no sistema.
*   **Integração com Sistemas Legados:** Conexão com sistemas de gestão de ativos existentes da Petrobras.

## 4. Backlog Priorizado (MoSCoW)

*   **Must Have:**
    *   **Autenticação e Autorização (JWT, Roles):** Essencial para segurança e controle de acesso. (Implementado e confirmado por código)
    *   **Gestão de Usuários (CRUD, Roles, Self-Registration):** Funcionalidade central para administração do sistema. (Implementado e confirmado por código)
    *   **API RESTful (ASP.NET Core):** Base para a comunicação do sistema. (Implementado e confirmado por código)
    *   **Banco de Dados (PostgreSQL + EF Core):** Persistência de dados. (Implementado e confirmado por código)
    *   **Fluxo de Descarte/Doação:** Propósito principal do sistema. (Mencionado no README como funcionalidade principal)
    *   **Segurança de Dados (Data Wiping):** Requisito de negócio crítico. (Mencionado no README como implícito no fluxo de descarte)

*   **Should Have:**
    *   **Dashboard Gerencial com KPIs:** Fornece visibilidade crucial. (Mencionado no README)
    *   **Gestão de Equipamentos (CRUD, Status, Aprovação Doação):** Funcionalidade central para controle de ativos. (Mencionado no README)
    *   **Triagem Técnica (Checklist, Laudo, Destino):** Processo fundamental para definição do destino do equipamento. (Mencionado no README)
    *   **Gestão de Instituições e Solicitações de Doação:** Facilita o processo de doação. (Mencionado no README)
    *   **Documentação da API (Swagger/OpenAPI):** Facilita o consumo da API. (Implementado e confirmado por código)
    *   **Configuração de CORS:** Permite comunicação com o frontend. (Implementado e confirmado por código)

*   **Could Have:**
    *   **Atualização de Foto de Usuário:** Funcionalidade mencionada no README.
    *   **Relatórios Avançados:** Geração de relatórios detalhados e customizáveis.
    *   **Notificações:** Alertas sobre status de equipamentos, solicitações de doação, etc.
    *   **Funcionalidades de Auditoria:** Rastreamento detalhado de ações realizadas no sistema.

*   **Won't Have (no escopo atual):**
    *   **Gestão de Estoque de Peças/Componentes:** O foco é em equipamentos completos.
    *   **Módulo de Compras/Aquisição de Novos Equipamentos:** O sistema lida com equipamentos obsoletos.
    *   **Interface Mobile Nativa:** O sistema é web-based.
    *   **Implementação explícita de Data Wiping como funcionalidade de software:** O processo é implícito e baseado em procedimentos externos ou lógica de descarte.

## 5. Regras de Negócio

*   **RN001 - Autenticação de Usuário:**
    *   **Nome:** Validação de Credenciais.
    *   **Descrição:** Usuários devem fornecer email e senha válidos para acessar o sistema.
    *   **Restrições:** Senhas são armazenadas com hash seguro (BCrypt). (Confirmado por código)
    *   **Perfis envolvidos:** Todos os usuários.
*   **RN002 - Geração de Token JWT:**
    *   **Nome:** Emissão de Token Pós-Login.
    *   **Descrição:** Após login bem-sucedido, um token JWT é gerado e retornado ao cliente.
    *   **Restrições:** Token com validade de 2 horas, contém informações do usuário (ID, Nome, Email, Role). (Confirmado por código: `TokenService.cs`, `Program.cs`)
    *   **Perfis envolvidos:** Usuários autenticados.
*   **RN003 - Controle de Acesso por Role:**
    *   **Nome:** Autorização Baseada em Perfil.
    *   **Descrição:** Acesso a certas funcionalidades (ex: listar/editar/deletar usuários) é restrito a perfis específicos (ex: Admin).
    *   **Restrições:** Uso de `[Authorize(Roles = "Admin")]`. (Confirmado por código: `UserController.cs`)
    *   **Perfis envolvidos:** Admin, User.
*   **RN004 - Gestão de Usuários:**
    *   **Nome:** Registro e Administração de Usuários.
    *   **Descrição:** Novos usuários podem se registrar publicamente. Administradores podem gerenciar todos os usuários (listar, obter, atualizar, deletar).
    *   **Restrições:** Registro público via `/register`. Gestão de usuários (listar, obter, atualizar, deletar) requer role "Admin". (Confirmado por código: `UserController.cs`)
    *   **Perfis envolvidos:** Admin, User (para auto-registro).
*   **RN005 - Atualização de Informações de Usuário:**
    *   **Nome:** Modificação de Dados do Usuário.
    *   **Descrição:** Usuários podem atualizar suas próprias informações (Nome, Email, Telefone, Data de Nascimento, Senha). Admins podem atualizar todos os campos de outros usuários, incluindo a `Role`.
    *   **Restrições:** Atualização de senha é opcional no DTO de update. (Confirmado por código: `UserController.cs`, `UserUpdateDto.cs`)
    *   **Perfis envolvidos:** Admin, User (para editar a própria conta).
*   **RN006 - Exclusão de Usuário:**
    *   **Nome:** Remoção de Usuário.
    *   **Descrição:** Usuários podem ser removidos do sistema por administradores.
    *   **Restrições:** Apenas Admins podem deletar usuários. (Confirmado por código: `UserController.cs`)
    *   **Perfis envolvidos:** Admin.
*   **RN007 - Segurança de Dados no Descarte:**
    *   **Nome:** Processo de Data Wiping.
    *   **Descrição:** O processo de descarte de equipamentos deve garantir a eliminação segura de dados.
    *   **Restrições:** Implícito no fluxo de descarte, baseado no README. Não há uma funcionalidade explícita de "data wiping" implementada no código inspecionado.
    *   **Perfis envolvidos:** Equipe de Triagem/Descarte.

## 6. Requisitos Funcionais

*   **RF001:** O sistema deve permitir o registro de novos usuários com nome, email, senha, telefone (opcional), data de nascimento e role. (Confirmado por código: `UserController.cs`, `UserUpdateDto.cs`)
*   **RF002:** O sistema deve permitir que usuários façam login com email e senha. (Confirmado por código: `UserController.cs`, `UserLoginRequestDto.cs`)
*   **RF003:** O sistema deve gerar um token JWT para usuários autenticados. (Confirmado por código: `UserController.cs`, `TokenService.cs`)
*   **RF004:** O sistema deve proteger rotas específicas, exigindo autenticação via token JWT. (Confirmado por código: `Program.cs`, `UserController.cs`)
*   **RF005:** O sistema deve permitir que usuários com a role "Admin" acessem funcionalidades de gerenciamento de outros usuários (listar, obter, atualizar, deletar). (Confirmado por código: `UserController.cs`)
*   **RF006:** O sistema deve permitir o cadastro (CRUD) de equipamentos. (Mencionado no README)
*   **RF007:** O sistema deve permitir a atualização do status de um equipamento. (Mencionado no README)
*   **RF008:** O sistema deve permitir a aprovação de equipamentos para doação. (Mencionado no README)
*   **RF009:** O sistema deve permitir a realização de triagem técnica de equipamentos, incluindo checklist e laudo. (Mencionado no README)
*   **RF010:** O sistema deve permitir o cadastro (CRUD) de instituições para recebimento de doações. (Mencionado no README)
*   **RF011:** O sistema deve permitir a criação de solicitações de doação de equipamentos. (Mencionado no README)
*   **RF012:** O sistema deve exibir um dashboard com KPIs relevantes (inventário, triagem, doações, descartes). (Mencionado no README)
*   **RF013:** O sistema deve exibir um gráfico de Pareto de defeitos. (Mencionado no README)
*   **RF014:** O sistema deve permitir a visualização de atualizações recentes do sistema. (Mencionado no README)
*   **RF015:** O sistema deve permitir a visualização da frequência de tipos de equipamentos. (Mencionado no README)
*   **RF016:** O sistema deve permitir a gestão (CRUD) de usuários por administradores. (Confirmado por código: `UserController.cs`)
*   **RF017:** O sistema deve permitir a atualização de senha de usuários. (Confirmado por código: `UserController.cs`, `UserUpdateDto.cs`)
*   **RF018:** O sistema deve permitir a atualização de foto de usuário. (Mencionado no README, não confirmado por código inspecionado).

## 7. Requisitos Não Funcionais

*   **Segurança:**
    *   Autenticação segura via JWT com tokens de curta duração (2h). (Confirmado por código)
    *   Hashing de senhas com BCrypt. (Confirmado por código)
    *   Controle de acesso baseado em roles (Admin/User). (Confirmado por código)
    *   Proteção contra ataques comuns (inferido pela tecnologia .NET Core e uso de JWT).
    *   Garantia de data wiping no fluxo de descarte (requisito de negócio, implícito). (Mencionado no README)
*   **Performance:**
    *   Tempo de resposta aceitável para operações de login, CRUD e consulta de dados (inferido pela tecnologia .NET Core e Next.js).
    *   Otimização de consultas ao banco de dados (PostgreSQL com EF Core). (Confirmado por código)
*   **Confiabilidade:**
    *   O sistema deve estar disponível para operação (inferido pela arquitetura web).
    *   Persistência de dados garantida pelo banco de dados PostgreSQL. (Confirmado por código)
*   **Escalabilidade:**
    *   A arquitetura .NET Core e Next.js permite escalabilidade horizontal (inferido).
*   **Usabilidade:**
    *   Interface intuitiva para gestão de equipamentos e usuários (inferido pela estrutura do front-end mencionada no README).
    *   Dashboard com informações claras e acessíveis. (Mencionado no README)
*   **Manutenibilidade:**
    *   Código organizado em camadas (API, Models, DTOs, Services, Data). (Confirmado por código)
    *   Uso de Entity Framework Core para abstração do banco de dados. (Confirmado por código)
    *   API documentada com Swagger/OpenAPI. (Confirmado por código)
*   **Tecnologia:**
    *   Backend: .NET 10 / ASP.NET Core, PostgreSQL, JWT, BCrypt. (Confirmado por código e `API.csproj`)
    *   Frontend: Next.js, TypeScript, Tailwind CSS, React Hook Form + Zod, Axios. (Mencionado no README)

## 8. Critérios de Aceite

*   **Critério 1: Login de Usuário**
    *   **Given** um usuário existe no sistema com email "teste@teste.com" e senha "senha123"
    *   **When** o usuário acessa a tela de login e insere "teste@teste.com" e "senha123"
    *   **Then** o sistema deve autenticar o usuário e retornar um token JWT. (Validado por código: `UserController.cs`, `TokenService.cs`)

*   **Critério 2: Criação de Equipamento (Admin)**
    *   **Given** um usuário com role "Admin" está logado no sistema
    *   **When** o usuário acessa a funcionalidade de cadastro de equipamentos e preenche os campos obrigatórios (ex: tipo, modelo, status "Em Triagem")
    *   **Then** o equipamento deve ser criado com sucesso no banco de dados e o status "Em Triagem" deve ser registrado. (Baseado no README; funcionalidade de equipamento não inspecionada diretamente no código)

*   **Critério 3: Aprovação de Equipamento para Doação (Admin)**
    *   **Given** um equipamento está com status "Aprovado para Doação"
    *   **When** um administrador visualiza os detalhes do equipamento e confirma a aprovação para doação
    *   **Then** o status do equipamento deve ser atualizado para "Doado" (ou similar) e registrado no histórico. (Baseado no README; funcionalidade de equipamento não inspecionada diretamente no código)

*   **Critério 4: Listagem de Usuários (Admin)**
    *   **Given** um usuário com role "Admin" está logado
    *   **When** o usuário acessa a funcionalidade de listagem de usuários
    *   **Then** o sistema deve exibir uma lista de todos os usuários cadastrados, incluindo nome, email, telefone e role. (Validado por código: `UserController.cs`)

## 9. Roadmap

### Entregas Concluídas

*   Autenticação e Autorização robustas com JWT e controle de roles (Admin/User). (Confirmado por código)
*   Gestão completa de Usuários (CRUD, auto-registro, gestão por Admin, atualização de senha). (Confirmado por código)
*   API RESTful implementada em ASP.NET Core com documentação Swagger/OpenAPI. (Confirmado por código)
*   Configuração de banco de dados PostgreSQL com Entity Framework Core. (Confirmado por código)
*   Configuração de CORS para comunicação com frontend. (Confirmado por código)
*   Dashboard Gerencial com KPIs e gráficos. (Mencionado no README)
*   Funcionalidades de Gestão de Equipamentos, Triagem Técnica, e Gestão de Instituições/Doações. (Mencionado no README)

### Próximas Entregas (Potenciais)

*   Implementação de funcionalidades de auditoria detalhada.
*   Desenvolvimento de relatórios avançados e exportação de dados.
*   Implementação de notificações no sistema.
*   Refinamento do fluxo de descarte para garantir a clareza do processo de data wiping (se necessário).

### Melhorias Futuras (Ideias)

*   Integração com sistemas legados de gestão de ativos da Petrobras.
*   Módulo de inventário mais detalhado com campos específicos (número de série, localização, etc.).
*   Possível desenvolvimento de um aplicativo mobile complementar.
*   Refinamento do fluxo de trabalho com automações e aprovações.

## 10. Dependências

*   **Backend:**
    *   .NET 10 / ASP.NET Core (Minimal APIs + Controllers)
    *   Entity Framework Core 9 + PostgreSQL (Npgsql)
    *   JWT para autenticação
    *   BCrypt.Net-Next para hashing de senhas
    *   Swagger/OpenAPI para documentação da API
*   **Frontend:** (Mencionado no README)
    *   Next.js 16 (App Router + Server Components)
    *   TypeScript
    *   Tailwind CSS
    *   React Hook Form + Zod para validação
    *   Axios para consumo da API
*   **Banco de Dados:**
    *   PostgreSQL (instância remota em desenvolvimento)

## 11. Riscos e Mitigações

*   **Risco:** Falha na segurança de dados durante o descarte (Data Wiping).
    *   **Descrição:** Processo de descarte inadequado pode levar a vazamento de dados sensíveis.
    *   **Impacto:** Alto (violação de conformidade, danos à reputação).
    *   **Probabilidade:** Média (depende da correta execução do processo físico/lógico).
    *   **Mitigação:** Documentar claramente o processo de data wiping e garantir que os procedimentos externos sejam seguidos. Reforçar a importância do requisito no README.
*   **Risco:** Inconsistência de dados entre o inventário físico e o sistema.
    *   **Descrição:** Equipamentos podem ser movimentados ou descartados sem atualização no sistema.
    *   **Impacto:** Média (inventário impreciso, dificuldade de rastreamento).
    *   **Probabilidade:** Média (depende da disciplina dos usuários).
    *   **Mitigação:** Implementar funcionalidades de auditoria e relatórios para identificar discrepâncias. Treinamento contínuo dos usuários sobre a importância da atualização em tempo real.
*   **Risco:** Complexidade na integração com sistemas legados.
    *   **Descrição:** Dificuldade em obter dados ou interagir com sistemas antigos da Petrobras.
    *   **Impacto:** Média (atraso na implementação de funcionalidades futuras).
    *   **Probabilidade:** Média (depende da documentação e APIs dos sistemas legados).
    *   **Mitigação:** Mapeamento detalhado das APIs e estruturas de dados dos sistemas legados. Desenvolvimento de adaptadores ou middlewares específicos.

## 12. Métricas de Sucesso

*   **Taxa de Equipamentos Reutilizados/Doados:** Percentual de equipamentos que tiveram destinação sustentável em relação ao total processado.
*   **Tempo Médio de Processamento de Equipamento:** Tempo desde a entrada do equipamento no sistema até sua destinação final.
*   **Número de Doações Realizadas:** Quantidade de equipamentos doados a instituições.
*   **Redução de Descarte de TI:** Volume (em peso ou unidades) de equipamentos desviados do descarte ambientalmente inadequado.
*   **Satisfação do Usuário (Admin/Gestor):** Pesquisas periódicas para avaliar a usabilidade e eficácia do sistema.
*   **Tempo de Resposta da API:** Monitoramento da performance das requisições da API.
*   **Número de Incidentes de Segurança:** Contagem de tentativas de acesso não autorizado ou falhas de segurança.
