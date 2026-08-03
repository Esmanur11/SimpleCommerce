using System.Data;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Application.Services.IService;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public class ShopService : IShopService
{
    private readonly IProductRepository _productRepository;
    private readonly IPriceRepository _priceRepository;
    private readonly IProductVariantRepository _productVariantRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IAddressRepository _addressRepository;
    private readonly IShippingProviderRepository _shippingProviderRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderItemRepository _orderItemRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IConnectionFactory _connectionFactory;

    public ShopService(
        IProductRepository productRepository,
        IPriceRepository priceRepository,
        IProductVariantRepository productVariantRepository,
        ICustomerRepository customerRepository,
        IAddressRepository addressRepository,
        IShippingProviderRepository shippingProviderRepository,
        IOrderRepository orderRepository,
        IOrderItemRepository orderItemRepository,
        IPaymentRepository paymentRepository,
        IConnectionFactory connectionFactory)
    {
        _productRepository = productRepository;
        _priceRepository = priceRepository;
        _productVariantRepository = productVariantRepository;
        _customerRepository = customerRepository;
        _addressRepository = addressRepository;
        _shippingProviderRepository = shippingProviderRepository;
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _paymentRepository = paymentRepository;
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<ProductListItemDto>> GetActiveProductsAsync(int page, int pageSize)
    {
        return await _productRepository.GetActiveProductsAsync(page, pageSize);
    }

    public async Task<ProductDetailDto?> GetProductDetailAsync(string productId)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null) return null;

        var price = await _priceRepository.GetActivePriceAsync(product.Id);
        var variants = await _productVariantRepository.GetByProductIdAsync(product.Id);

        return new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = price?.Amount ?? 0,
            CategoryId = product.CategoryId,
            CategoryName = product.CategoryName,
            Variants = variants.Select(v => new ProductVariantDto
            {
                VariantId = v.Id,
                Size = v.Size,
                Color = v.Color,
                StockQuantity = v.StockQuantity
            }).ToList(),
            ImageUrl = product.ImageUrl
        };
    }

    public async Task<PurchaseResultDto> PurchaseAsync(PurchaseRequestDto request)
    {
        var customerTask = _customerRepository.GetByIdAsync(request.CustomerId);
        var addressTask = _addressRepository.GetByIdAsync(request.AddressId);
        var shippingProviderTask = _shippingProviderRepository.GetByIdAsync(request.ShippingProviderId);
        var variantTask = _productVariantRepository.GetByIdAsync(request.VariantId);

        await Task.WhenAll(customerTask, addressTask, shippingProviderTask, variantTask);

        var customer = customerTask.Result;
        if (customer is null)
        {
            throw new KeyNotFoundException($"Müşteri bulunamadı: {request.CustomerId}");
        }

        var address = addressTask.Result;
        if (address is null || address.CustomerId != request.CustomerId)
        {
            throw new KeyNotFoundException("Adres bulunamadı ya da bu müşteriye ait değil.");
        }

        var shippingProvider = shippingProviderTask.Result;
        if (shippingProvider is null)
        {
            throw new KeyNotFoundException($"Kargo firması bulunamadı: {request.ShippingProviderId}");
        }

        var variant = variantTask.Result;
        if (variant is null)
        {
            throw new KeyNotFoundException($"Varyant bulunamadı: {request.VariantId}");
        }

        if (variant.StockQuantity < request.Quantity)
        {
            throw new InvalidOperationException($"Yetersiz stok: {variant.Size}/{variant.Color}");
        }

        var productTask = _productRepository.GetByIdAsync(variant.ProductId);
        var priceTask = _priceRepository.GetActivePriceAsync(variant.ProductId);
        await Task.WhenAll(productTask, priceTask);

        var product = productTask.Result;
        if (product is null)
        {
            throw new KeyNotFoundException($"Ürün bulunamadı: {variant.ProductId}");
        }

        var price = priceTask.Result;
        if (price is null)
        {
            throw new InvalidOperationException($"Ürünün aktif fiyatı bulunamadı: {product.Id}");
        }

        var now = DateTime.UtcNow;
        var itemsTotal = price.Amount * request.Quantity;
        var totalPrice = itemsTotal + shippingProvider.Price;

        var order = new Order
        {
            Id = GenerateId("ORD"),
            CustomerId = customer.Id,
            TotalPrice = totalPrice,
            Status = "Completed",
            CreatedAt = now,
            ShippingProviderId = shippingProvider.Id,
            ShippingPrice = shippingProvider.Price,
            ShippingFullName = address.FullName,
            ShippingPhone = address.Phone,
            ShippingCity = address.City,
            ShippingDistrict = address.District,
            ShippingAddressLine = address.AddressLine,
            ShippingZipCode = address.ZipCode
        };
        var orderItem = new OrderItem
        {
            Id = GenerateId("ITEM"),
            OrderId = order.Id,
            VariantId = variant.Id,
            Quantity = request.Quantity,
            UnitPrice = price.Amount
        };

        var payment = new Payment
        {
            Id = GenerateId("PAY"),
            OrderId = order.Id,
            Amount = totalPrice,
            PaymentStatus = "Successful",
            PaymentDate = now
        };

        using (IDbConnection connection = _connectionFactory.CreateConnection())
        {
            connection.Open();
            using var transaction = connection.BeginTransaction();

            try
            {
                await _orderRepository.CreateAsync(order, transaction);
                await _orderItemRepository.CreateAsync(orderItem, transaction);

                var newStock = variant.StockQuantity - request.Quantity;
                await _productVariantRepository.UpdateStockAsync(variant.Id, newStock, transaction);

                await _paymentRepository.CreateAsync(payment, transaction);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        return new PurchaseResultDto
        {
            OrderId = order.Id,
            ProductName = product.Name,
            Size = variant.Size,
            Color = variant.Color,
            Quantity = request.Quantity,
            UnitPrice = price.Amount,
            TotalPrice = totalPrice,
            OrderStatus = order.Status,
            PaymentStatus = payment.PaymentStatus
        };
    }

    public async Task<Product> CreateProductAsync(CreateProductRequestDto request, string? createdBy)
    {
        var product = new Product
        {
            Id = GenerateId("PROD"),
            Name = request.Name,
            Description = request.Description,
            CategoryId = request.CategoryId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };
        await _productRepository.CreateAsync(product);

        var price = new Price
        {
            Id = $"PRICE-{Guid.NewGuid().ToString("N")[..12]}",
            ProductId = product.Id,
            Amount = request.InitialPrice,
            ValidFrom = DateTime.UtcNow,
            ValidTo = null,
            IsActive = true,
            ChangedBy = createdBy
        };
        await _priceRepository.CreateInitialPriceAsync(price);

        return product;
    }

    public async Task<ProductVariant> AddVariantAsync(string productId, CreateVariantRequestDto request)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null)
        {
            throw new KeyNotFoundException($"Ürün bulunamadı: {productId}");
        }

        var variant = new ProductVariant
        {
            Id = GenerateId("VAR"),
            ProductId = productId,
            Size = request.Size,
            Color = request.Color,
            StockQuantity = request.StockQuantity,
            CreatedAt = DateTime.UtcNow
        };
        await _productVariantRepository.CreateAsync(variant);

        return variant;
    }

    public async Task UpdateVariantStockAsync(string variantId, int newStockQuantity)
    {
        var variant = await _productVariantRepository.GetByIdAsync(variantId);
        if (variant is null)
        {
            throw new KeyNotFoundException($"Varyant bulunamadı: {variantId}");
        }

        await _productVariantRepository.UpdateStockAsync(variantId, newStockQuantity);
    }

    public async Task UpdatePriceAsync(string productId, decimal newAmount, string? changedBy)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null)
        {
            throw new KeyNotFoundException($"Ürün bulunamadı: {productId}");
        }

        await _priceRepository.ChangePriceAsync(productId, newAmount, changedBy);
    }

    private static string GenerateId(string prefix)
    {
        var randomPart = Guid.NewGuid().ToString("N")[..12];
        return $"{prefix}-{randomPart}";
    }
}