import { apiClient } from "./client"
import type { Address, CreateAddressRequest, UpdateAddressRequest } from "../types/address"

export async function getAddresses(customerId: string): Promise<Address[]> {
  const res = await apiClient.get<Address[]>(`/addresses/${customerId}`)
  return res.data
}

export async function createAddress(data: CreateAddressRequest): Promise<Address> {
  const res = await apiClient.post<Address>("/addresses", data)
  return res.data
}

export async function updateAddress(id: string, data: UpdateAddressRequest): Promise<Address> {
  const res = await apiClient.put<Address>(`/addresses/${id}`, data)
  return res.data
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(`/addresses/${id}`)
}
