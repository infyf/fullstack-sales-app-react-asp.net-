using bild.Data;
using bild.Models;
using bild.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace bild.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/product/{productId}
        [HttpGet("{productId}")]
        public async Task<ActionResult<Product>> GetProduct(int productId)
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // POST: api/product
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] CreateProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categoryExists = await _context.Categories.FindAsync(productDto.id_cat);
            if (categoryExists == null)
            {
                return BadRequest(new { message = "сategory with the provided id_cat does not exist." });
            }

            var newProduct = new Product
            {
                Name = productDto.Name,
                id_cat = productDto.id_cat,
                Quantity = productDto.Quantity,
                Price = productDto.Price,
                Description = productDto.Description,
                Image = productDto.Image,
                Material = productDto.Material,
                Length = productDto.Length,
                Weight = productDto.Weight,
                Type = productDto.Type
            };

            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { productId = newProduct.Product_Id }, newProduct);
        }


    }
}