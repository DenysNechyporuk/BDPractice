using System.Linq.Expressions;
using System.Reflection;
using HotChocolate.Data.Filters;
using HotChocolate.Data.Filters.Expressions;
using HotChocolate.Language;

namespace TerminalManager.Features.Queries.NamingConfigs;

    /// <summary>
/// Custom handler that support case in-sensitive equals.
/// The QueryableStringOperationHandler already has an implemenation of CanHandle
/// It checks if the field is declared in a string operation type and also checks if
/// the operation of this field uses the `Operation` specified in the override property further below
/// </summary>
internal sealed class QueryableStringInvariantContainsHandler : QueryableStringOperationHandler
{
    /// <summary>
    /// Initializes a new instance of the class
    /// </summary>
    /// <param name="inputParser">InputParser</param>
    public QueryableStringInvariantContainsHandler(InputParser inputParser) : base(inputParser)
    {
    }

    private static readonly MethodInfo ToLower = typeof(string)
        .GetMethods()
        .Single(x => x.Name == nameof(string.ToLower) && x.GetParameters().Length == 0);

    private static readonly MethodInfo Contains = typeof(string)
        .GetMethods()
        .Single(x => x.Name == nameof(string.Contains) &&
                     x.GetParameters().Length == 1 &&
                     x.GetParameters()[0].ParameterType == typeof(string));

    /// <summary>
    /// This is used to match the handler to all `contains` fields
    /// </summary>
    protected override int Operation => DefaultFilterOperations.Contains;

    /// <summary>
    /// <inheritdoc />
    /// </summary>
    public override Expression HandleOperation(
        QueryableFilterContext context,
        IFilterOperationField field,
        IValueNode value,
        object? parsedValue)
    {
        var property = context.GetInstance();

        if (parsedValue is string str)
        {
            // Lowercase both the property and the search string
            var lowerCaseProperty = Expression.Call(property, ToLower);
            var lowerCaseValue = Expression.Constant(str.ToLower());

            // Use string.Contains to compare them
            return Expression.Call(lowerCaseProperty, Contains, lowerCaseValue);
        }

        throw new InvalidOperationException();
    }
}