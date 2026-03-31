# BiblioTech 📚


## Visão Geral 
Esta API é um sistema de biblioteca, que permite operações como registro, edição, deleção e listagem de livros, além de funcionalidades específicas para usuários comuns e superusuários. A API utiliza Python com o framework Django e o MongoDB como banco de dados. O sistema faz o gerenciamento de livros, permitindo que superusuários realizem operações de registro, edição, deleção e listagem de livros e usuários, e que usuários comuns visualizem e verifiquem a disponibilidade dos livros.


## Arquitetura MVT
A arquitetura MVT, combinada com o padrão de arquitetura Repository, separa uma aplicação em três componentes:

- ***Model:*** Responsável pela estrutura de dados e lógica de negócios.
- ***View:*** Apresenta a interface do usuário de forma visual.
- ***Template:*** Define a estrutura e layout das páginas apresentadas ao usuário.
- ***Repositories:*** Interagem com o banco de dados, gerenciando a persistência e recuperação dos dados.

No sistema de gestão de biblioteca, o Model manipula usuários e livros, os Templates definem a apresentação das páginas ao usuário, e os Repositories coordenam a interação entre o Model e o banco de dados, facilitando as operações de CRUD (Criar, Ler, Atualizar, Deletar). As Views utilizam esses Templates para renderizar a interface, combinando dados do Modelo com o layout definido.

## Funcionalidades
***SuperUser:***
- Livros: Registrar, editar, deletar, listar
- Usuários: Registrar, editar, deletar, listar

***User:***
- Listar o acervo de livros
- Visualizar se os livros estão reservados ou não


## Especificações Técnicas
- ***Linguagem de Programação:*** Python
- ***Framework:*** Django
- ***Banco de Dados:*** MongoDB
- ***Tipo de API:*** RESTful API


## Modelagem do Banco de dados (🟡 EM PROGRESSO)
***User***
- *superusuário:* Indica se o usuário tem permissões de superusuário.
- *campos comuns:* id, name, email, password.

***Book***
- *id:* Identificador único do livro.
- *title:* Título do livro.
- *author:* Autor do livro.
- *publish_date:* Data de publicação.
- *gender:* Gênero literário do livro.
- *isAvailable:* Indica se o livro está disponível ou reservado.
- *checkin_date:* Data em que o livro foi adicionado ao sistema.


## Interface Gráfica (🟡 EM PROGRESSO)

## Controle de Versão
Neste projeto adotaremos o fluxo de trabalho GitFlow para gerenciar as branches de desenvolvimento e um padrão de commits consistente para garantir clareza e rastreabilidade para controle de versões.
- ***main:*** Contém o código de produção. É estável e reflete o estado atual do software em produção.
- ***develop:*** Contém o código em desenvolvimento. Todas as novas funcionalidades e correções são integradas aqui antes de serem lançadas na branch main.
- ***feature/:*** Branches temporárias criadas a partir da develop para desenvolver novas funcionalidades. Após a conclusão, são mescladas de volta na develop.
- ***release/:*** Branches temporárias criadas a partir da develop quando o software está pronto para uma nova versão. Permite ajustes finais e testes antes de serem mescladas na main e develop.
- ***hotfix/:*** Branches temporárias criadas a partir da main para correções rápidas em produção. Após a conclusão, são mescladas de volta na main e develop.

## Gestão do Projeto
No desenvolvimento do sistema de gestão de biblioteca, utilizaremos o board do GitHub para organizar, rastrear e concluir tarefas de forma eficiente.

### Estrutura do Board:

- ***Backlog:*** Contém todas as tarefas a serem realizadas, incluindo ideias, funcionalidades futuras e bugs conhecidos.
- ***To Do:*** Tarefas priorizadas e prontas para serem iniciadas.
- ***In Progress:*** Tarefas em andamento, indicando quem está trabalhando nelas.
- ***Review:*** Tarefas concluídas, aguardando revisão de código e testes.
- ***Done:*** Tarefas revisadas e aprovadas, integradas ao projeto.

## Desenvolvedores
- [@camiyuka](https://github.com/camiyuka)
- [@AnaJuliaMM](https://github.com/AnaJuliaMM)
