using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bild.Models
{
    public class User
    {
        [Key]
        [Column("user_id")]
        public int User_Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime Created_At { get; set; }

        public Profile Profile { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>(); 

        //  для PurchaseHistory
        public virtual ICollection<PurchaseHistory> PurchaseHistories { get; set; } = new List<PurchaseHistory>();
    }
}