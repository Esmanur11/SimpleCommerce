using System.Data;

namespace SimpleCommerce.Application.Interfaces;

public interface IConnectionFactory
{
    IDbConnection CreateConnection();
}
