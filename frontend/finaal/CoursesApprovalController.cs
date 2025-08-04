using Microsoft.AspNetCore.Mvc;
using Unlogy.Data; 
using Unlogy.Entities; 
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Unlogy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesApprovalController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CoursesApprovalController(ApplicationDbContext context)
        {
            _context = context;
        }

      
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return NotFound();

           
            course.IsPublished = true;

          
            if (course.CategoryId == 0)
            {
               
                return BadRequest("Category not set for this course.");
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Course approved successfully." });
        }

        [HttpPost("reject/{id}")]
        public async Task<IActionResult> RejectCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return NotFound();

            course.IsPublished = false;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Course rejected successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetApprovedCourses()
        {
            var approvedCourses = await _context.Courses
                .Where(c => c.IsPublished == true)
                .ToListAsync();

            if (approvedCourses == null)
                return NotFound();

            return Ok(approvedCourses);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetCoursesByCategory(int categoryId)
        {
            var courses = await _context.Courses
                .Where(c => c.CategoryId == categoryId && c.IsPublished)
                .ToListAsync();

            if (courses == null || !courses.Any())
                return NotFound();

            return Ok(courses);
        }
    }

}
