using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unlogy.Migrations
{
    /// <inheritdoc />
    public partial class ProjectInstructionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectInstructor_AspNetUsers_InstructorId",
                table: "ProjectInstructor");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectInstructor_Projects_ProjectId",
                table: "ProjectInstructor");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectInstructor",
                table: "ProjectInstructor");

            migrationBuilder.RenameTable(
                name: "ProjectInstructor",
                newName: "projectInstructors");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectInstructor_ProjectId",
                table: "projectInstructors",
                newName: "IX_projectInstructors_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectInstructor_InstructorId",
                table: "projectInstructors",
                newName: "IX_projectInstructors_InstructorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_projectInstructors",
                table: "projectInstructors",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_projectInstructors_AspNetUsers_InstructorId",
                table: "projectInstructors",
                column: "InstructorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_projectInstructors_Projects_ProjectId",
                table: "projectInstructors",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_projectInstructors_AspNetUsers_InstructorId",
                table: "projectInstructors");

            migrationBuilder.DropForeignKey(
                name: "FK_projectInstructors_Projects_ProjectId",
                table: "projectInstructors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_projectInstructors",
                table: "projectInstructors");

            migrationBuilder.RenameTable(
                name: "projectInstructors",
                newName: "ProjectInstructor");

            migrationBuilder.RenameIndex(
                name: "IX_projectInstructors_ProjectId",
                table: "ProjectInstructor",
                newName: "IX_ProjectInstructor_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_projectInstructors_InstructorId",
                table: "ProjectInstructor",
                newName: "IX_ProjectInstructor_InstructorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectInstructor",
                table: "ProjectInstructor",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectInstructor_AspNetUsers_InstructorId",
                table: "ProjectInstructor",
                column: "InstructorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectInstructor_Projects_ProjectId",
                table: "ProjectInstructor",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
