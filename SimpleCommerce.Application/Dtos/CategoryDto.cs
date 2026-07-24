namespace SimpleCommerce.Application.Dtos;

public class CategoryDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public List<CategoryDto> Children { get; set; } = new();
}