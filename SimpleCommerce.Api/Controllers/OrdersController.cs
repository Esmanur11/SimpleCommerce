using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Services;
using SimpleCommerce.Application.Services.IService;

namespace SimpleCommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ApiControllerBase
{
    private readonly IShopService _shopService;
    private readonly IOrderService _orderService;

    public OrdersController(IShopService shopService, IOrderService orderService)
    {
        _shopService = shopService;
        _orderService = orderService;
    }

    [HttpPost("purchase")]
    public async Task<IActionResult> Purchase([FromBody] PurchaseRequestDto request)
    {
        try
        {
            var result = await _shopService.PurchaseAsync(request);
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

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var orders = await _orderService.GetAllOrderSummariesAsync(page, pageSize);
        return Ok(orders);
    }

    [Authorize(Roles = "Customer")]
    [HttpGet("{customerId}")]
    public async Task<IActionResult> GetCustomerOrders(string customerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (GetAuthenticatedCustomerId() != customerId)
        {
            return Forbid();
        }

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var orders = await _orderService.GetOrderSummariesByCustomerIdAsync(customerId, page, pageSize);
        return Ok(orders);
    }
}
