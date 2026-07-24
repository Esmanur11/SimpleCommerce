namespace SimpleCommerce.Application.Dtos;

public class CreateVariantRequestDto
{
    public string Size { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}