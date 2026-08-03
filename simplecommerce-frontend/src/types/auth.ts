export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  customerId: string
  email: string
  role: string
  firstName: string
  lastName: string
}
