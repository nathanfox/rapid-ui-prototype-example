export interface CartItem {
  productId: string
  quantity: number
  addedAt: Date
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  total: number
}