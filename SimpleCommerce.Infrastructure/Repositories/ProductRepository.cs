using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public ProductRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<Product>> GetActiveProductsAsync()
    {
        const string sql = """
                           SELECT id, name, description, category_id, category_name, is_active
                           FROM v_product_catalog
                           WHERE is_active = true
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Product>(sql);
    }

    public async Task<Product?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, name, description, category_id, category_name, is_active
                           FROM v_product_catalog
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Product>(sql, new { Id = id });
    }

    public async Task CreateAsync(Product product)
    {
        const string sql = """
                           INSERT INTO products (id, name, description, category_id, is_active, created_by, created_at)
                           VALUES (@Id, @Name, @Description, @CategoryId, @IsActive, @CreatedBy, @CreatedAt)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, product);
    }
}