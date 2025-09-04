using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [RegularExpression("admin|pj")]
    public string Role { get; set; } = "pj"; // "admin" ou "pj"

     public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
