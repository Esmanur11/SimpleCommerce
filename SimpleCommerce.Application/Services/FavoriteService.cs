using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly IProductRepository _productRepository;
    private readonly IPriceRepository _priceRepository;

    public FavoriteService(
        IFavoriteRepository favoriteRepository,
        IProductRepository productRepository,
        IPriceRepository priceRepository)
    {
        _favoriteRepository = favoriteRepository;
        _productRepository = productRepository;
        _priceRepository = priceRepository;
    }

    public async Task<IEnumerable<FavoriteViewDto>> GetFavoritesAsync(string customerId)
    {
        var favorites = await _favoriteRepository.GetByCustomerIdAsync(customerId);
        var result = new List<FavoriteViewDto>();

        foreach (var favorite in favorites)
        {
            var product = await _productRepository.GetByIdAsync(favorite.ProductId);
            if (product == null) continue;

            var price = await _priceRepository.GetActivePriceAsync(product.Id);

            result.Add(new FavoriteViewDto
            {
                FavoriteId = favorite.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                Price = price?.Amount ?? 0
            });
        }

        return result;
    }

    public async Task AddFavoriteAsync(AddFavoriteRequestDto request)
    {
        var existing = await _favoriteRepository.GetByCustomerIdAndProductIdAsync(request.CustomerId, request.ProductId);
        if (existing != null)
        {
            throw new InvalidOperationException("Bu ürün zaten favorilerinizde.");
        }

        var favorite = new Favorite
        {
            Id = GenerateId("FAV"),
            CustomerId = request.CustomerId,
            ProductId = request.ProductId,
            CreatedAt = DateTime.UtcNow
        };

        await _favoriteRepository.CreateAsync(favorite);
    }

    public async Task RemoveFavoriteAsync(string favoriteId)
    {
        await _favoriteRepository.DeleteAsync(favoriteId);
    }

    public async Task<string?> GetFavoriteOwnerCustomerIdAsync(string favoriteId)
    {
        var favorite = await _favoriteRepository.GetByIdAsync(favoriteId);
        return favorite?.CustomerId;
    }

    private static string GenerateId(string prefix)
    {
        return $"{prefix}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
    }
}