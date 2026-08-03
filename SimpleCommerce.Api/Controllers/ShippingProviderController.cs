using Microsoft.AspNetCore.Mvc;
using SimpleCommerce.Application.Services;
using SimpleCommerce.Application.Services.IService;

namespace SimpleCommerce.Api.Controllers;

[ApiController]
[Route("api/shipping-providers")]
public class ShippingProviderController : ControllerBase
{
    private readonly IShippingProviderService _shippingProviderService;

    public ShippingProviderController(IShippingProviderService shippingProviderService)
    {
        _shippingProviderService = shippingProviderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetShippingProviders()
    {
        var providers = await _shippingProviderService.GetAllAsync();
        return Ok(providers);
    }
}
