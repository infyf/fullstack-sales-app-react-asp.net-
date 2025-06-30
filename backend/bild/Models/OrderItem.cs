using bild.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class OrderItem
{
    [Key]
    public int OrderItemId { get; set; }

    public int Order_Id { get; set; }
    public int Product_Id { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Total_Price { get; set; }

    [ForeignKey("Order_Id")]
    public Order Order { get; set; }

    [ForeignKey("Product_Id")]
    public Product Product { get; set; }
}
