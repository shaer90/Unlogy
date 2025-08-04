using Microsoft.AspNetCore.Identity;


namespace Unlogy.Entities
{
    public class AppUser : IdentityUser
    {

        public ICollection<ProjectInstructor> ProjectInstructors { get; set; }

    }

}

