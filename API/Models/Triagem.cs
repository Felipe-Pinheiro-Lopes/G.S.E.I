namespace API.Models;

public record Triagem(
    int Id,
    int EquipamentoId,
    string ChecklistJson, // serialized checklist
    string LaudoTecnico,
    string Destino, // Reuso, Doacao, Descarte
    DateTime DataTriagem,
    string TecnicoResponsavel
);
