namespace API.DTOs;

// UserUpdateDto.cs
public class UserUpdateDto {
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Senha { get; set; } // Adicionei para o Register não quebrar
    public string Role { get; set; } = "User"; // Adicionei para salvar o cargo
    public string? Telefone { get; set; }
    public DateTime Data_Nasc { get; set; }
}