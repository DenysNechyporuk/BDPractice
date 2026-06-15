using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TerminalManagerDB.Migrations
{
    /// <inheritdoc />
    public partial class AddTerminalAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Terminals",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Terminals");
        }
    }
}
