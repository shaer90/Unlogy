namespace Unlogy.Entities
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public float? Price { get; set; }
        public string ImageUrl { get; set; }  
        public string? Level { get; set; }    
        public TimeSpan Duration { get; set; } 
        public bool? IsPublished { get; set; }
        public string? ApprovalStatus { get; set; }
        public int DurationInHours { get; set; }
        public double Rating { get; set; }


        public int ProjectId { get; set; }
        public Project Project { get; set; }


        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public string? InstructorId { get; set; }

        public AppUser? Instructor { get; set; }


        public ICollection<Lesson>? Lessons { get; set; }

    }
}
