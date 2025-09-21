import { defineStore } from 'pinia'
import { ref, readonly, computed } from 'vue'
import type { Cart } from '~/types/cart'

export const useCartStore = defineStore('mockCart', () => {
  const cart = ref<Cart>({
    id: `cart_${Date.now()}`,
    userId: '',
    items: [],
    total: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() =>
    cart.value.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  const addToCart = async (productId: string, quantity: number = 1) => {
    loading.value = true
    error.value = null

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      const existingItem = cart.value.items.find(item => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.value.items.push({
          productId,
          quantity,
          addedAt: new Date()
        })
      }

      await updateTotal()
      return true
    } catch (e) {
      error.value = 'Failed to add item to cart'
      return false
    } finally {
      loading.value = false
    }
  }

  const removeFromCart = async (productId: string) => {
    loading.value = true
    error.value = null

    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      cart.value.items = cart.value.items.filter(item => item.productId !== productId)
      await updateTotal()
      return true
    } catch (e) {
      error.value = 'Failed to remove item from cart'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    loading.value = true
    error.value = null

    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      const item = cart.value.items.find(item => item.productId === productId)

      if (item) {
        if (quantity <= 0) {
          await removeFromCart(productId)
        } else {
          item.quantity = quantity
          await updateTotal()
        }
      }
      return true
    } catch (e) {
      error.value = 'Failed to update quantity'
      return false
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 200))
    cart.value.items = []
    cart.value.total = 0
    loading.value = false
  }

  const updateTotal = async () => {
    // In a real app, this would fetch product prices from the backend
    // For mock, we'll use the product store
    const { useProductStore } = await import('~/prototype/stores/product')
    const productStore = useProductStore()

    let total = 0
    for (const item of cart.value.items) {
      const product = productStore.getProduct(item.productId)
      if (product) {
        total += product.price * item.quantity
      }
    }

    cart.value.total = Math.round(total * 100) / 100
  }

  const loadData = (data: Cart) => {
    cart.value = data
    error.value = null
  }

  const checkout = async () => {
    loading.value = true
    error.value = null

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      // Mock checkout process
      const orderId = `order_${Date.now()}`
      await clearCart()
      return { success: true, orderId }
    } catch (e) {
      error.value = 'Checkout failed'
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
    loading.value = false
  }

  return {
    cart: readonly(cart),
    itemCount: readonly(itemCount),
    loading: readonly(loading),
    error: readonly(error),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    loadData,
    setError
  }
})