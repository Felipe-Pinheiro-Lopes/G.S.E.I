# Planejamento de Adequacao - Mostra UniSENAI (1o Semestre ADS)

## Banco de Dados - Prof Andre
- [ ] **Falta implementar:** Documentacao tecnica oficial do banco (dicionario de dados) em arquivo dedicado no repositorio, descrevendo cada tabela, coluna, tipo, constraints, indices e relacionamentos, conforme expectativa do criterio 10 de documentacao.
- [ ] **Melhoria:** Modelo Logico Relacional (MLD) ainda nao esta materializado como artefato de documentacao (PDF, Markdown ou diagrama). Criar documento com a conversao explicita das entidades do DER para tabelas, atributos, chaves e normalizacao ate 3FN com justificativa.
- [ ] **Melhoria:** Politica de CORS esta restrita a `localhost:3000` diretamente no codigo. Mover para `appsettings.json` / variaveis de ambiente para suportar multiplos ambientes (dev/homolog/prod) e facilitar deploy.
- [ ] **Melhoria:** JWT Secret esta hardcoded como fallback em `Program.cs`. Remover valor default e exigir variavel de ambiente / secret manager, documentando a configuracao necessaria.

## Desenvolvimento Web Front-end - Prof Gabriel
- [ ] **Falta implementar:** Um ou mais testes automatizados (unitarios ou de integracao com Vitest/Jest + Testing Library) cobrindo fluxos criticos (ex.: login, CRUD de inventario, submissao de triagem). O projeto nao possui runner de testes configurado atualmente.
- [ ] **Melhoria:** Estrutura HTML semantica deve ser auditada componente por componente. Garantir uso correto de tags semanticas (`<main>`, `<nav>`, `<header>`, `<section>`, `<table>` com headers) em todas as telas (`page.tsx` das screens e componentes reutilizaveis como `ParetoChart`, `DescarteTable`, `SolicitacoesTable`).
- [ ] **Melhoria:** Responsividade das telas internas ainda nao foi validada contra breakpoints moveis. Aplicar testes de viewport e ajustar layout de tabelas/graficos para mobile usando Tailwind responsivo.
- [ ] **Melhoria:** `next.config.ts` deve ser ajustado para producao (desativar `reactStrictMode` apenas se causar conflitos, garantir configuracoes de imagens/dominios necessarios). Revisar e documentar o que foi feito.

## Engenharia de Software - Prof Glauco
- [ ] **Falta implementar:** Diagramas UML (pelo menos classe, sequencia e/ou componente) representando a arquitetura do sistema atual, alinhados ao codigo.
- [ ] **Falta implementar:** Prototipacao de interface documentada no repositorio (arquivos de prototipo no Figma/Whimiscal + link no README ou pasta `/docs/prototipo`), ou alta fidelidade no proprio codigo com Storybook.
- [ ] **Falta implementar:** Repositorio nao possui Wiki ativada nem pagina `.github/` com templates e documentacao estruturada; criar Wiki com guias de arquitetura, deploy e convencoes.
- [ ] **Falta implementar:** GitHub Projects com quadro kanban oficial contendo tarefas e issues do projeto com labels/milestones. O `.kilo/` nao corresponde a um Project do GitHub.
- [ ] **Falta implementar:** PRD (Product Requirements Document) formal descrevendo personas, backlog de features, regras de negocio, criterios de aceite e roadmap do G.S.E.I.
- [ ] **Melhoria:** README.md deve ser expandido com arquitetura detalhada (diagrama C4 minimo), decisoes tecnicas (ADR), fluxo de CI/CD planejado e instrucoes de deploy em producao.

## Linguagem de Programacao - Prof Cainao
- [ ] **Falta implementar:** Fluxogramas dos algoritmos centrais (ex.: fluxo de triagem, decisao de destino, pipeline de data wiping, regras de aprovacao de doacao) equivalentes ao codigo JavaScript/TypeScript do frontend e C# do backend.
- [ ] **Melhoria:** Incluir exemplos de codigo com comentarios detalhados em linguagem de facil leitura, mostrando estruturas condicionais, repeticao e modularizacao aplicadas aos casos de uso do G.S.E.I.
- [ ] **Melhoria:** Adicionar documentacao estrutural no codigo (regions, summaries XML nos controllers/services) e garantir ausencia de `TODO`s e hardcodes, especialmente em `TriagemController.cs` (campo `TecnicoResponsavel = "Tecnico"` deve vir de claims do token).

## Metodologia Cientifica Aplicada
- [ ] **Falta implementar:** Artigo cientifico completo em formato .md (ou .pdf) no repositorio, cobrindo problema, objetivos, fundamentacao teorica, metodologia, resultados, conclusoes e referencias.
- [ ] **Falta implementar:** Banner academico seguindo o template oficial da disciplina, com layout padronizado, incluindo artefatos dos diagramas e especificacoes tecnicas, disponivel no repositorio (arquivo de imagem/pdf + link).
- [ ] **Melhoria:** Vincular no README.md uma secao dedicada ao artigo e banner com links diretos e descricao de onde estao os arquivos para facilitar acesso dos avaliadores.

## 🛠️ Tarefas Manuais e Validacoes Finais
- [ ] Deploy do backend e frontend em ambiente acessivel (Vercel/Render/Azure) e atualizacao do `NEXT_PUBLIC_API_URL` e CORS para producao.
- [ ] Validar funcionamento local dos dois apps (`npm run dev` e `dotnet watch run`) e testar fluxos reais de login, triagem, doacao e descarte.
- [ ] Cadastrar convidados na portaria conforme cronograma de 08 a 12 de junho.
- [ ] Elaborar banner fisico impresso conforme template oficial para apresentacao no dia da feira.
- [ ] Realizar inscricao para apresentacao oral (vagas limitadas, se desejado).
- [ ] Apresentar o sistema aos avaliadores e garantir que todos os integrantes saibam explicar a interface e decisoes de implementacao (criterio 7 de Front-end).
