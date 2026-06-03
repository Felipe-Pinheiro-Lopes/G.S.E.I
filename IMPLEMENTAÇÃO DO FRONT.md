# Prompt de Implementação para Melhorias no Projeto G.S.E.I.

## 1. Persona

Assuma a persona de um Desenvolvedor Full-Stack Sênior com vasta experiência nas seguintes tecnologias:
*   **Front-end:** React (com Hooks, Context API e bibliotecas de componentes modernas).
*   **Back-end:** C# (com .NET, ASP.NET Core para APIs RESTful e boas práticas de SOLID).
*   **Banco de Dados:** PostgreSQL (com modelagem de dados, otimização de queries e escrita de funções).

Você é pragmático, focado em qualidade, e entende a importância de construir um front-end funcional primeiro, mas sempre planejando as futuras integrações com o back-end e o banco de dados.

## 2. Contexto do Projeto e Metodologia

O projeto, G.S.E.I., precisa de uma série de melhorias e correções em seu front-end. A metodologia de desenvolvimento atual é "front-end first": implementaremos e validaremos as interfaces e a experiência do usuário primeiro. Em seguida, conectaremos essas interfaces com o back-end e o banco de dados.

Seu objetivo é gerar o código e as diretrizes para implementar as melhorias listadas abaixo. Para cada tarefa de front-end, você deve também descrever as APIs de back-end e as estruturas de banco de dados que serão necessárias para suportar essa funcionalidade no futuro.

## 3. Checklist de Implementação: Front-end

Implemente as seguintes melhorias, organizadas por página.

### 3.1. DASHBOARD

*   [ ] **Funcionalidade "Log Completo":**
    *   O botão "Log Completo" deve abrir um modal.
    *   Dentro do modal, exiba um histórico de movimentações do dia em uma tabela ou lista.
    *   Adicione controles de filtro por data e horário.
    *   Implemente um botão que permita ao usuário selecionar um período e gerar um documento (pode ser um mock de um PDF ou CSV por enquanto) com os dados filtrados.

### 3.2. PÁGINA DE INVENTÁRIO

*   [ ] **Correção no Cadastro de Equipamentos:**
    *   Investigue e corrija o bug que impede o cadastro de novos equipamentos.
*   [ ] **Melhoria de UX nos Campos de Cadastro:**
    *   No formulário "Cadastrar Equipamento", altere o campo `CÓDIGO` (ex: "EQ-937081") para usar um *placeholder* (sugestão) em vez de um valor pré-preenchido. O campo deve estar vazio por padrão.
    *   Faça o mesmo para o campo `LOTE` (ex: "Lote-2026-01").
*   [ ] **Melhoria de UI (Contraste):**
    *   Na janela de "CADASTRAR EQUIPAMENTOS", altere a cor dos textos de tons claros para tons escuros (ex: `#333` ou `#000`) para garantir a legibilidade.
*   [ ] **Refatoração da Lógica da Página:**
    *   A página de inventário deve ser apenas para visualização e acompanhamento dos produtos. Remova qualquer funcionalidade que permita editar o status dos itens.
    *   Em vez de editar o status, adicione um botão "Enviar para Triagem" em cada item do inventário.

### 3.3. PÁGINA DE DOAÇÕES

*   [ ] **Validação de Formulário (Cadastro de Instituição):**
    *   Aplique uma máscara de formato no campo `CNPJ` para `XX.XXX.XXX/XXXX-XX`.
    *   Aplique uma máscara de formato no campo `Telefone` para `(XX) XXXXX-XXXX`.
    *   Adicione validação no campo `Email` para aceitar apenas endereços de e-mail válidos (ex: `usuario@dominio.com`).

### 3.4. PÁGINA DE DESCARTE

*   [ ] **Correção de Responsividade e Paginação:**
    *   Conserte a paginação para que seja funcional e responsiva, refletindo o número real de páginas e permitindo a navegação entre elas.
*   [ ] **Consistência na Exibição de Informações:**
    *   Garanta que o botão de "ver mais informações" funcione para todos os itens, independentemente do status ("DESCARTADO" ou "AGUARDANDO"). A informação deve ser sempre acessível.
*   [ ] **Controle de Permissões:**
    *   O campo "LAUDO TÉCNICO / MOTIVO DO DESCARTE" deve ser somente leitura (`read-only`) nesta tela. A edição deste campo é de responsabilidade da página de Triagem.

## 4. Planejamento Futuro: Back-end (C#)

Para suportar as funcionalidades do front-end, as seguintes APIs RESTful (ASP.NET Core) serão necessárias.

*   **Logs:**
    *   `GET /api/logs?startDate={date}&endDate={date}`: Retorna uma lista de eventos do log filtrados por data/hora.
*   **Inventário:**
    *   `POST /api/equipamentos`: Cria um novo equipamento. Deve gerar o código (`EQ-XXXXXX`) e o lote (`Lote-YYYY-MM`) no back-end.
    *   `GET /api/equipamentos`: Lista todos os equipamentos para a tela de inventário.
    *   `POST /api/equipamentos/{id}/enviar-triagem`: Altera o status de um equipamento para "Em Triagem".
*   **Doações:**
    *   `POST /api/instituicoes`: Cadastra uma nova instituição. A validação de CNPJ, email e telefone deve ocorrer aqui também.
*   **Descarte:**
    *   `GET /api/descarte?page={n}&limit={m}`: Retorna uma lista paginada de itens para descarte.
    *   `GET /api/descarte/{id}`: Retorna os detalhes de um item de descarte específico.

## 5. Planejamento Futuro: Banco de Dados (PostgreSQL)

As seguintes tabelas e campos serão necessários ou precisarão de modificação.

*   **Tabela `Logs`:**
    *   `id` (SERIAL PRIMARY KEY)
    *   `timestamp` (TIMESTAMP)
    *   `event_description` (TEXT)
    *   `user_id` (FOREIGN KEY)
*   **Tabela `Equipamentos`:**
    *   `id` (SERIAL PRIMARY KEY)
    *   `codigo` (VARCHAR, UNIQUE) - A lógica de geração "EQ-" deve ser gerenciada pelo back-end.
    *   `lote` (VARCHAR) - A lógica "Lote-" deve ser gerenciada pelo back-end.
    *   `status` (VARCHAR) - Ex: 'Em estoque', 'Em triagem', 'Descartado'.
    *   ...outros campos.
*   **Tabela `Instituicoes`:**
    *   `id` (SERIAL PRIMARY KEY)
    *   `cnpj` (VARCHAR, UNIQUE) - Armazenar apenas os números e aplicar a máscara no front-end.
    *   `telefone` (VARCHAR) - Armazenar apenas os números.
    *   `email` (VARCHAR, UNIQUE) - Usar constraints de validação.
