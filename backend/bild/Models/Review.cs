using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bild.Models
{
    public class Review
    {
        [Key]
        [Column("review_id")]
        public int Review_Id { get; set; }

        [Column("product_id")]
        public int Product_Id { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public int User_Id { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; }

        [Column("created_at")]
        public DateTime Created_At { get; set; }

        [Column("author_name")]
        public string AuthorName { get; set; }

        public virtual User User { get; set; }
        public virtual Product Product { get; set; }
    }
}