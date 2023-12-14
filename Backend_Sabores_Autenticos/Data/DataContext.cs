using Backend_Sabores_Autenticos.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend_Sabores_Autenticos.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Receipt> Receipts { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        
    }
}