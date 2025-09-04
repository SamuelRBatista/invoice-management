using Microsoft.EntityFrameworkCore;

namespace backend.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Invoice> Invoices { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ============================
        // Tabela Users
        // ============================
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users"); // snake_case
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Id)
                  .HasColumnName("id");

            entity.Property(u => u.Name)
                  .IsRequired()
                  .HasMaxLength(150)
                  .HasColumnName("name");

            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(150)
                  .HasColumnName("email");

            entity.Property(u => u.PasswordHash)
                  .IsRequired()
                  .HasMaxLength(200)
                  .HasColumnName("password_hash");

            entity.Property(u => u.Role)
                  .IsRequired()
                  .HasMaxLength(20)
                  .HasColumnName("role");

            entity.HasMany(u => u.Invoices)
                  .WithOne(i => i.User)
                  .HasForeignKey(i => i.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================
        // Tabela Invoices
        // ============================
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.ToTable("invoices"); // snake_case
            entity.HasKey(i => i.Id);

            entity.Property(i => i.Id)
                  .HasColumnName("id");

            entity.Property(i => i.UserId)
                  .IsRequired()
                  .HasColumnName("user_id");

            entity.Property(i => i.Title)
                  .IsRequired()
                  .HasMaxLength(200)
                  .HasColumnName("title");

            entity.Property(i => i.ReferenceMonth)
                  .IsRequired()
                  .HasMaxLength(20) // MM/YYYY
                  .HasColumnName("reference_month");

            entity.Property(i => i.FilePath)
                  .IsRequired()
                  .HasMaxLength(500)
                  .HasColumnName("file_path");

            entity.Property(i => i.Observations)
                  .HasMaxLength(1000)
                  .HasColumnName("observations");

            entity.Property(i => i.CreatedAt)
                  .HasColumnName("created_at")
                  .HasDefaultValueSql("NOW()"); // timestamp padrão PostgreSQL
        });
    }
}
