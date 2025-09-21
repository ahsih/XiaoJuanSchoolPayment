using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XiaoJuanSchoolPayment.Server.Migrations
{
    /// <inheritdoc />
    public partial class CurrencyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CurrencyId",
                table: "SchoolLessons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdated",
                table: "SchoolLessons",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "SchoolCurrency",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Symbol = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CurrencyCode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolCurrency", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SchoolLessons_CurrencyId",
                table: "SchoolLessons",
                column: "CurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_SchoolLessons_SchoolCurrency_CurrencyId",
                table: "SchoolLessons",
                column: "CurrencyId",
                principalTable: "SchoolCurrency",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SchoolLessons_SchoolCurrency_CurrencyId",
                table: "SchoolLessons");

            migrationBuilder.DropTable(
                name: "SchoolCurrency");

            migrationBuilder.DropIndex(
                name: "IX_SchoolLessons_CurrencyId",
                table: "SchoolLessons");

            migrationBuilder.DropColumn(
                name: "CurrencyId",
                table: "SchoolLessons");

            migrationBuilder.DropColumn(
                name: "LastUpdated",
                table: "SchoolLessons");
        }
    }
}
