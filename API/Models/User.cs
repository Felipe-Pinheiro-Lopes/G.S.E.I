namespace API.Models;

public class User
{
    public int Id { get; set; }
    public string Nome { get; set; } = null!;
    public string Senha { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTime Data_Nasc { get; set; }
    public string? Telefone { get; set; } = null;
    public string Role { get; set; } = "User";
}