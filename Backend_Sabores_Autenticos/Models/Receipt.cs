using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_Sabores_Autenticos.Models
{
    public class Receipt
    {
        [Key]
        public int ReceiptId { get; set; }
        [ForeignKey("OrderId")]
        public int OrderId { get; set; }
        [Required]
        public int TotalPrice { get; set; }
        [Required]
        public string Qty { get; set; } = string.Empty;

    }
}