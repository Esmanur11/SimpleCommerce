export interface StoredAuth {
  token: string
  customerId: string
  email: string
  role: string
  firstName: string
  lastName: string
}

const CUSTOMER_KEY = "sc_customer_auth"
const ADMIN_KEY = "sc_admin_auth"

function read(key: string): StoredAuth | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

function write(key: string, value: StoredAuth | null) {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.removeItem(key)
  }
}

export const customerAuthStorage = {
  get: () => read(CUSTOMER_KEY),
  set: (value: StoredAuth | null) => write(CUSTOMER_KEY, value),
}

export const adminAuthStorage = {
  get: () => read(ADMIN_KEY),
  set: (value: StoredAuth | null) => write(ADMIN_KEY, value),
}
