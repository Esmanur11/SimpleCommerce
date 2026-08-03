using System.Data;
using SimpleCommerce.Application.Dtos;
using SimpleCommerce.Application.Interfaces;
using SimpleCommerce.Application.Services.IService;
using SimpleCommerce.Domain.Entities;

namespace SimpleCommerce.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly ICartItemRepository _cartItemRepository;
    private readonly IProductVariantRepository _productVariantRepository;
    private readonly IProductRepository _productRepository;
    private readonly IPriceRepository _priceRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderItemRepository _orderItemRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IAddressRepository _addressRepository;
    private readonly IShippingProviderRepository _shippingProviderRepository;
    private readonly IConnectionFactory _connectionFactory;

    public CartService(
        ICartRepository cartRepository,
        ICartItemRepository cartItemRepository,
        IProductVariantRepository productVariantRepository,
        IProductRepository productRepository,
        IPriceRepository priceRepository,
        ICustomerRepository customerRepository,
        IOrderRepository orderRepository,
        IOrderItemRepository orderItemRepository,
        IPaymentRepository paymentRepository,
        IAddressRepository addressRepository,
        IShippingProviderRepository shippingProviderRepository,
        IConnectionFactory connectionFactory)
    {
        _cartRepository = cartRepository;
        _cartItemRepository = cartItemRepository;
        _productVariantRepository = productVariantRepository;
        _productRepository = productRepository;
        _priceRepository = priceRepository;
        _customerRepository = customerRepository;
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _paymentRepository = paymentRepository;
        _addressRepository = addressRepository;
        _shippingProviderRepository = shippingProviderRepository;
        _connectionFactory = connectionFactory;
    }

    public async Task<CartViewDto> GetCartAsync(string customerId)
    {
        var cart = await GetOrCreateCartAsync(customerId);
        var items = (await _cartItemRepository.GetDetailedByCartIdAsync(cart.Id)).ToList();

        return new CartViewDto
        {
            CartId = cart.Id,
            Items = items,
            TotalPrice = items.Sum(i => i.LineTotal)
        };
    }

    public async Task AddItemAsync(AddToCartRequestDto request)
    {
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId);
        if (customer is null)
        {
            throw new KeyNotFoundException($"Müşteri bulunamadı: {request.CustomerId}");
        }

        var variant = await _productVariantRepository.GetByIdAsync(request.VariantId);
        if (variant is null)
        {
            throw new KeyNotFoundException($"Varyant bulunamadı: {request.VariantId}");
        }

        var cart = await GetOrCreateCartAsync(request.CustomerId);
        var existingItem = await _cartItemRepository.GetByCartIdAndVariantIdAsync(cart.Id, request.VariantId);

        if (existingItem is not null)
        {
            await _cartItemRepository.UpdateQuantityAsync(existingItem.Id, existingItem.Quantity + request.Quantity);
        }
        else
        {
            var newItem = new CartItem
            {
                Id = GenerateId("CI"),
                CartId = cart.Id,
                VariantId = request.VariantId,
                Quantity = request.Quantity,
                CreatedAt = DateTime.UtcNow
            };
            await _cartItemRepository.CreateAsync(newItem);
        }
    }

    public async Task UpdateItemQuantityAsync(string cartItemId, int newQuantity)
    {
        if (newQuantity <= 0)
        {
            throw new ArgumentException("Miktar 0'dan büyük olmalıdır.");
        }

        var item = await _cartItemRepository.GetByIdAsync(cartItemId);
        if (item is null)
        {
            throw new KeyNotFoundException($"Sepet öğesi bulunamadı: {cartItemId}");
        }

        await _cartItemRepository.UpdateQuantityAsync(cartItemId, newQuantity);
    }

    public async Task RemoveItemAsync(string cartItemId)
    {
        await _cartItemRepository.DeleteAsync(cartItemId);
    }

    public async Task<string?> GetItemOwnerCustomerIdAsync(string cartItemId)
    {
        var item = await _cartItemRepository.GetByIdAsync(cartItemId);
        if (item is null) return null;

        var cart = await _cartRepository.GetByIdAsync(item.CartId);
        return cart?.CustomerId;
    }

    public async Task<CheckoutResultDto> CheckoutAsync(string customerId, string addressId, string shippingProviderId)
    {
        var customerTask = _customerRepository.GetByIdAsync(customerId);
        var addressTask = _addressRepository.GetByIdAsync(addressId);
        var shippingProviderTask = _shippingProviderRepository.GetByIdAsync(shippingProviderId);
        var cartTask = _cartRepository.GetByCustomerIdAsync(customerId);

        await Task.WhenAll(customerTask, addressTask, shippingProviderTask, cartTask);

        var customer = customerTask.Result;
        if (customer is null)
        {
            throw new KeyNotFoundException($"Müşteri bulunamadı: {customerId}");
        }

        var address = addressTask.Result;
        if (address is null || address.CustomerId != customerId)
        {
            throw new KeyNotFoundException("Adres bulunamadı ya da bu müşteriye ait değil.");
        }

        var shippingProvider = shippingProviderTask.Result;
        if (shippingProvider is null)
        {
            throw new KeyNotFoundException($"Kargo firması bulunamadı: {shippingProviderId}");
        }

        var cart = cartTask.Result;
        if (cart is null)
        {
            throw new InvalidOperationException("Sepet bulunamadı.");
        }

        var cartItems = (await _cartItemRepository.GetByCartIdAsync(cart.Id)).ToList();
        if (cartItems.Count == 0)
        {
            throw new InvalidOperationException("Sepet boş.");
        }

        var variantIds = cartItems.Select(ci => ci.VariantId).Distinct().ToArray();
        var variantsById = (await _productVariantRepository.GetByIdsAsync(variantIds))
            .ToDictionary(v => v.Id);

        var productIds = variantsById.Values.Select(v => v.ProductId).Distinct().ToArray();
        var productsTask = _productRepository.GetByIdsAsync(productIds);
        var pricesTask = _priceRepository.GetActivePricesAsync(productIds);
        await Task.WhenAll(productsTask, pricesTask);

        var productsById = productsTask.Result.ToDictionary(p => p.Id);
        var pricesByProductId = pricesTask.Result.ToDictionary(p => p.ProductId);

        var variantMap = new Dictionary<string, ProductVariant>();
        var productMap = new Dictionary<string, Product>();
        var priceMap = new Dictionary<string, decimal>();

        foreach (var item in cartItems)
        {
            if (!variantsById.TryGetValue(item.VariantId, out var variant))
            {
                throw new KeyNotFoundException($"Varyant bulunamadı: {item.VariantId}");
            }

            if (variant.StockQuantity < item.Quantity)
            {
                throw new InvalidOperationException($"Yetersiz stok: {variant.Size}/{variant.Color}");
            }

            if (!productsById.TryGetValue(variant.ProductId, out var product))
            {
                throw new KeyNotFoundException($"Ürün bulunamadı: {variant.ProductId}");
            }

            if (!pricesByProductId.TryGetValue(product.Id, out var price))
            {
                throw new InvalidOperationException($"Ürünün aktif fiyatı bulunamadı: {product.Id}");
            }

            variantMap[item.Id] = variant;
            productMap[item.Id] = product;
            priceMap[item.Id] = price.Amount;
        }

        var itemsTotal = cartItems.Sum(ci => priceMap[ci.Id] * ci.Quantity);
        var totalPrice = itemsTotal + shippingProvider.Price;
        var now = DateTime.UtcNow;

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
        var resultItems = new List<CartItemViewDto>();

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

                var orderItems = new List<OrderItem>();
                var stockUpdates = new List<VariantStockUpdate>();

                foreach (var item in cartItems)
                {
                    var variant = variantMap[item.Id];
                    var product = productMap[item.Id];
                    var unitPrice = priceMap[item.Id];

                    orderItems.Add(new OrderItem
                    {
                        Id = GenerateId("ITEM"),
                        OrderId = order.Id,
                        VariantId = variant.Id,
                        Quantity = item.Quantity,
                        UnitPrice = unitPrice
                    });

                    stockUpdates.Add(new VariantStockUpdate
                    {
                        VariantId = variant.Id,
                        NewStockQuantity = variant.StockQuantity - item.Quantity
                    });

                    resultItems.Add(new CartItemViewDto
                    {
                        CartItemId = item.Id,
                        ProductName = product.Name,
                        Size = variant.Size,
                        Color = variant.Color,
                        Quantity = item.Quantity,
                        UnitPrice = unitPrice,
                        LineTotal = unitPrice * item.Quantity,
                        ImageUrl = product.ImageUrl
                    });
                }

                await _orderItemRepository.CreateManyAsync(orderItems, transaction);
                await _productVariantRepository.UpdateStocksAsync(stockUpdates, transaction);

                await _paymentRepository.CreateAsync(payment, transaction);
                await _cartItemRepository.DeleteAllByCartIdAsync(cart.Id, transaction);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        return new CheckoutResultDto
        {
            OrderId = order.Id,
            TotalPrice = totalPrice,
            OrderStatus = order.Status,
            PaymentStatus = payment.PaymentStatus,
            Items = resultItems
        };
    }

    private async Task<Cart> GetOrCreateCartAsync(string customerId)
    {
        var existingCart = await _cartRepository.GetByCustomerIdAsync(customerId);
        if (existingCart is not null)
        {
            return existingCart;
        }

        var newCart = new Cart
        {
            Id = GenerateId("CART"),
            CustomerId = customerId,
            CreatedAt = DateTime.UtcNow
        };
        await _cartRepository.CreateAsync(newCart);
        return newCart;
    }

    private static string GenerateId(string prefix)
    {
        var randomPart = Guid.NewGuid().ToString("N")[..12];
        return $"{prefix}-{randomPart}";
    }
}