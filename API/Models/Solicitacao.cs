namespace API.Models;

public class Solicitacao
{
    public int Id { get; set; }
    public int InstituicaoId { get; set; }
    public string ResponsavelRetirada { get; set; } = default!;
    public string TelefoneContato { get; set; } = default!;
    public string Finalidade { get; set; } = default!;
    public string Status { get; set; } = "Pendente"; // Pendente, Aprovada, Negada, AguardandoInfo
    public DateTime DataSolicitacao { get; set; }
    public string? Protocolo { get; set; }
    public string Prioridade { get; set; } = "Média"; // Alta, Média, Baixa

    public Solicitacao() { }

    public Solicitacao(int id, int instituicaoId, string responsavelRetirada,
        string telefoneContato, string finalidade, string status,
        DateTime dataSolicitacao, string? protocolo = null,
        string prioridade = "Média")
    {
        Id = id;
        InstituicaoId = instituicaoId;
        ResponsavelRetirada = responsavelRetirada;
        TelefoneContato = telefoneContato;
        Finalidade = finalidade;
        Status = status;
        DataSolicitacao = dataSolicitacao;
        Protocolo = protocolo;
        Prioridade = prioridade;
    }
}
