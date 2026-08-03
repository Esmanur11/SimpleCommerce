using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Services;
using SimpleCommerce.Application.Services.IService;

namespace SimpleCommerce.Api.Controllers;

[ApiController]
[Route("api/favorites")]
[Authorize(Roles = "Customer")]
public class FavoriteController : ApiControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoriteController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpGet("{customerId}")]
    public async Task<IActionResult> GetFavorites(string customerId)
    {
        if (GetAuthenticatedCustomerId() != customerId)
        {
            return Forbid();
        }

        var favorites = await _favoriteService.GetFavoritesAsync(customerId);
        return Ok(favorites);
    }

    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteRequestDto request)
    {
        if (GetAuthenticatedCustomerId() != request.CustomerId)
        {
            return Forbid();
        }

        try
        {
            await _favoriteService.AddFavoriteAsync(request);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{favoriteId}")]
    public async Task<IActionResult> RemoveFavorite(string favoriteId)
    {
        var ownerCustomerId = await _favoriteService.GetFavoriteOwnerCustomerIdAsync(favoriteId);
        if (ownerCustomerId is null)
        {
            return NotFound();
        }

        if (ownerCustomerId != GetAuthenticatedCustomerId())
        {
            return Forbid();
        }

        await _favoriteService.RemoveFavoriteAsync(favoriteId);
        return Ok();
    }
}
