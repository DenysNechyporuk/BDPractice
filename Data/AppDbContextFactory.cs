using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using TerminalManagerDB.Data;

namespace TerminalManager.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlite("Data Source=terminals.db");

        return new AppDbContext(optionsBuilder.Options);
    }
}
