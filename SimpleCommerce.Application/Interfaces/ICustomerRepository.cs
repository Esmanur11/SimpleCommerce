using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(string id);
}