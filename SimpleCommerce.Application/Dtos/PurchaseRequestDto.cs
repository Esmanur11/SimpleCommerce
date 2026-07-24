namespace SimpleCommerce.Application.Dtos;

public class PurchaseRequestDto
{
    public string CustomerId { get; set; } = string.Empty;
    public string VariantId { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string AddressId { get; set; } = string.Empty;
    public string ShippingProviderId { get; set; } = string.Empty;
}