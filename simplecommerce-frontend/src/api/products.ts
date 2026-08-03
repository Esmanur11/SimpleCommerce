import { apiClient } from "./client"
import type {
  CreateProductRequest,
  CreateVariantRequest,
  ProductDetail,
  ProductListItem,
  UpdatePriceRequest,
  UpdateStockRequest,
} from "../types/product"

export async function getActiveProducts(page = 1, pageSize = 20): Promise<ProductListItem[]> {
  const res = await apiClient.get<ProductListItem[]>("/Products", { params: { page, pageSize } })
  return res.data
}

const MAX_PAGE_SIZE = 100

// Backend paginates /Products; catalog pages (admin list, storefront filters) still need the
// full active catalog, so fetch every page and concatenate instead of assuming it fits in one call.
export async function getAllActiveProducts(): Promise<ProductListItem[]> {
  const all: ProductListItem[] = []
  let page = 1

  while (true) {
    const batch = await getActiveProducts(page, MAX_PAGE_SIZE)
    all.push(...batch)
    if (batch.length < MAX_PAGE_SIZE) break
    page += 1
  }

  return all
}

export async function getProductDetail(id: string): Promise<ProductDetail> {
  const res = await apiClient.get<ProductDetail>(`/Products/${id}`)
  return res.data
}

export async function createProduct(data: CreateProductRequest) {
  const res = await apiClient.post("/Products", data)
  return res.data
}

export async function addVariant(productId: string, data: CreateVariantRequest) {
  const res = await apiClient.post(`/Products/${productId}/variants`, data)
  return res.data
}

export async function updateVariantStock(variantId: string, data: UpdateStockRequest) {
  await apiClient.put(`/Products/variants/${variantId}/stock`, data)
}

export async function updateProductPrice(productId: string, data: UpdatePriceRequest) {
  await apiClient.put(`/Products/${productId}/price`, data)
}
