using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _addressRepository;

    public AddressService(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<IEnumerable<AddressDto>> GetAddressesAsync(string customerId)
    {
        var addresses = await _addressRepository.GetByCustomerIdAsync(customerId);
        return addresses.Select(a => new AddressDto
        {
            Id = a.Id,
            Title = a.Title,
            FullName = a.FullName,
            Phone = a.Phone,
            City = a.City,
            District = a.District,
            AddressLine = a.AddressLine,
            ZipCode = a.ZipCode
        });
    }

    public async Task<AddressDto> AddAddressAsync(CreateAddressRequestDto request)
    {
        var address = new Address
        {
            Id = GenerateId("ADDR"),
            CustomerId = request.CustomerId,
            Title = request.Title,
            FullName = request.FullName,
            Phone = request.Phone,
            City = request.City,
            District = request.District,
            AddressLine = request.AddressLine,
            ZipCode = request.ZipCode,
            CreatedAt = DateTime.UtcNow
        };

        await _addressRepository.CreateAsync(address);

        return new AddressDto
        {
            Id = address.Id,
            Title = address.Title,
            FullName = address.FullName,
            Phone = address.Phone,
            City = address.City,
            District = address.District,
            AddressLine = address.AddressLine,
            ZipCode = address.ZipCode
        };
    }

    private static string GenerateId(string prefix)
    {
        var randomPart = Guid.NewGuid().ToString("N")[..12];
        return $"{prefix}-{randomPart}";
    }
}