namespace API.DTOs;

public record LoginRequest(string Email, string Senha);
public record LoginResponse(string Token, string Nome, string Role, int? InstituicaoId, string? FotoUrl = null, int? UserId = null);
