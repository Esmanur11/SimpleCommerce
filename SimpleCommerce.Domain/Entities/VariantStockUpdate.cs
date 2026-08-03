namespace SimpleCommerce.Domain.Entities;

public class VariantStockUpdate
{
    public string VariantId { get; set; } = string.Empty;
    public int NewStockQuantity { get; set; }
}
