using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class InvoicesController : ControllerBase
{
    private readonly InvoiceService _invoiceService;
    public InvoicesController(InvoiceService invoiceService) => _invoiceService = invoiceService;   

    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllInvoices()
    {
        var invoices = await _invoiceService.GetAllInvoicesAsync();       
        return Ok(invoices);
    }
       
    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyInvoices()
    {
        int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var invoices = await _invoiceService.GetInvoicesByUserIdAsync(userId);
        return Ok(invoices);
    }
  
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromForm] InvoiceCreateRequest request)
    {
        int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        var invoice = await _invoiceService.CreateInvoiceAsync(userId, request);
        return Ok(invoice);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInvoice(int id, [FromForm] InvoiceCreateRequest request)
    {
        int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        bool isAdmin = User.IsInRole("admin");

        try
        {
            var updated = await _invoiceService.UpdateInvoiceAsync(id, userId, isAdmin, request);
            if (!updated)
                return NotFound("Nota fiscal não encontrada.");
            return Ok();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message); // retorna 403
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvoice(int id)
    {
        var result = await _invoiceService.DeleteInvoiceAsync(id);
        if (!result)
            return NotFound();

        return NoContent(); // 204
    }

    [Authorize]
    [HttpGet("download/{filename}")]
    public IActionResult DownloadFile(string filename)
    {
        var path = Path.Combine("uploads", filename);
        if (!System.IO.File.Exists(path))
            return NotFound();

        var fileBytes = System.IO.File.ReadAllBytes(path);
        return File(fileBytes, "application/pdf", filename);
    }
}
