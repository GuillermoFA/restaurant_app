using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_Sabores_Autenticos.Models
{
    public class ProductDto
    {
        [Required]
        public string PdtName { get; set; } = string.Empty;
        [Required]
        public string PdtDescription { get; set; } = string.Empty;
        [Required]
        public int Price { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}