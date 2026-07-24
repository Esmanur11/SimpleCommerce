using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IShippingProviderRepository
{
    Task<ShippingProvider?> GetByIdAsync(string id);
    Task<IEnumerable<ShippingProvider>> GetAllAsync();
}