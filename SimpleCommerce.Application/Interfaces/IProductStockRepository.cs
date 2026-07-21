using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IProductStockRepository
{
    Task<ProductStock?> GetByProductIdAsync(string productId);
    Task UpdateQuantityAsync(string productId, int newQuantity);
}