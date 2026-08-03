export interface FavoriteView {
  favoriteId: string
  productId: string
  productName: string
  price: number
}

export interface AddFavoriteRequest {
  customerId: string
  productId: string
}
