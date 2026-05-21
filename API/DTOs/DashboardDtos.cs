namespace API.DTOs;

public record DashboardKpisDto(
    int TotalInventario,
    int EmTriagem,
    int DoacoesAprovadas,
    int DescartesRealizados,
    int FilaTriagem,
    int PecasFaltantes,
    string ProcessadosTurno,
    int AguardandoSanitizacao
);

public record ParetoDefeitoDto(
    string Defeito,
    int Quantidade
);

public record UltimaAtualizacaoDto(
    string Titulo,
    string Subtitulo,
    string Tempo,
    string Icone
);

public record FrequenciaTipoDto(
    string Tipo,
    int Quantidade,
    double Porcentagem
);

public record AtividadeHistoricoDto(
    string Descricao,
    string Data,
    string Responsavel
);

public record EquipamentoDestaqueDto(
    string Codigo,
    string Modelo,
    string Status,
    string? UltimaAtividade,
    List<AtividadeHistoricoDto> Historico
);

