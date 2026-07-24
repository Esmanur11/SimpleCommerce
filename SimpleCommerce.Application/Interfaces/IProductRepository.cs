using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetActiveProductsAsync();
    Task<Product?> GetByIdAsync(string id);
    Task CreateAsync(Product product);
}