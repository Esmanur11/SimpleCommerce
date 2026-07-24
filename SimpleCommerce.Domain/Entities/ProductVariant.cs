namespace SimpleCommerce.Domain.Entities;

public class ProductVariant
{
    public string Id { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public DateTime CreatedAt { get; set; }
}