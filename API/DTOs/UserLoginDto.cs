namespace API.DTOs;
public class UserLoginDto {
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string? Telefone { get; set; } = string.Empty;
    public DateTime Data_Nasc { get; set; }
    public string Role { get; set; } = "User"; // Adicionei para salvar o cargo
}