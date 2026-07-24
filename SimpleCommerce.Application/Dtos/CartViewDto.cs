namespace SimpleCommerce.Application.Dtos;

public class CartViewDto
{
    public string CartId { get; set; } = string.Empty;
    public List<CartItemViewDto> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
}