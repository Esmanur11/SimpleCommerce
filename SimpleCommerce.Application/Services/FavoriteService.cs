using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Application.Services.IService;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;

    public FavoriteService(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<IEnumerable<FavoriteViewDto>> GetFavoritesAsync(string customerId)
    {
        return await _favoriteRepository.GetDetailedByCustomerIdAsync(customerId);
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