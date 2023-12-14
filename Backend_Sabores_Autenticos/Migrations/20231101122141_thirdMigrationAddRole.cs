using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend_Sabores_Autenticos.Migrations
{
    /// <inheritdoc />
    public partial class thirdMigrationAddRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Customers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Customers");
        }
    }
}
