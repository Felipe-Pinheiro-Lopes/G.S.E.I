using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddMovimentacaoEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Movimentacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EquipamentoId = table.Column<int>(type: "integer", nullable: false),
                    TipoMovimentacao = table.Column<string>(type: "text", nullable: false),
                    DataHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StatusAnterior = table.Column<string>(type: "text", nullable: true),
                    StatusNovo = table.Column<string>(type: "text", nullable: true),
                    Descricao = table.Column<string>(type: "text", nullable: true),
                    Responsavel = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movimentacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Movimentacoes_Equipamentos_EquipamentoId",
                        column: x => x.EquipamentoId,
                        principalTable: "Equipamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Equipamentos_InstituicaoId",
                table: "Equipamentos",
                column: "InstituicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacoes_EquipamentoId_DataHora",
                table: "Movimentacoes",
                columns: new[] { "EquipamentoId", "DataHora" },
                descending: new[] { false, true });

            migrationBuilder.AddForeignKey(
                name: "FK_Equipamentos_Instituicoes_InstituicaoId",
                table: "Equipamentos",
                column: "InstituicaoId",
                principalTable: "Instituicoes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipamentos_Instituicoes_InstituicaoId",
                table: "Equipamentos");

            migrationBuilder.DropTable(
                name: "Movimentacoes");

            migrationBuilder.DropIndex(
                name: "IX_Equipamentos_InstituicaoId",
                table: "Equipamentos");
        }
    }
}
