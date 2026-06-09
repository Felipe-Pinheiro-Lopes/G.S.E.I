using API.Data;
using API.DTOs;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers;

/// <summary>
/// Controller responsável pela autenticação e registro de usuários.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, TokenService tokenService) : ControllerBase
{
    /// <summary>
    /// Autentica um usuário e retorna um token JWT válido.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !VerifyPassword(request.Senha, user.SenhaHash))
            return Unauthorized(new { message = "Email ou senha inválidos" });

        var token = tokenService.GenerateToken(user);

        return new LoginResponse(token, user.Nome, user.Role, user.InstituicaoId, user.FotoUrl, user.Id);
    }

    /// <summary>
    /// Cadastra um novo usuário no sistema com hash de senha seguro.
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Email já cadastrado.");

        var senhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha);

        var novoUsuario = new User
        {
            Nome = request.Nome,
            Email = request.Email,
            SenhaHash = senhaHash,
            Role = request.Role,
            InstituicaoId = request.InstituicaoId
        };

        db.Users.Add(novoUsuario);
        await db.SaveChangesAsync();

        return Ok(new { Message = "Usuário cadastrado com sucesso", Id = novoUsuario.Id });
    }

    private static bool VerifyPassword(string senha, string hash)
    {
        if (hash.StartsWith("$2a$") || hash.StartsWith("$2b$") || hash.StartsWith("$2y$"))
        {
            return BCrypt.Net.BCrypt.Verify(senha, hash);
        }

        // Fallback para hashes legados SHA-256
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(senha));
        return Convert.ToBase64String(bytes) == hash;
    }
}

// DTO for registration
public record RegisterRequest(string Nome, string Email, string Senha, string Role, int? InstituicaoId = null);

