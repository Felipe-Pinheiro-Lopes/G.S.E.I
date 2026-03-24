using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // <--- Certifique-se que esta linha existe
using API.Data;
using API.Models;
using API.DTOs;
using API.Services;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    // O ASP.NET injeta o seu banco de dados aqui automaticamente
    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserUpdateDto dto) 
    {
        var user = new User {
            Nome = dto.Nome,
            Email = dto.Email,
            Telefone = dto.Telefone,
            Data_Nasc = dto.Data_Nasc,
            Role = dto.Role, // <-- Agora vai salvar como Admin se você enviar do Front
            Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha) 
        };

        // --- GERANDO O TOKEN AQUI ---
        var token = TokenService.GenerateToken(user);

        _context.Users.Add(user);
        _context.SaveChanges();
        return Ok(new { 
            message = "Usuário criado com sucesso!" ,
            user = user.Nome,
            token = token // Agora o Swagger vai te mostrar o token aqui!
        });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLoginRequestDto dto)
    {
        // 1. Busca o usuário pelo e-mail
        var user = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

        // 2. Se não achar ou a senha estiver errada
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, user.Senha))
        {
            return Unauthorized(new { message = "E-mail ou senha inválidos" });
        }

        // 3. Se deu tudo certo, gera o token
        var token = TokenService.GenerateToken(user);

        // 4. Retorna o token para o usuário
        return Ok(new
        {
            user = user.Nome,
            token = token
        });
    }

    [HttpGet("listar")]
    [Authorize(Roles = "Admin")]
    public IActionResult ListarUsuarios()
    {
        // Adicionei u.Role aqui. Se não retornar no JSON, o React nunca saberá o cargo
        var lista = _context.Users.Select(u => new {
            u.Id,
            u.Nome,
            u.Email,
            u.Telefone,
            u.Role // <-- CRUCIAL: Sem isso o modal de edição sempre volta para 'User'
        }).ToList();

        return Ok(lista);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    [Authorize]
    public IActionResult ObterPorId(int id)
    {
        var user = _context.Users.Select(u => new { u.Id, u.Nome, u.Email, u.Telefone })
                                .FirstOrDefault(u => u.Id == id);

        if (user == null) return NotFound(new { message = "Usuário não encontrado" });

        return Ok(user);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] // Apenas admins devem poder editar outros usuários
    public IActionResult Atualizar(int id, [FromBody] UserUpdateDto dto)
    {
        // 1. Busca o usuário no banco pelo ID
        var userNoBanco = _context.Users.Find(id);
        
        if (userNoBanco == null) 
            return NotFound(new { message = "Usuário não encontrado" });

        // 2. Atualiza os campos usando os nomes corretos (dto e userNoBanco)
        userNoBanco.Nome = dto.Nome;
        userNoBanco.Email = dto.Email;
        userNoBanco.Telefone = dto.Telefone;
        userNoBanco.Data_Nasc = dto.Data_Nasc;
        
        // 3. Atualiza a Role (Certifique-se que adicionou 'Role' no UserUpdateDto como fizemos antes)
        userNoBanco.Role = dto.Role;

        // 4. Lógica opcional para senha: Só altera se o admin digitou algo no campo
        // (Lembrando que no DTO de Update a senha pode ser opcional)
        // if (!string.IsNullOrEmpty(dto.Senha)) {
        //     userNoBanco.Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha);
        // }

        _context.SaveChanges();
        return Ok(new { message = "Usuário atualizado com sucesso!" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [Authorize]
    public IActionResult Deletar(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null) return NotFound(new { message = "Usuário não encontrado" });

        _context.Users.Remove(user);
        _context.SaveChanges();

        return Ok(new { message = "Usuário removido com sucesso!" });
    }
}