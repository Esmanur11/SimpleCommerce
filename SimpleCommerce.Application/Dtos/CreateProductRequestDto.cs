namespace SimpleCommerce.Application.Dtos;

public class CreateProductRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public decimal InitialPrice { get; set; }
}