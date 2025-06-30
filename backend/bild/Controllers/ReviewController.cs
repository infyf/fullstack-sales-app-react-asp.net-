using bild.Data;
using bild.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bild.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

      
        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductReviews(int productId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Where(r => r.Product_Id == productId)
                    .OrderByDescending(r => r.Created_At)
                    .Select(r => new
                    {
                        r.Review_Id,
                        r.Product_Id,
                        r.User_Id,
                        r.Rating,
                        Comment = r.Comment ?? "",
                        r.Created_At,
                        AuthorName = r.AuthorName ?? "aнонімний користувач",
                        User = r.User != null ? new { r.User.User_Id, r.User.Name } : null,
                        Product = r.Product != null ? new { r.Product.Product_Id, r.Product.Name } : null
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Помилка при отриманні відгуків для продукту {productId}: {ex}");
                return StatusCode(500, "Сталася помилка при отриманні відгуків.");
            }
        }

        // add rev
        [HttpPost]
        public async Task<ActionResult<Review>> AddReview([FromBody] AddReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newReview = new Review
                {
                    Product_Id = reviewDto.Product_Id,
                    User_Id = reviewDto.User_Id,
                    Rating = (byte)reviewDto.Rating,
                    Comment = reviewDto.Comment,
                    Created_At = DateTime.UtcNow,
                    AuthorName = reviewDto.Author_Name
                };

                _context.Reviews.Add(newReview);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProductReviews), new { productId = newReview.Product_Id }, newReview);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"помилка при додаванні відгука: {ex}");
                return StatusCode(500, "сталася помилка при додаванні відгука.");
            }
        }

        // del
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview(int reviewId, [FromQuery] int userId)
        {
            try
            {
                var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Review_Id == reviewId);

                if (review == null)
                {
                    return NotFound(new { message = "Відгук не знайдено." });
                }

                if (review.User_Id != userId)
                {
                    return Forbid("Ви можете видаляти лише свої власні відгуки.");
                }

                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Відгук успішно видалено." });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Помилка при видаленні відгука: {ex}");
                return StatusCode(500, "Сталася помилка при видаленні відгука.");
            }
        }
    }
}
