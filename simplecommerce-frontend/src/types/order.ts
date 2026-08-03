export interface OrderSummary {
  orderId: string
  customerName: string
  totalPrice: number
  status: string
  createdAt: string
  shippingProviderName: string
  shippingCity: string
  shippingDistrict: string
  couponCode?: string | null
  discountAmount: number
}
