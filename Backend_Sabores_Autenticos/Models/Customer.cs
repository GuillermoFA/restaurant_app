using System.ComponentModel.DataAnnotations;

namespace Backend_Sabores_Autenticos.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        public string Rut { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string PasswordHashed { get; set; } = string.Empty;
        public bool IsActive {get; set;} = true;
    }
}