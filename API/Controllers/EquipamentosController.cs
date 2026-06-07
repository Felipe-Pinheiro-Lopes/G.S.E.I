using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EquipamentosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<object>> GetAll([FromQuery] string? status = null, [FromQuery] int pagina = 1, [FromQuery] int porPagina = 10)
    {
        try
        {
            var query = db.Equipamentos.AsQueryable();
            if (!string.IsNullOrEmpty(status))
                query = query.Where(e => e.Status == status);

            var total = await query.CountAsync();
            var itens = await query
                .OrderByDescending(e => e.DataEntrada)
                .Skip((pagina - 1) * porPagina)
                .Take(porPagina)
                .Select(e => new EquipamentoDto(
                    e.Id, e.Codigo, e.Modelo, e.Especificacoes, e.Status, e.Lote, e.Tipo,
                    e.InstituicaoId, e.AprovadoPor, e.LaudoDescarte))
                .ToListAsync();

            return Ok(new { itens, total, pagina, porPagina, totalPaginas = (int)Math.Ceiling(total / (double)porPagina) });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[EQUIPAMENTOS ERROR - GetAll] {ex.GetType().Name}: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<EquipamentoDto>> Create(EquipamentoCreateDto dto)
    {
        var equipamento = new Equipamento
        {
            Codigo = dto.Codigo,
            Modelo = dto.Modelo,
            Especificacoes = dto.Especificacoes ?? "",
            Status = "EmEstoque",
            Lote = dto.Lote ?? "",
            DataEntrada = DateTime.UtcNow,
            Tipo = dto.Tipo ?? "Equipamento"
        };

        db.Equipamentos.Add(equipamento);
        await db.SaveChangesAsync();

        db.Movimentacoes.Add(new Movimentacao
        {
            EquipamentoId = equipamento.Id,
            TipoMovimentacao = "Entrada",
            DataHora = DateTime.UtcNow,
            StatusNovo = equipamento.Status,
            Descricao = $"Equipamento {equipamento.Codigo} cadastrado",
            Responsavel = "Sistema"
        });
        await db.SaveChangesAsync();

        return Ok(new EquipamentoDto(
            equipamento.Id, equipamento.Codigo, equipamento.Modelo,
            equipamento.Especificacoes, equipamento.Status, equipamento.Lote,
            equipamento.Tipo, equipamento.InstituicaoId, equipamento.AprovadoPor,
            equipamento.LaudoDescarte));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var equipamento = await db.Equipamentos.FindAsync(id);
        if (equipamento == null)
            return NotFound();

        db.Equipamentos.Remove(equipamento);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] EquipamentoUpdateDto dto)
    {
        var existing = await db.Equipamentos.FindAsync(id);
        if (existing == null)
            return NotFound();

        // Update only the editable fields, preserve DataEntrada, Status, InstituicaoId, etc.
        existing.Codigo = dto.Codigo ?? existing.Codigo;
        existing.Modelo = dto.Modelo ?? existing.Modelo;
        existing.Especificacoes = dto.Especificacoes ?? existing.Especificacoes;
        existing.Lote = dto.Lote ?? existing.Lote;
        existing.Tipo = dto.Tipo ?? existing.Tipo;

        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Aprova um equipamento para doação, vinculando a uma instituição e registrando o responsável.
    /// Usado pela tela de Doações.
    /// </summary>
    [HttpPost("{id}/aprovar-doacao")]
    public async Task<IActionResult> AprovarDoacao(int id, [FromBody] AprovarDoacaoDto dto)
    {
        var eq = await db.Equipamentos.FindAsync(id);
        if (eq == null) return NotFound();

        var oldStatus = eq.Status;

        eq.Status = "DoacaoAprovada";
        eq.InstituicaoId = dto.InstituicaoId;
        eq.AprovadoPor = dto.AprovadoPor;

        var instituicao = await db.Instituicoes.FindAsync(dto.InstituicaoId);
        db.Movimentacoes.Add(new Movimentacao
        {
            EquipamentoId = id,
            TipoMovimentacao = "DoacaoAprovada",
            DataHora = DateTime.UtcNow,
            StatusAnterior = oldStatus,
            StatusNovo = "DoacaoAprovada",
            Descricao = $"Doação aprovada para instituição: {instituicao?.Nome ?? dto.InstituicaoId.ToString()}",
            Responsavel = dto.AprovadoPor
        });
        await db.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Cancela a doação de um equipamento, revertendo seu status.
    /// </summary>
    [HttpPost("{id}/cancelar-doacao")]
    public async Task<IActionResult> CancelarDoacao(int id)
    {
        var eq = await db.Equipamentos.FindAsync(id);
        if (eq == null) return NotFound();

        var oldStatus = eq.Status;
        eq.Status = "AguardandoDoacao";
        eq.InstituicaoId = null;
        eq.AprovadoPor = null;

        db.Movimentacoes.Add(new Movimentacao
        {
            EquipamentoId = id,
            TipoMovimentacao = "StatusAlterado",
            DataHora = DateTime.UtcNow,
            StatusAnterior = oldStatus,
            StatusNovo = "AguardandoDoacao",
            Descricao = $"Cancelamento de doação. Revertido de '{oldStatus}' para 'AguardandoDoacao'",
            Responsavel = "Sistema"
        });

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/registrar-descarte")]
    public async Task<IActionResult> RegistrarDescarte(int id, [FromBody] RegistrarDescarteDto dto)
    {
        var eq = await db.Equipamentos.FindAsync(id);
        if (eq == null) return NotFound();

        var oldStatus = eq.Status;
        var laudoFinal = string.IsNullOrWhiteSpace(eq.LaudoDescarte)
            ? dto.LaudoDescarte
            : eq.LaudoDescarte;

        eq.Status = dto.NovoStatus ?? "Descartado";
        eq.LaudoDescarte = laudoFinal;
        eq.AprovadoPor = dto.Responsavel;

        db.Movimentacoes.Add(new Movimentacao
        {
            EquipamentoId = id,
            TipoMovimentacao = "Descartado",
            DataHora = DateTime.UtcNow,
            StatusAnterior = oldStatus,
            StatusNovo = dto.NovoStatus ?? "Descartado",
            Descricao = $"Descarte registrado. Laudo: {laudoFinal}",
            Responsavel = dto.Responsavel
        });
        await db.SaveChangesAsync();

        return NoContent();
    }
}
