using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Unlogy.Data;
using Unlogy.Dto;
using Unlogy.Entities;

namespace Unlogy.Controllers
{
    [Route("api/projects/{projectId}/materials")]
    [ApiController]
    public class TrainingMaterialsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public TrainingMaterialsController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("")]
        public async Task<IActionResult> AddMaterial(int projectId, [FromForm] AddTrainingMaterialDto dto)
        {
            var project = await dbContext.Projects.FindAsync(projectId);
            if (project == null)
                return NotFound("Project not found");
            using var ms = new MemoryStream();
            await dto.File.CopyToAsync(ms);
            var material = new TrainingMaterial
            {
                Title = dto.Title,
                Description = dto.Description,
                FileData = ms.ToArray(),
                FileName=dto.File.FileName,
                ContentType = dto.File.ContentType,
                ProjectId = projectId,

            };
            dbContext.TrainingMaterials.Add(material);
            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Material added successfully" });

        }
        [HttpGet("Getmaterials")]
        public async Task<ActionResult<IEnumerable<TrainingMaterialResponseDto>>> GetMaterials(int projectId)
        {
            var materials = await dbContext.TrainingMaterials
                .Where(m => m.ProjectId == projectId)
                .Select(m => new TrainingMaterialResponseDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    FileName = m.FileName
                }).ToListAsync();

            return Ok(materials);
        }
        [HttpGet("{materialId}/showmaterial")]
        public async Task<IActionResult> DownloadMaterial(int projectId, int materialId)
        {
            var material = await dbContext.TrainingMaterials
                .FirstOrDefaultAsync(m => m.ProjectId == projectId && m.Id == materialId);

            if (material == null)
                return NotFound("Material not found");

            Response.Headers.Add("Content-Disposition", $"inline; filename={material.FileName}");

            return File(material.FileData, material.ContentType);
        }

        [HttpPut("{materialId}/editmaterial")]
        public async Task<IActionResult> EditMaterial(
    [FromRoute] int projectId,
    [FromRoute] int materialId,
    [FromForm] EditTrainingMaterialDto dto)
        {
            var material = await dbContext.TrainingMaterials
                .FirstOrDefaultAsync(m => m.Id == materialId && m.ProjectId == projectId);

            if (material == null)
                return NotFound(new { message = "Material not found" });

            material.Title = dto.Title;
            material.Description = dto.Description;

            if (dto.File != null)
            {
                using var memoryStream = new MemoryStream();
                await dto.File.CopyToAsync(memoryStream);
                material.FileData = memoryStream.ToArray(); 
                material.FileName = dto.File.FileName;
                material.ContentType = dto.File.ContentType;
            }

            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Material updated successfully" });
        }




        [HttpDelete("{materialId}/deletematerial")]
        public async Task<IActionResult> DeleteMaterial(int projectId, int materialId)
        {
            var material = await dbContext.TrainingMaterials
                .FirstOrDefaultAsync(m => m.Id == materialId && m.ProjectId == projectId);

            if (material == null)
                return NotFound("Material not found");

            dbContext.TrainingMaterials.Remove(material);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Material deleted successfully" });
        }



    }
}
