using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services;

public interface IShippingProviderService
{
    Task<IEnumerable<ShippingProviderDto>> GetAllAsync();
}
