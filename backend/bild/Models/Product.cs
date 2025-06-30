using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bild.Models
{
    public class Product
    {
        [Key]
        [Column("product_id")]
        public int Product_Id { get; set; }

        [Column("id_cat")]
        public int id_cat { get; set; }

        public string Name { get; set; }
        public int Quantity { get; set; } 
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Material { get; set; }
        public string Length { get; set; }
        public string Weight { get; set; }
        public string Type { get; set; }

       
        public Category Category { get; set; }

        // Навігаційна властивість для PurchaseHistory
        public virtual ICollection<PurchaseHistory> PurchaseHistories { get; set; } = new List<PurchaseHistory>();
    }
}
