using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services.IService;

public interface IFavoriteService
{
    Task<IEnumerable<FavoriteViewDto>> GetFavoritesAsync(string customerId);
    Task AddFavoriteAsync(AddFavoriteRequestDto request);
    Task RemoveFavoriteAsync(string favoriteId);
    Task<string?> GetFavoriteOwnerCustomerIdAsync(string favoriteId);
}