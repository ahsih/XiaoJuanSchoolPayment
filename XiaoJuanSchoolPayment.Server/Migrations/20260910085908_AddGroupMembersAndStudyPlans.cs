using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XiaoJuanSchoolPayment.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupMembersAndStudyPlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccommodationPlansJson",
                table: "StudentApplications",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CoursePlansJson",
                table: "StudentApplications",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EnrollmentType",
                table: "StudentApplications",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MembersJson",
                table: "StudentApplications",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccommodationPlansJson",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "CoursePlansJson",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "EnrollmentType",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "MembersJson",
                table: "StudentApplications");
        }
    }
}
