using Npgsql;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Linq;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly string _connectionString;
    public InvoiceRepository(IConfiguration configuration) => _connectionString = configuration.GetConnectionString("DefaultConnection")!;    
    public async Task<IEnumerable<Invoice>> GetAllAsync()
    {
        var invoices = new List<Invoice>();
        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(@"
            SELECT 
                i.id, i.user_id, i.title, i.reference_month, i.file_path, i.observations, i.created_at,
                u.id AS user_id, u.name, u.email, u.role
            FROM invoices i
            INNER JOIN users u ON i.user_id = u.id
        ", conn);

        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            invoices.Add(new Invoice
            {
                Id = reader.GetInt32(0),
                UserId = reader.GetInt32(1),
                Title = reader.GetString(2),
                ReferenceMonth = reader.GetDateTime(3),
                FilePath = reader.GetString(4),
                Observations = reader.IsDBNull(5) ? null : reader.GetString(5),
                CreatedAt = reader.GetDateTime(6),
                User = new User
                {
                    Id = reader.GetInt32(7),
                    Name = reader.GetString(8),
                    Email = reader.GetString(9),
                    Role = reader.GetString(10)
                }
            });
        }

        return invoices;
    }
    public async Task<Invoice?> GetByIdAsync(int id)
    {
        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(@"
            SELECT 
                i.id, i.user_id, i.title, i.reference_month, i.file_path, i.observations, i.created_at,
                u.id AS user_id, u.name, u.email, u.role
            FROM invoices i
            INNER JOIN users u ON i.user_id = u.id
            WHERE i.id = @id
        ", conn);
        cmd.Parameters.AddWithValue("id", id);

        await using var reader = await cmd.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return new Invoice
            {
                Id = reader.GetInt32(0),
                UserId = reader.GetInt32(1),
                Title = reader.GetString(2),
                ReferenceMonth = reader.GetDateTime(3),
                FilePath = reader.GetString(4),
                Observations = reader.IsDBNull(5) ? null : reader.GetString(5),
                CreatedAt = reader.GetDateTime(6),
                User = new User
                {
                    Id = reader.GetInt32(7),
                    Name = reader.GetString(8),
                    Email = reader.GetString(9),
                    Role = reader.GetString(10)
                }
            };
        }

        return null;
    }
    public async Task<IEnumerable<Invoice>> GetByUserIdAsync(int userId)
    {
        var invoices = new List<Invoice>();
        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(@"
            SELECT 
                i.id, i.user_id, i.title, i.reference_month, i.file_path, i.observations, i.created_at,
                u.id AS user_id, u.name, u.email, u.role
            FROM invoices i
            INNER JOIN users u ON i.user_id = u.id
            WHERE i.user_id = @user_id
        ", conn);
        cmd.Parameters.AddWithValue("user_id", userId);

        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            invoices.Add(new Invoice
            {
                Id = reader.GetInt32(0),
                UserId = reader.GetInt32(1),
                Title = reader.GetString(2),
                ReferenceMonth = reader.GetDateTime(3),
                FilePath = reader.GetString(4),
                Observations = reader.IsDBNull(5) ? null : reader.GetString(5),
                CreatedAt = reader.GetDateTime(6),
                User = new User
                {
                    Id = reader.GetInt32(7),
                    Name = reader.GetString(8),
                    Email = reader.GetString(9),
                    Role = reader.GetString(10)
                }
            });
        }

        return invoices;
    }
    public async Task CreateAsync(Invoice invoice)
    {
        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(@"
            INSERT INTO invoices (user_id, title, reference_month, file_path, observations, created_at)
            VALUES (@user_id, @title, @reference_month, @file_path, @observations, @created_at)
        ", conn);

        cmd.Parameters.AddWithValue("user_id", invoice.UserId);
        cmd.Parameters.AddWithValue("title", invoice.Title);
        cmd.Parameters.AddWithValue("reference_month", invoice.ReferenceMonth);
        cmd.Parameters.AddWithValue("file_path", invoice.FilePath);
        cmd.Parameters.AddWithValue("observations", (object?)invoice.Observations ?? DBNull.Value);
        cmd.Parameters.AddWithValue("created_at", invoice.CreatedAt);

        await cmd.ExecuteNonQueryAsync();
    }
    public async Task UpdateAsync(Invoice invoice)
    {
        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand(@"
            UPDATE invoices
            SET title = @title,
                reference_month = @reference_month,
                file_path = @file_path,
                observations = @observations
            WHERE id = @id
        ", conn);

        cmd.Parameters.AddWithValue("id", invoice.Id);
        cmd.Parameters.AddWithValue("title", invoice.Title);
        cmd.Parameters.AddWithValue("reference_month", invoice.ReferenceMonth);
        cmd.Parameters.AddWithValue("file_path", invoice.FilePath);
        cmd.Parameters.AddWithValue("observations", (object?)invoice.Observations ?? DBNull.Value);

        await cmd.ExecuteNonQueryAsync();
    }
    public async Task DeleteAsync(int id)
    {
        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new NpgsqlCommand("DELETE FROM invoices WHERE id = @id", conn);
        cmd.Parameters.AddWithValue("id", id);

        await cmd.ExecuteNonQueryAsync();
    }
}
