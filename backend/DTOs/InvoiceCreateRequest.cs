public class InvoiceCreateRequest
{
    public string Title { get; set; } = string.Empty;
    public DateTime ReferenceMonth { get; set; }
    public IFormFile? File { get; set; } = null!;
    public string? Observations { get; set; }
}