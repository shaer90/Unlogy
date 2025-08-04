namespace Unlogy.Dto
{
    public class EditTrainingMaterialDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile? File { get; set; }
    }
}
