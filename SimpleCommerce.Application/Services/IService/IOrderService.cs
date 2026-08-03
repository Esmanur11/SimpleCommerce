using SimpleCommerce.Application.Dtos;

namespace SimpleCommerce.Application.Services.IService;

public interface IOrderService
{
    Task<IEnumerable<OrderSummaryDto>> GetAllOrderSummariesAsync(int page, int pageSize);
    Task<IEnumerable<OrderSummaryDto>> GetOrderSummariesByCustomerIdAsync(string customerId, int page, int pageSize);
}