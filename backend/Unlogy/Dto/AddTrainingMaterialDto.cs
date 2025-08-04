namespace Unlogy.Dto
{
    public class AddTrainingMaterialDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }

    }
}
