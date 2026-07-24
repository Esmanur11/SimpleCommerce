namespace SimpleCommerce.Application.Dtos;

public class LoginResultDto
{
    public string Token { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}