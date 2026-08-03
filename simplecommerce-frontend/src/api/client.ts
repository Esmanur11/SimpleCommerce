import axios from "axios"
import { adminAuthStorage, customerAuthStorage } from "../lib/authStorage"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5009/api",
})

apiClient.interceptors.request.use((config) => {
  const isAdminRoute = window.location.pathname.startsWith("/admin")
  const auth = isAdminRoute ? adminAuthStorage.get() : customerAuthStorage.get()
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})
