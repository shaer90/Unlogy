namespace Unlogy.Dto
{
    public class ProjectListDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public string ? Icon { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public int CourseCount { get; set; }
        public int InstructorCount { get; set; }
    }
}
