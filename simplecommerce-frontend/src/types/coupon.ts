export interface ValidateCouponRequest {
  code: string
  cartTotal: number
}

export interface ValidateCouponResponse {
  code: string
  discountAmount: number
  finalTotal: number
}
