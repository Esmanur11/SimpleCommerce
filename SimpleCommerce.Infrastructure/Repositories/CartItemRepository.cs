using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class CartItemRepository : ICartItemRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public CartItemRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<CartItem?> GetByIdAsync(string id)
    {
        const string sql = """
                           SELECT id, cart_id, variant_id, quantity, created_at
                           FROM cart_items
                           WHERE id = @Id
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<CartItem>(sql, new { Id = id });
    }

    public async Task<IEnumerable<CartItem>> GetByCartIdAsync(string cartId)
    {
        const string sql = """
                           SELECT cart_item_id AS id, cart_id, variant_id, quantity
                           FROM v_cart_items_detail
                           WHERE cart_id = @CartId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<CartItem>(sql, new { CartId = cartId });
    }

    public async Task<CartItem?> GetByCartIdAndVariantIdAsync(string cartId, string variantId)
    {
        const string sql = """
                           SELECT cart_item_id AS id, cart_id, variant_id, quantity
                           FROM v_cart_items_detail
                           WHERE cart_id = @CartId AND variant_id = @VariantId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<CartItem>(sql, new { CartId = cartId, VariantId = variantId });
    }

    public async Task CreateAsync(CartItem cartItem)
    {
        const string sql = """
                           INSERT INTO cart_items (id, cart_id, variant_id, quantity)
                           VALUES (@Id, @CartId, @VariantId, @Quantity)
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, cartItem);
    }

    public async Task UpdateQuantityAsync(string cartItemId, int newQuantity)
    {
        const string sql = """
                           UPDATE cart_items
                           SET quantity = @NewQuantity
                           WHERE id = @CartItemId
                           """;

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, new { CartItemId = cartItemId, NewQuantity = newQuantity });
    }

    public async Task DeleteAsync(string cartItemId)
    {
        const string sql = "DELETE FROM cart_items WHERE id = @CartItemId";

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, new { CartItemId = cartItemId });
    }

    public async Task DeleteAllByCartIdAsync(string cartId, IDbTransaction? transaction = null)
    {
        const string sql = "DELETE FROM cart_items WHERE cart_id = @CartId";

        if (transaction is not null)
        {
            await transaction.Connection!.ExecuteAsync(sql, new { CartId = cartId }, transaction);
            return;
        }

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, new { CartId = cartId });
    }
}