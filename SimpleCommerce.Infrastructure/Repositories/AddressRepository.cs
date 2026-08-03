using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class AddressRepository : IAddressRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public AddressRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<Address>> GetByCustomerIdAsync(string customerId)
    {
        const string sql = """
                           SELECT id, customer_id, title, full_name, phone, city, district, address_line, zip_code, created_at
                           FROM v_addresses
                           WHERE customer_id = @CustomerId
                           ORDER BY created_at DESC
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Address>(sql, new { CustomerId = customerId });
    }

    public async Task<Address?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, customer_id, title, full_name, phone, city, district, address_line, zip_code, created_at
                           FROM v_addresses
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Address>(sql, new { Id = id });
    }

    public async Task CreateAsync(Address address)
    {
        const string sql = """
                           INSERT INTO addresses (id, customer_id, title, full_name, phone, city, district, address_line, zip_code, created_at)
                           VALUES (@Id, @CustomerId, @Title, @FullName, @Phone, @City, @District, @AddressLine, @ZipCode, @CreatedAt)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, address);
    }

    public async Task UpdateAsync(Address address)
    {
        const string sql = """
                           UPDATE addresses
                           SET title = @Title, full_name = @FullName, phone = @Phone, city = @City,
                               district = @District, address_line = @AddressLine, zip_code = @ZipCode
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, address);
    }

    public async Task DeleteAsync(string id)
    {
        const string sql = "DELETE FROM addresses WHERE id = @Id";

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, new { Id = id });
    }
}