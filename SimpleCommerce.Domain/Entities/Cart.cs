namespace SimpleCommerce.Domain.Entities;

public class Cart
{
    public string Id { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}