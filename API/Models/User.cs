namespace API.Models;

public class User
{
    public int Id { get; set; }
    public string Nome { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string SenhaHash { get; set; } = default!;
    public string Role { get; set; } = default!;
    public int? InstituicaoId { get; set; }

    public string? FotoUrl { get; set; }
}
