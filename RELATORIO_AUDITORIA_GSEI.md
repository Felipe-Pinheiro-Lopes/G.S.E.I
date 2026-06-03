# Relatório de Auditoria — G.S.E.I
**Data:** 02/06/2026  
**Escopo:** Backend (.NET 10), Frontend (Next.js 16), Banco de Dados (PostgreSQL)

---

## 1. Resumo Executivo

Foram identificados **38 problemas** no projeto, classificados por severidade:
- **Críticos:** 8 (tela Descarte inutilizável, 3 telas estáticas sem dados reais, falhas de segurança)
- **Altos:** 13 (dados falsos hardcoded no backend e frontend, contratos quebrados, endpoints inexistentes)
- **Médios:** 13 (alerts nativos, URLs hardcoded, inconsistências de contrato, imports mortos)
- **Baixos:** 4 (placeholders cosméticos, links mortos, dependências externas)

A prioridade de correção visa restaurar a funcionalidade mínima (tela Descarte e Inventário) primeiro, depois eliminar dados falsos e finalmente saneamente consistências.

---

## 2. Problemas Identificados

### 2.1 Críticos

| # | Arquivo | Linha | Descrição | Categoria |
|---|---------|-------|-----------|-----------|
| C1 | `front-end/src/app/Screens/Descarte/page.tsx` | 105-110, 112-145 | `setSelectedItem`, `setLaudoDescarte`, `setNovoStatus`, `setDrawerOpen`, `setSalvandoDescarte` são chamados mas **nunca declarados** com `useState`. Causa `ReferenceError` em runtime → tela Descarte é completamente não-funcional. | Crash |
| C2 | `front-end/src/app/Screens/Solicitacao/page.tsx` | 91-105 | Tabela de equipamentos disponíveis usa array estático hardcoded com dados falsos (`#DOA-8821`, `#DOA-5540`, `L-2024-EX`, `12 UNID.`). Nenhuma chamada de API. | Fake Data |
| C3 | `front-end/src/app/Screens/Solicitacao/page.tsx` | 11-14, 122 | `handleSubmit` só abre modal de sucesso com protocolo fake `#SOL-2024-041`. Nunca persiste a solicitação no backend. | Broken Functionality |
| C4 | `front-end/src/app/Screens/AcompanhamentoSolicitacao/page.tsx` | Throughout | Tela vazia. Sem fetch de dados, sem integração com backend. | Broken Functionality |
| C5 | `front-end/src/app/Screens/Inf-Instituicao/page.tsx` | Throughout | Tela vazia. Sem fetch de dados, sem integração com backend. | Broken Functionality |
| C6 | `API/Controllers/UsersController.cs` | 40-44 | Senha atualizada como **texto simples** (`// por enquanto texto simples para demo`). AuthController usa SHA256, mas este endpoint bypassa completamente o hash. | Segurança |
| C7 | `API/Controllers/AuthController.cs` | 23 | Token retornado é `Guid.NewGuid().ToString()` — não é JWT. Nenhum middleware de validação JWT existe na API. | Segurança |
| C8 | `front-end/src/app/Screens/Doacoes/page.tsx` | 404 | `setSelectedSolicitacao(eq as any)` cast de `EquipamentoDoacao` para `SolicitacaoRow`. O drawer acessa `protocolo`, `instituicao`, `cnpj` que não existem no objeto Equipamento → runtime `undefined`. | Type Safety / Crash |

### 2.2 Altos

| # | Arquivo | Linha | Descrição | Categoria |
|---|---------|-------|-----------|-----------|
| A1 | `API/Controllers/DashboardController.cs` | 36 | `var pecasFaltantes = 142;` — valor hardcoded fake, nunca vem do banco. | Fake Data (BE) |
| A2 | `API/Controllers/DashboardController.cs` | 111-118 | Pareto fallback retorna dados fabricados quando não há dados reais (`"Defeito Irreparável" = 2`, etc.). | Fake Data (BE) |
| A3 | `API/Controllers/DashboardController.cs` | 172-181 | `GetUltimasAtualizacoes` retorna entradas 100% falsas: `"50 Laptops doados"`, `"Para Amor Inclusivo"`, `"2 horas atrás"`. | Fake Data (BE) |
| A4 | `API/Controllers/TriagemController.cs` | 206 | `if (total == 0) total = 374;` — total hardcoded fake quando não há dados. | Fake Data (BE) |
| A5 | `API/Controllers/TriagemController.cs` | 209 | `pctDesc = total > 0 ? ... : 95` — percentual fake hardcoded em fallback. | Fake Data (BE) |
| A6 | `front-end/src/components/Sidebar.tsx` | 311 | `window.location.reload()` após salvar perfil — full reload desnecessário para atualização de estado local. | Bad UX |
| A7 | `front-end/src/app/Screens/Doacoes/page.tsx` | 467-468 | Campo de telefone no drawer sempre exibe `'—'`, e usa `currentUserName` (string de nome) para popolar, não dados reais da solicitação. | Dead / Wrong Data |
| A8 | `front-end/src/app/Screens/Doacoes/page.tsx` | 512-516 | Botões "Solicitar mais Informações", "Negar Pedido" e "Aprovar Doação" no drawer têm **nenhum handler** — são decorativos. | Broken Functionality |
| A9 | `front-end/src/app/Screens/Descarte/page.tsx` | 108 | Mapeamento de status incorreto: backend usa `AguardandoDescarte`, mas o código define `'Aguardando'` para o `novoStatus`. | Backend Contract |
| A10 | `front-end/src/app/Screens/Dashboard/page.tsx` | 73-82, 107, 134 | Backend retorna JSON em **PascalCase** (`TotalInventario`, `EmTriagem`, etc.) mas o frontend espera **camelCase** (`totalInventario`, `emTriagem`). Todos os KPIs ficam `undefined`. | Backend Contract |
| A11 | `front-end/src/app/Screens/Dashboard/page.tsx` | 107, 134 | Endpoints chamados `/logs` e `/api/logs/exportar` não existem no backend. Os endpoints corretos são `/api/dashboard/movimentacoes` e `/api/dashboard/movimentacoes/exportar`. | Broken Route |
| A12 | `front-end/src/app/Screens/Doacoes/page.tsx` | 199-207 | `handleRemoverDoacao` chama `PUT /Equipamentos/{id}/status` (`UpdateStatus`), mas `EquipamentosController.cs` comentou/removeu este endpoint na linha 78-79. Chamada sempre retornará 404. | Broken Route |
| A13 | `front-end/src/app/Screens/Doacoes/page.tsx` | 441 | Fallback de protocolo no drawer exibe `#SOL-XXXX` quando não há dado real. | Fake Data |

### 2.3 Médios

| # | Arquivo | Linha | Descrição | Categoria |
|---|---------|-------|-----------|-----------|
| M1 | `front-end/src/app/Screens/Inventario/page.tsx` | 312-316 | Fallback de código/lote gerado no client (`EQ-${Date.now()}`, `Lote-${...}`) pode conflitar com regras de negócio do backend. | Backend Contract |
| M2 | `front-end/src/app/Screens/Inventario/page.tsx` | 51-54, 110-116 | Lista de status padrão oculta `AguardandoDoacao`, `AguardandoFormatacao`, `AguardandoDescarte`, mas o dropdown oferece alguns desses. Confuso. | UX Inconsistency |
| M3 | `front-end/src/app/Screens/Doacoes/page.tsx` | 88 | `s.itensCount \|\| 3` — fallback de "3 Equipamentos" quando API não retorna count. | Fake Data |
| M4 | `front-end/src/app/Screens/Doacoes/page.tsx` | 126 | Fallback `'Instituição'` quando `nome` é null no retorno da API. | Fake Data |
| M5 | `front-end/src/components/Header.tsx` | 39-43 | Input de busca no Header não tem `value` nem `onChange` — é puramente decorativo. | Dead Code |
| M6 | `front-end/src/components/SolicitacoesTable.tsx` | 105-110 | Botão "Aplicar" tem `onClick` vazio — filtros já são reativos, botão é morto. | Dead Code |
| M7 | `front-end/src/app/Screens/Triagem/page.tsx` | 160, 204, 228, 236, 250, 263 | 6 usos de `alert()` para feedback. | UX Pattern |
| M8 | `front-end/src/app/Screens/Doacoes/page.tsx` | 181, 191, 198, 205, 254, 376, 384, 388 | 8 usos de `alert()` e 1 `confirm()` (bloqueante). | UX Pattern |
| M9 | `front-end/src/app/Screens/Inventario/page.tsx` | 69, 72, 306, 326, 329 | 5 usos de `alert()`. | UX Pattern |
| M10 | `front-end/src/app/Screens/Descarte/page.tsx` | 133, 139 | 2 usos de `alert()`. | UX Pattern |
| M11 | `front-end/src/app/Screens/Dashboard/page.tsx` | 268 | `alert()` como tooltip informativo. | UX Pattern |
| M12 | `front-end/src/services/api.ts` | 9 | `baseURL: 'http://localhost:5145/api'` hardcoded. Sem variável de ambiente. | Config |
| M13 | `front-end/src/services/api.ts` | 6 | `parseCookies()` executado no carregamento do módulo. No SSR do Next.js pode causar hydration mismatch. | SSR Issue |

### 2.4 Baixos

| # | Arquivo | Linha | Descrição | Categoria |
|---|---------|-------|-----------|-----------|
| B1 | `front-end/src/app/login/page.tsx` | 157 | Badge hardcoded `"AUDITADO V4.2"`. | Fake Data |
| B2 | `front-end/src/app/login/page.tsx` | 113, 150 | Links `href="#"` mortos. | Dead Link |
| B3 | `front-end/src/components/Sidebar.tsx` | 133, 182 | Avatar usa serviço externo `i.pravatar.cc` (dependência externa que pode falhar). | External Dependency |
| B4 | `front-end/src/components/Sidebar.tsx` | 225 | Fallback de email `'seu@email.com'` fake. | Fake Data |

---

## 3. Plano de Correção Detalhado

### 3.1 Frontend — Fase 1: Restaurar Funcionalidade Crítica

**F-1: Corrigir Descarte — estado inexistente (CRITICAL)**
- **Arquivo:** `front-end/src/app/Screens/Descarte/page.tsx`
- **Ação:** Adicionar `useState` faltantes ao topo do componente: `selectedItem`, `laudoDescarte`, `novoStatus`, `drawerOpen`, `salvandoDescarte`.
- **Status inicial:** `selectedItem = null`, `laudoDescarte = ''`, `novoStatus = 'AguardandoDescarte'`, `drawerOpen = false`, `salvandoDescarte = false`.

**F-2: Integrar Solicitacao com backend (CRITICAL)**
- **Arquivo:** `front-end/src/app/Screens/Solicitacao/page.tsx`
- **Ação:**
  1. Substituir array estático de equipamentos por `useEffect` que chama `GET /api/Equipamentos?status=AguardandoDoacao`.
  2. Adicionar checkbox states reais por equipamento.
  3. `handleSubmit` deve fazer `POST /api/Solicitacoes` com dados reais.
  4. Remover protocolo fake do modal de sucesso — exibir número retornado pelo backend.

**F-3: Popular AcompanhamentoSolicitacao (CRITICAL)**
- **Arquivo:** `front-end/src/app/Screens/AcompanhamentoSolicitacao/page.tsx`
- **Ação:** Adicionar `useEffect` que busca solicitações da instituição logada via `GET /api/Solicitacoes`. Renderizar tabela com status real. Remover props fake de userName/userRole.

**F-4: Popular Inf-Instituicao (CRITICAL)**
- **Arquivo:** `front-end/src/app/Screens/Inf-Instituicao/page.tsx`
- **Ação:** Adicionar `useEffect` que busca dados da instituição via `GET /api/Instituicoes/{id}` ou `/api/Users/me`. Formulário funcional para edição. Remover props fake.

**F-5: Corrigir contrato de KPIs no Dashboard (ALTO)**
- **Arquivo:** `front-end/src/app/Screens/Dashboard/page.tsx`
- **Ação:**
  1. Alterar `KpiData` interface para PascalCase: `TotalInventario`, `EmTriagem`, `DoacoesAprovadas`, etc.
  2. Alterar endpoints: `/logs` → `/dashboard/movimentacoes`, `/api/logs/exportar` → `/api/dashboard/movimentacoes/exportar`.

### 3.2 Frontend — Fase 2: Eliminar Dados Falsos e Corrigir Contratos

**F-6: Remover hardcode em Doacoes drawer (ALTO)**
- **Arquivo:** `front-end/src/app/Screens/Doacoes/page.tsx`
- **Ação:** Buscar telefone real da instituição no backend e renderizar no drawer. Implementar handlers dos botões "Solicitar mais Informações", "Negar Pedido" e "Aprovar Doação" com chamadas de API corretas.

**F-7: Corrigir endpoint inexistente em Doacoes (ALTO)**
- **Arquivo:** `front-end/src/app/Screens/Doacoes/page.tsx`
- **Ação:** `handleRemoverDoacao` deve chamar endpoint que reverte status (ex: `POST /api/doacoes/cancelar` ou atualizar status via backend). Não deve mais chamar `PUT /Equipamentos/{id}/status` que foi removido.

**F-8: Corrigir mapeamento de status no Descarte (ALTO)**
- **Arquivo:** `front-end/src/app/Screens/Descarte/page.tsx`
- **Ação:** Usar `'AguardandoDescarte'` como fallback em vez de `'Aguardando'` para consistência com o backend.

**F-9: Eliminar fallbacks com dados falsos no inventário (MÉDIO)**
- **Arquivo:** `front-end/src/app/Screens/Inventario/page.tsx`
- **Ação:** Confiar no backend para gerar `Codigo` e `Lote`. Remover geração client-side. Adicionar validação de campos obrigatórios.

**F-10: Padronizar tratamento de erros (MÉDIO)**
- **Arquivo:** todos os `page.tsx`
- **Ação:** Substituir todos os `alert()` por toasts/notificações da UI (ex: componente Toast customizado ou biblioteca como `sonner`). Remover `confirm()`.

### 3.3 Backend — Fase 1: Segurança e Integridade

**B-1: Corrigir hash de senha em UsersController (CRITICAL)**
- **Arquivo:** `API/Controllers/UsersController.cs`
- **Ação:** Usar `HashPassword()` (SHA256) do `AuthController` quando `NovaSenha` for fornecida.

**B-2: Implementar JWT real (crítico para F-3/F-4)**
- **Arquivo:** `API/Controllers/AuthController.cs`, novo `API/Services/TokenService.cs`
- **Ação:** Gerar JWT assinado no login. Adicionar middleware de validação. Para este projeto, usar biblioteca `System.IdentityModel.Tokens.Jwt`.

**B-3: Remover/corrigir dados fake do DashboardController (ALTO)**
- **Arquivo:** `API/Controllers/DashboardController.cs`
- **Ação:**
  1. Remover `pecasFaltantes = 142`; retornar 0 ou consultar tabela real.
  2. Pareto: retornar lista vazia quando não houver dados, em vez de falsos.
  3. Últimas atualizações: retornar lista vazia quando não houver dados reais.
  4. Triagem status: remover `total = 374` e `pctDesc = 95` — retornar `0` quando não houver dados.

### 3.4 Backend — Fase 2: Contratos de API

**B-4: Padronizar casing de retorno no Dashboard (ALTO)**
- **Arquivo:** `API/DTOs/DashboardDtos.cs`, `API/Controllers/DashboardController.cs`
- **Ação:** Garantir que nomes de propriedades nos DTOs retornados correspondem exatamente ao que o frontend espera (camelCase ou ajustar interface no frontend).

**B-5: Criar endpoint de reversão de doação (ALTO)**
- **Arquivo:** `API/Controllers/DoacoesController.cs`
- **Ação:** Criar `POST /api/doacoes/{id}/cancelar` que reverte status de `DoacaoAprovada` para `AguardandoDoacao`, para substituir a chamada quebrada `PUT /Equipamentos/{id}/status`.

### 3.5 Infraestrutura e Config

**I-1: Remover hardcode de URL e SSR issue (MÉDIO)**
- **Arquivo:** `front-end/src/services/api.ts`
- **Ação:**
  1. Usar `process.env.NEXT_PUBLIC_API_URL` (Next.js expõe apenas variáveis com `NEXT_PUBLIC_`).
  2. Mover `parseCookies()` para dentro de um hook ou função que é chamada no cliente, não no topo do módulo.

**I-2: Remover `window.location.reload()` do Sidebar (ALTO)**
- **Arquivo:** `front-end/src/components/Sidebar.tsx`
- **Ação:** Substituir por atualização de estado/localStorage/hook de usuário após salvar perfil.

---

## 4. Ordem de Execução Recomendada

```
1. F-1: Corrigir estado inexistente em Descarte (CRITICAL — tela quebra)
2. B-1: Corrigir hash plaintext em UsersController (CRITICAL — segurança)
3. B-3: Remover hardcoded fakes do DashboardController (ALTO — dados reais)
4. F-2: Integrar Solicitacao com backend (CRITICAL — fluxo quebrado)
5. F-3: Popular AcompanhamentoSolicitacao (CRITICAL — tela vazia)
6. F-4: Popular Inf-Instituicao (CRITICAL — tela vazia)
7. F-5: Corrigir contrato de KPIs Dashboard (ALTO — tela quebrada)
8. F-6: Corrigir drawer Doacoes — handlers + dados reais (ALTO)
9. B-5: Criar endpoint cancelar doação (ALTO — botão quebrado)
10. F-7: Atualizar handleRemoverDoacao para endpoint novo (ALTO)
11. F-8: Corrigir status Aguardando no Descarte (ALTO)
12. I-2: Remover window.location.reload() Sidebar (ALTO)
13. F-10: Padronizar tratamento de erros (MÉDIO)
14. I-1: Remover hardcode URL + SSR fix (MÉDIO)
15. F-9: Ajustar Inventário — backend gera código/lote (MÉDIO)
16. M2: Consistência de status em Inventário/Doacoes (MÉDIO)
17. M5-M6: Remover imports/código morto (MÉDIO/BAIXO)
18. Remover alerts restantes de todas as telas (MÉDIO)
19. B4: Padronizar casing DTOs Dashboard (MÉDIO)
20. B1/B2: Implementar JWT (crítico para segurança, média para fluxo imediato)
21. B3-B4: Melhorias de entity/validação DTOs Instituicao
22. B1: Resolver relacionamento Equipamento→Instituicao no OnModelCreating
23. B2: Implementar soft-delete nos controllers de hard DELETE
```

---

## 5. Critérios de Aceitação

Após as correções:

- [ ] `Descarte/page.tsx` carrega sem erros de compilação/TypeScript e abre drawer com dados reais.
- [ ] `Solicitacao/page.tsx` busca equipamentos reais, submete via POST e exibe protocolo do backend.
- [ ] `AcompanhamentoSolicitacao/page.tsx` exibe tabela com solicitações reais da instituição.
- [ ] `Inf-Instituicao/page.tsx` exibe e edita dados reais da instituição.
- [ ] `Dashboard/page.tsx` exibe KPIs reais do backend (sem `undefined`).
- [ ] Todos os endpoints chamados no frontend existem no backend.
- [ ] Nenhuma senha armazenada em plaintext no banco.
- [ ] Nenhum dado fake retornado pelo backend quando há dados reais disponíveis.
- [ ] Nenhum `alert()` ou `confirm()` nativo restante nas telas.
- [ ] `npm run build` no `front-end/` sem erros.
- [ ] `dotnet build` no `API/` sem erros.
