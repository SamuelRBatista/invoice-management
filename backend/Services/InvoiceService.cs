using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

public class InvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;

    public InvoiceService(IInvoiceRepository invoiceRepository)
    {
        _invoiceRepository = invoiceRepository;
    }

     // Lista todas notas (admin)
    public async Task<IEnumerable<Invoice>> GetAllInvoicesAsync()
    {
        return await _invoiceRepository.GetAllAsync();
    }

    // Lista notas de um usuário específico (fornecedor)
    public async Task<IEnumerable<Invoice>> GetInvoicesByUserIdAsync(int userId)
    {
        return await _invoiceRepository.GetByUserIdAsync(userId);
    }

    // Cria nota fiscal com upload de PDF
    public async Task<Invoice> CreateInvoiceAsync(int userId, InvoiceCreateRequest request)
    {
        // Cria nome único do arquivo
        var fileName = $"{Guid.NewGuid()}_{request.File.FileName}";
        var uploadPath = Path.Combine("uploads", fileName);

        // Salva arquivo
        using (var stream = new FileStream(uploadPath, FileMode.Create))
        {
            await request.File.CopyToAsync(stream);
        }

        var invoice = new Invoice
        {
            UserId = userId,
            Title = request.Title,
            ReferenceMonth = request.ReferenceMonth,
            FilePath = fileName,
            Observations = request.Observations,
            CreatedAt = DateTime.UtcNow
        };

        await _invoiceRepository.CreateAsync(invoice);
        return invoice;
    }

    public async Task<bool> UpdateInvoiceAsync(int id, int userId, InvoiceCreateRequest request)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id);
        if (invoice == null || invoice.UserId != userId)
            return false;

        // Atualiza campos
        invoice.Title = request.Title;
        invoice.ReferenceMonth = request.ReferenceMonth;
        invoice.Observations = request.Observations;

        if (request.File != null)
        {
            var fileName = $"{Guid.NewGuid()}_{request.File.FileName}";
            var uploadPath = Path.Combine("uploads", fileName);

            using (var stream = new FileStream(uploadPath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            invoice.FilePath = fileName;
        }

        await _invoiceRepository.UpdateAsync(invoice);
        return true;
    }

    public async Task<bool> DeleteInvoiceAsync(int id)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id);
        if (invoice == null)
            return false;

        await _invoiceRepository.DeleteAsync(id);
        return true;
    }
}
