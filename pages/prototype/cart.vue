<template>
  <div class="prototype-container">
    <PrototypeBanner />

    <div class="content">
      <div class="header">
        <h1>Shopping Cart</h1>
        <NuxtLink to="/prototype" class="back-link">← Back to Hub</NuxtLink>
      </div>

      <div v-if="cart.items.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <NuxtLink to="/prototype/products" class="btn-primary">
          Browse Products
        </NuxtLink>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <h2>Cart Items ({{ itemCount }})</h2>
          <div v-for="item in cartItemsWithProducts" :key="item.productId" class="cart-item">
            <div class="item-info">
              <h3>{{ item.product?.name || 'Unknown Product' }}</h3>
              <p class="price">${{ item.product?.price?.toFixed(2) || '0.00' }}</p>
            </div>
            <div class="item-controls">
              <button @click="updateQuantity(item.productId, item.quantity - 1)" class="qty-btn">
                -
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="updateQuantity(item.productId, item.quantity + 1)" class="qty-btn">
                +
              </button>
              <button @click="removeItem(item.productId)" class="remove-btn">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ cart.total.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (10%):</span>
            <span>${{ (cart.total * 0.1).toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ (cart.total * 1.1).toFixed(2) }}</span>
          </div>
          <button @click="handleCheckout" class="checkout-btn" :disabled="loading">
            {{ loading ? 'Processing...' : 'Checkout' }}
          </button>
          <button @click="clearCart" class="clear-btn">
            Clear Cart
          </button>
        </div>
      </div>

      <div v-if="checkoutSuccess" class="success-message">
        <h2>✅ Order Placed Successfully!</h2>
        <p>Order ID: {{ orderId }}</p>
        <NuxtLink to="/prototype/products" class="btn-primary">
          Continue Shopping
        </NuxtLink>
      </div>
    </div>

    <ScenarioSelector />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/prototype/stores/cart'
import { useProductStore } from '~/prototype/stores/product'
import ScenarioSelector from '~/prototype/components/ScenarioSelector.vue'
import PrototypeBanner from '~/prototype/components/PrototypeBanner.vue'

definePageMeta({
  middleware: 'prototype'
})

const cartStore = useCartStore()
const productStore = useProductStore()

const { cart, itemCount, loading } = storeToRefs(cartStore)

const checkoutSuccess = ref(false)
const orderId = ref('')

const cartItemsWithProducts = computed(() => {
  return cart.value.items.map(item => ({
    ...item,
    product: productStore.getProduct(item.productId)
  }))
})

const updateQuantity = async (productId: string, quantity: number) => {
  await cartStore.updateQuantity(productId, quantity)
}

const removeItem = async (productId: string) => {
  await cartStore.removeFromCart(productId)
}

const clearCart = async () => {
  await cartStore.clearCart()
}

const handleCheckout = async () => {
  const result = await cartStore.checkout()
  if (result.success) {
    checkoutSuccess.value = true
    orderId.value = result.orderId || ''
    setTimeout(() => {
      checkoutSuccess.value = false
    }, 5000)
  }
}
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

.back-link {
  color: #ff9800;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-cart p {
  font-size: 20px;
  color: #666;
  margin-bottom: 20px;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.cart-items {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-items h2 {
  color: #333;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info h3 {
  color: #333;
  margin-bottom: 5px;
}

.price {
  color: #ff9800;
  font-size: 18px;
  font-weight: bold;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.qty-btn:hover {
  background: #f5f5f5;
}

.quantity {
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  padding: 5px 10px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn:hover {
  background: #d32f2f;
}

.cart-summary {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.cart-summary h2 {
  color: #333;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.summary-row.total {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  border-bottom: none;
  margin-top: 10px;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.checkout-btn:hover:not(:disabled) {
  background: #45a049;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  width: 100%;
  padding: 10px;
  background: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.clear-btn:hover {
  background: #444;
}

.btn-primary {
  display: inline-block;
  padding: 10px 20px;
  background: #ff9800;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 20px;
}

.btn-primary:hover {
  background: #ff6b6b;
}

.success-message {
  text-align: center;
  padding: 40px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  margin-top: 20px;
}

.success-message h2 {
  color: #155724;
  margin-bottom: 10px;
}

.success-message p {
  color: #155724;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}
</style>