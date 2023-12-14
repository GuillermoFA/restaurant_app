using System.ComponentModel.DataAnnotations;

namespace Backend_Sabores_Autenticos.Models
{
    public class CustomerToAdminDto
    {
        [Required]
        public string Rut { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}