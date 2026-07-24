using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface ICartRepository
{
    Task<Cart?> GetByIdAsync(string id);
    Task<Cart?> GetByCustomerIdAsync(string customerId);
    Task CreateAsync(Cart cart);
}