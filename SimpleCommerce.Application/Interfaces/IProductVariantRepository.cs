using System.Data;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IProductVariantRepository
{
    Task<IEnumerable<ProductVariant>> GetByProductIdAsync(string productId);
    Task<ProductVariant?> GetByIdAsync(string id);
    Task<IEnumerable<ProductVariant>> GetByIdsAsync(IEnumerable<string> ids);
    Task UpdateStockAsync(string variantId, int newStockQuantity, IDbTransaction? transaction = null);
    Task UpdateStocksAsync(IEnumerable<VariantStockUpdate> updates, IDbTransaction? transaction = null);
    Task CreateAsync(ProductVariant variant);
}