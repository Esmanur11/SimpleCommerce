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
                               shipping_district, shipping_address_line, shipping_zip_code,
                               coupon_code, discount_amount)
                           VALUES (
                               @Id, @CustomerId, @TotalPrice, @Status, @CreatedAt,
                               @ShippingProviderId, @ShippingPrice,
                               @ShippingFullName, @ShippingPhone, @ShippingCity,
                               @ShippingDistrict, @ShippingAddressLine, @ShippingZipCode,
                               @CouponCode, @DiscountAmount)
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
                                  shipping_district, shipping_address_line, shipping_zip_code,
                                  coupon_code, discount_amount
                           FROM orders
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Order>(sql, new { Id = id });
    }

    public async Task<IEnumerable<OrderSummary>> GetAllSummariesAsync(int page, int pageSize)
    {
        const string sql = """
                           SELECT order_id, customer_id, customer_name, total_price, status, created_at,
                                  shipping_provider_name, shipping_city, shipping_district,
                                  coupon_code, discount_amount
                           FROM v_order_summary
                           ORDER BY created_at DESC, order_id DESC
                           LIMIT @PageSize OFFSET @Offset
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<OrderSummary>(sql, new { PageSize = pageSize, Offset = (page - 1) * pageSize });
    }

    public async Task<IEnumerable<OrderSummary>> GetSummariesByCustomerIdAsync(string customerId, int page, int pageSize)
    {
        const string sql = """
                           SELECT order_id, customer_id, customer_name, total_price, status, created_at,
                                  shipping_provider_name, shipping_city, shipping_district,
                                  coupon_code, discount_amount
                           FROM v_order_summary
                           WHERE customer_id = @CustomerId
                           ORDER BY created_at DESC, order_id DESC
                           LIMIT @PageSize OFFSET @Offset
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<OrderSummary>(sql, new { CustomerId = customerId, PageSize = pageSize, Offset = (page - 1) * pageSize });
    }
}