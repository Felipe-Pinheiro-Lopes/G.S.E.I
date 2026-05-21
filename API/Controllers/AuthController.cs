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
public class AuthController(AppDbContext db) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !VerifyPassword(request.Senha, user.SenhaHash))
            return Unauthorized(new { message = "Email ou senha inválidos" });

        // TODO: Generate real JWT token (use TokenService later)
        var token = Guid.NewGuid().ToString();

        return new LoginResponse(token, user.Nome, user.Role, user.InstituicaoId, user.FotoUrl, user.Id);
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Email já cadastrado.");

        var senhaHash = HashPassword(request.Senha);

        var novoUsuario = new User(
            0,
            request.Nome,
            request.Email,
            senhaHash,
            request.Role,
            request.InstituicaoId
        );

        db.Users.Add(novoUsuario);
        await db.SaveChangesAsync();

        return Ok(new { Message = "Usuário cadastrado com sucesso", Id = novoUsuario.Id });
    }

    private static string HashPassword(string senha)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(senha));
        return Convert.ToBase64String(bytes);
    }

    private static bool VerifyPassword(string senha, string hash)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(senha));
        return Convert.ToBase64String(bytes) == hash;
    }
}

// DTO for registration
public record RegisterRequest(string Nome, string Email, string Senha, string Role, int? InstituicaoId = null);
