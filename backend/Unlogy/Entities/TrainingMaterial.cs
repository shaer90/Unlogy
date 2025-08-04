namespace Unlogy.Entities
{
    public class TrainingMaterial
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public byte[] FileData { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }

    }
}
