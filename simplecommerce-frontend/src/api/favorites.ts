import { apiClient } from "./client"
import type { AddFavoriteRequest, FavoriteView } from "../types/favorite"

export async function getFavorites(customerId: string): Promise<FavoriteView[]> {
  const res = await apiClient.get<FavoriteView[]>(`/favorites/${customerId}`)
  return res.data
}

export async function addFavorite(data: AddFavoriteRequest): Promise<void> {
  await apiClient.post("/favorites", data)
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  await apiClient.delete(`/favorites/${favoriteId}`)
}
