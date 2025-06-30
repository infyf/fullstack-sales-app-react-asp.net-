using System.ComponentModel.DataAnnotations.Schema;

namespace bild.Models
{
    public class Profile
    {
        [Column("profile_id")]
        public int ProfileId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; }

        [Column("last_name")]
        public string LastName { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [Column("avatar_url")]
        public string AvatarUrl { get; set; }

        // Зв'язок з таблицею User
        public User User { get; set; }
    }
}
