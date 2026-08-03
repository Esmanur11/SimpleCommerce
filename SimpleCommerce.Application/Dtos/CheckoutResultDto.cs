namespace SimpleCommerce.Application.Dtos;

public class CheckoutResultDto
{
    public string OrderId { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public string OrderStatus { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public List<CartItemViewDto> Items { get; set; } = new();
    public string? CouponCode { get; set; }
    public decimal DiscountAmount { get; set; }
}