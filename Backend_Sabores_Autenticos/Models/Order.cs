using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_Sabores_Autenticos.Models
{
    public class Order
    {
        
        public int Id { get; set; } 
        public int CustomerId { get; set; }
        public string Status { get; set; } = string.Empty;
        
        public string? Comments { get; set; } = string.Empty;
        public int TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public Customer Customer { get; set; } = null!;
    }
}