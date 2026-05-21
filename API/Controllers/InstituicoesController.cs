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
    public async Task<ActionResult<Instituicao>> Create(Instituicao inst)
    {
        var nova = inst with { DataCadastro = DateTime.UtcNow };
        db.Instituicoes.Add(nova);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = nova.Id }, nova);
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
