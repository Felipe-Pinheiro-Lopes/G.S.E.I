namespace API.Models;

public class Equipamento
{
    public int Id { get; set; }
    public string Codigo { get; set; } = default!;
    public string Modelo { get; set; } = default!;
    public string Especificacoes { get; set; } = "";
    public string Lote { get; set; } = "";
    public string Status { get; set; } = "EmEstoque";
    public DateTime DataEntrada { get; set; }
    public int? InstituicaoId { get; set; }
    public string? Tipo { get; set; }
    public string? AprovadoPor { get; set; }
    public string? LaudoDescarte { get; set; }

    // Parameterless constructor for EF Core
    public Equipamento() { }

    // Convenience constructor for seeding/creation
    public Equipamento(int id, string codigo, string modelo, string especificacoes,
        string lote, string status, DateTime dataEntrada,
        int? instituicaoId = null, string? tipo = null,
        string? aprovadoPor = null, string? laudoDescarte = null)
    {
        Id = id;
        Codigo = codigo;
        Modelo = modelo;
        Especificacoes = especificacoes;
        Lote = lote;
        Status = status;
        DataEntrada = dataEntrada;
        InstituicaoId = instituicaoId;
        Tipo = tipo;
        AprovadoPor = aprovadoPor;
        LaudoDescarte = laudoDescarte;
    }
}
