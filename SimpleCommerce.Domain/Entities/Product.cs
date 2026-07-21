namespace SimpleCommerce.Domain.Entities;

public class Product
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; } 
    public bool IsActive { get; set; } 
    public DateTime CreatedAt { get; set; } 
}