using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class PriceRepository : IPriceRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public PriceRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Price?> GetActivePriceAsync(string productId)
    {
        const string sql = """
                           SELECT id, product_id, amount, valid_from, valid_to, is_active, changed_by
                           FROM prices
                           WHERE product_id = @ProductId AND is_active = true
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Price>(sql, new { ProductId = productId });
    }

    public async Task<IEnumerable<Price>> GetActivePricesAsync(IEnumerable<string> productIds)
    {
        const string sql = """
                           SELECT id, product_id, amount, valid_from, valid_to, is_active, changed_by
                           FROM prices
                           WHERE product_id = ANY(@ProductIds) AND is_active = true
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Price>(sql, new { ProductIds = productIds.ToArray() });
    }

    public async Task CreateInitialPriceAsync(Price price)
    {
        const string sql = """
                           INSERT INTO prices (id, product_id, amount, valid_from, valid_to, is_active, changed_by)
                           VALUES (@Id, @ProductId, @Amount, @ValidFrom, @ValidTo, @IsActive, @ChangedBy)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, price);
    }

    public async Task ChangePriceAsync(string productId, decimal newAmount, string? changedBy)
    {
        const string closeSql = """
                                UPDATE prices
                                SET valid_to = now(), is_active = false
                                WHERE product_id = @ProductId AND is_active = true
                                """;

        const string insertSql = """
                                 INSERT INTO prices (id, product_id, amount, valid_from, valid_to, is_active, changed_by)
                                 VALUES (@Id, @ProductId, @Amount, @ValidFrom, NULL, true, @ChangedBy)
                                 """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        await connection.ExecuteAsync(closeSql, new { ProductId = productId }, transaction);

        var newPrice = new
        {
            Id = $"PRICE-{Guid.NewGuid().ToString("N")[..12]}",
            ProductId = productId,
            Amount = newAmount,
            ValidFrom = DateTime.UtcNow,
            ChangedBy = changedBy
        };
        await connection.ExecuteAsync(insertSql, newPrice, transaction);

        transaction.Commit();
    }
}