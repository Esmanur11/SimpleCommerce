using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public UserRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        const string sql = """
                           SELECT id, email, password_hash, role, created_at
                           FROM v_users
                           WHERE email = @Email
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, email, password_hash, role, created_at
                           FROM v_users
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Id = id });
    }

    public async Task CreateAsync(User user)
    {
        const string sql = """
                           INSERT INTO users (id, email, password_hash, role, created_at)
                           VALUES (@Id, @Email, @PasswordHash, @Role, @CreatedAt)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, user);
    }
}