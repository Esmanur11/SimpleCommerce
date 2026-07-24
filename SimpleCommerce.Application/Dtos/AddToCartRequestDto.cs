namespace SimpleCommerce.Application.Dtos;

public class AddToCartRequestDto
{
    public string CustomerId { get; set; } = string.Empty;
    public string VariantId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}