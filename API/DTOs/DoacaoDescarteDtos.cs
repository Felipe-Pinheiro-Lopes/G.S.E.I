namespace API.DTOs;

public record AprovarDoacaoDto(int InstituicaoId, string AprovadoPor);

public record RegistrarDescarteDto(string? LaudoDescarte, string Responsavel, string? NovoStatus = "Descartado");
