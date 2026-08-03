using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services.IService;

public interface IAuthService
{
    Task<LoginResultDto> RegisterAsync(RegisterRequestDto request);
    Task<LoginResultDto> LoginAsync(LoginRequestDto request);
    Task<LoginResultDto> AdminLoginAsync(LoginRequestDto request);
}