import { apiClient } from "./client"
import type { ValidateCouponRequest, ValidateCouponResponse } from "../types/coupon"

export async function validateCoupon(data: ValidateCouponRequest): Promise<ValidateCouponResponse> {
  const res = await apiClient.post<ValidateCouponResponse>("/coupons/validate", data)
  return res.data
}
