namespace SimpleCommerce.Domain.Entities;

public class ShippingProvider
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}