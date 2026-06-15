using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TerminalManager.Features.Configuration;
using TerminalManagerDB.Models;

namespace TerminalManager.Features.Login;

public static class JwtTokenGenerator
{
    public static string GenerateJwtToken(AppUser user,
        AuthConfiguration authConfiguration,
        string userRole,
        IList<Claim> roleClaims)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authConfiguration.Key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = [
            new(JwtRegisteredClaimNames.Sub, user.Email!),
            new("userid", user.Id),
            new("role", userRole)
        ];

        foreach (var roleClaim in roleClaims)
        {
            claims.Add(new Claim(roleClaim.Type, roleClaim.Value));
        }

        var token = new JwtSecurityToken(
            issuer: authConfiguration.Issuer,
            audience: authConfiguration.Audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}