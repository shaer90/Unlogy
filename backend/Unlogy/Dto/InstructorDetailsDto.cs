namespace Unlogy.Dto
{
    public class InstructorDetailsDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public List<InstructorProjectDto> Projects { get; set; }
    }
}
