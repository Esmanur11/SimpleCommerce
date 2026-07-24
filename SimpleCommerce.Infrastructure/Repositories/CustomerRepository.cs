using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public CustomerRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Customer?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, first_name, last_name, email, phone, password_hash, created_at
                           FROM v_customers
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Customer>(sql, new { Id = id });
    }

    public async Task<Customer?> GetByEmailAsync(string email)
    {
        const string sql = """
                           SELECT id, first_name, last_name, email, phone, password_hash, created_at
                           FROM v_customers
                           WHERE email = @Email
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Customer>(sql, new { Email = email });
    }

    public async Task CreateAsync(Customer customer)
    {
        const string sql = """
                           INSERT INTO customers (id, first_name, last_name, email, phone, password_hash, created_at)
                           VALUES (@Id, @FirstName, @LastName, @Email, @Phone, @PasswordHash, @CreatedAt)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, customer);
    }
}