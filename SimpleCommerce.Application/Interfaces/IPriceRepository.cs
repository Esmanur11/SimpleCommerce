using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IPriceRepository
{
    Task<Price?> GetActivePriceAsync(string productId);
    Task CreateInitialPriceAsync(Price price);
    Task ChangePriceAsync(string productId, decimal newAmount, string? changedBy);
}