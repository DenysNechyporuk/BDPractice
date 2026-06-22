namespace TerminalManagerDB.Interface;

public interface TimeAuditableEntity
{
    DateTime CreatedAt{ get; set; }

    
    DateTime? UpdatedAt { get; set; }
}