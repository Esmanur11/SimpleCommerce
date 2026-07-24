namespace SimpleCommerce.Application.Dtos;

public class ShippingProviderDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
