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

    private static readonly Regex PhoneRegex = new(@"^0?\d{10}$", RegexOptions.Compiled);
    private static readonly Regex ZipCodeRegex = new(@"^\d{5}$", RegexOptions.Compiled);

    public async Task<AddressDto> AddAddressAsync(CreateAddressRequestDto request)
    {
        var title = request.Title.Trim();
        var fullName = request.FullName.Trim();
        var phone = request.Phone.Trim();
        var city = request.City.Trim();
        var district = request.District.Trim();
        var addressLine = request.AddressLine.Trim();
        var zipCode = request.ZipCode?.Trim();

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

        var address = new Address
        {
            Id = GenerateId("ADDR"),
            CustomerId = request.CustomerId,
            Title = title,
            FullName = fullName,
            Phone = phone,
            City = city,
            District = district,
            AddressLine = addressLine,
            ZipCode = string.IsNullOrEmpty(zipCode) ? null : zipCode,
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