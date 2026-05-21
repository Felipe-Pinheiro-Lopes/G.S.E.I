namespace API.DTOs;

public record RealizarTriagemDto(
    int EquipamentoId,
    List<string> Checklist,
    string LaudoTecnico,
    string Destino
);

public record IniciarAndamentoDto(
    int EquipamentoId,
    string TecnicoResponsavel
);
