using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<object>>> GetAll()
    {
        return await db.Users
            .Select(u => new { u.Id, u.Nome, u.Email, u.Role, u.InstituicaoId })
            .ToListAsync<object>();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetById(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();
        return new { user.Id, user.Nome, user.Email, user.Role, user.InstituicaoId };
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();

        string sql = @"UPDATE ""Users"" SET ""Nome"" = {0}, ""FotoUrl"" = {1}";

        var parameters = new List<object> { dto.Nome, dto.FotoUrl };

        // Se veio nova senha, atualiza também (idealmente faria hash aqui)
        if (!string.IsNullOrWhiteSpace(dto.NovaSenha))
        {
            // TODO: Melhorar com hash real (igual ao AuthController)
            sql += @", ""SenhaHash"" = {2}";
            parameters.Add(dto.NovaSenha); // por enquanto texto simples para demo
        }

        sql += @" WHERE ""Id"" = {3}";
        parameters.Add(id);

        await db.Database.ExecuteSqlRawAsync(sql, parameters.ToArray());

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
