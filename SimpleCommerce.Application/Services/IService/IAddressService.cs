using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services.IService;

public interface IAddressService
{
    Task<IEnumerable<AddressDto>> GetAddressesAsync(string customerId);
    Task<AddressDto> AddAddressAsync(CreateAddressRequestDto request);
    Task<string?> GetAddressOwnerCustomerIdAsync(string addressId);
    Task<AddressDto> UpdateAddressAsync(string addressId, UpdateAddressRequestDto request);
    Task DeleteAddressAsync(string addressId);
}