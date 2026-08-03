namespace SimpleCommerce.Application.Dtos;

public class CheckoutRequestDto
{
    public string AddressId { get; set; } = string.Empty;
    public string ShippingProviderId { get; set; } = string.Empty;
    public string? CouponCode { get; set; }
}