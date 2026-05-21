namespace API.Models;

public record User(
    int Id,
    string Nome,
    string Email,
    string SenhaHash,
    string Role, // Internal, Instituicao
    int? InstituicaoId = null
)
{
    /// <summary>
    /// URL ou caminho da foto de perfil do usuário.
    /// Preparado para implementação futura de troca de avatar/foto.
    /// </summary>
    public string? FotoUrl { get; init; }
}
