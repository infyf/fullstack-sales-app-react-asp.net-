
using bild.Data;
using bild.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace bild.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest("Email already exists.");
            }

            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = userDto.Password,
                Created_At = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var profile = new Profile
            {
                UserId = user.User_Id, 
                FirstName = "",
                LastName = "",
                Phone = "",
                Address = "",
                AvatarUrl = ""
            };

            _context.Profiles.Add(profile);
            await _context.SaveChangesAsync();

         
            return Ok(new { message = "user registered successfully. Profile created.", user = new { id = user.User_Id, user.Email, user.Name } });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginData)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginData.Email && u.Password == loginData.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "nевірний email або пароль." });
            }

            // повертаємо User_Id у відповіді
            return Ok(new { message = "вхід успішний", user = new { id = user.User_Id, user.Email, user.Name } });
        }
    }

    public class UserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}