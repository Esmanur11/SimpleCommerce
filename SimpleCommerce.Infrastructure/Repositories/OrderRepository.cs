using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public OrderRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task CreateAsync(Order order)
    {
        const string sql = """
                           INSERT INTO orders (id, customer_id, total_price, status, created_at)
                           VALUES (@Id, @CustomerId, @TotalPrice, @Status, @CreatedAt)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, order);
    }

    public async Task<Order?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, customer_id, total_price, status, created_at
                           FROM orders
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Order>(sql, new { Id = id });
    }
}