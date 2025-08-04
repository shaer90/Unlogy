using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Unlogy.Data;
using Unlogy.Dto;
using Unlogy.Entities;

namespace Unlogy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly Microsoft.AspNetCore.Identity.UserManager<AppUser> userManager;
        private readonly Microsoft.AspNetCore.Identity.RoleManager<IdentityRole> roleManager;

        public InstructorsController(ApplicationDbContext dbContext, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }
        [HttpGet("instructorlist")]
        public async Task<IActionResult> GetInstructorsList()
        {
            var instructors = await userManager.GetUsersInRoleAsync("Instructor");
            var result = instructors.Select(i => i.UserName).ToList();
            return Ok(result);
        }


        [HttpGet("instructorswithprojects")]
        public async Task<ActionResult<PagedResult<InstructorWithProjectsDto>>> GetAllInstructorsWithProjects(
    int pageNumber = 1, int pageSize = 10)
        {
           
            var instructorsQuery = from user in dbContext.Users
                                   join userRole in dbContext.UserRoles on user.Id equals userRole.UserId
                                   join role in dbContext.Roles on userRole.RoleId equals role.Id
                                   where role.Name == "Instructor"
                                   select user;

            var query = from instructor in instructorsQuery
                        join pi in dbContext.projectInstructors on instructor.Id equals pi.InstructorId into projectsGroup
                        select new InstructorWithProjectsDto
                        {
                            Id= instructor.Id,
                            UserName = instructor.UserName,
                            Email = instructor.Email,
                            ProjectsCount = projectsGroup.Count()
                        };

            var totalCount = await query.CountAsync();

            var pagedItems = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new PagedResult<InstructorWithProjectsDto>
            {
                Items = pagedItems,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return Ok(result);
        }
        [HttpGet("{instructorId}/projects")]
        public async Task<IActionResult> GetProjectsByInstructor(string instructorId)
        {
            var projects = await dbContext.projectInstructors
                .Where(ip => ip.InstructorId == instructorId)
                .Include(ip => ip.Project)
                .Select(ip => new {
                    id = ip.Project.Id,
                    title = ip.Project.Title,
                    icon = ip.Project.Icon,
                    description = ip.Project.Description
                })
                .ToListAsync();

            return Ok(projects);
        }



        [HttpGet("{instructorId}/instructordetails")]
       public async Task<IActionResult> GetInstructorDetails( string instructorId)
        {
            var instructor = await dbContext.AppUsers
                .Where(user => user.Id == instructorId)
                .Select(user => new InstructorDetailsDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Projects = user.ProjectInstructors
                                    .Select(p => new InstructorProjectDto
                                    {
                                        ProjectId = p.Project.Id,
                                        Title = p.Project.Title,
                                        Description = p.Project.Description

                                    }).ToList()


                }).FirstOrDefaultAsync();
            if (instructor == null)
                return NotFound("Instructor not found");

            return Ok(instructor);


        }
        [HttpPost("AddInstructor")]
        public async Task<IActionResult> RegisterInstructor([FromBody] AddInstructorDto dto)
        {
            var userExists = await userManager.FindByEmailAsync(dto.Email);
            if (userExists != null)
                return BadRequest(new { message = "Instructor with this email already exists." });

            var instructor = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                EmailConfirmed = true
            };
            var defaultPassword = dto.UserName + "@11";

            var result = await userManager.CreateAsync(instructor, defaultPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

          
            await userManager.AddToRoleAsync(instructor, "Instructor");

            return Ok(new { message = "Instructor created successfully." });
        }
        [HttpDelete("DeleteInstructor/{id}")]
        public async Task<IActionResult> DeleteInstructor(string id)
        {
            var instructor = await userManager.FindByIdAsync(id);

            if (instructor == null)
                return NotFound(new { message = "Instructor not found." });


            var roles = await userManager.GetRolesAsync(instructor);
            if (!roles.Contains("Instructor"))
                return BadRequest(new { message = "User is not an instructor." });

            var result = await userManager.DeleteAsync(instructor);

             await dbContext.SaveChangesAsync();

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Instructor deleted successfully." });
        }
    }
}
