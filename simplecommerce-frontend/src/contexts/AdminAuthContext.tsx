import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { loginAdmin } from "../api/auth"
import { adminAuthStorage, type StoredAuth } from "../lib/authStorage"
import type { LoginRequest } from "../types/auth"

interface AdminAuthContextValue {
  auth: StoredAuth | null
  login: (data: LoginRequest) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => adminAuthStorage.get())

  const login = async (data: LoginRequest) => {
    const result = await loginAdmin(data)
    const stored: StoredAuth = {
      token: result.token,
      customerId: result.customerId,
      email: result.email,
      role: result.role,
      firstName: result.firstName,
      lastName: result.lastName,
    }
    adminAuthStorage.set(stored)
    setAuth(stored)
  }

  const logout = () => {
    adminAuthStorage.set(null)
    setAuth(null)
  }

  const value = useMemo(() => ({ auth, login, logout }), [auth])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider")
  return ctx
}
