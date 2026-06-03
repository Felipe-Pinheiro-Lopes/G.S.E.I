namespace API.DTOs;

public record MovimentacaoDto(
    int Id,
    int EquipamentoId,
    string CodigoEquipamento,
    string TipoMovimentacao,
    string? StatusAnterior,
    string? StatusNovo,
    string? Descricao,
    string? Responsavel,
    DateTime DataHora
);

public record MovimentacaoFiltroDto(
    DateTime? DataInicio = null,
    DateTime? DataFim = null,
    int? EquipamentoId = null,
    string? TipoMovimentacao = null,
    int Pagina = 1,
    int PorPagina = 20
);

public record MovimentacaoPaginadaDto(
    List<MovimentacaoDto> Itens,
    int Total,
    int Pagina,
    int PorPagina,
    int TotalPaginas
);
