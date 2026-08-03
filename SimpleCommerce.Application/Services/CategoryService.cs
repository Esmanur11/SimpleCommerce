using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Application.Services.IService;

namespace SimpleCommerce.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoryTreeAsync()
    {
        var categories = (await _categoryRepository.GetAllAsync()).ToList();
        var childrenByParentId = categories
            .Where(c => c.ParentCategoryId != null)
            .ToLookup(c => c.ParentCategoryId!);

        var roots = categories.Where(c => c.ParentCategoryId == null);

        return roots.Select(root => BuildNode(root, childrenByParentId));
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequestDto request)
    {
        var category = new Domain.Entities.Category
        {
            Id = GenerateId("CAT"),
            Name = request.Name,
            ParentCategoryId = request.ParentCategoryId
        };
        await _categoryRepository.CreateAsync(category);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Children = new List<CategoryDto>()
        };
    }

    private static CategoryDto BuildNode(
        Domain.Entities.Category category,
        ILookup<string, Domain.Entities.Category> childrenByParentId)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Children = childrenByParentId[category.Id]
                .Select(child => BuildNode(child, childrenByParentId))
                .ToList()
        };
    }

    private static string GenerateId(string prefix)
    {
        return $"{prefix}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
    }
}