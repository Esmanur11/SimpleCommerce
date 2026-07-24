using System.Data;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IOrderRepository
{
    Task CreateAsync(Order order, IDbTransaction? transaction = null);
    Task<Order?> GetByIdAsync(string id);
    Task<IEnumerable<OrderSummary>> GetAllSummariesAsync();
    Task<IEnumerable<OrderSummary>> GetSummariesByCustomerIdAsync(string customerId);
}