namespace SimpleCommerce.Application.Dtos;

public class ValidateCouponResponseDto
{
    public string Code { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public decimal FinalTotal { get; set; }
}
