using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

public class InvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    public InvoiceService(IInvoiceRepository invoiceRepository) => _invoiceRepository = invoiceRepository;

    public async Task<IEnumerable<Invoice>> GetAllInvoicesAsync()
    {
        return await _invoiceRepository.GetAllAsync();
    }

    public async Task<IEnumerable<Invoice>> GetInvoicesByUserIdAsync(int userId)
    {
        return await _invoiceRepository.GetByUserIdAsync(userId);
    }

    public async Task<Invoice> CreateInvoiceAsync(int userId, InvoiceCreateRequest request)
    {
        // Normaliza o nome do arquivo
        var fileName = GenerateSafeFileName(request.File.FileName);

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

    public async Task<bool> UpdateInvoiceAsync(int id, int userId, bool isAdmin, InvoiceCreateRequest request)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id);

        if (invoice == null)
            return false;

        if (!isAdmin && invoice.UserId != userId)
            throw new UnauthorizedAccessException("Você não tem permissão para alterar esta nota.");

        invoice.Title = request.Title;
        invoice.ReferenceMonth = request.ReferenceMonth;
        invoice.Observations = request.Observations;

        if (request.File != null)
        {
            if (!string.IsNullOrEmpty(invoice.FilePath))
            {
                var oldFilePath = Path.Combine("uploads", invoice.FilePath);
                if (System.IO.File.Exists(oldFilePath))
                {
                    try
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Erro ao deletar arquivo antigo: {ex.Message}");                        
                    }
                }
            }
            
            var fileName = GenerateSafeFileName(request.File.FileName);
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
         if (!string.IsNullOrEmpty(invoice.FilePath))
        {
            var filePath = Path.Combine("uploads", invoice.FilePath);
            if (System.IO.File.Exists(filePath))
            {
                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                   
                    Console.WriteLine($"Erro ao deletar arquivo: {ex.Message}");
                }
            }
        }

        await _invoiceRepository.DeleteAsync(id);
        return true;
    }

    // ============================
    // Método para normalizar nomes
    // ============================
    private string GenerateSafeFileName(string originalFileName)
    {
        var nameWithoutExt = Path.GetFileNameWithoutExtension(originalFileName);
        var extension = Path.GetExtension(originalFileName);

        // Remove caracteres inválidos e acentos
        var cleanName = string.Concat(nameWithoutExt.Split(Path.GetInvalidFileNameChars()));

        // Substitui espaços por _
        cleanName = cleanName.Replace(" ", "_");

        // Opcional: remover acentos
        cleanName = RemoveDiacritics(cleanName);

        // Adiciona GUID para garantir unicidade
        return $"{Guid.NewGuid()}_{cleanName}{extension}";
    }

    private string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(System.Text.NormalizationForm.FormD);
        var stringBuilder = new System.Text.StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(System.Text.NormalizationForm.FormC);
    }
}
