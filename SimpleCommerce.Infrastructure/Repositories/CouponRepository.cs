using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class CouponRepository : ICouponRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public CouponRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Coupon?> GetByCodeAsync(string code)
    {
        const string sql = """
                           SELECT id, code, min_cart_amount, discount_amount, is_active, created_at
                           FROM coupons
                           WHERE code = @Code
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Coupon>(sql, new { Code = code });
    }
}
