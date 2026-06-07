namespace API.DTOs;

public record UserUpdateDto(
    string? Nome = null,
    string? FotoUrl = null,
    string? NovaSenha = null,
    string? Email = null,
    string? Role = null,
    int? InstituicaoId = null
);
