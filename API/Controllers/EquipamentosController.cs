using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipamentosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<EquipamentoDto>>> GetAll([FromQuery] string? status = null)
    {
        var query = db.Equipamentos.AsQueryable();
        if (!string.IsNullOrEmpty(status))
            query = query.Where(e => e.Status == status);

        var equipamentos = await query
            .Select(e => new EquipamentoDto(
                e.Id, e.Codigo, e.Modelo, e.Especificacoes, e.Status, e.Lote, e.Tipo,
                e.InstituicaoId, e.AprovadoPor, e.LaudoDescarte))
            .ToListAsync();

        return equipamentos;
    }

    [HttpPost]
    public async Task<ActionResult<Equipamento>> Create(Equipamento equipamento)
    {
        db.Equipamentos.Add(equipamento);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = equipamento.Id }, equipamento);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string novoStatus)
    {
        var eq = await db.Equipamentos.FindAsync(id);
        if (eq == null) return NotFound();

        await db.Database.ExecuteSqlRawAsync("UPDATE \"Equipamentos\" SET \"Status\" = {0} WHERE \"Id\" = {1}", novoStatus, id);
        return NoContent();
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
    public async Task<IActionResult> Update(int id, Equipamento updatedEquipamento)
    {
        var existing = await db.Equipamentos.FindAsync(id);
        if (existing == null)
            return NotFound();

        // Como é um record, fazemos update via SQL bruto para simplicidade
        await db.Database.ExecuteSqlRawAsync(@"
            UPDATE ""Equipamentos"" 
            SET ""Codigo"" = {0}, ""Modelo"" = {1}, ""Especificacoes"" = {2}, 
                ""Lote"" = {3}, ""Status"" = {4}, ""Tipo"" = {5}
            WHERE ""Id"" = {6}",
            updatedEquipamento.Codigo,
            updatedEquipamento.Modelo,
            updatedEquipamento.Especificacoes,
            updatedEquipamento.Lote,
            updatedEquipamento.Status,
            updatedEquipamento.Tipo,
            id);

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

        await db.Database.ExecuteSqlRawAsync(@"
            UPDATE ""Equipamentos"" 
            SET ""Status"" = {0}, 
                ""InstituicaoId"" = {1}, 
                ""AprovadoPor"" = {2}
            WHERE ""Id"" = {3}",
            "DoacaoAprovada",
            dto.InstituicaoId,
            dto.AprovadoPor,
            id);

        return NoContent();
    }

    /// <summary>
    /// Registra o descarte de um equipamento (laudo + responsável).
    /// Usado pela tela de Descarte.
    /// </summary>
    [HttpPost("{id}/registrar-descarte")]
    public async Task<IActionResult> RegistrarDescarte(int id, [FromBody] RegistrarDescarteDto dto)
    {
        var eq = await db.Equipamentos.FindAsync(id);
        if (eq == null) return NotFound();

        await db.Database.ExecuteSqlRawAsync(@"
            UPDATE ""Equipamentos"" 
            SET ""Status"" = {0}, 
                ""LaudoDescarte"" = {1}, 
                ""AprovadoPor"" = {2}   -- reutilizamos o campo como 'Responsável pelo Descarte'
            WHERE ""Id"" = {3}",
            dto.NovoStatus ?? "Descartado",
            dto.LaudoDescarte,
            dto.Responsavel,
            id);

        return NoContent();
    }
}
