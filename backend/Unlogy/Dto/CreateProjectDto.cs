using Microsoft.AspNetCore.Mvc;

namespace Unlogy.Dto
{
    public class CreateProjectDto
    {
        public class FormProjectDto
        {
            [FromForm(Name = "title")]
            public string Title { get; set; }

            [FromForm(Name = "description")]
            public string Description { get; set; }

            [FromForm(Name = "icon")]
            public IFormFile? Icon { get; set; }

            [FromForm(Name = "instructorUserNames")]
            public List<string> InstructorUserNames { get; set; }
        }

    }
}
