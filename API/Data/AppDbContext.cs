using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Equipamento> Equipamentos { get; set; }
    public DbSet<Instituicao> Instituicoes { get; set; }
    public DbSet<Solicitacao> Solicitacoes { get; set; }
    public DbSet<ItemSolicitacao> ItensSolicitacao { get; set; }
        public DbSet<Triagem> Triagens { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Indexes and relationships
        modelBuilder.Entity<Equipamento>()
            .HasIndex(e => e.Codigo)
            .IsUnique();

        modelBuilder.Entity<Solicitacao>()
            .HasOne<Instituicao>()
            .WithMany()
            .HasForeignKey(s => s.InstituicaoId);

        modelBuilder.Entity<ItemSolicitacao>()
            .HasOne<Solicitacao>()
            .WithMany()
            .HasForeignKey(i => i.SolicitacaoId);

        modelBuilder.Entity<ItemSolicitacao>()
            .HasOne<Equipamento>()
            .WithMany()
            .HasForeignKey(i => i.EquipamentoId);

        modelBuilder.Entity<Triagem>()
            .HasOne<Equipamento>()
            .WithMany()
            .HasForeignKey(t => t.EquipamentoId);

        modelBuilder.Entity<Equipamento>()
            .HasOne<Instituicao>()
            .WithMany()
            .HasForeignKey(e => e.InstituicaoId)
            .IsRequired(false);

        modelBuilder.Entity<Movimentacao>()
            .HasOne<Equipamento>()
            .WithMany()
            .HasForeignKey(m => m.EquipamentoId);

        modelBuilder.Entity<Movimentacao>()
            .HasIndex(m => new { m.EquipamentoId, m.DataHora })
            .IsDescending(false, true);
    }
}
