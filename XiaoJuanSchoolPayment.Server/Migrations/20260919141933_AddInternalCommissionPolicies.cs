using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XiaoJuanSchoolPayment.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddInternalCommissionPolicies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SchoolCommissionPolicies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    SchoolId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PolicyCode = table.Column<string>(type: "varchar(80)", maxLength: 80, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Title = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EffectiveRegistrationDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NewStudentsOnly = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CommissionRate = table.Column<decimal>(type: "decimal(5,4)", precision: 5, scale: 4, nullable: false),
                    CurrencyCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FormulaNote = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ScopeNote = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Source = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SourceNotice = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RecordedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolCommissionPolicies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SchoolCommissionPolicies_Schools_SchoolId",
                        column: x => x.SchoolId,
                        principalTable: "Schools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SchoolCommissionRoomBases",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    SchoolCommissionPolicyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    RoomCode = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RoomName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PublishedRoomPriceFourWeeks = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CommissionBasisFourWeeks = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Note = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolCommissionRoomBases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SchoolCommissionRoomBases_SchoolCommissionPolicies_SchoolCom~",
                        column: x => x.SchoolCommissionPolicyId,
                        principalTable: "SchoolCommissionPolicies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SchoolCommissionPolicies_PolicyCode",
                table: "SchoolCommissionPolicies",
                column: "PolicyCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SchoolCommissionPolicies_SchoolId",
                table: "SchoolCommissionPolicies",
                column: "SchoolId");

            migrationBuilder.CreateIndex(
                name: "IX_SchoolCommissionRoomBases_SchoolCommissionPolicyId_RoomCode",
                table: "SchoolCommissionRoomBases",
                columns: new[] { "SchoolCommissionPolicyId", "RoomCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SchoolCommissionRoomBases");

            migrationBuilder.DropTable(
                name: "SchoolCommissionPolicies");
        }
    }
}
