export interface CartItemView {
  cartItemId: string
  productName: string
  size: string
  color: string
  quantity: number
  unitPrice: number
  lineTotal: number
  imageUrl?: string | null
}

export interface CartView {
  cartId: string
  items: CartItemView[]
  totalPrice: number
}

export interface AddToCartRequest {
  customerId: string
  variantId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface CheckoutRequest {
  addressId: string
  shippingProviderId: string
  couponCode?: string | null
}

export interface CheckoutResult {
  orderId: string
  totalPrice: number
  orderStatus: string
  paymentStatus: string
  items: CartItemView[]
  couponCode?: string | null
  discountAmount: number
}
