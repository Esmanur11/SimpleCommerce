namespace SimpleCommerce.Application.Dtos;

public class FavoriteViewDto
{
    public string FavoriteId { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}