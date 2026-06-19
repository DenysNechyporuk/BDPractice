using TerminalManagerDB.Data;
using TerminalManagerDB.Enums;
using TerminalManagerDB.Models;

namespace TerminalManager.Features.Queries.GraphQL;

public class TerminalQuery
{
    [UseOffsetPaging(MaxPageSize = 100, IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Terminals> GetTerminals([Service] AppDbContext db, Status[]? statuses)
    {
        var query = db.Terminals.AsQueryable();

        if (statuses is { Length: > 0 })
        {
            query = query.Where(terminal => statuses.Contains(terminal.Status));
        }

        return query;
    }
}
