namespace SimpleCommerce.Domain.Entities;

public class OrderItem
{
    public string Id { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty;
    public string VariantId { get; set; } = string.Empty;
    public int Quantity { get; set; } 
    public decimal UnitPrice { get; set; }
}