using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Application.Services.IService;

namespace SimpleCommerce.Application.Services;

public class ShippingProviderService : IShippingProviderService
{
    private readonly IShippingProviderRepository _shippingProviderRepository;

    public ShippingProviderService(IShippingProviderRepository shippingProviderRepository)
    {
        _shippingProviderRepository = shippingProviderRepository;
    }

    public async Task<IEnumerable<ShippingProviderDto>> GetAllAsync()
    {
        var providers = await _shippingProviderRepository.GetAllAsync();

        return providers.Select(p => new ShippingProviderDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price
        });
    }
}
