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

public record EquipamentoCreateDto(
    string Codigo,
    string Modelo,
    string? Especificacoes = null,
    string? Lote = null,
    string? Tipo = null
);

public record EquipamentoUpdateDto(
    string? Codigo = null,
    string? Modelo = null,
    string? Especificacoes = null,
    string? Lote = null,
    string? Tipo = null
);
