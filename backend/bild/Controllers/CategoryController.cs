using bild.Data;
using bild.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bild.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _context.Categories
                                           .Include(c => c.Products) 
                                           .ToListAsync();
            return Ok(categories);
        }

   
        [HttpGet("{id_cat}")]
        public async Task<ActionResult<Category>> GetCategory(int id_cat)
        {
            var category = await _context.Categories
                                         .Include(c => c.Products)
                                         .FirstOrDefaultAsync(c => c.id_cat == id_cat);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }
    }
}
