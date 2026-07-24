namespace SimpleCommerce.Domain.Entities;

public class Favorite
{
    public string Id { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}