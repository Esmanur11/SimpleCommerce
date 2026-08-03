using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services.IService;

public interface ICartService
{
    Task<CartViewDto> GetCartAsync(string customerId);
    Task AddItemAsync(AddToCartRequestDto request);
    Task UpdateItemQuantityAsync(string cartItemId, int newQuantity);
    Task RemoveItemAsync(string cartItemId);
    Task<CheckoutResultDto> CheckoutAsync(string customerId, string addressId, string shippingProviderId);
    Task<string?> GetItemOwnerCustomerIdAsync(string cartItemId);
}