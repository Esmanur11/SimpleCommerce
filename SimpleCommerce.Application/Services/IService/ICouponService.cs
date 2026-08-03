using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services.IService;

public interface ICouponService
{
    Task<ValidateCouponResponseDto> ValidateAsync(string code, decimal cartTotal);
}
