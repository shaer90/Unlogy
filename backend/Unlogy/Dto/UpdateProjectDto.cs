using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Unlogy.Dto
{
    public class UpdateProjectDto
    {
        [FromForm]
        public string Title { get; set; }

        [FromForm]
        public string Description { get; set; }

        [FromForm]
        public IFormFile? Icon { get; set; }
    }
}
