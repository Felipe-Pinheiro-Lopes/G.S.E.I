namespace API.Models;

public record Equipamento(
    int Id,
    string Codigo,
    string Modelo,
    string Especificacoes,
    string Lote,
    string Status,
    DateTime DataEntrada,
    int? InstituicaoId = null,
    string? Tipo = null,
    string? AprovadoPor = null,
    string? LaudoDescarte = null
)
{
    public static Equipamento Create(
        string codigo, string modelo, string? especificacoes,
        string lote, string status, DateTime dataEntrada,
        int? instituicaoId = null, string? tipo = null,
        string? aprovadoPor = null, string? laudoDescarte = null)
    {
        return new Equipamento(
            Id: 0, Codigo: codigo, Modelo: modelo,
            Especificacoes: especificacoes ?? "", Lote: lote,
            Status: status, DataEntrada: dataEntrada,
            InstituicaoId: instituicaoId, Tipo: tipo,
            AprovadoPor: aprovadoPor, LaudoDescarte: laudoDescarte);
    }
}
