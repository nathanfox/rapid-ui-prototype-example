import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { ProductGenerator } from '../data/generators/ProductGenerator'
import type { Product, SearchFilters } from '~/types/product'

export const useProductStore = defineStore('mockProduct', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const generator = new ProductGenerator()

  const searchProducts = async (filters: SearchFilters) => {
    loading.value = true
    error.value = null

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      let results = [...products.value]

      if (filters.query) {
        results = results.filter(p =>
          p.name.toLowerCase().includes(filters.query!.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.query!.toLowerCase())
        )
      }

      if (filters.category) {
        results = results.filter(p => p.category === filters.category)
      }

      if (filters.minPrice !== undefined) {
        results = results.filter(p => p.price >= filters.minPrice!)
      }

      if (filters.maxPrice !== undefined) {
        results = results.filter(p => p.price <= filters.maxPrice!)
      }

      if (filters.inStock) {
        results = results.filter(p => p.inventory > 0)
      }

      if (filters.sortBy) {
        results.sort((a, b) => {
          const order = filters.sortOrder === 'desc' ? -1 : 1
          switch (filters.sortBy) {
            case 'price':
              return (a.price - b.price) * order
            case 'rating':
              return (a.rating - b.rating) * order
            case 'name':
              return a.name.localeCompare(b.name) * order
            default:
              return 0
          }
        })
      }

      return results
    } catch (e) {
      error.value = 'Failed to search products'
      return []
    } finally {
      loading.value = false
    }
  }

  const getProduct = (id: string): Product | undefined => {
    return products.value.find(p => p.id === id)
  }

  const loadData = (data: Product[]) => {
    products.value = data
    error.value = null
  }

  const generateProducts = (count: number = 20) => {
    products.value = generator.generateMany(count)
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
    loading.value = false
  }

  // Initialize with some products
  generateProducts(20)

  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    searchProducts,
    getProduct,
    loadData,
    generateProducts,
    setError
  }
})