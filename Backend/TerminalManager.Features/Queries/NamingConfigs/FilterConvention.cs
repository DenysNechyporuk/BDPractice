using HotChocolate.Data.Filters;
using HotChocolate.Data.Filters.Expressions;


namespace TerminalManager.Features.Queries.NamingConfigs;

/// <summary>
/// Custom filtering conventions that support case in-sensitive equals and contains
/// </summary>
public sealed class CustomFilteringConvention : FilterConvention
{
    /// <summary>
    /// <inheritdoc />
    /// </summary>
    protected override void Configure(IFilterConventionDescriptor descriptor)
    {
        descriptor.AddDefaults();
        descriptor.Operation(DefaultFilterOperations.Equals).Name("eq");
        descriptor.AddProviderExtension(
            new QueryableFilterProviderExtension(
                x => x.AddFieldHandler<QueryableStringInvariantEqualsHandler>()));

        descriptor.Operation(DefaultFilterOperations.Contains).Name("contains");
        descriptor.AddProviderExtension(
            new QueryableFilterProviderExtension(
                x => x.AddFieldHandler<QueryableStringInvariantEqualsHandler>()
                    .AddFieldHandler<QueryableStringInvariantContainsHandler>()));
    }
}
