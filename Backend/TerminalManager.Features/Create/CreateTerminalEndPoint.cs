using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using TerminalManagerDB.Data;
using TerminalManagerDB.Enums;
using TerminalManagerDB.Models;

namespace TerminalManager.Features.Create;

public record CreateTerminalRequest(
    string Name,
    string SerialNumber,
    string Address,
    Status Status
);

public class CreateTerminalEndPoint(AppDbContext db)
    : Endpoint<CreateTerminalRequest, Results<Created, BadRequest>>
{
    public override void Configure()
    {
        Post("/api/terminals");
        AuthSchemes("Bearer");
    }

    public override async Task<Results<Created, BadRequest>> ExecuteAsync(
        CreateTerminalRequest req,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Name) ||
            string.IsNullOrWhiteSpace(req.SerialNumber) ||
            string.IsNullOrWhiteSpace(req.Address))
        {
            return TypedResults.BadRequest();
        }

        var terminal = new Terminals
        {
            Name = req.Name,
            SerialNumber = req.SerialNumber,
            Address = req.Address,
            Status = req.Status
        };

        db.Terminals.Add(terminal);

        await db.SaveChangesAsync(ct);

        return TypedResults.Created();
    }
}
