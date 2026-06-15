using FastEndpoints;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using TerminalManager.Features.Configuration;
using TerminalManagerDB.Models;


namespace TerminalManager.Features.Login;


public record LoginUserRequest(string Email, string Password);
public record LoginUserResponse(string Token);


public class LoginEndpoint(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<IdentityRoles> roleManager, IOptions<AuthConfiguration> authOptions) : Endpoint<LoginUserRequest, Results<Ok<LoginUserResponse>, 
    NotFound, 
    UnauthorizedHttpResult>>
{
    public override void Configure()
    {
        Post("/api/user/login");
        AllowAnonymous();
    }
    
    public override async Task<Results<Ok<LoginUserResponse>, NotFound, UnauthorizedHttpResult>> ExecuteAsync(
        LoginUserRequest req, CancellationToken ct)
    {
        var user = await userManager.FindByEmailAsync(req.Email);
        if (user is null)
        {
            return TypedResults.NotFound();
        }
        var result = await signInManager.CheckPasswordSignInAsync(user, req.Password, false);
        if (!result.Succeeded)
        {
            return TypedResults.Unauthorized();
        }
        var roles = await userManager.GetRolesAsync(user);
        var userRole = roles.FirstOrDefault() ?? "Admin";

        var role = await roleManager.FindByNameAsync(userRole);
        var roleClaims = role is not null ? await roleManager.GetClaimsAsync(role) : [];
        
        var token = JwtTokenGenerator.GenerateJwtToken(user, authOptions.Value, userRole, roleClaims);
        return TypedResults.Ok(new LoginUserResponse(token));
    }
}
