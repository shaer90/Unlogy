using Microsoft.AspNetCore.Identity;
using Unlogy.Entities;
using Unlogy.Settings;

namespace Unlogy.Data.Seeders
{
    public class DatabaseSeeder
    {
        public static async Task SeedRolesAndAdminAsync(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {

            string[] roles = { "Admin", "Instructor", "Freelancer" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            var adminEmail = "admin@unlogy.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                var newAdmin = new AppUser
                {
                    UserName = "LujainEmad",
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var adminResult = await userManager.CreateAsync(newAdmin, "Admin@123");

                if (adminResult.Succeeded)
                    await userManager.AddToRoleAsync(newAdmin, "Admin");
            }

            string[] instructorNames = { "Sahar", "Abdulrahman", "Mona", "Shadia" };

            foreach (var name in instructorNames)
            {
                var email = name.ToLower() + "@unlogy.com";
                var user = await userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    var newInstructor = new AppUser
                    {
                        UserName = name,
                        Email = email,
                        EmailConfirmed = true

                    };

                    var result = await userManager.CreateAsync(newInstructor, "Instructor@123");

                    if (result.Succeeded)
                        await userManager.AddToRoleAsync(newInstructor, "Instructor");
                }
            }
        }
    }

}


