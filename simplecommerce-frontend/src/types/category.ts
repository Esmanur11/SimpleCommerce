export interface Category {
  id: string
  name: string
  children: Category[]
}

export interface CreateCategoryRequest {
  name: string
  parentCategoryId?: string | null
}
