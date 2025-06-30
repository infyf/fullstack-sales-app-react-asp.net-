using bild.Data;

using bild.Models;

using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;

using System.Linq;

using System.Threading.Tasks;



namespace bild.Controllers

{

    [Route("api/[controller]")]

    [ApiController]

    public class ProfileController : ControllerBase

    {

        private readonly AppDbContext _context;



        public ProfileController(AppDbContext context)

        {

            _context = context;

        }



        [HttpGet("GetProfile")]

        public async Task<IActionResult> GetProfile(string email)

        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);



            if (user == null)

            {

                return NotFound(new { message = "User not found." });

            }



            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == user.User_Id);



            if (profile == null)

            {

                return NotFound(new { message = "Profile not found." });

            }



            var purchaseHistory = await _context.PurchaseHistories

              .Where(ph => ph.UserId == user.User_Id)

              .OrderByDescending(ph => ph.PurchaseDate)

              .GroupBy(ph => ph.OrderNumber) // Групуємо за номером замовлення

                      .Select(g => new

                      {

                          orderId = g.Key,

                          date = g.Max(ph => ph.PurchaseDate),

                          totalAmount = g.Sum(ph => ph.TotalPrice),

                          items = g.Select(ph => new

                          {

                              name = ph.ProductName,

                              quantity = ph.Quantity,

                              price = ph.UnitPrice,

                              image = _context.Products

                        .Where(p => p.Product_Id == ph.ProductId)

                        .Select(p => p.Image)

                        .FirstOrDefault()

                          }).ToList()

                      })

              .ToListAsync();



            return Ok(new

            {

                Profile = new

                {

                    profile.ProfileId,

                    profile.UserId,

                    profile.FirstName,

                    profile.LastName,

                    profile.Phone,

                    profile.Address,

                    profile.AvatarUrl,

                    user.Email,

                    user.Name

                },

                PurchaseHistory = purchaseHistory

            });

        }



        [HttpPut("UpdateProfile")]

        public async Task<IActionResult> UpdateProfile(string email, [FromBody] UpdateProfileDto updatedProfile)

        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)

            {

                return NotFound(new { message = "User not found." });

            }



            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == user.User_Id);



            if (profile == null)

            {

                return NotFound(new { message = "Profile not found." });

            }



            // update prof

            profile.FirstName = updatedProfile.FirstName ?? profile.FirstName;

            profile.LastName = updatedProfile.LastName ?? profile.LastName;

            profile.Phone = updatedProfile.Phone ?? profile.Phone;

            profile.Address = updatedProfile.Address ?? profile.Address;

            profile.AvatarUrl = updatedProfile.AvatarUrl ?? profile.AvatarUrl;



            await _context.SaveChangesAsync();



            return Ok(new

            {

                Profile = new

                {

                    profile.ProfileId,

                    profile.UserId,

                    profile.FirstName,

                    profile.LastName,

                    profile.Phone,

                    profile.Address,

                    profile.AvatarUrl,

                    user.Email,

                    user.Name

                },

                Message = "Profile updated successfully."

            });

        }

    }



    public class UpdateProfileDto

    {

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public string AvatarUrl { get; set; }

    }

}