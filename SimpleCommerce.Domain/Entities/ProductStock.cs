namespace SimpleCommerce.Domain.Entities;

public class ProductStock
{
    public string Id { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public int Quantity { get; set; } 
}