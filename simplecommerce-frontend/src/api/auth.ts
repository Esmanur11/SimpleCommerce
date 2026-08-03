import { apiClient } from "./client"
import type { LoginRequest, LoginResult, RegisterRequest } from "../types/auth"

export async function registerCustomer(data: RegisterRequest): Promise<LoginResult> {
  const res = await apiClient.post<LoginResult>("/auth/register", data)
  return res.data
}

export async function loginCustomer(data: LoginRequest): Promise<LoginResult> {
  const res = await apiClient.post<LoginResult>("/auth/login", data)
  return res.data
}

export async function loginAdmin(data: LoginRequest): Promise<LoginResult> {
  const res = await apiClient.post<LoginResult>("/auth/admin-login", data)
  return res.data
}
