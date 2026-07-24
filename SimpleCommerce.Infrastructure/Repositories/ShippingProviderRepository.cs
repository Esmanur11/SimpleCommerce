using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class ShippingProviderRepository : IShippingProviderRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public ShippingProviderRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<ShippingProvider?> GetByIdAsync(string id)
    {
        const string sql = "SELECT id, name, price FROM shipping_providers WHERE id = @Id";

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<ShippingProvider>(sql, new { Id = id });
    }

    public async Task<IEnumerable<ShippingProvider>> GetAllAsync()
    {
        const string sql = "SELECT id, name, price FROM shipping_providers";

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<ShippingProvider>(sql);
    }
}