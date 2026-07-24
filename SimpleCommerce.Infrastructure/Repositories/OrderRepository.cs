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

    public async Task CreateAsync(Order order, IDbTransaction? transaction = null)
    {
        const string sql = """
                           INSERT INTO orders (
                               id, customer_id, total_price, status, created_at,
                               shipping_provider_id, shipping_price,
                               shipping_full_name, shipping_phone, shipping_city,
                               shipping_district, shipping_address_line, shipping_zip_code)
                           VALUES (
                               @Id, @CustomerId, @TotalPrice, @Status, @CreatedAt,
                               @ShippingProviderId, @ShippingPrice,
                               @ShippingFullName, @ShippingPhone, @ShippingCity,
                               @ShippingDistrict, @ShippingAddressLine, @ShippingZipCode)
                           """;

        if (transaction is not null)
        {
            await transaction.Connection!.ExecuteAsync(sql, order, transaction);
            return;
        }

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, order);
    }

    public async Task<Order?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, customer_id, total_price, status, created_at,
                                  shipping_provider_id, shipping_price,
                                  shipping_full_name, shipping_phone, shipping_city,
                                  shipping_district, shipping_address_line, shipping_zip_code
                           FROM orders
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Order>(sql, new { Id = id });
    }

    public async Task<IEnumerable<OrderSummary>> GetAllSummariesAsync()
    {
        const string sql = "SELECT * FROM v_order_summary ORDER BY created_at DESC";

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<OrderSummary>(sql);
    }

    public async Task<IEnumerable<OrderSummary>> GetSummariesByCustomerIdAsync(string customerId)
    {
        const string sql = """
                           SELECT * FROM v_order_summary
                           WHERE customer_id = @CustomerId
                           ORDER BY created_at DESC
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<OrderSummary>(sql, new { CustomerId = customerId });
    }
}