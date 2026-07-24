namespace SimpleCommerce.Domain.Entities;

public class CartItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string CartId { get; set; } = string.Empty;
    public string VariantId { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; }
}