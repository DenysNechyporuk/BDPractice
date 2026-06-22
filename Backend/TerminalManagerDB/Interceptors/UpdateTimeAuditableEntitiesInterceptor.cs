using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using TerminalManagerDB.Interface;

namespace TerminalManagerDB.Interceptors;

public class UpdateTimeAuditableEntitiesInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = new CancellationToken())
    {
        var dbContext = eventData.Context;
        if (dbContext is null)
        {
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        var auditableEntities = dbContext.ChangeTracker.Entries<TimeAuditableEntity>();
        foreach (var entity in auditableEntities)
        {
            if (entity.State is EntityState.Added)
            {
                entity.Entity.CreatedAt = DateTime.UtcNow;
                entity.Entity.UpdatedAt = DateTime.UtcNow;
            }

            if (entity.State is EntityState.Modified)
            {
                entity.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}
