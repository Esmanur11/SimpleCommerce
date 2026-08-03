import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { loginCustomer, registerCustomer } from "../api/auth"
import { customerAuthStorage, type StoredAuth } from "../lib/authStorage"
import type { LoginRequest, RegisterRequest } from "../types/auth"

interface CustomerAuthContextValue {
  auth: StoredAuth | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null)

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => customerAuthStorage.get())

  const login = async (data: LoginRequest) => {
    const result = await loginCustomer(data)
    const stored: StoredAuth = {
      token: result.token,
      customerId: result.customerId,
      email: result.email,
      role: result.role,
      firstName: result.firstName,
      lastName: result.lastName,
    }
    customerAuthStorage.set(stored)
    setAuth(stored)
  }

  const register = async (data: RegisterRequest) => {
    const result = await registerCustomer(data)
    const stored: StoredAuth = {
      token: result.token,
      customerId: result.customerId,
      email: result.email,
      role: result.role,
      firstName: result.firstName,
      lastName: result.lastName,
    }
    customerAuthStorage.set(stored)
    setAuth(stored)
  }

  const logout = () => {
    customerAuthStorage.set(null)
    setAuth(null)
  }

  const value = useMemo(() => ({ auth, login, register, logout }), [auth])

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider")
  return ctx
}
