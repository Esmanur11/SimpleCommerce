using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetCategoryTreeAsync();
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequestDto request);
}