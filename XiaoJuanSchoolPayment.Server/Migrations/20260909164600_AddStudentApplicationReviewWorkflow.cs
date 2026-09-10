using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XiaoJuanSchoolPayment.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentApplicationReviewWorkflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChangeSummary",
                table: "StudentApplications",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedAt",
                table: "StudentApplications",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublishedByName",
                table: "StudentApplications",
                type: "varchar(256)",
                maxLength: 256,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PublishedByUserId",
                table: "StudentApplications",
                type: "varchar(450)",
                maxLength: 450,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PublishedSnapshotJson",
                table: "StudentApplications",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ReviewStatus",
                table: "StudentApplications",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Published")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedAt",
                table: "StudentApplications",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubmittedByName",
                table: "StudentApplications",
                type: "varchar(256)",
                maxLength: 256,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SubmittedByUserId",
                table: "StudentApplications",
                type: "varchar(450)",
                maxLength: 450,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsPendingDeletion",
                table: "StudentApplicationDocuments",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChangeSummary",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "PublishedAt",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "PublishedByName",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "PublishedByUserId",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "PublishedSnapshotJson",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "ReviewStatus",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "SubmittedAt",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "SubmittedByName",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "SubmittedByUserId",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "IsPendingDeletion",
                table: "StudentApplicationDocuments");
        }
    }
}
