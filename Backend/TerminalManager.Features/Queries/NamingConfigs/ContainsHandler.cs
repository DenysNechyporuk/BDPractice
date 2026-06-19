using System.Linq.Expressions;
using System.Reflection;
using HotChocolate.Data.Filters;
using HotChocolate.Data.Filters.Expressions;
using HotChocolate.Language;

namespace TerminalManager.Features.Queries.NamingConfigs;

/// <summary>
/// Custom handler that support case in-sensitive contains.
/// The QueryableStringOperationHandler already has an implemenation of CanHandle
/// It checks if the field is declared in a string operation type and also checks if
/// the operation of this field uses the `Operation` specified in the override property further below
/// </summary>
internal sealed class QueryableStringInvariantEqualsHandler : QueryableStringOperationHandler
{
    /// <summary>
    /// Initializes a new instance of the class
    /// </summary>
    /// <param name="inputParser">InputParser</param>
    public QueryableStringInvariantEqualsHandler(InputParser inputParser) : base(inputParser)
    {
    }

    // For creating a expression tree we need the `MethodInfo` of the `ToLower` method of string
    private static readonly MethodInfo ToLower = typeof(string)
        .GetMethods()
        .Single(
            x => x.Name == nameof(string.ToLower) &&
                 x.GetParameters().Length == 0);

    /// <summary>
    /// This is used to match the handler to all `eq` fields
    /// </summary>
    protected override int Operation => DefaultFilterOperations.Equals;

    /// <summary>
    /// <inheritdoc />
    /// </summary>
    public override Expression HandleOperation(
        QueryableFilterContext context,
        IFilterOperationField field,
        IValueNode value,
        object? parsedValue)
    {
        // We get the instance of the context. This is the expression path to the propert
        // e.g. ~> y.Street
        var property = context.GetInstance();

        // the parsed value is what was specified in the query
        // e.g. ~> eq: "221B Baker Street"
        if (parsedValue is string str)
        {
            // Creates and returnes the operation
            // e.g. ~> y.Street.ToLower() == "221b baker street"
            return Expression.Equal(
                Expression.Call(property, ToLower),
                Expression.Constant(str.ToLower()));
        }

        // Something went wrong 😱
        throw new InvalidOperationException();
    }
}