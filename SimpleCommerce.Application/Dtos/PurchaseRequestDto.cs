namespace SimpleCommerce.Application.Dtos;

public class PurchaseRequestDto
{
    public string CustomerId { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}