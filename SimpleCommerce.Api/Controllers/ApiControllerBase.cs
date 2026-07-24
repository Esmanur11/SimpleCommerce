using Microsoft.AspNetCore.Mvc;

namespace SimpleCommerce.Api.Controllers;

public abstract class ApiControllerBase : ControllerBase
{
    protected string? GetAuthenticatedCustomerId()
    {
        return User.FindFirst("customerId")?.Value;
    }
}
