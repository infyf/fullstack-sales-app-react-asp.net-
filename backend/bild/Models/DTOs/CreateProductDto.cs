using System.ComponentModel.DataAnnotations;

namespace bild.Models.DTOs
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public int id_cat { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        public string Description { get; set; }

        public string Image { get; set; }

        public string Material { get; set; }

        public string Length { get; set; }

        public string Weight { get; set; }

        public string Type { get; set; }
    }
}