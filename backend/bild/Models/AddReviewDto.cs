// Models/AddReviewDto.cs
namespace bild.Models
{
    public class AddReviewDto
    {
        public int Product_Id { get; set; }
        public int User_Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string Author_Name { get; set; }
    }
}