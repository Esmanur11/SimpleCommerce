namespace SimpleCommerce.Application.Dtos;

public class ProductDetailDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public List<ProductVariantDto> Variants { get; set; } = new();
}