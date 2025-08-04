using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unlogy.Migrations
{
    /// <inheritdoc />
    public partial class CreatedAtToProjectTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Projects",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Projects");
        }
    }
}
