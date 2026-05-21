namespace API.Models;

public record Equipamento(
    int Id,
    string Codigo, // e.g. EQ-1024
    string Modelo,
    string Especificacoes,
    string Lote,
    string Status, // EmEstoque, EmTriagem, AguardandoDoacao, DoacaoAprovada, Descartado, etc.
    DateTime DataEntrada,
    int? InstituicaoId = null,
    string? Tipo = null, // Notebook, Computador, Monitor, Periférico, Peças
    string? AprovadoPor = null,           // Técnico que aprovou a doação
    string? LaudoDescarte = null          // Laudo simples para descarte (reutilizado)
);
