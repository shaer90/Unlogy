using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Unlogy.Data;
using Unlogy.Dto;

namespace Unlogy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public CategoriesController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await dbContext.Categories.Include(c => c.Courses).Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                CourseCount = c.Courses.Count
            }).ToListAsync();

            return Ok(categories);
        }

        [HttpGet("TopCategories")]
        public async Task<ActionResult<List<CategoryDto>>> GetTopCategories([FromQuery] int limit = 8)
        {
            var topCategories = await dbContext.Categories
                .OrderByDescending(c => c.Courses.Count)
                .Take(limit)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Icon = c.Icon,
                    CourseCount = c.Courses.Count
                })
                .ToListAsync();

            return Ok(topCategories);
        }

    }
}
