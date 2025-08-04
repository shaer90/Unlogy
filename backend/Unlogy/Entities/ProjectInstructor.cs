namespace Unlogy.Entities
{
    public class ProjectInstructor
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public string InstructorId { get; set; }
        public AppUser Instructor { get; set; }
    }

}
