using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class InvoicesController : ControllerBase
{
    private readonly InvoiceService _invoiceService;

    public InvoicesController(InvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    // GET: api/invoices
    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllInvoices()
    {
        var invoices = await _invoiceService.GetAllInvoicesAsync();
        return Ok(invoices);
    }

    // GET: api/invoices/my
    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyInvoices()
    {
        int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var invoices = await _invoiceService.GetInvoicesByUserIdAsync(userId);
        return Ok(invoices);
    }

    // POST: api/invoices
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

        var updated = await _invoiceService.UpdateInvoiceAsync(id, userId, request);
        if (!updated)
            return NotFound();

        return Ok();
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

    // GET: api/invoices/download/{filename}
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
