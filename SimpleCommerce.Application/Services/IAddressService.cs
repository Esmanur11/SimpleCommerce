using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services;

public interface IAddressService
{
    Task<IEnumerable<AddressDto>> GetAddressesAsync(string customerId);
    Task<AddressDto> AddAddressAsync(CreateAddressRequestDto request);
}