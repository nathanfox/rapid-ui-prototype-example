<template>
  <div class="prototype-container">
    <PrototypeBanner />

    <div class="content">
      <h1>🧪 Prototype Hub</h1>
      <p>Welcome to the prototype environment. Here you can test different UI components with mock data.</p>

      <div class="prototype-grid">
        <NuxtLink to="/prototype/products" class="prototype-card">
          <h2>📦 Products</h2>
          <p>Browse and search product catalog with various data scenarios</p>
        </NuxtLink>

        <NuxtLink to="/prototype/cart" class="prototype-card">
          <h2>🛒 Shopping Cart</h2>
          <p>Test shopping cart functionality and checkout flow</p>
        </NuxtLink>

        <NuxtLink to="/prototype/user" class="prototype-card">
          <h2>👤 User Profile</h2>
          <p>User authentication and profile management</p>
        </NuxtLink>
      </div>

      <div class="scenario-section">
        <h2>Data Scenarios</h2>
        <p>Use the scenario selector in the bottom-right corner to switch between different data scenarios:</p>
        <ul>
          <li><strong>Normal:</strong> Standard operation with typical data</li>
          <li><strong>Empty:</strong> No products available</li>
          <li><strong>Large:</strong> Performance test with 1000+ products</li>
          <li><strong>Error:</strong> Simulate network failures</li>
          <li><strong>Cart Full:</strong> Pre-filled shopping cart</li>
          <li><strong>Out of Stock:</strong> Limited inventory scenario</li>
          <li><strong>Sale:</strong> Discounted items</li>
          <li><strong>Premium:</strong> Admin user with premium products</li>
        </ul>
      </div>
    </div>

    <ScenarioSelector />
  </div>
</template>

<script setup lang="ts">
import ScenarioSelector from '~/prototype/components/ScenarioSelector.vue'
import PrototypeBanner from '~/prototype/components/PrototypeBanner.vue'

definePageMeta({
  middleware: 'prototype'
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

h1 {
  color: #ff6b6b;
  margin-bottom: 20px;
  font-size: 2.5em;
}

.prototype-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 40px 0;
}

.prototype-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #333;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid transparent;
}

.prototype-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: #ff9800;
}

.prototype-card h2 {
  color: #ff9800;
  margin-bottom: 10px;
}

.scenario-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-top: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.scenario-section h2 {
  color: #ff6b6b;
  margin-bottom: 20px;
}

.scenario-section ul {
  list-style: none;
  padding: 0;
}

.scenario-section li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.scenario-section li:last-child {
  border-bottom: none;
}

.scenario-section strong {
  color: #ff9800;
  margin-right: 10px;
}
</style>