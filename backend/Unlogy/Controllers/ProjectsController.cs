using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Unlogy.Data;
using Unlogy.Dto;
using Unlogy.Entities;
using static Unlogy.Dto.CreateProjectDto;

namespace Unlogy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly ApplicationDbContext dbContext;

        public ProjectsController(UserManager<AppUser> userManager, ApplicationDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet("allprojects")]
        
        public async Task<ActionResult<IEnumerable<ProjectListDto>>> GetAllProjects()
        {
            var projects = await dbContext.Projects
                                          .Select(p => new ProjectListDto
                                          {
                                              Id = p.Id,
                                              Title = p.Title,
                                              Description = p.Description,
                                              CourseCount = p.TrainingMaterials.Count(),
                                              InstructorCount = p.ProjectInstructors.Count(),
                                              Icon = p.Icon
                                          }).ToListAsync();

            return Ok(projects);
        }
        [HttpGet("recentprojects")]
        public async Task<ActionResult<IEnumerable<ProjectListDto>>> RecentProjects()
        {
            var projects = await dbContext.Projects
                                          .Select(p => new ProjectListDto
                                          {
                                              Id = p.Id,
                                              Title = p.Title,
                                              Description = p.Description,
                                              CourseCount = p.TrainingMaterials.Count(),
                                              InstructorCount = p.ProjectInstructors.Count(),
                                              CreatedAt= p.CreatedAt,

                                              Icon = p.Icon
                                          })
                                          .OrderByDescending(p => p.CreatedAt ?? DateTime.MinValue)
                                          .Take(8)
                                          .ToListAsync();

            return Ok(projects);
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost("CreateProject")]
        public async Task<IActionResult> CreateProject([FromForm] FormProjectDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.Icon == null || dto.Icon.Length == 0)
                return BadRequest("Icon file is required.");

       
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ProjectIcons");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

        
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Icon.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.Icon.CopyToAsync(stream);
            }

            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                Icon = fileName, 
                ProjectInstructors = new List<ProjectInstructor>()
            };

            foreach (var username in dto.InstructorUserNames)
            {
                var instructor = await userManager.FindByNameAsync(username);
                if (instructor == null)
                    return BadRequest($"Instructor '{username}' not found");

                if (!await userManager.IsInRoleAsync(instructor, "Instructor"))
                    return BadRequest($"User '{username}' is not in the Instructor role.");

                project.ProjectInstructors.Add(new ProjectInstructor
                {
                    InstructorId = instructor.Id
                });
            }

            dbContext.Projects.Add(project);
            await dbContext.SaveChangesAsync();

            return Ok("Project created successfully.");
        }





        [HttpGet("{projectId}/projectdetails")]
        public async Task<IActionResult> GetProjectDetails(int projectId)
        {
            var project = await dbContext.Projects
                                   .Include(p => p.ProjectInstructors)
                                   .ThenInclude(pi => pi.Instructor)
                                   .Include(p => p.TrainingMaterials)
                                   .FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
                return NotFound("Project not found");
            var dto = new ProjectDetailsDto
            {
                Title = project.Title,
                Description = project.Description,
                Instructors = project.ProjectInstructors.Select(i => i.Instructor.UserName).ToList(),
                MaterialCount = project.TrainingMaterials?.Count ?? 0,

            };
            return Ok(dto);
        }
        //[Authorize(Roles = "Admin")]
        [HttpPut("{id}/updateprojectinfo")]
        public async Task<IActionResult> UpdateProject(int id, [FromForm] UpdateProjectDto dto)
        {
            var project = await dbContext.Projects.FindAsync(id);
            if (project == null)
                return NotFound("Project not found");

            project.Title = dto.Title;
            project.Description = dto.Description;

            if (dto.Icon != null)
            {
                
                if (!string.IsNullOrEmpty(project.Icon))
                {
                    var oldPath = Path.Combine("wwwroot/ProjectIcons", project.Icon);
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Icon.FileName);
                var filePath = Path.Combine("wwwroot/ProjectIcons", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Icon.CopyToAsync(stream);
                }

                project.Icon = fileName;
            }

            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Project updated successfully" });
        }
        //[Authorize(Roles = "Admin")]
        [HttpPost("{projectId}/addinstructors")]
        public async Task<IActionResult> AddInstructorsToProject(int projectId, [FromBody] UpdateProjectInstructorsDto dto)
        {
            var project = await dbContext.Projects
                .Include(p => p.ProjectInstructors)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
                return NotFound("Project not found");

            foreach (var username in dto.InstructorUserNames)
            {
                var instructor = await userManager.FindByNameAsync(username);
                if (instructor == null)
                    return BadRequest($"Instructor '{username}' not found");

                if (!await userManager.IsInRoleAsync(instructor, "Instructor"))
                    return BadRequest($"User '{username}' is not an Instructor");


                if (!project.ProjectInstructors.Any(pi => pi.InstructorId == instructor.Id))
                {
                    project.ProjectInstructors.Add(new ProjectInstructor
                    {
                        ProjectId = projectId,
                        InstructorId = instructor.Id
                    });
                }
            }

            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Instructors added successfully" });
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await dbContext.Projects
                              .Include(p => p.ProjectInstructors)
                              .FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
                return NotFound(new { message = "Project not found" });
            dbContext.projectInstructors.RemoveRange(project.ProjectInstructors);
            dbContext.Projects.Remove(project);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Project deleted successfully" });

        }
        //[HttpPut("{projectId}/updateprojectinfo")]
        //public async Task<IActionResult> UpdateProjectInfo(int projectId, [FromBody] UpdateProjectDto dto)
        //{
        //    var project = await dbContext.Projects.FindAsync(projectId);
        //    if (project == null)
        //        return NotFound("Project not found");

        //    project.Title = dto.Title;
        //    project.Description = dto.Description;

        //    await dbContext.SaveChangesAsync();
        //    return Ok(new { message = "Project updated successfully" });


        //}
        //[Authorize(Roles = "Admin")]
        [HttpDelete("{projectId}/deleteinstructor")]
        public async Task<IActionResult> RemoveInstructorFromProject(int projectId, [FromBody] UpdateProjectInstructorsDto dto)
        {
            var project = await dbContext.Projects
                                .Include(p => p.ProjectInstructors)
                                .FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
                return NotFound("project not found");
            foreach(var username in dto.InstructorUserNames){
                var instructor = await userManager.FindByNameAsync(username);
                if (instructor == null)
                    continue;
                var relation = project.ProjectInstructors.FirstOrDefault(p => p.InstructorId == instructor.Id);
                if (relation != null)
                    dbContext.projectInstructors.Remove(relation);

            }

            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Instructor remove successfully" });
        }
 
    }
    }


