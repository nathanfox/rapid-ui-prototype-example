<template>
  <div class="prototype-container">
    <PrototypeBanner />

    <div class="content">
      <div class="header">
        <h1>Product Catalog</h1>
        <div class="header-actions">
          <NuxtLink to="/prototype/cart" class="cart-link">
            🛒 Cart ({{ itemCount }})
          </NuxtLink>
          <NuxtLink to="/prototype" class="back-link">← Back to Hub</NuxtLink>
        </div>
      </div>

      <div v-if="cartNotification" class="cart-notification">
        ✅ {{ cartNotification }}
      </div>

      <ProductSearch @search="handleSearch" />

      <div class="filters">
        <select v-model="selectedCategory" @change="applyFilters">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Computers">Computers</option>
          <option value="Audio">Audio</option>
          <option value="Accessories">Accessories</option>
          <option value="Gaming">Gaming</option>
        </select>

        <select v-model="sortBy" @change="applyFilters">
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>

        <label class="stock-filter">
          <input type="checkbox" v-model="inStockOnly" @change="applyFilters" />
          In Stock Only
        </label>
      </div>

      <div v-if="loading" class="loading">Loading products...</div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="retry">Retry</button>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="empty">
        <p>No products found</p>
      </div>

      <div v-else class="product-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>

    <ScenarioSelector />
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/prototype/stores/product'
import { useCartStore } from '~/prototype/stores/cart'
import type { SearchFilters } from '~/types/product'
import ScenarioSelector from '~/prototype/components/ScenarioSelector.vue'
import PrototypeBanner from '~/prototype/components/PrototypeBanner.vue'
import ProductSearch from '~/prototype/components/products/ProductSearch.vue'
import ProductCard from '~/prototype/components/products/ProductCard.vue'

definePageMeta({
  middleware: 'prototype'
})

const productStore = useProductStore()
const cartStore = useCartStore()

const { products, loading, error } = storeToRefs(productStore)
const { itemCount } = storeToRefs(cartStore)

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('')
const inStockOnly = ref(false)
const filteredProducts = ref(products.value)
const cartNotification = ref('')

const applyFilters = async () => {
  const filters: SearchFilters = {
    query: searchQuery.value,
    category: selectedCategory.value || undefined,
    inStock: inStockOnly.value || undefined
  }

  if (sortBy.value) {
    const [field, order] = sortBy.value.split('-')
    filters.sortBy = field as 'price' | 'rating' | 'name'
    filters.sortOrder = order as 'asc' | 'desc' || 'asc'
  }

  filteredProducts.value = await productStore.searchProducts(filters)
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  applyFilters()
}

const handleAddToCart = async (productId: string) => {
  const success = await cartStore.addToCart(productId)
  if (success) {
    const product = productStore.getProduct(productId)
    cartNotification.value = `Added "${product?.name}" to cart!`
    setTimeout(() => {
      cartNotification.value = ''
    }, 3000)
  }
}

const retry = () => {
  applyFilters()
}

onMounted(() => {
  applyFilters()
})

watch(products, () => {
  applyFilters()
})
</script>

<style scoped>
.prototype-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 100px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
}

.header-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.cart-link {
  padding: 8px 16px;
  background: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background 0.3s;
}

.cart-link:hover {
  background: #45a049;
}

.back-link {
  color: #ff9800;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.cart-notification {
  background: #d4edda;
  color: #155724;
  padding: 12px 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.stock-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error {
  color: #c00;
}

.error button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error button:hover {
  background: #ff6b6b;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
</style>