export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inventory: number
  rating: number
  images: readonly string[]
  tags: readonly string[]
}

export interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'price' | 'rating' | 'name'
  sortOrder?: 'asc' | 'desc'
}