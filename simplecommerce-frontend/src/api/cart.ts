import { apiClient } from "./client"
import type {
  AddToCartRequest,
  CartView,
  CheckoutRequest,
  CheckoutResult,
  UpdateCartItemRequest,
} from "../types/cart"

export async function getCart(customerId: string): Promise<CartView> {
  const res = await apiClient.get<CartView>(`/cart/${customerId}`)
  return res.data
}

export async function addCartItem(data: AddToCartRequest): Promise<void> {
  await apiClient.post("/cart/items", data)
}

export async function updateCartItem(cartItemId: string, data: UpdateCartItemRequest): Promise<void> {
  await apiClient.put(`/cart/items/${cartItemId}`, data)
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  await apiClient.delete(`/cart/items/${cartItemId}`)
}

export async function checkoutCart(customerId: string, data: CheckoutRequest): Promise<CheckoutResult> {
  const res = await apiClient.post<CheckoutResult>(`/cart/${customerId}/checkout`, data)
  return res.data
}
