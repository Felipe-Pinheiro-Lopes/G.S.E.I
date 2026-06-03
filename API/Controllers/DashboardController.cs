using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.DTOs;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(AppDbContext context) : ControllerBase
{
    /// <summary>
    /// Retorna os principais indicadores (KPIs) do dashboard
    /// </summary>
    [HttpGet("kpis")]
    public async Task<ActionResult<DashboardKpisDto>> GetKpis()
    {
        try
        {
            var total = await context.Equipamentos.CountAsync();

        var emTriagem = await context.Equipamentos
            .CountAsync(e => e.Status == "EmTriagem" || e.Status == "Em Triagem" || e.Status == "EmAnalise");

        var doacoes = await context.Equipamentos
            .CountAsync(e => e.Status == "DoacaoAprovada" || e.Status == "Doação Aprovada");

        var descartes = await context.Equipamentos
            .CountAsync(e => e.Status == "Descartado");

        var filaTriagem = await context.Equipamentos
            .CountAsync(e => e.Status == "EmTriagem" || e.Status == "Em Triagem" || e.Status == "EmAnalise");

        var pecasFaltantes = 0;

        var now = DateTime.UtcNow;
        var today = new DateTime(now.Year, now.Month, now.Day, 0, 0, 0, DateTimeKind.Utc);
        var tomorrow = today.AddDays(1);
        var triagensHoje = await context.Triagens
            .CountAsync(t => t.DataTriagem >= today && t.DataTriagem < tomorrow);
        var processadosTurno = $"{triagensHoje}/25";

        var aguardandoSanitizacao = await context.Equipamentos
            .CountAsync(e => e.Status == "AguardandoFormatacao" || e.Status == "Aguardando Sanitização");

        return new DashboardKpisDto(
            total,
            emTriagem,
            doacoes,
            descartes,
            filaTriagem,
            pecasFaltantes,
            processadosTurno,
            aguardandoSanitizacao
        );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DASHBOARD ERROR - KPIs] {ex.GetType().Name}: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            throw; // re-lança para manter o 500 (útil para debug)
        }
    }

    /// <summary>
    /// Retorna os defeitos mais comuns (Pareto) calculado a partir dos Laudos Técnicos reais das triagens.
    /// Faz contagem simples por palavras-chave nos laudos cadastrados.
    /// </summary>
    [HttpGet("pareto-defeitos")]
    public async Task<ActionResult<List<ParetoDefeitoDto>>> GetParetoDefeitos()
    {
        var triagens = await context.Triagens
            .Where(t => !string.IsNullOrWhiteSpace(t.LaudoTecnico))
            .Select(t => t.LaudoTecnico.ToLower())
            .ToListAsync();

        var contadores = new Dictionary<string, int>
        {
            ["Bateria Viciada"] = 0,
            ["Tela Quebrada"] = 0,
            ["Placa-mãe em curto"] = 0,
            ["Problemas Software"] = 0,
            ["Defeito Irreparável"] = 0,
            ["Obsoleto"] = 0
        };

        foreach (var laudo in triagens)
        {
            if (laudo.Contains("bateria") || laudo.Contains("viciada")) contadores["Bateria Viciada"]++;
            if (laudo.Contains("tela") || laudo.Contains("quebrada") || laudo.Contains("display")) contadores["Tela Quebrada"]++;
            if (laudo.Contains("placa") || laudo.Contains("curto") || laudo.Contains("mãe")) contadores["Placa-mãe em curto"]++;
            if (laudo.Contains("software") || laudo.Contains("sistema") || laudo.Contains("boot") || laudo.Contains("so")) contadores["Problemas Software"]++;
            if (laudo.Contains("irreparável") || laudo.Contains("irreparavel") || laudo.Contains("danificado")) contadores["Defeito Irreparável"]++;
            if (laudo.Contains("obsoleto") || laudo.Contains("antigo")) contadores["Obsoleto"]++;
        }

        // Se não houver dados reais suficientes, usar os valores do seed como base + contagem
        var result = contadores
            .Where(kv => kv.Value > 0)
            .OrderByDescending(kv => kv.Value)
            .Take(4)
            .Select(kv => new ParetoDefeitoDto(kv.Key, kv.Value))
            .ToList();

        return result;
    }


    /// <summary>
    /// Retorna as últimas atualizações do sistema (doações, triagens, descartes)
    /// </summary>
    [HttpGet("ultimas-atualizacoes")]
    public async Task<ActionResult<List<UltimaAtualizacaoDto>>> GetUltimasAtualizacoes()
    {
        var atualizacoes = new List<UltimaAtualizacaoDto>();

        // Últimas doações aprovadas
        // Usamos Select para evitar erro caso as colunas AprovadoPor/LaudoDescarte ainda não existam no banco remoto
        var ultimasDoacoes = await context.Equipamentos
            .Where(e => e.Status == "DoacaoAprovada" || e.Status == "Doação Aprovada")
            .OrderByDescending(e => e.DataEntrada)
            .Take(2)
            .Select(e => e.Modelo)
            .ToListAsync();

        foreach (var modelo in ultimasDoacoes)
        {
            atualizacoes.Add(new UltimaAtualizacaoDto(
                $"{modelo} doado",
                "Instituição receptora",
                "Recentemente",
                "volunteer_activism"
            ));
        }

        // Últimas triagens realizadas
        var ultimasTriagens = await context.Triagens
            .OrderByDescending(t => t.DataTriagem)
            .Take(3)
            .ToListAsync();

        foreach (var triagem in ultimasTriagens)
        {
            var codigoEquipamento = await context.Equipamentos
                .Where(e => e.Id == triagem.EquipamentoId)
                .Select(e => e.Codigo)
                .FirstOrDefaultAsync();

            atualizacoes.Add(new UltimaAtualizacaoDto(
                $"Triagem: {codigoEquipamento ?? "EQ-XXXX"}",
                triagem.Destino,
                triagem.DataTriagem.ToString("dd MMM"),
                "fact_check"
            ));
        }

        // Se não tiver dados reais, retorna alguns exemplos
        return atualizacoes.Take(4).ToList();
    }

    /// <summary>
    /// Retorna a distribuição de tipos de equipamentos (para o gráfico de rosca)
    /// </summary>
    [HttpGet("frequencia-tipos")]
    public async Task<ActionResult<List<FrequenciaTipoDto>>> GetFrequenciaTipos()
    {
        var grupos = await context.Equipamentos
            .GroupBy(e => e.Tipo ?? "Desconhecido")
            .Select(g => new
            {
                Tipo = g.Key,
                Quantidade = g.Count()
            })
            .OrderByDescending(x => x.Quantidade)
            .ToListAsync();

        var total = grupos.Sum(x => x.Quantidade);
        if (total == 0) total = 1;

        var result = grupos.Select(g => new FrequenciaTipoDto(
            g.Tipo,
            g.Quantidade,
            Math.Round(g.Quantidade * 100.0 / total, 1)
        )).ToList();

        return result;
    }

    [HttpGet("movimentacoes")]
    public async Task<ActionResult<MovimentacaoPaginadaDto>> GetMovimentacoes([FromQuery] MovimentacaoFiltroDto filtro)
    {
        try
        {
            var query = context.Movimentacoes.AsQueryable();

            if (filtro.EquipamentoId.HasValue)
                query = query.Where(m => m.EquipamentoId == filtro.EquipamentoId.Value);

            if (!string.IsNullOrWhiteSpace(filtro.TipoMovimentacao))
                query = query.Where(m => m.TipoMovimentacao == filtro.TipoMovimentacao);

            if (filtro.DataInicio.HasValue)
            {
                var inicio = DateTime.SpecifyKind(filtro.DataInicio.Value, DateTimeKind.Utc);
                query = query.Where(m => m.DataHora >= inicio);
            }

            if (filtro.DataFim.HasValue)
            {
                var fim = DateTime.SpecifyKind(filtro.DataFim.Value.Date.AddDays(1), DateTimeKind.Utc);
                query = query.Where(m => m.DataHora < fim);
            }

            var total = await query.CountAsync();
            var pagina = filtro.Pagina > 0 ? filtro.Pagina : 1;
            var porPagina = filtro.PorPagina > 0 ? filtro.PorPagina : 20;

            var itens = await query
                .OrderByDescending(m => m.DataHora)
                .Skip((pagina - 1) * porPagina)
                .Take(porPagina)
                .Join(context.Equipamentos,
                    m => m.EquipamentoId,
                    e => e.Id,
                    (m, e) => new MovimentacaoDto(
                        m.Id,
                        m.EquipamentoId,
                        e.Codigo,
                        m.TipoMovimentacao,
                        m.StatusAnterior,
                        m.StatusNovo,
                        m.Descricao,
                        m.Responsavel,
                        m.DataHora
                    ))
                .ToListAsync();

            return new MovimentacaoPaginadaDto(itens, total, pagina, porPagina, (int)Math.Ceiling(total / (double)porPagina));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DASHBOARD ERROR - Movimentacoes] {ex}");
            return new MovimentacaoPaginadaDto(new List<MovimentacaoDto>(), 0, 1, 20, 0);
        }
    }

    [HttpGet("movimentacoes/exportar")]
    public async Task<IActionResult> ExportarMovimentacoes([FromQuery] MovimentacaoFiltroDto filtro)
    {
        try
        {
            var query = context.Movimentacoes.AsQueryable();

            if (filtro.EquipamentoId.HasValue)
                query = query.Where(m => m.EquipamentoId == filtro.EquipamentoId.Value);

            if (!string.IsNullOrWhiteSpace(filtro.TipoMovimentacao))
                query = query.Where(m => m.TipoMovimentacao == filtro.TipoMovimentacao);

            if (filtro.DataInicio.HasValue)
            {
                var inicio = DateTime.SpecifyKind(filtro.DataInicio.Value, DateTimeKind.Utc);
                query = query.Where(m => m.DataHora >= inicio);
            }

            if (filtro.DataFim.HasValue)
            {
                var fim = DateTime.SpecifyKind(filtro.DataFim.Value.Date.AddDays(1), DateTimeKind.Utc);
                query = query.Where(m => m.DataHora < fim);
            }

            var dados = await query
                .OrderByDescending(m => m.DataHora)
                .Join(context.Equipamentos,
                    m => m.EquipamentoId,
                    e => e.Id,
                    (m, e) => new {
                        m.Id,
                        CodigoEquipamento = e.Codigo,
                        m.TipoMovimentacao,
                        m.StatusAnterior,
                        m.StatusNovo,
                        m.Descricao,
                        m.Responsavel,
                        m.DataHora
                    })
                .ToListAsync();

            var csv = new System.Text.StringBuilder();
            csv.AppendLine("Id,CodigoEquipamento,TipoMovimentacao,StatusAnterior,StatusNovo,Descricao,Responsavel,DataHora");
            foreach (var item in dados)
            {
                var linha = string.Join(",", new object?[]
                {
                    item.Id,
                    $"\"{item.CodigoEquipamento}\"",
                    $"\"{item.TipoMovimentacao}\"",
                    $"\"{item.StatusAnterior ?? ""}\"",
                    $"\"{item.StatusNovo ?? ""}\"",
                    $"\"{(item.Descricao ?? "").Replace("\"", "\"\"")}\"",
                    $"\"{item.Responsavel ?? ""}\"",
                    item.DataHora.ToString("yyyy-MM-dd HH:mm:ss")
                });
                csv.AppendLine(linha);
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
            return File(bytes, "text/csv", $"movimentacoes_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DASHBOARD ERROR - ExportarMovimentacoes] {ex}");
            return StatusCode(500, "Erro ao gerar CSV.");
        }
    }
}
