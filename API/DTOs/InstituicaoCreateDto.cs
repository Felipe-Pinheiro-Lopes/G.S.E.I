using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class InstituicaoCreateDto
{
    [Required, MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$",
        ErrorMessage = "CNPJ inválido. Formato esperado: 00.000.000/0000-00")]
    public string Cnpj { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Responsavel { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$",
        ErrorMessage = "Telefone inválido. Formato: (11) 99999-9999")]
    public string Telefone { get; set; } = string.Empty;

    [Required, EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;
}
