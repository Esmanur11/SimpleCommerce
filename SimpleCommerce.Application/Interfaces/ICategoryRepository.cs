using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
    Task CreateAsync(Category category);
}