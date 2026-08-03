namespace SimpleCommerce.Application.Dtos;

public class CouponDto
{
    public string Code { get; set; } = string.Empty;
    public decimal MinCartAmount { get; set; }
    public decimal DiscountAmount { get; set; }
}
