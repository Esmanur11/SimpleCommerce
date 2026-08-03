using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IAddressRepository
{
    Task<IEnumerable<Address>> GetByCustomerIdAsync(string customerId);
    Task<Address?> GetByIdAsync(string id);
    Task CreateAsync(Address address);
    Task UpdateAsync(Address address);
    Task DeleteAsync(string id);
}