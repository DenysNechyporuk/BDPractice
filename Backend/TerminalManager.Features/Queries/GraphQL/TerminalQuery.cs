using TerminalManagerDB.Data;
using TerminalManagerDB.Models;


namespace TerminalManager.Features.Queries.GraphQL;

public class TerminalQuery
{
    [UseOffsetPaging(MaxPageSize = 100, IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Terminals> GetTerminals([Service] AppDbContext db)
    {
        return db.Terminals.AsQueryable();
    }
}