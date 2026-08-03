import { apiClient } from "./client"
import type { Category, CreateCategoryRequest } from "../types/category"

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<Category[]>("/categories")
  return res.data
}

export async function createCategory(data: CreateCategoryRequest): Promise<Category> {
  const res = await apiClient.post<Category>("/categories", data)
  return res.data
}
