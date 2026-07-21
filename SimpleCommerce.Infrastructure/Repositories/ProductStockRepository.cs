using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class ProductStockRepository : IProductStockRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public ProductStockRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<ProductStock?> GetByProductIdAsync(string productId)
    {
        const string sql = """
                           SELECT id, product_id, quantity
                           FROM product_stocks
                           WHERE product_id = @ProductId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<ProductStock>(sql, new { ProductId = productId });
    }

    public async Task UpdateQuantityAsync(string productId, int newQuantity)
    {
        const string sql = """
                           UPDATE product_stocks
                           SET quantity = @NewQuantity
                           WHERE product_id = @ProductId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, new { NewQuantity = newQuantity, ProductId = productId });
    }
}