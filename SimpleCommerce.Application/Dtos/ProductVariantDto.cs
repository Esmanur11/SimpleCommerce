namespace SimpleCommerce.Application.Dtos;

public class ProductVariantDto
{
    public string VariantId { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}