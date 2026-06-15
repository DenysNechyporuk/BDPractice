using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using TerminalManagerDB.Data;
using TerminalManagerDB.Enums;
using TerminalManagerDB.Models;


namespace TerminalManager.Features.Delete;

public record DeleteTerminalRequest(int Id);

public class DeleteTerminalEndpoint(AppDbContext db)
    : Endpoint<DeleteTerminalRequest, Results<NoContent, NotFound>>
{
    
    
    public override void Configure()
    {
        Delete("/api/terminals/{Id}");
        AuthSchemes("Bearer");
    }

    public override async Task<Results<NoContent, NotFound>> ExecuteAsync(
        DeleteTerminalRequest req,
        CancellationToken ct)
    {

        if (req.Id <= 0)
            return TypedResults.NotFound();

        var terminal = await db.Terminals.FindAsync([req.Id], ct);

        if (terminal is null)
            return TypedResults.NotFound();

        db.Terminals.Remove(terminal);
        await db.SaveChangesAsync(ct);

        return TypedResults.NoContent();
    }
}
