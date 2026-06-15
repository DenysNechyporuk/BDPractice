using Microsoft.AspNetCore.Identity;

namespace TerminalManagerDB.Models;

public class IdentityRoles : IdentityRole
{
    public const string RoleName = "Admin";
}
