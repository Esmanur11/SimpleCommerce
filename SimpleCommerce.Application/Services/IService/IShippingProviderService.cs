using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services.IService;

public interface IShippingProviderService
{
    Task<IEnumerable<ShippingProviderDto>> GetAllAsync();
}
