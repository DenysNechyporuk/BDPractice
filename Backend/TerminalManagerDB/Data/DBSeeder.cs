using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TerminalManagerDB.Models;

namespace TerminalManagerDB.Data;

public static class DatabaseSeedService
{
    public static async Task SeedAsync(AppDbContext dbContext, UserManager<AppUser> userManager,
        RoleManager<IdentityRoles> roleManager)
    {
        await dbContext.Database.MigrateAsync();

        if (await dbContext.Users.AnyAsync())
        {
            return;
        }
        
        var result = await roleManager.CreateAsync(new IdentityRoles { Name = "Admin" });
        
        var adminUser = new AppUser
        {
            Id = Guid.NewGuid().ToString(),
            Email = "admin@test.com",
            UserName = "admin@test.com"
        };

        result = await userManager.CreateAsync(adminUser, "Test1234!");
        result = await userManager.AddToRoleAsync(adminUser, "Admin");


    }
}