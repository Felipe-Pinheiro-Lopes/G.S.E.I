namespace API.Models;

public record Instituicao(
    int Id,
    string Nome,
    string Cnpj,
    string Responsavel,
    string Telefone,
    string Email,
    DateTime DataCadastro
);
