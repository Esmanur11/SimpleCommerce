using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services;

public interface IShopService
{
    Task<IEnumerable<ProductListItemDto>> GetActiveProductsAsync();
    Task<PurchaseResultDto> PurchaseAsync(PurchaseRequestDto request);
}