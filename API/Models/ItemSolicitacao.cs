namespace API.Models;

public record ItemSolicitacao(
    int Id,
    int SolicitacaoId,
    int EquipamentoId,
    int QuantidadeSolicitada
);
