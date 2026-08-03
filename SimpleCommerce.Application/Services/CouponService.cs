using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Application.Services.IService;

namespace SimpleCommerce.Application.Services;

public class CouponService : ICouponService
{
    private readonly ICouponRepository _couponRepository;

    public CouponService(ICouponRepository couponRepository)
    {
        _couponRepository = couponRepository;
    }

    public async Task<ValidateCouponResponseDto> ValidateAsync(string code, decimal cartTotal)
    {
        var normalizedCode = code.Trim().ToUpperInvariant();

        var coupon = await _couponRepository.GetByCodeAsync(normalizedCode);
        if (coupon is null || !coupon.IsActive)
        {
            throw new KeyNotFoundException("Kupon kodu bulunamadı.");
        }

        if (cartTotal < coupon.MinCartAmount)
        {
            throw new ArgumentException(
                $"Bu kuponu kullanmak için sepet tutarı en az {coupon.MinCartAmount:0.##} TL olmalıdır.");
        }

        var finalTotal = Math.Max(0, cartTotal - coupon.DiscountAmount);

        return new ValidateCouponResponseDto
        {
            Code = coupon.Code,
            DiscountAmount = coupon.DiscountAmount,
            FinalTotal = finalTotal
        };
    }
}
