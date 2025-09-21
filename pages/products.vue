<template>
  <div class="container">
    <h1>Products - Production</h1>
    <p>This is the production products page.</p>
    <p>In a real application, this would connect to your production API and display real products.</p>

    <div class="navigation">
      <NuxtLink to="/" class="nav-link">← Home</NuxtLink>
      <NuxtLink to="/cart" class="nav-link">Shopping Cart</NuxtLink>
      <NuxtLink
        v-if="canAccessPrototypes"
        to="/prototype/products"
        class="nav-link prototype-link"
      >
        🧪 View Prototype
      </NuxtLink>
    </div>

    <div class="placeholder">
      <p>Production store would be imported from ~/stores/product.ts</p>
      <p>This page would use real API calls and production data.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePrototypeAccess } from '~/composables/usePrototypeAccess'

const { canAccessPrototypes } = usePrototypeAccess()

// In production, you would import:
// import { useProductStore } from '~/stores/product'
// const productStore = useProductStore()
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.navigation {
  margin-top: 30px;
  display: flex;
  gap: 20px;
}

.nav-link {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover {
  background: #0056b3;
}

.prototype-link {
  background: #ff9800;
}

.prototype-link:hover {
  background: #ff6b6b;
}

.placeholder {
  margin-top: 40px;
  padding: 30px;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
}
</style>