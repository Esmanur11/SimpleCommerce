using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IFavoriteRepository
{
    Task<Favorite?> GetByIdAsync(string id);
    Task<IEnumerable<Favorite>> GetByCustomerIdAsync(string customerId);
    Task<IEnumerable<FavoriteViewDto>> GetDetailedByCustomerIdAsync(string customerId);
    Task<Favorite?> GetByCustomerIdAndProductIdAsync(string customerId, string productId);
    Task CreateAsync(Favorite favorite);
    Task DeleteAsync(string favoriteId);
}