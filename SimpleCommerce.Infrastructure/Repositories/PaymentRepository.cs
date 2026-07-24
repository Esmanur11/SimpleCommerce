using System.Data;
using Dapper;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;
using SimpleCommerce.Infrastructure.Database;

namespace SimpleCommerce.Infrastructure.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly IConnectionFactory _connectionFactory;

    public PaymentRepository(IConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task CreateAsync(Payment payment, IDbTransaction? transaction = null)
    {
        const string sql = """
                           INSERT INTO payments (id, order_id, amount, payment_status, payment_date)
                           VALUES (@Id, @OrderId, @Amount, @PaymentStatus, @PaymentDate)
                           """;

        if (transaction is not null)
        {
            await transaction.Connection!.ExecuteAsync(sql, payment, transaction);
            return;
        }

        using IDbConnection connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, payment);
    }
}