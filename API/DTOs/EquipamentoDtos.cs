namespace API.DTOs;

public record EquipamentoDto(
    int Id,
    string Codigo,
    string Modelo,
    string Especificacoes,
    string Status,
    string Lote,
    string? Tipo = null,
    int? InstituicaoId = null,
    string? AprovadoPor = null,
    string? LaudoDescarte = null
);
