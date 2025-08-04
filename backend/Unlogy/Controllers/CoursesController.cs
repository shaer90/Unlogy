using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Unlogy.Data;

namespace Unlogy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public CoursesController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        [HttpGet("popular")]
        public async Task<IActionResult> GetMostPopularCourses()
        {
            var courses = await dbContext.Courses
                .OrderByDescending(c => c.Rating)
                .Take(8)
                .Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.ImageUrl,
                    c.Rating,
                    c.DurationInHours
                })
                .ToListAsync();

            return Ok(courses);
        }

    }
}
