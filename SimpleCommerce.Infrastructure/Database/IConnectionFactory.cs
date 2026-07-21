using System.Data;

namespace SimpleCommerce.Infrastructure.Database;

public interface IConnectionFactory
{
    IDbConnection CreateConnection();
}
