using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Services;

namespace SimpleCommerce.Api.Controllers;

[ApiController]
[Route("api/addresses")]
[Authorize(Roles = "Customer")]
public class AddressController : ApiControllerBase
{
    private readonly IAddressService _addressService;

    public AddressController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    [HttpGet("{customerId}")]
    public async Task<IActionResult> GetAddresses(string customerId)
    {
        if (GetAuthenticatedCustomerId() != customerId)
        {
            return Forbid();
        }

        var addresses = await _addressService.GetAddressesAsync(customerId);
        return Ok(addresses);
    }

    [HttpPost]
    public async Task<IActionResult> AddAddress([FromBody] CreateAddressRequestDto request)
    {
        if (GetAuthenticatedCustomerId() != request.CustomerId)
        {
            return Forbid();
        }

        var address = await _addressService.AddAddressAsync(request);
        return Ok(address);
    }
}
