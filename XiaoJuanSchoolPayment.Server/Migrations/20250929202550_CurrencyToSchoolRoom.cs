using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XiaoJuanSchoolPayment.Server.Migrations
{
    /// <inheritdoc />
    public partial class CurrencyToSchoolRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Currency",
                table: "SchoolRooms",
                newName: "Week");

            migrationBuilder.AddColumn<int>(
                name: "CurrencyId",
                table: "SchoolRooms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdated",
                table: "SchoolRooms",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_SchoolRooms_CurrencyId",
                table: "SchoolRooms",
                column: "CurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_SchoolRooms_SchoolCurrency_CurrencyId",
                table: "SchoolRooms",
                column: "CurrencyId",
                principalTable: "SchoolCurrency",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SchoolRooms_SchoolCurrency_CurrencyId",
                table: "SchoolRooms");

            migrationBuilder.DropIndex(
                name: "IX_SchoolRooms_CurrencyId",
                table: "SchoolRooms");

            migrationBuilder.DropColumn(
                name: "CurrencyId",
                table: "SchoolRooms");

            migrationBuilder.DropColumn(
                name: "LastUpdated",
                table: "SchoolRooms");

            migrationBuilder.RenameColumn(
                name: "Week",
                table: "SchoolRooms",
                newName: "Currency");
        }
    }
}
