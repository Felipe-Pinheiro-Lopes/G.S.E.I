using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin,Internal")]
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
            user.Nome = dto.Nome;

        if (!string.IsNullOrWhiteSpace(dto.FotoUrl))
            user.FotoUrl = dto.FotoUrl;

        if (!string.IsNullOrWhiteSpace(dto.NovaSenha))
            user.SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);

        if (!string.IsNullOrWhiteSpace(dto.Email))
            user.Email = dto.Email;

        if (!string.IsNullOrWhiteSpace(dto.Role))
        {
            user.Role = dto.Role;
            user.InstituicaoId = dto.InstituicaoId;
        }

        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Internal")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
