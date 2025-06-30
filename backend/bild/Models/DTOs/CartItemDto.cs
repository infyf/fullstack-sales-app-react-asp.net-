namespace bild.Models.DTOs
{
    // DTO для елемента кошика
    public class CartItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int? CategoryId { get; set; } // Залишаємо nullable, але обробляємо в контролері
    }
}