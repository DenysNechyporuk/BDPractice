using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TerminalManagerDB.Models;

namespace TerminalManagerDB.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser, IdentityRoles, string>(options)
{
    public DbSet<Terminals> Terminals => Set<Terminals>();
}
