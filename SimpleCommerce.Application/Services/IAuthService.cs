using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services;

public interface IAuthService
{
    Task<LoginResultDto> RegisterAsync(RegisterRequestDto request);
    Task<LoginResultDto> LoginAsync(LoginRequestDto request);
    Task<LoginResultDto> AdminLoginAsync(LoginRequestDto request);
}