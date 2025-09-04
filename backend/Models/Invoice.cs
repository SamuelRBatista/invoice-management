using System;
using System.ComponentModel.DataAnnotations;

public class Invoice
{
    public int Id { get; set; }

    // Relacionamento com usuário (fornecedor)
    public int UserId { get; set; }
    public User? User { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^(0[1-9]|1[0-2])\/\d{4}$", ErrorMessage = "Formato deve ser MM/YYYY")]
    public DateTime ReferenceMonth { get; set; }

    [Required]
    public string FilePath { get; set; } = string.Empty; // nome do arquivo PDF na pasta uploads

    public string? Observations { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
