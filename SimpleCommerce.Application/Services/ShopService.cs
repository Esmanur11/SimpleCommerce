using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public class ShopService : IShopService
{
    private readonly IProductRepository _productRepository;
    private readonly IProductStockRepository _productStockRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderItemRepository _orderItemRepository;
    private readonly IPaymentRepository _paymentRepository;

    public ShopService(
        IProductRepository productRepository,
        IProductStockRepository productStockRepository,
        ICustomerRepository customerRepository,
        IOrderRepository orderRepository,
        IOrderItemRepository orderItemRepository,
        IPaymentRepository paymentRepository)
    {
        _productRepository = productRepository;
        _productStockRepository = productStockRepository;
        _customerRepository = customerRepository;
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _paymentRepository = paymentRepository;
    }

    public async Task<IEnumerable<ProductListItemDto>> GetActiveProductsAsync()
    {
        var products = await _productRepository.GetActiveProductsAsync();
        var result = new List<ProductListItemDto>();

        foreach (var product in products)
        {
            var stock = await _productStockRepository.GetByProductIdAsync(product.Id);

            result.Add(new ProductListItemDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = stock?.Quantity ?? 0
            });
        }

        return result;
    }

    public async Task<PurchaseResultDto> PurchaseAsync(PurchaseRequestDto request)
    {
        if (request.Quantity <= 0)
        {
            throw new ArgumentException("Adet 0'dan büyük olmalı.", nameof(request.Quantity));
        }

        var customer = await _customerRepository.GetByIdAsync(request.CustomerId);
        if (customer is null)
        {
            throw new KeyNotFoundException($"Müşteri bulunamadı: {request.CustomerId}");
        }

        var product = await _productRepository.GetByIdAsync(request.ProductId);
        if (product is null || !product.IsActive)
        {
            throw new KeyNotFoundException($"Ürün bulunamadı veya aktif değil: {request.ProductId}");
        }

        var stock = await _productStockRepository.GetByProductIdAsync(request.ProductId);
        if (stock is null || stock.Quantity < request.Quantity)
        {
            throw new InvalidOperationException(
                $"Yetersiz stok. Mevcut: {stock?.Quantity ?? 0}, istenen: {request.Quantity}");
        }

        var totalPrice = product.Price * request.Quantity;
        var now = DateTime.UtcNow;

        var order = new Order
        {
            Id = GenerateId("ORD"),
            CustomerId = customer.Id,
            TotalPrice = totalPrice,
            Status = "Completed",
            CreatedAt = now
        };
        await _orderRepository.CreateAsync(order);

        var orderItem = new OrderItem
        {
            Id = GenerateId("ITEM"),
            OrderId = order.Id,
            ProductId = product.Id,
            Quantity = request.Quantity,
            UnitPrice = product.Price
        };
        await _orderItemRepository.CreateAsync(orderItem);

        var newQuantity = stock.Quantity - request.Quantity;
        await _productStockRepository.UpdateQuantityAsync(product.Id, newQuantity);

        var payment = new Payment
        {
            Id = GenerateId("PAY"),
            OrderId = order.Id,
            Amount = totalPrice,
            PaymentStatus = "Successful",
            PaymentDate = now
        };
        await _paymentRepository.CreateAsync(payment);

        return new PurchaseResultDto
        {
            OrderId = order.Id,
            ProductName = product.Name,
            Quantity = request.Quantity,
            UnitPrice = product.Price,
            TotalPrice = totalPrice,
            OrderStatus = order.Status,
            PaymentStatus = payment.PaymentStatus
        };
    }

    private static string GenerateId(string prefix)
    {
        var randomPart = Guid.NewGuid().ToString("N")[..12];
        return $"{prefix}-{randomPart}";
    }
}