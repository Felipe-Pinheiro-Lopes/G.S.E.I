using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InstituicoesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Instituicao>>> GetAll()
    {
        return await db.Instituicoes
            .OrderByDescending(i => i.DataCadastro)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Instituicao>> GetById(int id)
    {
        var inst = await db.Instituicoes.FindAsync(id);
        return inst == null ? NotFound() : inst;
    }

    [HttpPost]
    public async Task<ActionResult<API.Models.Instituicao>> Create([FromBody] API.DTOs.InstituicaoCreateDto dto)
    {
        try
        {
            var nova = new API.Models.Instituicao(
                Id: 0,
                Nome: dto.Nome,
                Cnpj: dto.Cnpj,
                Responsavel: dto.Responsavel,
                Telefone: dto.Telefone,
                Email: dto.Email,
                DataCadastro: DateTime.UtcNow
            );

            db.Instituicoes.Add(nova);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = nova.Id }, nova);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Instituicoes ERROR - Create] {ex.GetType().Name}: {ex.Message}");
            if (ex.InnerException != null) Console.WriteLine(ex.InnerException.Message);
            return StatusCode(500, "Erro ao cadastrar instituição.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Instituicao inst)
    {
        if (id != inst.Id) return BadRequest();
        db.Entry(inst).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

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
