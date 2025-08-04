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
    public class FreelancersController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<AppUser> userManager;

        public FreelancersController(ApplicationDbContext dbContext, UserManager<AppUser> userManager)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
        }
        [HttpGet("getallfreelancers")]
        public async Task<ActionResult<PagedResult<FreelancerDto>>> GetAllFreelancers(
    int pageNumber = 1, int pageSize = 10)
        {
            var freelancersQuery = from user in dbContext.Users
                                   join userRole in dbContext.UserRoles on user.Id equals userRole.UserId
                                   join role in dbContext.Roles on userRole.RoleId equals role.Id
                                   where role.Name == "Freelancer" && user.EmailConfirmed 
                                   select new FreelancerDto
                                   {
                                       Id = user.Id,
                                       UserName = user.UserName,
                                       Email = user.Email
                                   };

            var totalCount = await freelancersQuery.CountAsync();

            var pagedItems = await freelancersQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new PagedResult<FreelancerDto>
            {
                Items = pagedItems,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return Ok(result);
        }


        [HttpDelete("DeleteFreelancer/{id}")]
        public async Task<IActionResult> DeleteInstructor(string id)
        {
            var freelancer = await userManager.FindByIdAsync(id);

            if (freelancer == null)
                return NotFound(new { message = "Freelancer not found." });


            var roles = await userManager.GetRolesAsync(freelancer);
            if (!roles.Contains("Freelancer"))
                return BadRequest(new { message = "User is not an freelancer." });

            var result = await userManager.DeleteAsync(freelancer);

            await dbContext.SaveChangesAsync();

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Freelancer deleted successfully." });
        }

        [HttpPost("AddFreelancer")]
        public async Task<IActionResult> AddFreelancer([FromBody] AddFreelancerDto dto  )
        {
            if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "UserName and Email are required." });
            }

            var userExists = await userManager.FindByEmailAsync(dto.Email);
            if (userExists != null)
            {
                return BadRequest(new { message = "A user with this email already exists." });
            }

            var newFreelancer = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(newFreelancer, dto.UserName+"@11"); 

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await userManager.AddToRoleAsync(newFreelancer, "Freelancer");

            return Ok(new { message = "Freelancer added successfully." });
        }



    }
}
