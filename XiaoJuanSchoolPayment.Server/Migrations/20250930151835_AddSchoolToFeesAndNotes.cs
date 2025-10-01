using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XiaoJuanSchoolPayment.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSchoolToFeesAndNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SchoolFees_Schools_SchoolId",
                table: "SchoolFees");

            migrationBuilder.DropForeignKey(
                name: "FK_SchoolNotes_Schools_SchoolId",
                table: "SchoolNotes");

            migrationBuilder.AlterColumn<Guid>(
                name: "SchoolId",
                table: "SchoolNotes",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AlterColumn<Guid>(
                name: "SchoolId",
                table: "SchoolFees",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddColumn<int>(
                name: "CurrencyId",
                table: "SchoolFees",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdated",
                table: "SchoolFees",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_SchoolFees_CurrencyId",
                table: "SchoolFees",
                column: "CurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_SchoolFees_SchoolCurrency_CurrencyId",
                table: "SchoolFees",
                column: "CurrencyId",
                principalTable: "SchoolCurrency",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SchoolFees_Schools_SchoolId",
                table: "SchoolFees",
                column: "SchoolId",
                principalTable: "Schools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SchoolNotes_Schools_SchoolId",
                table: "SchoolNotes",
                column: "SchoolId",
                principalTable: "Schools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SchoolFees_SchoolCurrency_CurrencyId",
                table: "SchoolFees");

            migrationBuilder.DropForeignKey(
                name: "FK_SchoolFees_Schools_SchoolId",
                table: "SchoolFees");

            migrationBuilder.DropForeignKey(
                name: "FK_SchoolNotes_Schools_SchoolId",
                table: "SchoolNotes");

            migrationBuilder.DropIndex(
                name: "IX_SchoolFees_CurrencyId",
                table: "SchoolFees");

            migrationBuilder.DropColumn(
                name: "CurrencyId",
                table: "SchoolFees");

            migrationBuilder.DropColumn(
                name: "LastUpdated",
                table: "SchoolFees");

            migrationBuilder.AlterColumn<Guid>(
                name: "SchoolId",
                table: "SchoolNotes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AlterColumn<Guid>(
                name: "SchoolId",
                table: "SchoolFees",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddForeignKey(
                name: "FK_SchoolFees_Schools_SchoolId",
                table: "SchoolFees",
                column: "SchoolId",
                principalTable: "Schools",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SchoolNotes_Schools_SchoolId",
                table: "SchoolNotes",
                column: "SchoolId",
                principalTable: "Schools",
                principalColumn: "Id");
        }
    }
}
