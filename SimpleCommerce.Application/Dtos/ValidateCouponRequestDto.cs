namespace SimpleCommerce.Application.Dtos;

public class ValidateCouponRequestDto
{
    public string Code { get; set; } = string.Empty;
    public decimal CartTotal { get; set; }
}
