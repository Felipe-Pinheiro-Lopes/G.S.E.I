namespace API.Models;

public class ItemSolicitacao
{
    public int Id { get; set; }
    public int SolicitacaoId { get; set; }
    public int EquipamentoId { get; set; }
    public int QuantidadeSolicitada { get; set; }

    public ItemSolicitacao() { }

    public ItemSolicitacao(int id, int solicitacaoId, int equipamentoId, int quantidadeSolicitada)
    {
        Id = id;
        SolicitacaoId = solicitacaoId;
        EquipamentoId = equipamentoId;
        QuantidadeSolicitada = quantidadeSolicitada;
    }
}
