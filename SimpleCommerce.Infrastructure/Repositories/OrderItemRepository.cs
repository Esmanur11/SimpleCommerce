using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class OrderItemRepository : IOrderItemRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public OrderItemRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task CreateAsync(OrderItem orderItem, IDbTransaction? transaction = null)
    {
        const string sql = """
                           INSERT INTO order_items (id, order_id, variant_id, quantity, unit_price)
                           VALUES (@Id, @OrderId, @VariantId, @Quantity, @UnitPrice)
                           """;

        if (transaction is not null)
        {
            await transaction.Connection!.ExecuteAsync(sql, orderItem, transaction);
            return;
        }

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, orderItem);
    }
}