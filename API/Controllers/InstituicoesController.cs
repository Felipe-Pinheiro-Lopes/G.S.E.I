using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

/// <summary>
/// Controller responsável pela gestão e cadastro das instituições de caridade/destinatárias de doações.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InstituicoesController(AppDbContext db, ILogger<InstituicoesController> logger) : ControllerBase
{
    /// <summary>
    /// Retorna a lista de todas as instituições parceiras ordenadas pelo cadastro mais recente.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Instituicao>>> GetAll()
    {
        return await db.Instituicoes
            .OrderByDescending(i => i.DataCadastro)
            .ToListAsync();
    }

    /// <summary>
    /// Retorna os dados de uma instituição específica.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Instituicao>> GetById(int id)
    {
        var inst = await db.Instituicoes.FindAsync(id);
        return inst == null ? NotFound() : inst;
    }

    /// <summary>
    /// Cadastra uma nova instituição parceira no sistema.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Instituicao>> Create([FromBody] InstituicaoCreateDto dto)
    {
        try
        {
            var nova = new Instituicao
            {
                Nome = dto.Nome,
                Cnpj = dto.Cnpj,
                Responsavel = dto.Responsavel,
                Telefone = dto.Telefone,
                Email = dto.Email,
                DataCadastro = DateTime.UtcNow
            };

            db.Instituicoes.Add(nova);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = nova.Id }, nova);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[Instituicoes ERROR - Create] {Message}", ex.Message);
            if (ex.InnerException != null) logger.LogError(ex.InnerException, "[Instituicoes Inner Error] {Message}", ex.InnerException.Message);
            return StatusCode(500, "Erro ao cadastrar instituição.");
        }
    }

    /// <summary>
    /// Atualiza dados da instituição preservando o DataCadastro original.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] InstituicaoUpdateDto dto)
    {
        var existing = await db.Instituicoes.FindAsync(id);
        if (existing == null) return NotFound();

        // Update only the editable fields — DataCadastro and Id are preserved
        existing.Nome = dto.Nome ?? existing.Nome;
        existing.Cnpj = dto.Cnpj ?? existing.Cnpj;
        existing.Responsavel = dto.Responsavel ?? existing.Responsavel;
        existing.Telefone = dto.Telefone ?? existing.Telefone;
        existing.Email = dto.Email ?? existing.Email;

        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Remove uma instituição do sistema.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var inst = await db.Instituicoes.FindAsync(id);
        if (inst == null) return NotFound();
        db.Instituicoes.Remove(inst);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
