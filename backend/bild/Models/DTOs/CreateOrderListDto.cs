
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace bild.Models.DTOs
{
    public class CreateOrderListDto
    {
        [Required]
        public int User_Id { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "order must contain at least one item.")]
        public List<OrderItemDto> OrderItems { get; set; }
    }

    public class OrderItemDto
    {
        [Required]
        public int Product_Id { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}