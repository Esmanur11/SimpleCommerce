using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services.IService;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetCategoryTreeAsync();
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequestDto request);
}