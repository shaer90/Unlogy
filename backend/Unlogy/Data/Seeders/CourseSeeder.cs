using Microsoft.EntityFrameworkCore;
using Unlogy.Data;
using Unlogy.Entities;

//namespace Unlogy.Seeders
//{
//    public static class CourseSeeder
//    {
//        public static async Task SeedAsync(ApplicationDbContext context, string? instructorId)
//        {
//            if (!await context.Courses.AnyAsync())
//            {
//                var categories = await context.Categories.ToListAsync();

//                var courses = new List<Course>
//                {
//                    new Course
//                    {
//                        Title = "Introduction to Word & Excel",
//                        Description = "Master basic computer programs.",
//                        ImageUrl = "word-excel.png",
//                        Rating = 4.5,
//                        DurationInHours = 10,
//                        Duration = TimeSpan.FromHours(10),
//                        IsPublished = true,
//                        ApprovalStatus = "Approved",
//                        CategoryId = categories.First(c => c.Name == "Computer Skills").Id,
//                        InstructorId = instructorId
//                    },
//                    new Course
//                    {
//                        Title = "Cybersecurity Basics",
//                        Description = "Learn about data protection and safe practices.",
//                        ImageUrl = "cybersecurity.jpg",
//                        Rating = 4.7,
//                        DurationInHours = 8,
//                        Duration = TimeSpan.FromHours(8),
//                        IsPublished = true,
//                        ApprovalStatus = "Approved",
//                        CategoryId = categories.First(c => c.Name == "Cyber Security").Id,
//                        InstructorId = instructorId
//                    },
//                    new Course
//                    {
//                        Title = "Programming Logic 101",
//                        Description = "Start thinking like a programmer.",
//                        ImageUrl = "programming.jpeg",
//                        Rating = 4.6,
//                        DurationInHours = 12,
//                        Duration = TimeSpan.FromHours(12),
//                        IsPublished = true,
//                        ApprovalStatus = "Approved",
//                        CategoryId = categories.First(c => c.Name == "Programming Fundamentals").Id,
//                        InstructorId = instructorId
//                    },
//                    new Course
//                    {
//                        Title = "Networking Essentials",
//                        Description = "Basics of routers, IPs, and switches.",
//                        ImageUrl = "networks.jpg",
//                        Rating = 4.3,
//                        DurationInHours = 7,
//                        Duration = TimeSpan.FromHours(7),
//                        IsPublished = true,
//                        ApprovalStatus = "Approved",
//                        CategoryId = categories.First(c => c.Name == "Computer Networks").Id,
//                        InstructorId = instructorId
//                    },
//                    new Course
//                    {
//                        Title = "ASP.NET Core for Beginners",
//                        Description = "Build web APIs using .NET.",
//                        ImageUrl = "backend.jpeg",
//                        Rating = 4.8,
//                        DurationInHours = 14,
//                        Duration = TimeSpan.FromHours(14),
//                        IsPublished = true,
//                        ApprovalStatus = "Approved",
//                        CategoryId = categories.First(c => c.Name == "Backend Development").Id,
//                        InstructorId = instructorId
//                    },
//                    new Course
//                    {
//                        Title = "Engineering 101",
//                        Description = "Fundamentals of engineering concepts.",
//                        ImageUrl = "engineering.jpeg",
//                        Rating = 4.2,
//                        DurationInHours = 9,
//                        Duration = TimeSpan.FromHours(9),
//                        IsPublished = true,
//                        ApprovalStatus = "Approved",
//                        CategoryId = categories.First(c => c.Name == "Engineering Fundamentals").Id,
//                        InstructorId = instructorId
//                    },
//                    new Course
//                    {
//                        Title = "Frontend Basics: HTML & CSS",
//                        Description = "Learn to build static web pages.",
//                        ImageUrl = "frontend.jpeg",
//                        Rating = 4.4,
//                        DurationInHours = 11,
//                        Duration = TimeSpan.FromHours(11),
//                        IsPublished = true,
//                        ApprovalStatus = "Approved",
//                        CategoryId = categories.First(c => c.Name == "Frontend Fundamentals").Id,
//                        InstructorId = instructorId
//                    },
//                    new Course
//                    {
//                        Title = "Build Android Apps",
//                        Description = "Create your first mobile app.",
//                        ImageUrl = "mobile-app.jpeg",
//                        Rating = 4.6,
//                        DurationInHours = 10,
//                        Duration = TimeSpan.FromHours(10),
//                        IsPublished = true,
//                        ApprovalStatus = "Approved",
//                        CategoryId = categories.First(c => c.Name == "Mobile App Programming").Id,
//                        InstructorId = instructorId
//                    }
//                };

//                await context.Courses.AddRangeAsync(courses);
//                await context.SaveChangesAsync();
//            }
//        }
//    }
//}
