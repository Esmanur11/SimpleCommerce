using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Services;
using SimpleCommerce.Application.Services.IService;

namespace SimpleCommerce.Api.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize(Roles = "Customer")]
public class CartController : ApiControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet("{customerId}")]
    public async Task<IActionResult> GetCart(string customerId)
    {
        if (GetAuthenticatedCustomerId() != customerId)
        {
            return Forbid();
        }

        var cart = await _cartService.GetCartAsync(customerId);
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddToCartRequestDto request)
    {
        if (GetAuthenticatedCustomerId() != request.CustomerId)
        {
            return Forbid();
        }

        await _cartService.AddItemAsync(request);
        return Ok();
    }

    [HttpPut("items/{cartItemId}")]
    public async Task<IActionResult> UpdateItem(string cartItemId, [FromBody] UpdateCartItemRequestDto request)
    {
        var ownerCustomerId = await _cartService.GetItemOwnerCustomerIdAsync(cartItemId);
        if (ownerCustomerId is null)
        {
            return NotFound();
        }

        if (ownerCustomerId != GetAuthenticatedCustomerId())
        {
            return Forbid();
        }

        try
        {
            await _cartService.UpdateItemQuantityAsync(cartItemId, request.Quantity);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("items/{cartItemId}")]
    public async Task<IActionResult> RemoveItem(string cartItemId)
    {
        var ownerCustomerId = await _cartService.GetItemOwnerCustomerIdAsync(cartItemId);
        if (ownerCustomerId is null)
        {
            return NotFound();
        }

        if (ownerCustomerId != GetAuthenticatedCustomerId())
        {
            return Forbid();
        }

        await _cartService.RemoveItemAsync(cartItemId);
        return Ok();
    }

    [HttpPost("{customerId}/checkout")]
    public async Task<IActionResult> Checkout(string customerId, [FromBody] CheckoutRequestDto request)
    {
        if (GetAuthenticatedCustomerId() != customerId)
        {
            return Forbid();
        }

        try
        {
            var result = await _cartService.CheckoutAsync(customerId, request.AddressId, request.ShippingProviderId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
