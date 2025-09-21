<template>
  <div class="container">
    <h1>Production Home Page</h1>
    <p>This is the production version of the application.</p>

    <nav>
      <NuxtLink to="/products" class="nav-link">Products</NuxtLink>
      <NuxtLink to="/cart" class="nav-link">Shopping Cart</NuxtLink>
      <NuxtLink
        v-if="canAccessPrototypes"
        to="/prototype"
        class="nav-link prototype-link"
      >
        🧪 View Prototypes
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { usePrototypeAccess } from '~/composables/usePrototypeAccess'

const { canAccessPrototypes } = usePrototypeAccess()
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

nav {
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
</style>