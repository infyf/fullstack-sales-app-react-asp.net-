using System.Linq;
using System.Threading.Tasks;
using bild.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bild.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PurchaseHistoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetUserPurchaseHistory")]
        public async Task<IActionResult> GetUserPurchaseHistory(string email)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var purchaseHistory = await _context.PurchaseHistories
                .Where(ph => ph.UserId == user.User_Id)
                .OrderByDescending(ph => ph.PurchaseDate)
                .Join(
                    _context.Products,
                    ph => ph.ProductName, 
                    p => p.Name,
                    (ph, p) => new
                    {
                        ph.OrderNumber,
                        ph.ProductName,
                        ph.PurchaseDate,
                        ph.Quantity,
                        ph.UnitPrice,
                        ph.TotalPrice,
                        p.Image 
                    })
                .ToListAsync();

            return Ok(purchaseHistory);
        }
    }
}