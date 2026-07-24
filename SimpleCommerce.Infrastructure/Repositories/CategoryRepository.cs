using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public CategoryRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        const string sql = "SELECT id, name, parent_category_id FROM v_categories";

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<Category>(sql);
    }

    public async Task CreateAsync(Category category)
    {
        const string sql = """
                           INSERT INTO categories (id, name, parent_category_id)
                           VALUES (@Id, @Name, @ParentCategoryId)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, category);
    }
}