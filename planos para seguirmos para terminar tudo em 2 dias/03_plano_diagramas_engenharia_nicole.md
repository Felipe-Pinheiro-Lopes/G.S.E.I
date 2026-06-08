# Plano de Trabalho - Diagramas e Engenharia de Software
**Responsavel:** Nicole  
**Prazo:** 2 dias  
**Professor:** Prof Glauco  
**Criterios abrangidos:** Engenharia de Software

## Objetivo
Entregar todos os diagramas e artefatos visuais de Engenharia de Software exigidos pelo professor Glauco.

## Tarefas

### 1. Diagramas UML do Sistema Atual
Gerar pelo menos 3 diagramas, salvos em `docs/diagramas/`:

| Diagrama | Ferramenta | Descricao |
|----------|-----------|-----------|
| Diagrama de Classes (UML) | PlantUML ou draw.io | Classes principais do backend (Models), controllers e DbContext, com atributos, metodos publicos e relacionamentos (associacoes, heranca se houver) |
| Diagrama de Sequencia | PlantUML | Pelo menos 2 cenarios principais: (a) Login + obtencao de JWT, (b) Fluxo completo de triagem (iniciar -> finalizar -> atualizar status -> registrar movimentacao) |
| Diagrama de Componentes/Arquitetura | PlantUML ou Excalidraw | Visao de alto nivel: Frontend Next.js, API ASP.NET Core, PostgreSQL, Servicos externos. Mostrar protocolos (HTTP/HTTPS, JSON) e dependencias. |

Padroes para PlantUML:
- Usar skinparam backgroundColor white para melhor leitura
- Exportar PNG apos gerar o codigo .puml

### 2. Prototipacao da Interface
Escolher UMA das opcoes abaixo e entregar em `docs/prototipo/`:

- **Opcao A (Recomendada)**: Exportar prototipo de alta fidelidade do Figma/Whimiscal como PDF ou PNG, com comentarios apontando as telas: Login, Dashboard, Inventario, Triagem, Doacao, Descarte.
- **Opcao B**: Capturas de tela do sistema rodando, com anotacoes explicando o fluxo de cada tela.
- **Opcao C**: Storybook configurado com os componentes do projeto (Button, StatCard, Charts) e link de acesso.

Se houver arquivos de origem (Figma link, .fig), incluir tambem.

### 3. GitHub Projects - Atualizar o Existente
O projeto ja existe em: https://github.com/users/Felipe-Pinheiro-Lopes/projects/2/views/1

Acoes necessarias:
- Revisar as colunas padrão (To Do / In Progress / Done)
- Criar issues representando cada tarefa pendente do PLANEJAMENTO.md
- Aplicar labels: `documentacao`, `diagrama`, `bug`, `feature`, `melhoria`
- Configurar milestone para a entrega da Mostra UniSENAI
- Atribuir cada issue ao membro responsavel (quando o repositorio tiver equipe configurada)
- Dar embed/link do Project no README.md

### 4. Entregas
| Arquivo | Local | Descricao |
|---------|-------|-----------|
| classes.puml + classes.png | docs/diagramas/ | Diagrama de classes |
| sequencia-login.puml + sequencia-login.png | docs/diagramas/ | Sequencia de login |
| sequencia-triagem.puml + sequencia-triagem.png | docs/diagramas/ | Sequencia de triagem |
| componentes.puml + componentes.png | docs/diagramas/ | Arquitetura/componentes |
| prototipo.pdf (ou pasta com capturas) | docs/prototipo/ | Prototipacao da interface |

## Observacoes
- Nicole e responsavel por toda a parte visual do professor Glauco.
- Os diagramas devem ser alinhados com o codigo atual (Models/Controllers de API).
- Para o GitHub Project, basta linkar o existente no README e garantir que esteja minimamente povoado.
