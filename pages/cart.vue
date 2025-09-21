<template>
  <div class="container">
    <h1>Shopping Cart - Production</h1>
    <p>This is the production shopping cart page.</p>
    <p>In a real application, this would show the user's actual shopping cart with real products.</p>

    <div class="navigation">
      <NuxtLink to="/" class="nav-link">← Home</NuxtLink>
      <NuxtLink to="/products" class="nav-link">Products</NuxtLink>
      <NuxtLink
        v-if="canAccessPrototypes"
        to="/prototype/cart"
        class="nav-link prototype-link"
      >
        🧪 View Prototype
      </NuxtLink>
    </div>

    <div class="placeholder">
      <p>Production cart store would be imported from ~/stores/cart.ts</p>
      <p>This page would use real API calls and production data.</p>
      <p>It would handle real checkout, payment processing, etc.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePrototypeAccess } from '~/composables/usePrototypeAccess'

const { canAccessPrototypes } = usePrototypeAccess()

// In production, you would import:
// import { useCartStore } from '~/stores/cart'
// const cartStore = useCartStore()
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