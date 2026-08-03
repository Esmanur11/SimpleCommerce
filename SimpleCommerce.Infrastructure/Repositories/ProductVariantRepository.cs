using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class ProductVariantRepository : IProductVariantRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public ProductVariantRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(string productId)
    {
        const string sql = """
                           SELECT variant_id AS id, product_id, size, color, stock_quantity
                           FROM v_product_variants_detail
                           WHERE product_id = @ProductId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<ProductVariant>(sql, new { ProductId = productId });
    }

    public async Task<ProductVariant?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT variant_id AS id, product_id, size, color, stock_quantity
                           FROM v_product_variants_detail
                           WHERE variant_id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<ProductVariant>(sql, new { Id = id });
    }

    public async Task<IEnumerable<ProductVariant>> GetByIdsAsync(IEnumerable<string> ids)
    {
        const string sql = """
                           SELECT variant_id AS id, product_id, size, color, stock_quantity
                           FROM v_product_variants_detail
                           WHERE variant_id = ANY(@Ids)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<ProductVariant>(sql, new { Ids = ids.ToArray() });
    }

    public async Task UpdateStockAsync(string variantId, int newStockQuantity, IDbTransaction? transaction = null)
    {
        const string sql = """
                           UPDATE product_variants
                           SET stock_quantity = @NewStockQuantity
                           WHERE id = @VariantId
                           """;

        var parameters = new { VariantId = variantId, NewStockQuantity = newStockQuantity };

        if (transaction is not null)
        {
            await transaction.Connection!.ExecuteAsync(sql, parameters, transaction);
            return;
        }

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, parameters);
    }

    public async Task UpdateStocksAsync(IEnumerable<VariantStockUpdate> updates, IDbTransaction? transaction = null)
    {
        const string sql = """
                           UPDATE product_variants
                           SET stock_quantity = @NewStockQuantity
                           WHERE id = @VariantId
                           """;

        if (transaction is not null)
        {
            await transaction.Connection!.ExecuteAsync(sql, updates, transaction);
            return;
        }

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, updates);
    }

    public async Task CreateAsync(ProductVariant variant)
    {
        const string sql = """
                           INSERT INTO product_variants (id, product_id, size, color, stock_quantity, created_at)
                           VALUES (@Id, @ProductId, @Size, @Color, @StockQuantity, @CreatedAt)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, variant);
    }
}