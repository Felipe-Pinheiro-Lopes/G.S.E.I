namespace API.Models;

public record Solicitacao(
    int Id,
    int InstituicaoId,
    string ResponsavelRetirada,
    string TelefoneContato,
    string Finalidade,
    string Status, // Pendente, Aprovada, Negada, EmTriagem
    DateTime DataSolicitacao,
    string? Protocolo = null,
    string Prioridade = "Média" // Alta, Média, Baixa
);
