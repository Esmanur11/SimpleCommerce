export interface Address {
  id: string
  title: string
  fullName: string
  phone: string
  city: string
  district: string
  addressLine: string
  zipCode?: string | null
}

export interface CreateAddressRequest {
  customerId: string
  title: string
  fullName: string
  phone: string
  city: string
  district: string
  addressLine: string
  zipCode?: string | null
}

export interface UpdateAddressRequest {
  title: string
  fullName: string
  phone: string
  city: string
  district: string
  addressLine: string
  zipCode?: string | null
}
