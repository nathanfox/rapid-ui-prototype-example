<template>
  <div class="product-card" :class="{ 'out-of-stock': product.inventory === 0 }">
    <div class="product-image">
      <img :src="product.images[0]" :alt="product.name" />
      <div v-if="product.tags.length > 0" class="tags">
        <span v-for="tag in product.tags" :key="tag" class="tag" :class="`tag-${tag}`">
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="description">{{ product.description }}</p>

      <div class="meta">
        <span class="category">{{ product.category }}</span>
        <span class="rating">⭐ {{ product.rating }}</span>
      </div>

      <div class="price-section">
        <span class="price">${{ product.price.toFixed(2) }}</span>
        <span v-if="product.inventory > 0" class="stock">
          {{ product.inventory }} in stock
        </span>
        <span v-else class="stock out">Out of Stock</span>
      </div>

      <button
        @click="$emit('add-to-cart', product.id)"
        :disabled="product.inventory === 0 || adding"
        class="add-to-cart"
      >
        <span v-if="adding">Adding...</span>
        <span v-else-if="product.inventory === 0">Out of Stock</span>
        <span v-else>Add to Cart</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

interface Props {
  product: Product
}

interface Emits {
  (e: 'add-to-cart', id: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const adding = ref(false)
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-card.out-of-stock {
  opacity: 0.7;
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  background: #666;
  color: white;
}

.tag-sale {
  background: #ff5722;
}

.tag-new {
  background: #4caf50;
}

.tag-featured {
  background: #2196f3;
}

.tag-bestseller {
  background: #ff9800;
}

.tag-limited {
  background: #9c27b0;
}

.tag-exclusive {
  background: #795548;
}

.tag-trending {
  background: #e91e63;
}

.tag-premium {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #333;
}

.product-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.description {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 15px;
  flex: 1;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 13px;
}

.category {
  color: #999;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.rating {
  color: #ff9800;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stock {
  font-size: 13px;
  color: #4caf50;
}

.stock.out {
  color: #f44336;
}

.add-to-cart {
  width: 100%;
  padding: 12px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart:hover:not(:disabled) {
  background: #ff6b6b;
}

.add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>