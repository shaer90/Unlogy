using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Unlogy.Data;
using Unlogy.Dto;
using Unlogy.Entities;
using Unlogy.Settings;


namespace Unlogy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<AppUser> userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly IConfiguration configuration;
        
 

        public AccountsController( ApplicationDbContext dbContext,UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<AppUser> signInManager, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
            _roleManager = roleManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
         
          
        }

        [HttpPost("register")]
       
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUserByName = await userManager.FindByNameAsync(dto.UserName);
            if (existingUserByName != null)
                return BadRequest(new { error = "Username is already taken." });

            var existingUserByEmail = await userManager.FindByEmailAsync(dto.Email);
            if (existingUserByEmail != null)
                return BadRequest(new { error = "Email is already registered." });

            var user = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }

            
            var roleResult = await userManager.AddToRoleAsync(user, "Freelancer");
            if (!roleResult.Succeeded)
            {
                var errors = roleResult.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }
            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action(
       nameof(ConfirmEmail), "Accounts", 
       new { userId = user.Id, token },
       protocol: Request.Scheme
   );
            var email = new Email
            {
                Recivers = user.Email,
                Subject = "Confirm your email",
                Body = $"Please confirm your account by clicking <a href='{confirmationLink}'>here</a>."
            };
            EmailSettings.SendEmail(email);

            return Ok(new
            {
                message = "User Registered Successfully. Please confirm your email.",
                role = "Freelancer"
            });
        }
        [HttpGet("confirmemail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                return BadRequest("Invalid user ID");

            var result = await userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
                return Ok("Email confirmed successfully.");
            else
                return BadRequest("Email confirmation failed.");
        }





        [HttpPost("login")]
        
        public async Task<IActionResult> Login([FromBody] LoginDto loginDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await userManager.FindByNameAsync(loginDTO.Username);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            var result = await signInManager.PasswordSignInAsync(loginDTO.Username, loginDTO.Password, false, false);
            if (!result.Succeeded)
            {
                return Unauthorized("Invalid username or password");
            }

            var token = GenerateToken(user);
            var roles = await userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault(); // Assuming one role per user

            return Ok(new
            {
                token,
                user = new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    role = role
                }
            });
        }




        //[HttpPost("register")]

        //public async Task<IActionResult> Register(RegisterDTO dto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    var validRoles = new[] { "Student", "Teacher" };
        //    if (!validRoles.Contains(dto.Role))
        //        return BadRequest(new { error = "Invalid role. Only 'Student' or 'Teacher' are allowed." });

        //    var existingUserByName = await userManager.FindByNameAsync(dto.UserName);
        //    if (existingUserByName != null)
        //        return BadRequest(new { error = "Username is already taken." });

        //    var existingUserByEmail = await userManager.FindByEmailAsync(dto.Email);
        //    if (existingUserByEmail != null)
        //        return BadRequest(new { error = "Email is already registered." });

        //    var user = new AppUser
        //    {
        //        UserName = dto.UserName,
        //        Email = dto.Email
        //    };

        //    var result = await userManager.CreateAsync(user, dto.Password);
        //    if (!result.Succeeded)
        //    {
        //        var errors = result.Errors.Select(e => e.Description);
        //        return BadRequest(new { errors });
        //    }

        //    var roleResult = await userManager.AddToRoleAsync(user, dto.Role);
        //    if (!roleResult.Succeeded)
        //    {
        //        var errors = roleResult.Errors.Select(e => e.Description);
        //        return BadRequest(new { errors });
        //    }

        //    var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        //    var confirmUrl = ${user.Id}&token={Uri.EscapeDataString(token)}";

        //    await emailService.SendConfirmationEmail(user.Email, user.Id, token);

        //    return Ok(new { message = "User Registered Successfully. Please check your email to confirm your account.", role = dto.Role });
        //}
        //[HttpPost("confirm-email")]
        //public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto model)
        //{
        //    var user = await userManager.FindByIdAsync(model.UserId);
        //    if (user == null)
        //        return BadRequest("Invalid request");

        //    var decodedToken = Uri.UnescapeDataString(model.Token);
        //    var result = await userManager.ConfirmEmailAsync(user, decodedToken);

        //    if (result.Succeeded)
        //        return Ok("Email confirmed successfully");

        //    var errors = result.Errors.Select(e => e.Description);
        //    return BadRequest(new { message = "Email confirmation failed.", errors });
        //}















        //[HttpPost("login")]
        //public async Task<IActionResult> Login([FromBody] LoginDto loginDTO)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    var user = await userManager.FindByNameAsync(loginDTO.Username);
        //    if (user == null)
        //    {
        //        return Unauthorized("Invalid username or password");
        //    }


        //    if (!await userManager.IsEmailConfirmedAsync(user))
        //    {
        //        return Unauthorized("Email not confirmed. Please check your email to confirm your account.");
        //    }

        //    var result = await signInManager.PasswordSignInAsync(loginDTO.Username, loginDTO.Password, false, false);
        //    if (!result.Succeeded)
        //    {
        //        return Unauthorized("Invalid username or password");
        //    }

        //    var token = GenerateToken(user);
        //    return Ok(token);
        //}




        private string GenerateToken(AppUser user)
        {
            var roles = userManager.GetRolesAsync(user).Result; 

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

           
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["JWT:Issuer"],
                audience: configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



    }
}
