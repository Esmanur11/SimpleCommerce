namespace SimpleCommerce.Application.Dtos;

public class AddressDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string? ZipCode { get; set; }
}