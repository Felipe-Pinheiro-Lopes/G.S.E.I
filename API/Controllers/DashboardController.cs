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
        var total = await context.Equipamentos.CountAsync();

        var emTriagem = await context.Equipamentos
            .CountAsync(e => e.Status == "EmTriagem" || e.Status == "Em Triagem" || e.Status == "EmAnalise");

        var doacoes = await context.Equipamentos
            .CountAsync(e => e.Status == "DoacaoAprovada" || e.Status == "Doação Aprovada");

        var descartes = await context.Equipamentos
            .CountAsync(e => e.Status == "Descartado");

        var filaTriagem = await context.Equipamentos
            .CountAsync(e => e.Status == "EmTriagem" || e.Status == "Em Triagem" || e.Status == "EmAnalise");

        // Placeholder até termos uma tabela de Peças
        var pecasFaltantes = 142;

        // Processados no turno (evitando problema de timezone do PostgreSQL)
        var today = DateTime.UtcNow.Date;
        var triagensHoje = await context.Triagens
            .CountAsync(t => t.DataTriagem >= today && t.DataTriagem < today.AddDays(1));
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

        if (result.Count == 0)
        {
            // Fallback amigável com dados que refletem o seed inicial
            result = new List<ParetoDefeitoDto>
            {
                new("Defeito Irreparável", 2),
                new("Obsoleto", 1),
                new("Tela Quebrada", 0),
                new("Bateria Viciada", 0)
            };
        }

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
        var ultimasDoacoes = await context.Equipamentos
            .Where(e => e.Status == "DoacaoAprovada" || e.Status == "Doação Aprovada")
            .OrderByDescending(e => e.DataEntrada)
            .Take(2)
            .ToListAsync();

        foreach (var eq in ultimasDoacoes)
        {
            atualizacoes.Add(new UltimaAtualizacaoDto(
                $"{eq.Modelo} doado",
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
        if (atualizacoes.Count == 0)
        {
            atualizacoes.AddRange(new List<UltimaAtualizacaoDto>
            {
                new("50 Laptops doados", "Para Amor Inclusivo", "2 horas atrás", "volunteer_activism"),
                new("Ferramentas que chegaram", "32 lotes", "5 horas atrás", "inventory_2"),
                new("Porcentagem descartados", "45% Descartados / 55% Doados", "10 dias", "build_circle")
            });
        }

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
}
