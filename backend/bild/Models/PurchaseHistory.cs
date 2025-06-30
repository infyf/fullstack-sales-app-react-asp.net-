using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bild.Models
{
    [Table("purchase_history")]
    public class PurchaseHistory
    {
        [Key]
        [Column("history_id")]
        public int HistoryId { get; set; }

        [Column("order_number")]
        public string OrderNumber { get; set; }

        [Column("user_id")]
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        [Column("product_id")]
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public Product Product { get; set; }

        [Column("product_name")]
        public string ProductName { get; set; }

        [Column("purchase_date")]
        public DateTime PurchaseDate { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("unit_price", TypeName = "decimal(18, 2)")]
        public decimal UnitPrice { get; set; }

        [Column("total_price", TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }
    }
}