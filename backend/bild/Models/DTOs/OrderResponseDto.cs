namespace bild.Models.DTOs
{
    // DTO для відповіді при створенні замовлення
    public class OrderResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int? OrderId { get; set; }
    }
}