namespace API.Models;

public record Movimentacao(
    int Id,
    int EquipamentoId,
    string TipoMovimentacao,   // "Entrada", "Triagem_Inicio", "Triagem_Finalizada",
                               // "EnviadoParaDoacao", "DoacaoAprovada",
                               // "EnviadoParaDescarte", "Descartado", "StatusAlterado"
    DateTime DataHora,
    string? StatusAnterior = null,
    string? StatusNovo = null,
    string? Descricao = null,
    string? Responsavel = null  // nome do usuário ou técnico
);
