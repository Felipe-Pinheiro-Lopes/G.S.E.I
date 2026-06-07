namespace API.Models;

public class Triagem
{
    public int Id { get; set; }
    public int EquipamentoId { get; set; }
    public string ChecklistJson { get; set; } = "[]"; // serialized checklist
    public string LaudoTecnico { get; set; } = "";
    public string Destino { get; set; } = ""; // Reuso, Doacao, Descarte
    public DateTime DataTriagem { get; set; }
    public string TecnicoResponsavel { get; set; } = "";

    public Triagem() { }

    public Triagem(int id, int equipamentoId, string checklistJson,
        string laudoTecnico, string destino, DateTime dataTriagem,
        string tecnicoResponsavel)
    {
        Id = id;
        EquipamentoId = equipamentoId;
        ChecklistJson = checklistJson;
        LaudoTecnico = laudoTecnico;
        Destino = destino;
        DataTriagem = dataTriagem;
        TecnicoResponsavel = tecnicoResponsavel;
    }
}
