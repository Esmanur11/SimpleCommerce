using Microsoft.AspNetCore.Mvc;
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
}