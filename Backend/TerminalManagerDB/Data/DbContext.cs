using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TerminalManagerDB.Enums;
using TerminalManagerDB.Models;

namespace TerminalManagerDB.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser, IdentityRoles, string>(options)
{
    public DbSet<Terminals> Terminals => Set<Terminals>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        var entity = modelBuilder.Entity<Terminals>().ToTable("Terminals");
        var statusConverter = new EnumToStringConverter<Status>();
        
        modelBuilder.Entity<Terminals>().HasKey(p => p.Id);
        modelBuilder.Entity<Terminals>().Property(x => x.Id).ValueGeneratedOnAdd();
        entity.Property(x => x.Id).HasColumnName("Id").IsRequired();
        entity.Property(x => x.Name).HasColumnName("Name").IsRequired();
        entity.Property(x => x.SerialNumber).HasColumnName("SerialNumber").IsRequired();
        entity.Property(x => x.Address).HasColumnName("Address").IsRequired();
        entity.Property(x => x.Status).HasColumnName("Status").HasConversion(statusConverter).IsRequired();
        entity.Property(x => x.CreatedAt).HasColumnName("CreatedAt").IsRequired();
        entity.Property(x => x.UpdatedAt).HasColumnName("UpdatedAt");
    }
    
}
