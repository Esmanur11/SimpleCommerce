using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IOrderItemRepository
{
    Task CreateAsync(OrderItem orderItem);
}