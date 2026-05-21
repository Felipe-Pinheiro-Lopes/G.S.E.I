using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddAprovadoPorAndLaudoDescarteToEquipamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AprovadoPor",
                table: "Equipamentos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LaudoDescarte",
                table: "Equipamentos",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AprovadoPor",
                table: "Equipamentos");

            migrationBuilder.DropColumn(
                name: "LaudoDescarte",
                table: "Equipamentos");
        }
    }
}
