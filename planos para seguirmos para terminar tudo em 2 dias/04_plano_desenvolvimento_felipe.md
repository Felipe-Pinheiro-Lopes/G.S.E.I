# Plano de Trabalho - Desenvolvimento do Sistema
**Responsavel:** Felipe  
**Prazo:** 2 dias  
**Professores:** Prof Andre (BD), Prof Gabriel (Front-end), Prof Cainã (Linguagem)

## Objetivo
Ajustar o codigo do sistema para remover deficiencias tecnicas e implementar melhorias que garantam a nota maxima nas disciplinas afetas ao desenvolvimento.

## Tarefas

### 1. Seguranca e Configuracao (Prof Andre)
- [ ] Remover hardcoded JWT Secret de `API/Program.cs`. Criar `appsettings.Development.json` com valor dummy e `appsettings.Production.json` com placeholder. Ler via `builder.Configuration["Jwt:Key"]` apenas, SEM fallback hardcoded.
- [ ] Mover CORS `localhost:3000` para `appsettings.json`:  
  ```json
  "Cors": { "AllowedOrigins": ["http://localhost:3000"] }
  ```  
  E ler em `Program.cs` via `builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()`.
- [ ] Garantir que `X-Forwarded-Proto` seja tratado se houver proxy reverso (para nao quebrar HTTPS em prod).

### 2. Front-end - Ajustes de Qualidade (Prof Gabriel)
- [ ] **HTML Semantico**: auditar arquivos em `front-end/src/app/Screens/` e `front-end/src/components/`. Garantir uso de tags semanticas.
- [ ] **Responsividade**: testar breakpoints mobile (sm, md, lg) em tabelas (`DescarteTable`, `SolicitacoesTable`) e graficos (`ParetoChart`, `CategoriesDonut`, `VolumeBarChart`). Ajustar classes Tailwind para `overflow-x-auto`, `w-full`, `min-w-*` conforme necessario.
- [ ] **next.config.ts**: revisar e documentar configuracoes aplicadas (images.domains, output: standalone, compress, reactStrictMode).

### 3. Codigo - Documentacao e Limpeza (Prof Cainã)
- [ ] Remover TODO de `TriagemController.cs` linha 26: `TecnicoResponsavel = "Tecnico"` -> ler do `User.Claims` do `HttpContext`.
- [ ] Adicionar XML summaries em Controllers e Services principais.
- [ ] Inserir exemplos de codigo comentado em `docs/codigo-exemplos.md` mostrando: estrutura condicional, repeticao, modularizacao usadas no fluxo de triagem e aprovacao.
- [ ] Garantir ausencia de `Console.WriteLine` para log em producao (substituir por ILogger).

### 4. Integracoes e Deploy
- [ ] Garantir que `dotnet build` passe sem erros/warnings criticos.
- [ ] Garantir que `npm run build` no front-end complete sem erros.
- [ ] Atualizar `README.md` (apos Ryan/Bianca finalizarem a versao expandida) com links para a Wiki.

### 5. Entregas
| Arquivo | Descricao |
|---------|-----------|
| appsettings.json atualizado | CORS via config |
| Program.cs ajustado | Sem hardcoded secrets |
| TriagemController.cs corrigido | Sem TODO |
| docs/codigo-exemplos.md | Exemplos didaticos |
| fronts ajustados | Semantica + responsividade |

## Observacoes
- Felipe e o responsavel maior pelo sistema. Ajustes em BD e Front devem ser feitos aqui quando couberem ao desenvolvimento.
- Reunir-se com Enrico para validar se as alteracoes no modelo nao quebram o codigo existente.
