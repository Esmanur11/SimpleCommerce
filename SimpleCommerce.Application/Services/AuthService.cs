using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public class AuthService : IAuthService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(
        ICustomerRepository customerRepository,
        IUserRepository userRepository,
        IConfiguration configuration)
    {
        _customerRepository = customerRepository;
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<LoginResultDto> RegisterAsync(RegisterRequestDto request)
    {
        var existingCustomer = await _customerRepository.GetByEmailAsync(request.Email);
        if (existingCustomer != null)
        {
            throw new InvalidOperationException("Bu e-posta zaten kayıtlı.");
        }

        var customer = new Customer
        {
            Id = GenerateId("CUST"),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };
        await _customerRepository.CreateAsync(customer);

        return GenerateCustomerLoginResult(customer);
    }

    public async Task<LoginResultDto> LoginAsync(LoginRequestDto request)
    {
        var customer = await _customerRepository.GetByEmailAsync(request.Email);
        if (customer == null || !BCrypt.Net.BCrypt.Verify(request.Password, customer.PasswordHash))
        {
            throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");
        }

        return GenerateCustomerLoginResult(customer);
    }

    public async Task<LoginResultDto> AdminLoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");
        }

        return GenerateAdminLoginResult(user);
    }

    private LoginResultDto GenerateCustomerLoginResult(Customer customer)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, customer.Id),
            new("customerId", customer.Id),
            new(ClaimTypes.Name, customer.Email),
            new(ClaimTypes.Role, "Customer")
        };

        return new LoginResultDto
        {
            Token = GenerateToken(claims),
            CustomerId = customer.Id,
            Email = customer.Email,
            Role = "Customer"
        };
    }

    private LoginResultDto GenerateAdminLoginResult(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(ClaimTypes.Name, user.Email),
            new(ClaimTypes.Role, user.Role)
        };

        return new LoginResultDto
        {
            Token = GenerateToken(claims),
            CustomerId = string.Empty,
            Email = user.Email,
            Role = user.Role
        };
    }

    private string GenerateToken(List<Claim> claims)
    {
        var jwtKey = _configuration["Jwt:Key"]!;
        var jwtIssuer = _configuration["Jwt:Issuer"]!;
        var jwtAudience = _configuration["Jwt:Audience"]!;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateId(string prefix)
    {
        return $"{prefix}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
    }
}