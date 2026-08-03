using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<ProductListItemDto>> GetActiveProductsAsync(int page, int pageSize);
    Task<Product?> GetByIdAsync(string id);
    Task<IEnumerable<Product>> GetByIdsAsync(IEnumerable<string> ids);
    Task CreateAsync(Product product);
}