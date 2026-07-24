using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public interface IShopService
{
    Task<IEnumerable<ProductListItemDto>> GetActiveProductsAsync();
    Task<ProductDetailDto?> GetProductDetailAsync(string productId);
    Task<PurchaseResultDto> PurchaseAsync(PurchaseRequestDto request);
    Task<Product> CreateProductAsync(CreateProductRequestDto request, string? createdBy);
    Task<ProductVariant> AddVariantAsync(string productId, CreateVariantRequestDto request);
    Task UpdateVariantStockAsync(string variantId, int newStockQuantity);
    Task UpdatePriceAsync(string productId, decimal newAmount, string? changedBy);
}