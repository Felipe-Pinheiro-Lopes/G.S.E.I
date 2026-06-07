namespace API.Models;

public class Movimentacao
{
    public int Id { get; set; }
    public int EquipamentoId { get; set; }
    public string TipoMovimentacao { get; set; } = default!;
    // "Entrada", "Triagem_Inicio", "Triagem_Finalizada",
    // "EnviadoParaDoacao", "DoacaoAprovada",
    // "EnviadoParaDescarte", "Descartado", "StatusAlterado"
    public DateTime DataHora { get; set; }
    public string? StatusAnterior { get; set; }
    public string? StatusNovo { get; set; }
    public string? Descricao { get; set; }
    public string? Responsavel { get; set; } // nome do usuário ou técnico

    public Movimentacao() { }

    public Movimentacao(int id, int equipamentoId, string tipoMovimentacao,
        DateTime dataHora, string? statusAnterior = null,
        string? statusNovo = null, string? descricao = null,
        string? responsavel = null)
    {
        Id = id;
        EquipamentoId = equipamentoId;
        TipoMovimentacao = tipoMovimentacao;
        DataHora = dataHora;
        StatusAnterior = statusAnterior;
        StatusNovo = statusNovo;
        Descricao = descricao;
        Responsavel = responsavel;
    }
}
