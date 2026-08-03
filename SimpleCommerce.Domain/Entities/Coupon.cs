namespace SimpleCommerce.Domain.Entities;

public class Coupon
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public decimal MinCartAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
