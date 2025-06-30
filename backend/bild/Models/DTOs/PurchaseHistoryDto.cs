using System.ComponentModel.DataAnnotations.Schema;

namespace bild.Models.DTOs
{
    public class PurchaseHistoryDto
    {
        public string OrderNumber { get; set; }
        public string ProductName { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int Quantity { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal UnitPrice { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }
    }
}
