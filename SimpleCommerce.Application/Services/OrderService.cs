using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;

namespace SimpleCommerce.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<IEnumerable<OrderSummaryDto>> GetAllOrderSummariesAsync()
    {
        var summaries = await _orderRepository.GetAllSummariesAsync();
        return summaries.Select(MapToDto);
    }

    public async Task<IEnumerable<OrderSummaryDto>> GetOrderSummariesByCustomerIdAsync(string customerId)
    {
        var summaries = await _orderRepository.GetSummariesByCustomerIdAsync(customerId);
        return summaries.Select(MapToDto);
    }

    private static OrderSummaryDto MapToDto(Domain.Entities.OrderSummary s)
    {
        return new OrderSummaryDto
        {
            OrderId = s.OrderId,
            CustomerName = s.CustomerName,
            TotalPrice = s.TotalPrice,
            Status = s.Status,
            CreatedAt = s.CreatedAt,
            ShippingProviderName = s.ShippingProviderName,
            ShippingCity = s.ShippingCity,
            ShippingDistrict = s.ShippingDistrict
        };
    }
}