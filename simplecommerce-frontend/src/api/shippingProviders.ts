import { apiClient } from "./client"
import type { ShippingProvider } from "../types/shippingProvider"

export async function getShippingProviders(): Promise<ShippingProvider[]> {
  const res = await apiClient.get<ShippingProvider[]>("/shipping-providers")
  return res.data
}
