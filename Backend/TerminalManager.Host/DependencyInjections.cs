using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TerminalManager.Features.Configuration;
using TerminalManagerDB.Data;
using TerminalManagerDB.Models;
using HotChocolate.AspNetCore;
using HotChocolate.CostAnalysis;
using TerminalManager.Features.Queries.GraphQL;
using TerminalManager.Features.Queries.NamingConfigs;


namespace TerminalManager;

public static class DependencyInjections
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDatabase(configuration);
        services.AddCors(options =>
        {
            options.AddPolicy("Frontend", policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        services.AddIdentity();
        services.AddLogin(configuration);
        services.AddGraphQl();
        services.Configure<AuthConfiguration>(configuration.GetSection(nameof(AuthConfiguration)));
        return services;
    }

    private static void AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connection = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options => options.UseSqlite(connection));
        
    }
    
    private static void AddIdentity (this IServiceCollection services)
    {
        services
            .AddIdentity<AppUser, IdentityRoles>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders();

        services.Configure<IdentityOptions>(options =>
        {
            // Password settings.
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequiredLength = 6;
            options.Password.RequiredUniqueChars = 1;

            // Lockout settings.
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;

            // User settings.
            options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
            options.User.RequireUniqueEmail = false;
        });
    }
    
    private static void AddLogin(this IServiceCollection services, IConfiguration configuration)
    {
        var authConfiguration = configuration
            .GetSection(nameof(AuthConfiguration))
            .Get<AuthConfiguration>();

        if (authConfiguration is null)
        {
            throw new InvalidOperationException($"{nameof(AuthConfiguration)} section is missing.");
        }

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authConfiguration.Issuer,
                    ValidateAudience = true,
                    ValidAudience = authConfiguration.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authConfiguration.Key)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddAuthorization();
    }
    private static void AddGraphQl(this IServiceCollection services)
    {
        services
            .AddGraphQLServer()
            .AddQueryType<TerminalQuery>()
            .AddProjections()
            .AddFiltering<CustomFilteringConvention>()
            .AddSorting()
            .ModifyCostOptions(options =>
            {
                options.EnforceCostLimits = false;
            });
    }
}
