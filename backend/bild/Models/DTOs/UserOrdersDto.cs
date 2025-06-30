using System;

namespace bild.Models.DTOs
{
    // DTO для списку замовлень користувача
    public class UserOrdersDto
    {
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public int Items { get; set; }
        public int FirstOrderId { get; set; }
    }
}