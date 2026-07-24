using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Services;

namespace SimpleCommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IShopService _shopService;

    public ProductsController(IShopService shopService)
    {
        _shopService = shopService;
    }

    [HttpGet]
    public async Task<IActionResult> GetActiveProducts()
    {
        var products = await _shopService.GetActiveProductsAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductDetail(string id)
    {
        var product = await _shopService.GetProductDetailAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequestDto request)
    {
        var adminId = GetCurrentUserId();
        var product = await _shopService.CreateProductAsync(request, adminId);
        return Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{productId}/variants")]
    public async Task<IActionResult> AddVariant(string productId, [FromBody] CreateVariantRequestDto request)
    {
        try
        {
            var variant = await _shopService.AddVariantAsync(productId, request);
            return Ok(variant);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("variants/{variantId}/stock")]
    public async Task<IActionResult> UpdateVariantStock(string variantId, [FromBody] UpdateStockRequestDto request)
    {
        try
        {
            await _shopService.UpdateVariantStockAsync(variantId, request.NewStockQuantity);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/price")]
    public async Task<IActionResult> UpdatePrice(string id, [FromBody] UpdatePriceRequestDto request)
    {
        try
        {
            var adminId = GetCurrentUserId();
            await _shopService.UpdatePriceAsync(id, request.NewAmount, adminId);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}