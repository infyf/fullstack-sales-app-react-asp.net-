using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bild.Models
{
    public class Order
    {
        [Key]
        [Column("order_id")]
        public int Order_Id { get; set; }

        [Column("user_id")]
        public int User_Id { get; set; }

        [Column("product_id")]
        public int Product_Id { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("total_price", TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }

        [Column("order_date")]
        public DateTime Order_Date { get; set; }

        [Column("id_cat")]
        public int Id_Cat { get; set; }

        // Навігаційні властивості
        public User User { get; set; }
        public Product Product { get; set; }
        public Category Category { get; set; }
    }
}