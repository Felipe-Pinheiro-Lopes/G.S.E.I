namespace API.Models;

public class Instituicao
{
    public int Id { get; set; }
    public string Nome { get; set; } = default!;
    public string Cnpj { get; set; } = default!;
    public string Responsavel { get; set; } = default!;
    public string Telefone { get; set; } = default!;
    public string Email { get; set; } = default!;
    public DateTime DataCadastro { get; set; }

    public Instituicao() { }

    public Instituicao(int id, string nome, string cnpj, string responsavel,
        string telefone, string email, DateTime dataCadastro)
    {
        Id = id;
        Nome = nome;
        Cnpj = cnpj;
        Responsavel = responsavel;
        Telefone = telefone;
        Email = email;
        DataCadastro = dataCadastro;
    }
}
