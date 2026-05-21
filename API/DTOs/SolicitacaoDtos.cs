namespace API.DTOs;

public record CriarSolicitacaoDto(
    int InstituicaoId,
    string ResponsavelRetirada,
    string TelefoneContato,
    string Finalidade,
    List<int> EquipamentoIds
);

public record SolicitacaoDto(
    int Id,
    string InstituicaoNome,
    string ResponsavelRetirada,
    string Status,
    DateTime DataSolicitacao,
    string? Protocolo,
    string Prioridade = "Média",
    string? Cnpj = null,
    int ItensCount = 0,
    string? ItensResumo = null
);
