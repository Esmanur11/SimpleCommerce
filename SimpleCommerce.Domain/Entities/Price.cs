namespace SimpleCommerce.Domain.Entities;

public class Price
{
    public string Id { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public bool IsActive { get; set; }
    public string? ChangedBy { get; set; }
}