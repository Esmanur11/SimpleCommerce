namespace SimpleCommerce.Application.Dtos;

public class CreateCategoryRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string? ParentCategoryId { get; set; }
}