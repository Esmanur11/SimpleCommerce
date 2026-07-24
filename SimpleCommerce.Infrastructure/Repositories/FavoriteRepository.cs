using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public FavoriteRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Favorite?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT favorite_id AS id, customer_id, product_id
                           FROM v_favorites_detail
                           WHERE favorite_id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Favorite>(sql, new { Id = id });
    }

    public async Task<IEnumerable<Favorite>> GetByCustomerIdAsync(string customerId)
    {
        const string sql = """
                           SELECT favorite_id AS id, customer_id, product_id
                           FROM v_favorites_detail
                           WHERE customer_id = @CustomerId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Favorite>(sql, new { CustomerId = customerId });
    }

    public async Task<Favorite?> GetByCustomerIdAndProductIdAsync(string customerId, string productId)
    {
        const string sql = """
                           SELECT favorite_id AS id, customer_id, product_id
                           FROM v_favorites_detail
                           WHERE customer_id = @CustomerId AND product_id = @ProductId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Favorite>(sql, new { CustomerId = customerId, ProductId = productId });
    }

    public async Task CreateAsync(Favorite favorite)
    {
        const string sql = """
                           INSERT INTO favorites (id, customer_id, product_id)
                           VALUES (@Id, @CustomerId, @ProductId)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, favorite);
    }

    public async Task DeleteAsync(string favoriteId)
    {
        const string sql = "DELETE FROM favorites WHERE id = @FavoriteId";

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, new { FavoriteId = favoriteId });
    }
}