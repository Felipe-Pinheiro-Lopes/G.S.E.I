using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

/// <summary>
/// Controller responsável por gerenciar e controlar as solicitações de doações realizadas por instituições.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SolicitacoesController(AppDbContext db, ILogger<SolicitacoesController> logger) : ControllerBase
{
    /// <summary>
    /// Registra uma nova solicitação de doação e associa os equipamentos.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<SolicitacaoDto>> Criar(CriarSolicitacaoDto dto)
    {
        var solicitacao = new Solicitacao
        {
            InstituicaoId = dto.InstituicaoId,
            ResponsavelRetirada = dto.ResponsavelRetirada,
            TelefoneContato = dto.TelefoneContato,
            Finalidade = dto.Finalidade,
            Status = "Pendente",
            DataSolicitacao = DateTime.UtcNow,
            Protocolo = $"SOL-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}",
            Prioridade = "Média"
        };

        db.Solicitacoes.Add(solicitacao);
        await db.SaveChangesAsync();

        // Add selected equipment items
        foreach (var eqId in dto.EquipamentoIds)
        {
            db.ItensSolicitacao.Add(new ItemSolicitacao
            {
                SolicitacaoId = solicitacao.Id,
                EquipamentoId = eqId,
                QuantidadeSolicitada = 1
            });
        }
        await db.SaveChangesAsync();

        var inst = await db.Instituicoes.FindAsync(dto.InstituicaoId);
        return new SolicitacaoDto(solicitacao.Id, inst?.Nome ?? "", dto.ResponsavelRetirada, solicitacao.Status, solicitacao.DataSolicitacao, solicitacao.Protocolo, solicitacao.Prioridade);
    }

    /// <summary>
    /// Retorna todas as solicitações de doações registradas no sistema.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<SolicitacaoDto>>> Listar()
    {
        var lista = await db.Solicitacoes
            .Join(db.Instituicoes, s => s.InstituicaoId, i => i.Id, (s, i) => new { s, i })
            .Select(x => new SolicitacaoDto(
                x.s.Id,
                x.i.Nome,
                x.s.ResponsavelRetirada,
                x.s.Status,
                x.s.DataSolicitacao,
                x.s.Protocolo,
                x.s.Prioridade
            ))
            .ToListAsync();

        return lista;
    }

    /// <summary>
    /// Aprova uma solicitação de doação pelo seu ID.
    /// </summary>
    [HttpPut("{id}/aprovar")]
    public async Task<IActionResult> Aprovar(int id)
    {
        var sol = await db.Solicitacoes.FindAsync(id);
        if (sol == null) return NotFound();

        sol.Status = "Aprovada";
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Nega uma solicitação de doação e reverte os equipamentos vinculados.
    /// </summary>
    [HttpPost("{id}/negar")]
    public async Task<IActionResult> Negar(int id)
    {
        var sol = await db.Solicitacoes.FindAsync(id);
        if (sol == null) return NotFound();

        var oldStatus = sol.Status;
        sol.Status = "Negada";

        // Revert linked equipment back to "AguardandoDoacao"
        var itens = await db.ItensSolicitacao
            .Where(i => i.SolicitacaoId == id)
            .ToListAsync();

        foreach (var item in itens)
        {
            var eq = await db.Equipamentos.FindAsync(item.EquipamentoId);
            if (eq != null && eq.Status != "EmEstoque")
            {
                eq.Status = "AguardandoDoacao";
                eq.InstituicaoId = null;
                eq.AprovadoPor = null;
            }
        }

        db.Movimentacoes.Add(new Movimentacao
        {
            EquipamentoId = itens.FirstOrDefault()?.EquipamentoId ?? 0,
            TipoMovimentacao = "Solicitacao_Negada",
            DataHora = DateTime.UtcNow,
            StatusAnterior = oldStatus,
            StatusNovo = "Negada",
            Descricao = $"Solicitação {sol.Protocolo} negada.",
            Responsavel = "Sistema"
        });

        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Solicita mais informações sobre uma solicitação de doação.
    /// </summary>
    [HttpPost("{id}/solicitar-info")]
    public async Task<IActionResult> SolicitarInfo(int id)
    {
        var sol = await db.Solicitacoes.FindAsync(id);
        if (sol == null) return NotFound();

        var oldStatus = sol.Status;
        sol.Status = "AguardandoInfo";

        db.Movimentacoes.Add(new Movimentacao
        {
            EquipamentoId = 0,
            TipoMovimentacao = "Solicitacao_AguardandoInfo",
            DataHora = DateTime.UtcNow,
            StatusAnterior = oldStatus,
            StatusNovo = "AguardandoInfo",
            Descricao = $"Informações adicionais solicitadas para {sol.Protocolo}.",
            Responsavel = "Sistema"
        });

        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Retorna os indicadores de doações e solicitações.
    /// </summary>
    [HttpGet("kpis")]
    public async Task<ActionResult<object>> GetKpis()
    {
        try
        {
            var total = await db.Solicitacoes.CountAsync();
            var aprovadas = await db.Solicitacoes.CountAsync(s => s.Status == "Aprovada" || s.Status == "DoacaoAprovada");
            var pendentes = await db.Solicitacoes.CountAsync(s => s.Status == "Pendente" || s.Status == "Em Análise");
            var itensDoados = await db.Equipamentos.CountAsync(e => e.Status == "DoacaoAprovada");

            return new { total, aprovadas, pendentes, itensDoados };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[Doacoes KPIs Error]");
            return new { total = 0, aprovadas = 0, pendentes = 0, itensDoados = 0 };
        }
    }

    /// <summary>
    /// Retorna o volume de solicitações mensais aprovadas no ano informado.
    /// </summary>
    [HttpGet("volume-mensal")]
    public async Task<ActionResult<List<object>>> GetVolumeMensal([FromQuery] int ano = 2025)
    {
        try
        {
            var solicitacoes = await db.Solicitacoes
                .Where(s => s.DataSolicitacao.Year == ano && (s.Status == "Aprovada" || s.Status == "DoacaoAprovada"))
                .ToListAsync();

            var grouped = solicitacoes
                .GroupBy(s => s.DataSolicitacao.Month)
                .Select(g => new { mes = g.Key, qtd = g.Count() })
                .OrderBy(x => x.mes)
                .ToList();

            return grouped.Cast<object>().ToList();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[Doacoes Volume Error]");
            return new List<object>();
        }
    }

    /// <summary>
    /// Retorna a distribuição por categorias dos itens doados.
    /// </summary>
    [HttpGet("top-categorias")]
    public async Task<ActionResult<List<object>>> GetTopCategorias()
    {
        try
        {
            var equipamentos = await db.Equipamentos
                .Where(e => e.Status == "DoacaoAprovada" && e.Tipo != null)
                .ToListAsync();

            var total = equipamentos.Count;
            if (total == 0) return new List<object>();

            var cats = equipamentos
                .GroupBy(e => e.Tipo)
                .Select(g => new { tipo = g.Key, qtd = g.Count() })
                .OrderByDescending(x => x.qtd)
                .Take(4)
                .ToList();

            return cats.Cast<object>().ToList();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[Doacoes Top Categorias Error]");
            return new List<object>();
        }
    }
}
