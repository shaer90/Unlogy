using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unlogy.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTheRelationBetweenProjectTableAndAppUsetMakeitManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_AspNetUsers_InstructorId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_InstructorId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "InstructorId",
                table: "Projects");

            migrationBuilder.CreateTable(
                name: "ProjectInstructor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    InstructorId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectInstructor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectInstructor_AspNetUsers_InstructorId",
                        column: x => x.InstructorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectInstructor_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInstructor_InstructorId",
                table: "ProjectInstructor",
                column: "InstructorId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInstructor_ProjectId",
                table: "ProjectInstructor",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectInstructor");

            migrationBuilder.AddColumn<string>(
                name: "InstructorId",
                table: "Projects",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_InstructorId",
                table: "Projects",
                column: "InstructorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_AspNetUsers_InstructorId",
                table: "Projects",
                column: "InstructorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
