using bild.Models;
using Microsoft.EntityFrameworkCore;

namespace bild.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<PurchaseHistory> PurchaseHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<User>().HasKey(u => u.User_Id);
            modelBuilder.Entity<User>()
                .HasMany(u => u.PurchaseHistories) // Додано навігаційну властивість
                .WithOne(ph => ph.User)
                .HasForeignKey(ph => ph.UserId)
                .OnDelete(DeleteBehavior.Cascade) // При видаленні користувача видалятимуться і його покупки
                .HasConstraintName("FK_PurchaseHistory_Users_UserId");

            modelBuilder.Entity<Profile>().ToTable("profile");
            modelBuilder.Entity<Profile>().HasKey(p => p.ProfileId);
            modelBuilder.Entity<Profile>()
                .HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<Profile>(p => p.UserId);

            modelBuilder.Entity<Product>().ToTable("products");
            modelBuilder.Entity<Product>().HasKey(p => p.Product_Id);
            modelBuilder.Entity<Product>()
                .HasMany(p => p.PurchaseHistories) // Додано навігаційну властивість
                .WithOne(ph => ph.Product)
                .HasForeignKey(ph => ph.ProductId)
                .OnDelete(DeleteBehavior.Restrict) // Забороняємо видалення продукту, якщо є історія покупок
                .HasConstraintName("FK_PurchaseHistory_Products_ProductId");

            modelBuilder.Entity<Category>().ToTable("categories");
            modelBuilder.Entity<Category>().HasKey(c => c.id_cat);
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.id_cat);
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Orders)
                .WithOne(o => o.Category)
                .HasForeignKey(o => o.Id_Cat)
                .HasConstraintName("FK_Orders_Categories_IdCat");

            modelBuilder.Entity<Order>().ToTable("orders");
            modelBuilder.Entity<Order>().HasKey(o => o.Order_Id);
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.User_Id)
                .HasConstraintName("FK_Orders_Users_UserId");
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Product)
                .WithMany()
                .HasForeignKey(o => o.Product_Id)
                .HasConstraintName("FK_Orders_Products_ProductId");

            modelBuilder.Entity<Review>().ToTable("reviews");
            modelBuilder.Entity<Review>().HasKey(r => r.Review_Id);
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Product)
                .WithMany()
                .HasForeignKey(r => r.Product_Id)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.User_Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PurchaseHistory>().ToTable("purchase_history");
            modelBuilder.Entity<PurchaseHistory>().HasKey(ph => ph.HistoryId);
            // Зв'язки для PurchaseHistory вже налаштовані вище разом з User та Product
        }
    }
}