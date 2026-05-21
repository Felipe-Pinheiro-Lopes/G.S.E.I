using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialGsei : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Equipamentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Codigo = table.Column<string>(type: "text", nullable: false),
                    Modelo = table.Column<string>(type: "text", nullable: false),
                    Especificacoes = table.Column<string>(type: "text", nullable: false),
                    Lote = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    DataEntrada = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    InstituicaoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipamentos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Instituicoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Cnpj = table.Column<string>(type: "text", nullable: false),
                    Responsavel = table.Column<string>(type: "text", nullable: false),
                    Telefone = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Instituicoes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    SenhaHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    InstituicaoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Triagens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EquipamentoId = table.Column<int>(type: "integer", nullable: false),
                    ChecklistJson = table.Column<string>(type: "text", nullable: false),
                    LaudoTecnico = table.Column<string>(type: "text", nullable: false),
                    Destino = table.Column<string>(type: "text", nullable: false),
                    DataTriagem = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TecnicoResponsavel = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Triagens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Triagens_Equipamentos_EquipamentoId",
                        column: x => x.EquipamentoId,
                        principalTable: "Equipamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Solicitacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InstituicaoId = table.Column<int>(type: "integer", nullable: false),
                    ResponsavelRetirada = table.Column<string>(type: "text", nullable: false),
                    TelefoneContato = table.Column<string>(type: "text", nullable: false),
                    Finalidade = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    DataSolicitacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Protocolo = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Solicitacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Solicitacoes_Instituicoes_InstituicaoId",
                        column: x => x.InstituicaoId,
                        principalTable: "Instituicoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItensSolicitacao",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SolicitacaoId = table.Column<int>(type: "integer", nullable: false),
                    EquipamentoId = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeSolicitada = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItensSolicitacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItensSolicitacao_Equipamentos_EquipamentoId",
                        column: x => x.EquipamentoId,
                        principalTable: "Equipamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItensSolicitacao_Solicitacoes_SolicitacaoId",
                        column: x => x.SolicitacaoId,
                        principalTable: "Solicitacoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Equipamentos_Codigo",
                table: "Equipamentos",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItensSolicitacao_EquipamentoId",
                table: "ItensSolicitacao",
                column: "EquipamentoId");

            migrationBuilder.CreateIndex(
                name: "IX_ItensSolicitacao_SolicitacaoId",
                table: "ItensSolicitacao",
                column: "SolicitacaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Solicitacoes_InstituicaoId",
                table: "Solicitacoes",
                column: "InstituicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Triagens_EquipamentoId",
                table: "Triagens",
                column: "EquipamentoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItensSolicitacao");

            migrationBuilder.DropTable(
                name: "Triagens");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Solicitacoes");

            migrationBuilder.DropTable(
                name: "Equipamentos");

            migrationBuilder.DropTable(
                name: "Instituicoes");
        }
    }
}
