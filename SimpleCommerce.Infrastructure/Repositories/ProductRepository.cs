using System.Data;
using Dapper;
using SimpleCommerce.Application.Dtos;
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

    public async Task<IEnumerable<ProductListItemDto>> GetActiveProductsAsync(int page, int pageSize)
    {
        const string sql = """
                           SELECT id, name, description, price, category_id, category_name,
                                  CAST(stock_quantity AS integer) AS stock_quantity, image_url
                           FROM v_product_catalog
                           WHERE is_active = true
                           ORDER BY id
                           LIMIT @PageSize OFFSET @Offset
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<ProductListItemDto>(sql, new { PageSize = pageSize, Offset = (page - 1) * pageSize });
    }

    public async Task<Product?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, name, description, category_id, category_name, is_active, image_url
                           FROM v_product_catalog
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Product>(sql, new { Id = id });
    }

    public async Task<IEnumerable<Product>> GetByIdsAsync(IEnumerable<string> ids)
    {
        const string sql = """
                           SELECT id, name, description, category_id, category_name, is_active, image_url
                           FROM v_product_catalog
                           WHERE id = ANY(@Ids)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Product>(sql, new { Ids = ids.ToArray() });
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