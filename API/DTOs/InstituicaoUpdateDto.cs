namespace API.DTOs;

public record InstituicaoUpdateDto(
    string? Nome = null,
    string? Cnpj = null,
    string? Responsavel = null,
    string? Telefone = null,
    string? Email = null
);
