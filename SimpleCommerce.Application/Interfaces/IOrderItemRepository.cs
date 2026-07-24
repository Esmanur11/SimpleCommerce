using System.Data;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IOrderItemRepository
{
    Task CreateAsync(OrderItem orderItem, IDbTransaction? transaction = null);
}