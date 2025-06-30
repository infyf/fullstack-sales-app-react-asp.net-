using bild.Data;
using bild.Models;
using bild.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Linq;

namespace bild.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrderController> _logger; // Додано логер

        public OrderController(AppDbContext context, ILogger<OrderController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.ToListAsync();
        }

        // GET: api/order/{orderId}
        [HttpGet("{orderId}")]
        public async Task<ActionResult<Order>> GetOrder(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // POST: api/order
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderDto orderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FindAsync(orderDto.User_Id);
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            var product = await _context.Products.FindAsync(orderDto.Product_Id);
            if (product == null)
            {
                return BadRequest(new { message = "Product not found." });
            }

            if (product.Quantity < orderDto.Quantity)
            {
                return BadRequest(new { message = $"Not enough stock for product {product.Name}." });
            }

            var category = await _context.Categories.FindAsync(product.id_cat);
            if (category == null)
            {
                return BadRequest(new { message = "Category not found for the product." });
            }

            var order = new Order
            {
                User_Id = orderDto.User_Id,
                Product_Id = orderDto.Product_Id,
                Quantity = orderDto.Quantity,
                TotalPrice = product.Price * orderDto.Quantity,
                Order_Date = DateTime.UtcNow,
                Id_Cat = product.id_cat
            };

            _context.Orders.Add(order);
            product.Quantity -= orderDto.Quantity; 
            await _context.SaveChangesAsync();

            // створення запису в PurchaseHistory
            var purchaseHistory = new PurchaseHistory
            {
                OrderNumber = order.Order_Id.ToString(), 
                UserId = order.User_Id,
                ProductId = order.Product_Id,
                ProductName = product.Name,
                PurchaseDate = order.Order_Date,
                Quantity = order.Quantity,
                UnitPrice = product.Price,
                TotalPrice = order.TotalPrice
            };

            _context.PurchaseHistories.Add(purchaseHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { orderId = order.Order_Id }, order);
        }

        // POST: api/order/batch
        [HttpPost("batch")]
        public async Task<ActionResult<IEnumerable<Order>>> CreateOrderList([FromBody] CreateOrderListDto orderListDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int userId = orderListDto.User_Id;
            _logger.LogInformation($"[CreateOrderList] Отримано User_Id з запиту: {userId}");

            var user = await _context.Users.FindAsync(userId);
            _logger.LogInformation($"[CreateOrderList] Результат пошуку користувача з ID {userId}: {(user == null ? "не знайдено" : "знайдено")}");

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var orders = new List<Order>();

            foreach (var item in orderListDto.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.Product_Id);
                if (product == null)
                {
                    return BadRequest(new { message = $"Product with ID {item.Product_Id} not found." });
                }

                if (product.Quantity < item.Quantity)
                {
                    return BadRequest(new { message = $"Not enough stock for product {product.Name}." });
                }

                var category = await _context.Categories.FindAsync(product.id_cat);
                if (category == null)
                {
                    return BadRequest(new { message = $"Category not found for product {product.Name}." });
                }

                var order = new Order
                {
                    User_Id = orderListDto.User_Id,
                    Product_Id = item.Product_Id,
                    Quantity = item.Quantity,
                    TotalPrice = product.Price * item.Quantity,
                    Order_Date = DateTime.UtcNow,
                    Id_Cat = product.id_cat
                };

                orders.Add(order);
                product.Quantity -= item.Quantity; 
            }

            _context.Orders.AddRange(orders);
            await _context.SaveChangesAsync(); // зберігаємо замовлення, щоб отримати Order_Id

            var purchaseHistories = new List<PurchaseHistory>();
            foreach (var orderItem in orders)
            {
                var product = await _context.Products.FindAsync(orderItem.Product_Id);
                if (product != null)
                {
                    purchaseHistories.Add(new PurchaseHistory
                    {
                        OrderNumber = orderItem.Order_Id.ToString(), // використовуємо Order_Id як OrderNumber
                        UserId = orderItem.User_Id,
                        ProductId = orderItem.Product_Id,
                        ProductName = product.Name,
                        PurchaseDate = orderItem.Order_Date,
                        Quantity = orderItem.Quantity,
                        UnitPrice = product.Price,
                        TotalPrice = orderItem.TotalPrice
                    });
                }
            }

            _context.PurchaseHistories.AddRange(purchaseHistories);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrders), orders);
        }
    }

    // DTO (Data Transfer Object) для створення списку замовлень
    public class CreateOrderListDto
    {
        [Required]
        public int User_Id { get; set; }

        [Required]
        public List<OrderItemDto> OrderItems { get; set; }
    }

    public class OrderItemDto
    {
        [Required]
        public int Product_Id { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }

    // DTO (Data Transfer Object) для створення одного замовлення
    public class CreateOrderDto
    {
        [Required]
        public int User_Id { get; set; }

        [Required]
        public int Product_Id { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}