namespace API.DTOs;

public record UserUpdateDto(
    string Nome,
    string? FotoUrl = null,
    string? NovaSenha = null
);
