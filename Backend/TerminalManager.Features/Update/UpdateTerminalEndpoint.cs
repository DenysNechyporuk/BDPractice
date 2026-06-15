using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using TerminalManagerDB.Data;
using TerminalManagerDB.Enums;
using TerminalManagerDB.Models;

namespace TerminalManager.Features.Update;


public record UpdateTerminalRequest(int Id, string Name, string SerialNumber, string Address, Status Status);

public class UpdateTerminalEndpoint(AppDbContext db) : Endpoint<UpdateTerminalRequest, Results<NoContent,NotFound>>
{
    public override void Configure()
    {
        Put("/api/terminals/");
        AuthSchemes("Bearer");
    }
    public override async Task<Results<NoContent, NotFound>> ExecuteAsync(
        UpdateTerminalRequest req,
        CancellationToken ct)
    {

        if (req.Id <= 0)
            return TypedResults.NotFound();

        var terminal = await db.Terminals.FindAsync([req.Id], ct);

        if (terminal is null)
            return TypedResults.NotFound();

        
        terminal.Name = req.Name;
        terminal.SerialNumber = req.SerialNumber;
        terminal.Address = req.Address;
        terminal.Status = req.Status;
        
        db.Terminals.Update(terminal);
        await db.SaveChangesAsync(ct);

        return TypedResults.NoContent();
    }
}
