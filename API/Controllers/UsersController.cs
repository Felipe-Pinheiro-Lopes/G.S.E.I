using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

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
        return new { user.Id, user.Nome, user.Email, user.Role, user.InstituicaoId,
                     user.FotoUrl };
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();

        if (!string.IsNullOrWhiteSpace(dto.Nome))
        {
            user.Nome = dto.Nome;
            db.Entry(user).Property(u => u.Nome).IsModified = true;
        }

        if (!string.IsNullOrWhiteSpace(dto.FotoUrl))
        {
            user.FotoUrl = dto.FotoUrl;
            db.Entry(user).Property(u => u.FotoUrl).IsModified = true;
        }

        if (!string.IsNullOrWhiteSpace(dto.NovaSenha))
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(dto.NovaSenha));
            user.SenhaHash = Convert.ToBase64String(bytes);
            db.Entry(user).Property(u => u.SenhaHash).IsModified = true;
        }

        await db.SaveChangesAsync();

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
