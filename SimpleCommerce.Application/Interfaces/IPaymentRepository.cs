using System.Data;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Interfaces;

public interface IPaymentRepository
{
    Task CreateAsync(Payment payment, IDbTransaction? transaction = null);
}