using System.ComponentModel.DataAnnotations;

namespace Backend_Sabores_Autenticos.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required]
        public string PdtName { get; set; } = string.Empty;
        [Required]
        public string PdtDescription { get; set; } = string.Empty;
        
        [Required]
        public int Price { get; set; }
        public string ImageName { get; set; } = string.Empty;
        
    }
}