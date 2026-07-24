using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services;

public interface IOrderService
{
    Task<IEnumerable<OrderSummaryDto>> GetAllOrderSummariesAsync();
    Task<IEnumerable<OrderSummaryDto>> GetOrderSummariesByCustomerIdAsync(string customerId);
}