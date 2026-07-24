namespace SimpleCommerce.Application.Dtos;

public class AddFavoriteRequestDto
{
    public string CustomerId { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
}