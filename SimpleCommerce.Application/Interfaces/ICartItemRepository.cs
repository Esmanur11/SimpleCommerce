using System.Data;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface ICartItemRepository
{
    Task<CartItem?> GetByIdAsync(string id);
    Task<IEnumerable<CartItem>> GetByCartIdAsync(string cartId);
    Task<IEnumerable<CartItemViewDto>> GetDetailedByCartIdAsync(string cartId);
    Task<CartItem?> GetByCartIdAndVariantIdAsync(string cartId, string variantId);
    Task CreateAsync(CartItem cartItem);
    Task UpdateQuantityAsync(string cartItemId, int newQuantity);
    Task DeleteAsync(string cartItemId);
    Task DeleteAllByCartIdAsync(string cartId, IDbTransaction? transaction = null);
}