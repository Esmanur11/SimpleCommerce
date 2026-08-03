using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Services;
using SimpleCommerce.Application.Services.IService;

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

        try
        {
            var address = await _addressService.AddAddressAsync(request);
            return Ok(address);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAddress(string id, [FromBody] UpdateAddressRequestDto request)
    {
        var ownerCustomerId = await _addressService.GetAddressOwnerCustomerIdAsync(id);
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
            var address = await _addressService.UpdateAddressAsync(id, request);
            return Ok(address);
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAddress(string id)
    {
        var ownerCustomerId = await _addressService.GetAddressOwnerCustomerIdAsync(id);
        if (ownerCustomerId is null)
        {
            return NotFound();
        }

        if (ownerCustomerId != GetAuthenticatedCustomerId())
        {
            return Forbid();
        }

        await _addressService.DeleteAddressAsync(id);
        return Ok();
    }
}
