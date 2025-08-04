using Unlogy.Entities;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    public string Icon { get; set; }

    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ProjectInstructor> ProjectInstructors { get; set; }
    public ICollection<TrainingMaterial> TrainingMaterials { get; set; } = new List<TrainingMaterial>();
    public ICollection<Course> Courses { get; set; }
}
