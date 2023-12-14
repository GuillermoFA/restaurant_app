using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_Sabores_Autenticos.Models
{
    public class OrderDto
    {
        [Required]
        public List<int> ArrayOfProdId { get; set; } = new List<int>();
        [Required]
        public int CustomerId { get; set; }
        
        public string? Comment { get; set; } = string.Empty;
    }
}