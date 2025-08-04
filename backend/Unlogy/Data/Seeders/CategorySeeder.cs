using Unlogy.Entities;
using Microsoft.EntityFrameworkCore;
using Unlogy.Data;

//namespace Unlogy.Seeders
//{
//    public static class CategorySeeder
//    {
//        public static async Task SeedAsync(ApplicationDbContext context)
//        {
//            if (!await context.Categories.AnyAsync())
//            {
//                var categories = new List<Category>
//                {
//                    new Category {  Name = "Computer Skills", Icon = "computer-skills.png" },
//                    new Category {  Name = "Cyber Security", Icon = "cyber-security.png" },
//                    new Category { Name = "Programming Fundamentals", Icon = "programming-fundamentals.png" },
//                    new Category { Name = "Computer Networks", Icon = "computer-networks.png" },
//                    new Category { Name = "Backend Development", Icon = "backend-development.png" },
//                    new Category { Name = "Engineering Fundamentals", Icon = "engineering-fundamentals.png" },
//                    new Category {  Name = "Frontend Fundamentals", Icon = "frontend-fundamentals.png" },
//                    new Category {  Name = "Mobile App Programming", Icon = "mobile-app.png" }
//                };

//                await context.Categories.AddRangeAsync(categories);
//                await context.SaveChangesAsync();
//            }
//        }
//    }
//}
