using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TriagemController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> RealizarTriagem(RealizarTriagemDto dto)
    {
        var triagem = new Triagem(
            0,
            dto.EquipamentoId,
            JsonSerializer.Serialize(dto.Checklist),
            dto.LaudoTecnico,
            dto.Destino,
            DateTime.UtcNow,
            "Técnico" // TODO: from auth
        );

        db.Triagens.Add(triagem);

        // Update equipamento status based on destino
        // "Doacao" now goes to an intermediate state so it can be approved + assigned to an institution in the Doações screen
        string novoStatus = dto.Destino switch
        {
            "Reuso" => "EmEstoque",
            "Doacao" => "AguardandoDoacao",      // waits for institution assignment + approval
            "Descarte" => "AguardandoDescarte",  // waits for final confirmation + laudo in Descarte screen
            _ => "EmTriagem"
        };

        await db.Database.ExecuteSqlRawAsync(
            "UPDATE \"Equipamentos\" SET \"Status\" = {0} WHERE \"Id\" = {1}", 
            novoStatus, dto.EquipamentoId);

        await db.SaveChangesAsync();
        return Ok(triagem);
    }

    [HttpGet("historico/{equipamentoId}")]
    public async Task<ActionResult<List<Triagem>>> GetHistorico(int equipamentoId)
    {
        var triagens = await db.Triagens
            .Where(t => t.EquipamentoId == equipamentoId)
            .OrderByDescending(t => t.DataTriagem)
            .ToListAsync();

        return triagens;
    }

    /// <summary>
    /// Lista triagens (usado pela tela de Triagem para enriquecer "Em Andamento" com o responsável)
    /// Suporta filtro por equipamentoId via query string.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<Triagem>>> GetAll([FromQuery] int? equipamentoId = null)
    {
        var query = db.Triagens.AsQueryable();

        if (equipamentoId.HasValue)
        {
            query = query.Where(t => t.EquipamentoId == equipamentoId.Value);
        }

        var result = await query
            .OrderByDescending(t => t.DataTriagem)
            .ToListAsync();

        return result;
    }

    [HttpGet("finalizados")]
    public async Task<ActionResult<List<EquipamentoDto>>> GetFinalizados()
    {
        var idsTriados = await db.Triagens
            .Select(t => t.EquipamentoId)
            .Distinct()
            .ToListAsync();

        if (idsTriados.Count == 0)
            return new List<EquipamentoDto>();

        var equipamentos = await db.Equipamentos
            .Where(e => idsTriados.Contains(e.Id))
            .Select(e => new EquipamentoDto(e.Id, e.Codigo, e.Modelo, e.Especificacoes, e.Status, e.Lote, e.Tipo))
            .ToListAsync();

        return equipamentos;
    }

    [HttpPost("iniciar")]
    public async Task<IActionResult> IniciarAndamento(IniciarAndamentoDto dto)
    {
        // Registra o início da triagem (reivindicação do equipamento)
        var triagem = new Triagem(
            0,
            dto.EquipamentoId,
            "[]", // checklist vazio no início
            "",   // laudo vazio
            "EmAnalise",
            DateTime.UtcNow,
            dto.TecnicoResponsavel
        );

        db.Triagens.Add(triagem);

        // Atualiza o status do equipamento
        await db.Database.ExecuteSqlRawAsync(
            "UPDATE \"Equipamentos\" SET \"Status\" = {0} WHERE \"Id\" = {1}",
            "EmAnalise", dto.EquipamentoId);

        await db.SaveChangesAsync();
        return Ok(triagem);
    }

    // ==================== ENDPOINTS PARA TELA DE DESCARTE ====================

    [HttpGet("descarte/kpis")]
    public async Task<ActionResult<object>> GetDescarteKpis()
    {
        try
        {
            var totalDescartado = await db.Equipamentos.CountAsync(e => e.Status == "Descartado");
            var aguardando = await db.Triagens.CountAsync(t => t.Destino == "Descarte" && !db.Equipamentos.Any(e => e.Id == t.EquipamentoId && e.Status == "Descartado"));
            var esteMes = await db.Equipamentos.CountAsync(e => e.Status == "Descartado" && e.DataEntrada.Month == DateTime.UtcNow.Month);
            var lotes = await db.Equipamentos.Where(e => e.Status == "Descartado").Select(e => e.Lote).Distinct().CountAsync();

            return new { totalDescartado, aguardando = Math.Max(0, aguardando), esteMes, lotes };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Descarte KPIs Error] {ex}");
            return new { totalDescartado = 0, aguardando = 0, esteMes = 0, lotes = 0 };
        }
    }

    [HttpGet("descarte/volume")]
    public async Task<ActionResult<List<object>>> GetDescarteVolume([FromQuery] int ano = 2025)
    {
        try
        {
            var equipamentos = await db.Equipamentos
                .Where(e => e.Status == "Descartado" && e.DataEntrada.Year == ano)
                .ToListAsync();

            var grouped = equipamentos
                .GroupBy(e => e.DataEntrada.Month)
                .Select(g => new { mes = g.Key, qtd = g.Count() })
                .OrderBy(x => x.mes)
                .ToList();

            return grouped.Cast<object>().ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Descarte Volume Error] {ex}");
            return new List<object>();
        }
    }

    [HttpGet("descarte/status")]
    public async Task<ActionResult<List<object>>> GetDescarteStatus()
    {
        try
        {
            var descartados = await db.Equipamentos.CountAsync(e => e.Status == "Descartado");
            var total = descartados + await db.Triagens.CountAsync(t => t.Destino == "Descarte");
            if (total == 0) total = 374;

            var aguardando = Math.Max(0, total - descartados);
            var pctDesc = total > 0 ? Math.Round((double)descartados / total * 100) : 95;

            return new List<object> {
                new { label = $"Descartado ({pctDesc}%)", percent = (int)pctDesc, color = "#15803d" },
                new { label = $"Aguardando ({100 - pctDesc}%)", percent = 100 - (int)pctDesc, color = "#facc15" }
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Descarte Status Error] {ex}");
            return new List<object> { new { label = "Descartado (100%)", percent = 100, color = "#15803d" } };
        }
    }

    [HttpGet("descarte/itens")]
    public async Task<ActionResult<List<object>>> GetDescarteItens()
    {
        try
        {
            // Itens que vieram da Triagem (Destino=Descarte) ou já finalizados como Descartado
            var itens = await db.Equipamentos
                .Where(e => e.Status == "Descartado" || e.Status == "AguardandoDescarte")
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
                .OrderByDescending(x => x.data)
                .Take(100)
                .ToListAsync();

            return itens.Cast<object>().ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Descarte Itens Error] {ex}");
            return new List<object>();
        }
    }
}
