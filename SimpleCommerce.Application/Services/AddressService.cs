using System.Text.RegularExpressions;
using SimpleCommerce.Application.Constants;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Application.Services.IService;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _addressRepository;

    private static readonly Regex PhoneRegex = new(@"^0?\d{10}$", RegexOptions.Compiled);
    private static readonly Regex ZipCodeRegex = new(@"^\d{5}$", RegexOptions.Compiled);

    public AddressService(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<IEnumerable<AddressDto>> GetAddressesAsync(string customerId)
    {
        var addresses = await _addressRepository.GetByCustomerIdAsync(customerId);
        return addresses.Select(ToDto);
    }

    public async Task<AddressDto> AddAddressAsync(CreateAddressRequestDto request)
    {
        var normalized = ValidateAndNormalize(
            request.Title, request.FullName, request.Phone, request.City,
            request.District, request.AddressLine, request.ZipCode);

        var address = new Address
        {
            Id = GenerateId("ADDR"),
            CustomerId = request.CustomerId,
            Title = normalized.Title,
            FullName = normalized.FullName,
            Phone = normalized.Phone,
            City = normalized.City,
            District = normalized.District,
            AddressLine = normalized.AddressLine,
            ZipCode = normalized.ZipCode,
            CreatedAt = DateTime.UtcNow
        };

        await _addressRepository.CreateAsync(address);

        return ToDto(address);
    }

    public async Task<string?> GetAddressOwnerCustomerIdAsync(string addressId)
    {
        var address = await _addressRepository.GetByIdAsync(addressId);
        return address?.CustomerId;
    }

    public async Task<AddressDto> UpdateAddressAsync(string addressId, UpdateAddressRequestDto request)
    {
        var address = await _addressRepository.GetByIdAsync(addressId);
        if (address is null)
        {
            throw new KeyNotFoundException($"Adres bulunamadı: {addressId}");
        }

        var normalized = ValidateAndNormalize(
            request.Title, request.FullName, request.Phone, request.City,
            request.District, request.AddressLine, request.ZipCode);

        address.Title = normalized.Title;
        address.FullName = normalized.FullName;
        address.Phone = normalized.Phone;
        address.City = normalized.City;
        address.District = normalized.District;
        address.AddressLine = normalized.AddressLine;
        address.ZipCode = normalized.ZipCode;

        await _addressRepository.UpdateAsync(address);

        return ToDto(address);
    }

    public async Task DeleteAddressAsync(string addressId)
    {
        await _addressRepository.DeleteAsync(addressId);
    }

    private static (string Title, string FullName, string Phone, string City, string District, string AddressLine, string? ZipCode) ValidateAndNormalize(
        string title, string fullName, string phone, string city, string district, string addressLine, string? zipCode)
    {
        title = title.Trim();
        fullName = fullName.Trim();
        phone = phone.Trim();
        city = city.Trim();
        district = district.Trim();
        addressLine = addressLine.Trim();
        zipCode = zipCode?.Trim();

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Adres başlığı gerekli.");
        }
        if (title.Length > 50)
        {
            throw new ArgumentException("Adres başlığı en fazla 50 karakter olabilir.");
        }

        if (string.IsNullOrWhiteSpace(fullName))
        {
            throw new ArgumentException("Ad soyad gerekli.");
        }
        if (fullName.Length > 150)
        {
            throw new ArgumentException("Ad soyad en fazla 150 karakter olabilir.");
        }

        if (string.IsNullOrWhiteSpace(phone))
        {
            throw new ArgumentException("Telefon gerekli.");
        }
        if (!PhoneRegex.IsMatch(phone))
        {
            throw new ArgumentException("Telefon numarası geçerli bir Türkiye telefon numarası olmalıdır (10-11 haneli, sadece rakam).");
        }

        if (string.IsNullOrWhiteSpace(city))
        {
            throw new ArgumentException("Şehir gerekli.");
        }
        if (!TurkeyLocations.IsValidProvince(city))
        {
            throw new ArgumentException("Geçersiz şehir seçimi.");
        }

        if (string.IsNullOrWhiteSpace(district))
        {
            throw new ArgumentException("İlçe gerekli.");
        }
        if (!TurkeyLocations.IsValidDistrict(city, district))
        {
            throw new ArgumentException("Seçilen ilçe, seçilen şehre ait değil.");
        }

        if (string.IsNullOrWhiteSpace(addressLine))
        {
            throw new ArgumentException("Adres gerekli.");
        }
        if (addressLine.Length > 300)
        {
            throw new ArgumentException("Adres en fazla 300 karakter olabilir.");
        }

        if (!string.IsNullOrEmpty(zipCode) && !ZipCodeRegex.IsMatch(zipCode))
        {
            throw new ArgumentException("Posta kodu 5 haneli olmalıdır.");
        }

        if (!string.IsNullOrEmpty(zipCode)
            && TurkeyProvinceCodes.ByProvince.TryGetValue(city, out var provinceCode)
            && !zipCode.StartsWith(provinceCode, StringComparison.Ordinal))
        {
            throw new ArgumentException($"Posta kodu seçilen il ile uyuşmuyor ({city} için {provinceCode}xxx).");
        }

        return (title, fullName, phone, city, district, addressLine, string.IsNullOrEmpty(zipCode) ? null : zipCode);
    }

    private static AddressDto ToDto(Address address) => new()
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

    private static string GenerateId(string prefix)
    {
        var randomPart = Guid.NewGuid().ToString("N")[..12];
        return $"{prefix}-{randomPart}";
    }
}
