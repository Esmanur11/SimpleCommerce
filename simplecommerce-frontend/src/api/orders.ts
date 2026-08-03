import { apiClient } from "./client"
import type { OrderSummary } from "../types/order"

export async function getCustomerOrders(
  customerId: string,
  page = 1,
  pageSize = 20,
): Promise<OrderSummary[]> {
  const res = await apiClient.get<OrderSummary[]>(`/Orders/${customerId}`, { params: { page, pageSize } })
  return res.data
}

export async function getAllOrders(page = 1, pageSize = 20): Promise<OrderSummary[]> {
  const res = await apiClient.get<OrderSummary[]>("/Orders", { params: { page, pageSize } })
  return res.data
}
