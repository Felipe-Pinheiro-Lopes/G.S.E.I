# Plano de Implementação — Melhorias G.S.E.I

> Baseado em `MelhoriasFront.md` + varredura completa do código atual (front-end + back-end + banco).
> Data: 01/06/2026

---

## Sumário Executivo

Foram identificadas **8 solicitações** em `MelhoriasFront.md`, agrupadas em 4 áreas. Além dessas, a varredura encontrou **12 problemas adicionais** (bugs, dados falsos, rotas quebradas, ausência de validação, etc.). O plano abaixo cobre TUDO.

---

## Seção 1 — Requisitos de `MelhoriasFront.md` (Mapeados)

| # | Requisito | Área | Prioridade |
|---|---|---|---|
| 1 | Dashboard: botão "Log Completo" abre histórico de movimentações do dia com filtro por data/período e geração de documento | Dashboard / Backend / DB | Alta |
| 2 | Inventário: corrigir hardcode "EQ-937081" — deve ser placeholder/sugestão, não valor fixo | Frontend | Alta |
| 3 | Inventário: corrigir hardcode "Lote-2026-01" — mesmo tratamento do item 2 | Frontend | Alta |
| 4 | Inventário: cores das letras no modal "Cadastrar Equipamentos" estão muito claras | Frontend | Média |
| 5 | Inventário: inventário NÃO deve permitir edição de status inline; substituir por botão "Enviar para Triagem" | Frontend + Backend | Alta |
| 6 | Doações: tela de cadastro de instituição — CNPJ com máscara, telefone com máscara, email com validação de formato | Frontend + Backend | Média |
| 7 | Descarte: paginação fake ("64 páginas") — remover paginação hardcoded e deixar funcional/restringida ao total real | Frontend + Backend | Alta |
| 8 | Descarte: itens "Descartado" devem exibir informações (drawer/info), não apenas "Aguardando" | Frontend | Alta |
| 9 | Descarte: "Laudo Técnico / Motivo do Descarte" não deve ser editável na tela de Descarte; somente visualização | Frontend + Backend | Alta |

---

## Seção 2 — Problemas Adicionais Encontrados (Varredura)

| # | Problema | Severidade | Local |
|---|---|---|---|
| A1 | Três arquivos (`.tsx`) em `app/Screens/` sem `page.tsx` → rotas retornam 404 no Next.js App Router | Crítica | `front-end/src/app/Screens/AcompanhamentoSolicitacao.tsx`, `Inf-Instituicao.tsx`, `Solicitacao.tsx` |
| A2 | `app/page.tsx` ainda é o template default do Next.js ("To get started...") | Média | `front-end/src/app/page.tsx` |
| A3 | Inventário: edição usa `prompt()`/`confirm()` nativos do browser (UX ruim, sem validação) | Média | `Inventario/page.tsx` |
| A4 | Doações: "Remover" executa `DELETE` hard, não altera status | Alta | `Doacoes/page.tsx` |
| A5 | Doações: "Editar" inline atualiza só `modelo`, não outros campos | Baixa | `Doacoes/page.tsx` |
| A6 | Doações: `SolicitacoesTable` importado mas nunca renderizado (dead import) | Baixa | `Doacoes/page.tsx` |
| A7 | `Inf-Instituicao.tsx` usa `window.location.reload()` após salvar perfil (full reload desnecessário) | Baixa | `Inf-Instituicao.tsx` |
| A8 | Sem biblioteca de validação de formulários — validação é manual e inconsistente | Média | Todo front-end |
| A9 | Sem skeleton loaders — apenas texto "Carregando..." | Baixa | Todo front-end |
| A10 | Dados falsos/placeholder aparecem quando API falha (fallback hardcoded em Dashboard, Inventário, Doações, Descarte) | Alta | Várias páginas |
| A11 | Inconsistência de casing nos status do backend: alguns retornam `"EmAnalise"`, outros `"Em Andamento"`; sem enum forte | Alta | Backend Models |
| A12 | `Equipamento.InstituicaoId` FK existe no DB mas não está configurada como relacionamento no `OnModelCreating` | Média | API/Data/AppDbContext.cs |

---

## Seção 3 — Plano de Implementação Detalhado

### 3.1 Backend (.NET 10 / C#)

#### Tarefa B-1: Criar entidade `Movimentacao` (Log)

**Objetivo:** Suportar o "Log Completo" do Dashboard com histórico de movimentações.

**Arquivos a criar:**
- `API/Models/Movimentacao.cs`
- `API/DTOs/MovimentacaoDtos.cs`
- Migration: `AddMovimentacaoEntity`

**Estrutura da entidade:**

```csharp
// API/Models/Movimentacao.cs
namespace API.Models;

public record Movimentacao(
    int Id,
    int EquipamentoId,
    string TipoMovimentacao,  // "Entrada", "Triagem_Inicio", "Triagem_Finalizada",
                              // "EnviadoParaDoacao", "DoacaoAprovada",
                              // "EnviadoParaDescarte", "Descartado", "StatusAlterado"
    string? StatusAnterior = null,
    string? StatusNovo = null,
    string? Descricao = null,
    string? Responsavel = null,  // nome do usuário ou técnico
    DateTime DataHora
);
```

**DTO de resposta:**

```csharp
// API/DTOs/MovimentacaoDtos.cs
namespace API.DTOs;

public record MovimentacaoDto(
    int Id,
    int EquipamentoId,
    string CodigoEquipamento,
    string TipoMovimentacao,
    string? StatusAnterior,
    string? StatusNovo,
    string? Descricao,
    string? Responsavel,
    DateTime DataHora
);

public record MovimentacaoFiltroDto(
    DateTime? DataInicio = null,
    DateTime? DataFim = null,
    int? EquipamentoId = null,
    string? TipoMovimentacao = null
);

public record MovimentacaoPaginadaDto(
    List<MovimentacaoDto> Itens,
    int Total,
    int Pagina,
    int PorPagina
);
```

**Mudanças em `AppDbContext.cs`:**
- Adicionar `DbSet<Movimentacao> Movimentacoes`
- Configurar relacionamento `Movimentacao → Equipamento` (Many-to-One)
- Configurar índice composto em `(EquipamentoId, DataHota)` para performance

**Tarefa B-2: Popular `Movimentacao` automaticamente em cada operação**

**Estratégia:** Criar um serviço `IMovimentacaoService` / `MovimentacaoService` para centralizar a criação de logs. ** Alternativa mais simples (menor impacto):** adicionar lógica de log DENTRO de cada controller que modifica status, usando `db.Movimentacoes.Add(...)` antes de `SaveChangesAsync`. Para este plano, recomendamos a abordagem direta no controller por simplicidade, com a ressalva de que idealmente migraria-se para Services depois.

**Pontos de inserção de log:**
- `EquipamentosController.Create` → log "Entrada" com `DataEntrada`
- `EquipamentosController.UpdateStatus` → log "StatusAlterado" com anterior/novo
- `EquipamentosController.AprovarDoacao` → log "DoacaoAprovada"
- `EquipamentosController.RegistrarDescarte` → log "Descartado"
- `TriagemController.RealizarTriagem` → log "Triagem_Finalizada"
- `TriagemController.IniciarAndamento` → log "Triagem_Inicio"

**Tarefa B-3: Novos endpoints no `DashboardController`**

```csharp
// GET /api/dashboard/movimentacoes
// Query params: ?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD&tipo=...&pagina=1&porPagina=20
[HttpGet("movimentacoes")]
public async Task<ActionResult<MovimentacaoPaginadaDto>> GetMovimentacoes([FromQuery] MovimentacaoFiltroDto filtro)

// GET /api/dashboard/movimentacoes/exportar-pdf (ou exportar-csv)
// Gera um arquivo CSV/PDF com os dados filtrados
[HttpGet("movimentacoes/exportar")]
public async Task<IActionResult> ExportarMovimentacoes([FromQuery] MovimentacaoFiltroDto filtro)
```

**Implementação de exportação:** Usar `CsvHelper` (NuGet) para CSV. Para PDF, usar `QuestPDF` ou `iTextSharp`. **Recomendação para este projeto:** começar com CSV (mais simples, atende ao requisito de "documento").

**Checklist B-1 a B-3:**

- [ ] Criar `API/Models/Movimentacao.cs`
- [ ] Criar `API/DTOs/MovimentacaoDtos.cs`
- [ ] Adicionar `DbSet<Movimentacao>` no `AppDbContext`
- [ ] Configurar relacionamento e índice em `OnModelBuilding`
- [ ] Criar migration `AddMovimentacaoEntity`
- [ ] Rodar `dotnet ef database update`
- [ ] Injetar lógica de log em `EquipamentosController.Create`
- [ ] Injetar lógica de log em `EquipamentosController.UpdateStatus`
- [ ] Injetar lógica de log em `EquipamentosController.AprovarDoacao`
- [ ] Injetar lógica de log em `EquipamentosController.RegistrarDescarte`
- [ ] Injetar lógica de log em `TriagemController.RealizarTriagem`
- [ ] Injetar lógica de log em `TriagemController.IniciarAndamento`
- [ ] Adicionar `GET /api/dashboard/movimentacoes`
- [ ] Adicionar `GET /api/dashboard/movimentacoes/exportar`
- [ ] (Opcional) Adicionar NuGet `CsvHelper` para exportação CSV

---

#### Tarefa B-4: Corrigir criação de Equipamento — adicionar DTO dedicado

**Problema atual:** `POST /api/equipamentos` recebe o `Equipamento` completo, exigindo `Id` e `DataEntrada` do cliente. O ideal é que o backend gere `Id` (identity) e `DataEntrada` (server-side `DateTime.UtcNow`).

**Arquivo a criar:**
- `API/DTOs/EquipamentoCreateDto.cs`

**Estrutura:**

```csharp
namespace API.DTOs;

public record EquipamentoCreateDto(
    string Codigo,        // Required — frontend envia sugestão, backend valida unicidade
    string Modelo,        // Required
    string? Especificacoes = null,
    string? Lote = null,
    string? Tipo = null
    // NÃO envia Id, DataEntrada, Status, InstituicaoId, AprovadoPor, LaudoDescarte
);
```

**Mudança no controller:**

```csharp
// Antes
[HttpPost]
public async Task<ActionResult<Equipamento>> Create(Equipamento equipamento)

// Depois
[HttpPost]
public async Task<ActionResult<EquipamentoDto>> Create(EquipamentoCreateDto dto)
{
    var equipamento = new Equipamento(
        Id: 0, // Identity — gerado pelo banco
        Codigo: dto.Codigo,
        Modelo: dto.Modelo,
        Especificacoes: dto.Especificacoes ?? "",
        Status: "EmEstoque", // ou "Pendente" — definir status padrão inicial
        Lote: dto.Lote ?? "",
        DataEntrada: DateTime.UtcNow,
        Tipo: dto.Tipo ?? "Equipamento",
        InstituicaoId: null,
        AprovadoPor: null,
        LaudoDescarte: null
    );

    db.Equipamentos.Add(equipamento);
    await db.SaveChangesAsync();

    // Log de movimentação
    db.Movimentacoes.Add(new Movimentacao(
        Id: 0,
        EquipamentoId: equipamento.Id,
        TipoMovimentacao: "Entrada",
        StatusNovo: equipamento.Status,
        Descricao: $"Equipamento {equipamento.Codigo} cadastrado",
        Responsavel: "Sistema", // TODO: vir do auth
        DataHora: DateTime.UtcNow
    ));
    await db.SaveChangesAsync();

    return CreatedAtAction(nameof(GetAll), new { id = equipamento.Id }, equipamento);
}
```

**Checklist B-4:**

- [ ] Criar `API/DTOs/EquipamentoCreateDto.cs`
- [ ] Alterar `EquipamentosController.Create` para usar `EquipamentoCreateDto`
- [ ] Garantir que `DataEntrada` é gerada no backend
- [ ] Garantir que `Status` inicial é definido no backend (ex: "EmEstoque")
- [ ] Adicionar log de movimentação na criação

---

#### Tarefa B-5: Implementar paginação em `GetDescarteItens` (resolve item 7)

**Problema atual:** `.Take(100)` sem `Skip`/`page`/`total` → frontend não sabe o total real e mostra "64 páginas" fake.

**Solução:**

```csharp
[HttpGet("descarte/itens")]
public async Task<ActionResult<object>> GetDescarteItens([FromQuery] int pagina = 1, [FromQuery] int porPagina = 10)
{
    var query = db.Equipamentos
        .Where(e => e.Status == "Descartado" || e.Status == "AguardandoDescarte")
        .OrderByDescending(e => e.DataEntrada);

    var total = await query.CountAsync();
    var itens = await query
        .Skip((pagina - 1) * porPagina)
        .Take(porPagina)
        .Select(e => new {
            id = e.Id,
            descricao = e.Modelo,
            codigo = e.Codigo,
            lote = e.Lote,
            data = e.DataEntrada.ToString("dd/MM/yyyy"),
            status = e.Status == "AguardandoDescarte" ? "Aguardando" : "Descartado",
            responsavel = e.AprovadoPor ?? "Equipe GSEI",
            tipo = e.Tipo ?? "Equipamento",
            laudo = e.LaudoDescarte ?? ""
        })
        .ToListAsync();

    return Ok(new { itens, total, pagina, porPagina, totalPaginas = (int)Math.Ceiling(total / (double)porPagina) });
}
```

**Checklist B-5:**

- [ ] Alterar `TriagemController.GetDescarteItens` para aceitar `pagina` e `porPagina`
- [ ] Retornar objeto com `itens`, `total`, `pagina`, `porPagina`, `totalPaginas`
- [ ] Aplicar mesma lógica de paginação em `EquipamentosController.GetAll` e `SolicitacoesController.GetAll`

---

#### Tarefa B-6: Restringir edição de `LaudoDescarte` à Triagem

**Objetivo:** O campo `LaudoDescarte` (motivo do descarte) é preenchido durante a Triagem. A tela de Descarte só deve permitir **leitura**.

**Abordagem no backend:**
- O endpoint `POST /api/equipamentos/{id}/registrar-descarte` **não deve aceitar** atualização de `LaudoDescarte` se já houver valor.
- Adicionar verificação: se `LaudoDescarte` não for null/vazio, retornar erro 409 (Conflict) ou simplesmente ignorar a atualização desse campo.

```csharp
[HttpPost("{id}/registrar-descarte")]
public async Task<IActionResult> RegistrarDescarte(int id, [FromBody] RegistrarDescarteDto dto)
{
    var eq = await db.Equipamentos.FindAsync(id);
    if (eq == null) return NotFound();

    // LaudoDescarte é imutável após triagem; se já existir, não sobrescrever
    var laudoFinal = string.IsNullOrWhiteSpace(eq.LaudoDescarte)
        ? dto.LaudoDescarte
        : eq.LaudoDescarte;

    await db.Database.ExecuteSqlRawAsync(@"
        UPDATE ""Equipamentos""
        SET ""Status"" = {0},
            ""LaudoDescarte"" = {1},
            ""AprovadoPor"" = {2}
        WHERE ""Id"" = {3}",
        dto.NovoStatus ?? "Descartado",
        laudoFinal,
        dto.Responsavel,
        id);

    return NoContent();
}
```

**Checklist B-6:**

- [ ] Alterar `EquipamentosController.RegistrarDescarte` para não sobrescrever `LaudoDescarte` se já preenchido
- [ ] Atualizar DTO `RegistrarDescarteDto` para remover ou tornar `LaudoDescarte` opcional/informativo

---

#### Tarefa B-7: Remover endpoint `UpdateStatus` (ou restringir via role)

**Objetivo:** Forçar que mudanças de status passem apenas pela Triagem.

**Opção 1 (Recomendada para este projeto — menor impacto):** Remover `PUT /api/equipamentos/{id}/status` do controller. O frontend de Inventário passará a usar `POST /api/triagem/iniciar` com `TecnicoResponsavel` para enviar para triagem.

**Opção 2 (Mais robusta):** Adicionar `[Authorize]` + role check, e validar que a transição de status segue as regras de negócio.

```csharp
// Remover este método de EquipamentosController:
// [HttpPut("{id}/status")]
// public async Task<IActionResult> UpdateStatus(int id, [FromBody] string novoStatus)
```

**Checklist B-7:**

- [ ] Remover `UpdateStatus` de `EquipamentosController` (ou comentar com TODO)
- [ ] Verificar se há alguma outra chamada a esse endpoint no frontend e atualizar
- [ ] Garantir que Inventário usa `POST /api/triagem/iniciar` para enviar para triagem

---

#### Tarefa B-8: Configurar relacionamento `Equipamento → Instituicao` no `OnModelCreating`

**Problema atual:** A FK `InstituicaoId` existe na tabela mas o EF Core não tem a configuração de relacionamento.

**Arquivo:** `API/Data/AppDbContext.cs`

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // ... configurações existentes ...
    modelBuilder.Entity<Equipamento>()
        .HasOne<Instituicao>()
        .WithMany()
        .HasForeignKey(e => e.InstituicaoId)
        .IsRequired(false);
}
```

**Checklist B-8:**

- [ ] Adicionar configuração `HasOne/WithMany` em `OnModelCreating`

---

#### Tarefa B-9: Adicionar validação de formato CNPJ, Telefone e Email

**Nível:** Backend para garantir integridade, frontend para UX.

**Backend — usar DataAnnotations ou FluentValidation:**

```csharp
// API/DTOs/InstituicaoCreateDto.cs
using System.ComponentModel.DataAnnotations;

public record InstituicaoCreateDto(
    [Required, MaxLength(200)] string Nome,
    [Required, RegularExpression(@"^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$",
        ErrorMessage = "CNPJ inválido. Formato esperado: 00.000.000/0000-00")]
    string Cnpj,
    [Required, MaxLength(100)] string Responsavel,
    [Required, RegularExpression(@"^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$",
        ErrorMessage = "Telefone inválido. Formato: (11) 99999-9999")]
    string Telefone,
    [Required, EmailAddress(ErrorMessage = "Email inválido")] string Email
);
```

**Checklist B-9:**

- [ ] Criar `InstituicaoCreateDto` com validações
- [ ] (Opcional) Criar `InstituicaoUpdateDto`
- [ ] Alterar `InstituicoesController.Create` para usar o DTO com validação
- [ ] Adicionar regex/máscara no frontend (JS) para CNPJ e telefone

---

### 3.2 Frontend (Next.js 16 / React / TypeScript)

#### Tarefa F-1: Corrigir rotas quebradas — `AcompanhamentoSolicitacao`, `Inf-Instituicao`, `Solicitacao`

**Problema:** Arquivos `.tsx` não são `page.tsx` → Next.js App Router retorna 404.

**Solução:** Renomear ou criar `page.tsx` correspondente.

```
app/Screens/
├── AcompanhamentoSolicitacao/
│   └── page.tsx  (conteúdo do .tsx antigo)
├── Inf-Instituicao/
│   └── page.tsx
├── Solicitacao/
│   └── page.tsx
```

**Checklist F-1:**

- [ ] Mover conteúdo de `AcompanhamentoSolicitacao.tsx` para `AcompanhamentoSolicitacao/page.tsx`
- [ ] Mover conteúdo de `Inf-Instituicao.tsx` para `Inf-Instituicao/page.tsx`
- [ ] Mover conteúdo de `Solicitacao.tsx` para `Solicitacao/page.tsx`
- [ ] Remover arquivos `.tsx` antigos
- [ ] Verificar Sidebar para links corretos (`/Screens/AcompanhamentoSolicitacao` etc.)

---

#### Tarefa F-2: Corrigir `app/page.tsx` — remover template default

**Solução:** Redirecionar `/` para `/login` ou exibir landing page própria do G.S.E.I.

```typescript
// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}
```

**Checklist F-2:**

- [ ] Substituir conteúdo de `app/page.tsx` por redirect para `/login`

---

#### Tarefa F-3: Inventário — corrigir placeholders "EQ-937081" e "Lote-2026-01"

**Arquivo:** `app/Screens/Inventario/page.tsx`

**Alteração no estado inicial do modal:**

```typescript
// Antes (hardcoded como value)
const [codigo, setCodigo] = useState(`EQ-${Date.now().slice(-6)}`);
const [lote, setLote] = useState(`Lote-${new Date().getFullYear()}-01`);

// Depois (placeholder)
const [codigo, setCodigo] = useState('');
const [lote, setLote] = useState('');

// No input:
<input
  value={codigo}
  onChange={(e) => setCodigo(e.target.value)}
  placeholder={`EQ-${Date.now().slice(-6)}`}  // sugestão visual apenas
/>
<input
  value={lote}
  onChange={(e) => setLote(e.target.value)}
  placeholder={`Lote-${new Date().getFullYear()}-01`}
/>
```

**Checklist F-3:**

- [ ] Alterar estado inicial de `codigo` para string vazia
- [ ] Alterar estado inicial de `lote` para string vazia
- [ ] Adicionar `placeholder` nos inputs com o formato sugerido
- [ ] Verificar se backend aceita string vazia (ou se deve usar `null` — ajustar DTO se necessário)

---

#### Tarefa F-4: Inventário — corrigir cor das letras no modal "Cadastrar Equipamentos"

**Problema:** Cores estão muito claras (baixo contraste).

**Arquivo:** `app/Screens/Inventario/page.tsx` (modal)

**Diagnóstico:** Verificar se o modal está usando classes como `text-gray-400` ou `text-gray-300` para labels/inputs. Alterar para `text-gray-800` ou `text-[#071e27]` (cor do tema).

```tsx
// Antes (exemplo hipotético)
<p className="text-gray-300">Código</p>
<input className="... text-gray-300" />

// Depois
<p className="text-gray-800">Código</p>
<input className="... text-gray-800" />
```

**Checklist F-4:**

- [ ] Inspecionar todas as labels e inputs do modal de cadastro
- [ ] Alterar classes de cor para `text-gray-800` ou `text-[--color-on-surface]`
- [ ] Garantir contraste mínimo AA (4.5:1)

---

#### Tarefa F-5: Inventário — remover edição inline de status; adicionar botão "Enviar para Triagem"

**Mudança no frontend:**

1. **Remover** o `<select>` de edição de status da tabela de inventário.
2. **Adicionar** uma coluna "Ações" com botão "Enviar para Triagem" em cada linha.
3. **Implementar** a chamada a `POST /api/triagem/iniciar` (que já existe no backend) com `TecnicoResponsavel`.

```tsx
// Nova coluna na tabela
<th>Ações</th>

// Nova célula (para itens EmEstoque ou AguardandoFormatacao)
<td>
  {(equipamento.status === 'EmEstoque' || equipamento.status === 'AguardandoFormatacao') && (
    <Button
      onClick={() => handleEnviarParaTriagem(equipamento)}
      className="bg-green-600 text-white px-3 py-1 rounded-lg"
    >
      Enviar para Triagem
    </Button>
  )}
</td>
```

```typescript
// Nova função na página
const handleEnviarParaTriagem = async (equipamento: Equipamento) => {
  try {
    await api.post('/triagem/iniciar', {
      EquipamentoId: equipamento.id,
      TecnicoResponsavel: 'Técnico', // TODO: pegar do usuário logado
    });
    alert('Equipamento enviado para triagem!');
    fetchEquipamentos(); // recarregar lista
  } catch (err) {
    alert('Erro ao enviar para triagem');
  }
};
```

**Checklist F-5:**

- [ ] Remover coluna de edição de status da tabela de Inventário
- [ ] Adicionar coluna "Ações" com botão "Enviar para Triagem"
- [ ] Implementar `handleEnviarParaTriagem` chamando `POST /api/triagem/iniciar`
- [ ] Atualizar backend (B-7) para remover `UpdateStatus` ou garantir que Inventário não o usa mais

---

#### Tarefa F-6: Doações — adicionar máscara/validação de CNPJ, Telefone e Email

**Arquivo:** `app/Screens/Doacoes/page.tsx` (modal "Nova Instituição")

**Biblioteca recomendada:** `react-hook-form` + `zod` para validação, ou máscaras puras com `onChange`.

**Máscaras (implementação simples com regex de entrada):**

```typescript
// utils/masks.ts
export const mascaraCNPJ = (value: string): string => {
  const nums = value.replace(/\D/g, '').slice(0, 14);
  return nums
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

export const mascaraTelefone = (value: string): string => {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  return nums
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

export const validarEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

**Uso nos inputs:**

```tsx
<input
  value={cnpj}
  onChange={(e) => setCnpj(mascaraCNPJ(e.target.value))}
  placeholder="00.000.000/0000-00"
/>
<input
  value={telefone}
  onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
  placeholder="(11) 99999-9999"
/>
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="exemplo@email.com"
/>
```

**Validação no submit:**

```typescript
const handleCadastrarInstituicao = async () => {
  if (!validarEmail(email)) {
    alert('Email inválido');
    return;
  }
  if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) {
    alert('CNPJ inválido');
    return;
  }
  // ... prosseguir com POST
};
```

**Checklist F-6:**

- [ ] Criar `front-end/src/utils/masks.ts` com `mascaraCNPJ`, `mascaraTelefone`, `validarEmail`
- [ ] Aplicar máscaras nos inputs do modal "Nova Instituição"
- [ ] Adicionar validação no submit do formulário
- [ ] Adicionar validação no backend (B-9)

---

#### Tarefa F-7: Descarte — corrigir paginação fake

**Arquivo:** `app/Screens/Descarte/page.tsx`

**Problema:** Frontend "./descarte/page.tsx" mostra total de páginas hardcoded (64) sem consultar o backend.

**Alteração:**

```typescript
// Estado atual do componente
const [descarteData, setDescarteData] = useState<DescarteItem[]>([]);
const [paginaAtual, setPaginaAtual] = useState(1);
const [totalPaginas, setTotalPaginas] = useState(0); // antes era hardcoded

// Fetch atualizado
const fetchDescarteItens = async (pagina: number = 1) => {
  setLoading(true);
  try {
    const { data } = await api.get('/triagem/descarte/itens', {
      params: { pagina, porPagina: 10 }
    });
    setDescarteData(data.itens);
    setTotalPaginas(data.totalPaginas);
    setPaginaAtual(data.pagina);
  } catch (err) {
    // tratar erro
  } finally {
    setLoading(false);
  }
};
```

**Componente de paginação:**

```tsx
{/* Footer da tabela */}
<div className="flex justify-between items-center mt-4">
  <span>
    Página {paginaAtual} de {totalPaginas}
  </span>
  <div className="flex gap-2">
    <Button
      onClick={() => fetchDescarteItens(paginaAtual - 1)}
      disabled={paginaAtual <= 1}
    >
      Anterior
    </Button>
    <Button
      onClick={() => fetchDescarteItens(paginaAtual + 1)}
      disabled={paginaAtual >= totalPaginas}
    >
      Próxima
    </Button>
  </div>
</div>
```

**Checklist F-7:**

- [ ] Remover hardcode de "64 páginas" do estado
- [ ] Atualizar `fetchDescarteItens` para enviar `?pagina=&porPagina=`
- [ ] Ler `totalPaginas` da resposta do backend
- [ ] Renderizar paginação funcional no footer
- [ ] (Backend) Garantir que `TriagemController.GetDescarteItens` retorna paginação (B-5)

---

#### Tarefa F-8: Descarte — exibir informações de itens "Descartado" (não apenas "Aguardando")

**Arquivo:** `app/Screens/Descarte/page.tsx`

**Mudança:** Remover o `if`/`else` ou `switch` que bloqueia o drawer para itens `"Descartado"`. Ambos os status devem permitir abertura do drawer para consulta.

```typescript
// Antes (exemplo hipotético)
const handleRowClick = (item: DescarteItem) => {
  if (item.status === 'Aguardando') {
    setItemSelecionado(item);
    setDrawerOpen(true);
  } else {
    alert('Item descartado não pode ser visualizado'); // ❌ problema
  }
};

// Depois
const handleRowClick = (item: DescarteItem) => {
  setItemSelecionado(item);
  setDrawerOpen(true); // ✅ qualquer status pode ser consultado
};
```

**Ajuste no drawer:** Indicar visualmente que o item está "Descartado" (somente leitura) vs "Aguardando".

**Checklist F-8:**

- [ ] Remover condição que bloqueia drawer para "Descartado"
- [ ] Ajustar UI do drawer para indicar modo "somente leitura" quando `status === 'Descartado'`

---

#### Tarefa F-9: Descarte — tornar "Laudo Técnico / Motivo do Descarte" somente leitura

**Arquivo:** `app/Screens/Descarte/page.tsx` (drawer)

**Alteração:**

```tsx
{/* Antes: textarea editável */}
<textarea
  value={itemSelecionado.laudo}
  onChange={(e) => setItemSelecionado({ ...itemSelecionado, laudo: e.target.value })}
/>

{/* Depois: somente leitura */}
<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 whitespace-pre-wrap">
  {itemSelecionado.laudo || 'Laudo não disponível.'}
</div>
```

**Checklist F-9:**

- [ ] Substituir `<textarea>` editável por `<div>` readonly no drawer de Descarte
- [ ] Garantir que backend não aceita atualização do laudo (B-6)

---

#### Tarefa F-10: Remover dados falsos/placeholder (fallback hardcoded)

**Arquivos afetados:** `Dashboard/page.tsx`, `Inventario/page.tsx`, `Doacoes/page.tsx`, `Descarte/page.tsx`

**Abordagem:** Substituir fallbacks hardcoded por estados de erro amigáveis.

```typescript
// Antes (exemplo)
try {
  const { data } = await api.get('/dashboard/kpis');
  setKpis(data);
} catch {
  setKpis({ total: 128, emEstoque: 45, emTriagem: 32, aguardandoDoacao: 28 }); // ❌ fake
}

// Depois
try {
  const { data } = await api.get('/dashboard/kpis');
  setKpis(data);
} catch {
  setKpis(null);
}

// No JSX:
{kpis ? (
  <StatCard titulo="Total" valor={kpis.total} />
) : (
  <div className="text-gray-500 text-sm">Não foi possível carregar os dados do dashboard.</div>
)}
```

**Checklist F-10:**

- [ ] Remover fallback hardcoded de Dashboard (Notebook Dell G15, Bateria Viciada 892)
- [ ] Remover fallback hardcoded de Inventário (EQ-1024, EQ-1025)
- [ ] Remover fallback hardcoded de Doações
- [ ] Remover fallback hardcoded de Descarte
- [ ] Implementar UI de erro amigável

---

#### Tarefa F-11: Adicionar debug/placeholder de perfil e dados falsos

**Arquivos afetados:** `services/api.ts`, todas as páginas

**Mudança:** Em vez de dados fake quando API falha, mostrar estado de erro consistente.

**Checklist F-11:**

- [ ] Padronizar tratamento de erro em todas as páginas
- [ ] (Opcional) Criar hook `useGseiApi` para centralizar fetch + erro

---

### 3.3 Banco de Dados (PostgreSQL)

#### Tarefa D-1: Criar tabela `Movimentacoes`

**SQL (reference para migration manual ou scaffold):**

```sql
CREATE TABLE "Movimentacoes" (
    "Id" SERIAL PRIMARY KEY,
    "EquipamentoId" INT NOT NULL REFERENCES "Equipamentos"("Id") ON DELETE CASCADE,
    "TipoMovimentacao" VARCHAR(50) NOT NULL,
    "StatusAnterior" VARCHAR(50),
    "StatusNovo" VARCHAR(50),
    "Descricao" TEXT,
    "Responsavel" VARCHAR(200),
    "DataHora" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IX_Movimentacoes_EquipamentoId_DataHora ON "Movimentacoes" ("EquipamentoId", "DataHora" DESC);
```

**Migration (scaffold):**

```bash
dotnet ef migrations add AddMovimentacaoEntity --project API --startup-project API
dotnet ef database update --project API --startup-project API
```

**Checklist D-1:**

- [ ] Criar migration `AddMovimentacaoEntity`
- [ ] Verificar que `Movimentacoes` FK para `Equipamentos` está correta
- [ ] Verificar índice criado

---

#### Tarefa D-2: Ajustar estrutura de `Equipamentos` se necessário

**Verificar:** A coluna `Status` já existe. Adicionar constraint CHECK com enum:

```sql
-- Opcional, mas recomendado para integridade
ALTER TABLE "Equipamentos" ADD CONSTRAINT CK_Equipamentos_Status
  CHECK ("Status" IN (
    'EmEstoque', 'EmTriagem', 'EmAnalise', 'AguardandoDoacao',
    'DoacaoAprovada', 'AguardandoDescarte', 'Descartado', 'AguardandoFormatacao'
  ));
```

**Checklist D-2:**

- [ ] (Opcional) Adicionar constraint CHECK em `Status`
- [ ] (Opcional) Adicionar constraint CHECK em `Triagens.Destino`
- [ ] (Opcional) Adicionar constraint CHECK em `Solicitacoes.Status`

---

## Seção 4 — Ordem de Execução Recomendada

A ordem abaixo foi definida para minimizar dependências e risco de quebra:

```
Fase 1 — Fundação (Backend primeiro)
1. D-1: Criar tabela Movimentacoes + migration
2. B-8: Configurar relacionamento Equipamento→Instituicao em OnModelCreating
3. B-4: Criar EquipamentoCreateDto + atualizar Create no controller
4. B-7: Remover UpdateStatus (ou preparar remoção)
5. B-9: Criar InstituicaoCreateDto com validação

Fase 2 — Funcionalidades Principais
6. B-1 a B-3: Movimentacao entity + endpoints Dashboard (log completo + exportação)
7. B-5: Paginação em GetDescarteItens
8. B-6: Restringir LaudoDescarte
9. F-7: Atualizar frontend de Descarte para usar páginação real
10. F-8: Descarte — exibir info de itens "Descartado"
11. F-9: Descarte — Laudo somente leitura
12. F-5: Inventário — botão "Enviar para Triagem" (depende de B-7)
13. F-3: Inventário — placeholders (EQ-*, Lote-*)
14. F-4: Inventário — corrigir cores do modal
15. F-6: Doações — máscara CNPJ/Telefone/Email

Fase 3 — Correções Gerais
16. F-1: Corrigir rotas quebradas (AcompanhamentoSolicitacao, Inf-Instituicao, Solicitacao)
17. F-2: Fix app/page.tsx
18. F-10: Remover dados falsos/placeholder
19. F-11: Padronizar tratamento de erros
20. A3: Substituir prompt/confirm por diálogos próprios (baixa prioridade)
21. A4: Doações "Remover" → alterar status (não DELETE)
22. A6: Remover import morto SolicitacoesTable
23. A7: Remover window.location.reload() de Inf-Instituicao
24. (Opcional) A8/A9: React Hook Form + skeletons (melhoria de UX)

Fase 4 — Refatoração (quando tempo permitir)
25. A11: Converter Status/Role/Destino para enums tipados
26. A12: Criar Services layer separando lógica de Controllers
27. A5: Doações edição inline expandir para todos os campos
```

---

## Seção 5 — Checklist de Verificação Geral (Pré-Deploy)

Após concluir todas as fases, executar:

- [ ] `dotnet build` no `API/` — sem erros
- [ ] `dotnet ef database update` — sem erros de migration
- [ ] `npm run build` no `front-end/` — sem erros de build Next.js
- [ ] Testar login → dashboard carrega com dados reais (sem fallback fake)
- [ ] Testar cadastro de equipamento: campos código/lote como placeholder
- [ ] Testar envio para triagem a partir do inventário
- [ ] Testar triagem completa → status muda corretamente
- [ ] Testar cadastro de instituição: máscaras e validação aplicam
- [ ] Testar descarte: paginação funciona, "Descartado" exibe info, laudo é readonly
- [ ] Testar dashboard "Log Completo": filtros por data retornam dados reais
- [ ] Verificar telefone → `(11) 99999-9999`, CNPJ → `00.000.000/0000-00`, Email → bloqueia formato inválido
- [ ] Verificar responsividade em mobile (especialmente página Descarte)
- [ ] Confirmar que tabela `Movimentacoes` está recebendo registros em cada operação
- [ ] Confirmar que `Inf-Instituicao` não faz full reload ao salvar
- [ ] Confirmar que rotas `/Screens/*` quebradas estão corrigidas (404 resolvido)

---

## Observações Técnicas

1. **Autenticação real:** Atualmente o token é um GUID simples (`AuthController.Login`). Para a tarefa B-1 (Log Completo), o campo `Responsavel` usa `"Sistema"` como placeholder. Quando implementar JWT real, basta substituir por `User.Identity.Name` — a estrutura `Movimentacao` já suporta isso.
2. **N+1 queries:** Após criar `Movimentacao`, ao buscar histórico de um equipamento, usar `.Include(m => m.Equipamento)` para evitar N+1 se precisar do código.
3. **SQL Raw vs EF:** Alguns controllers usam `ExecuteSqlRawAsync` para updates. Idealmente migrar para `db.Entry(equipamento).CurrentValues.SetValues(...)` + `SaveChangesAsync()`, mas isso é refatoração futura.
4. **Frontend sem cache:** Como não há React Query/SWR, toda mutação (triagem, descarte, aprovação) deverá chamar `fetch...()` novamente para atualizar a UI.
5. **Next.js 16 breaking changes:** Ao corrigir rotas (F-1), lembrar que Next.js 16 usa `page.tsx` obrigatoriamente para App Router. Não é permitido `.tsx` solto em rotas.

---

*Plano gerado em 01/06/2026. Todos os itens são rastreáveis e verificáveis.*
