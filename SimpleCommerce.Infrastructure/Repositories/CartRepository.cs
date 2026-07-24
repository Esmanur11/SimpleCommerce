using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public CartRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Cart?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, customer_id, created_at
                           FROM v_carts
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Cart>(sql, new { Id = id });
    }

    public async Task<Cart?> GetByCustomerIdAsync(string customerId)
    {
        const string sql = """
                           SELECT id, customer_id, created_at
                           FROM v_carts
                           WHERE customer_id = @CustomerId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Cart>(sql, new { CustomerId = customerId });
    }

    public async Task CreateAsync(Cart cart)
    {
        const string sql = """
                           INSERT INTO carts (id, customer_id)
                           VALUES (@Id, @CustomerId)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, cart);
    }
}