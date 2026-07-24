namespace SimpleCommerce.Application.Dtos;

public class OrderSummaryDto
{
    public string OrderId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string ShippingProviderName { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingDistrict { get; set; } = string.Empty;
}