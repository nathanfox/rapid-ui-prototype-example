import { ScenarioManager } from './ScenarioManager'
import { ProductGenerator } from '../generators/ProductGenerator'
import { UserGenerator } from '../generators/UserGenerator'
import type { Cart } from '~/types/cart'

const productGen = new ProductGenerator()
const userGen = new UserGenerator()

export const scenarioManager = new ScenarioManager()

// Normal operation scenario
scenarioManager.register({
  name: 'normal',
  description: 'Normal Operation - 20 products, 5 users, empty cart [Affects: Products, Users, Cart]',
  stores: {
    products: () => productGen.generateMany(20),
    users: () => userGen.generateMany(5),
    cart: () => ({
      id: `cart_${Date.now()}`,
      userId: 'user_1',
      items: [],
      total: 0
    } as Cart)
  }
})

// Empty state scenario
scenarioManager.register({
  name: 'empty',
  description: 'Empty State - No products [Affects: Products, Users, Cart]',
  stores: {
    products: () => [],
    users: () => [userGen.generate()],
    cart: () => ({
      id: `cart_${Date.now()}`,
      userId: 'user_1',
      items: [],
      total: 0
    } as Cart)
  }
})

// Large dataset for performance testing
scenarioManager.register({
  name: 'large',
  description: 'Performance Test - 1000 products, 100 users [Affects: Products, Users, Cart]',
  stores: {
    products: () => productGen.generateMany(1000),
    users: () => userGen.generateMany(100),
    cart: () => ({
      id: `cart_${Date.now()}`,
      userId: 'user_1',
      items: [],
      total: 0
    } as Cart)
  },
  delay: 2000
})

// Error simulation
scenarioManager.register({
  name: 'error',
  description: 'Error State - Network failure [Affects: None - Simulates error]',
  stores: {},
  error: new Error('Network connection failed')
})

// Shopping cart with items
scenarioManager.register({
  name: 'cart-full',
  description: 'Shopping Cart - Multiple items [Affects: Products, Users, Cart]',
  stores: {
    products: () => {
      const products = productGen.generateMany(50)
      // Ensure first 3 products have known IDs for cart
      products[0].id = 'prod_1'
      products[1].id = 'prod_2'
      products[2].id = 'prod_3'
      return products
    },
    users: () => [userGen.generate()],
    cart: () => ({
      id: `cart_${Date.now()}`,
      userId: 'user_1',
      items: [
        { productId: 'prod_1', quantity: 2, addedAt: new Date() },
        { productId: 'prod_2', quantity: 1, addedAt: new Date() },
        { productId: 'prod_3', quantity: 5, addedAt: new Date() }
      ],
      total: 299.99
    } as Cart)
  }
})

// Out of stock scenario
scenarioManager.register({
  name: 'out-of-stock',
  description: 'Limited Stock - 70% out of stock [Affects: Products, Users, Cart]',
  stores: {
    products: () => {
      const products = productGen.generateMany(30)
      // Set 70% of products to out of stock
      products.forEach((p, i) => {
        if (i % 10 > 2) {
          p.inventory = 0
        } else {
          p.inventory = Math.floor(Math.random() * 5) + 1
        }
      })
      return products
    },
    users: () => userGen.generateMany(5),
    cart: () => ({
      id: `cart_${Date.now()}`,
      userId: 'user_1',
      items: [],
      total: 0
    } as Cart)
  }
})

// Sale/discount scenario
scenarioManager.register({
  name: 'sale',
  description: 'Sale Event - 30% off every 3rd item [Affects: Products, Users, Cart]',
  stores: {
    products: () => {
      const products = productGen.generateMany(40)
      // Add sale tags and adjust prices
      products.forEach((p, i) => {
        if (i % 3 === 0) {
          p.tags = [...p.tags, 'sale']
          p.price = Math.round(p.price * 0.7 * 100) / 100 // 30% off
        }
      })
      return products
    },
    users: () => userGen.generateMany(10),
    cart: () => ({
      id: `cart_${Date.now()}`,
      userId: 'user_1',
      items: [],
      total: 0
    } as Cart)
  }
})

// Premium user scenario
scenarioManager.register({
  name: 'premium',
  description: 'Premium User - Admin, 100 premium products, full cart [Affects: Products, Users, Cart]',
  stores: {
    products: () => {
      const products = productGen.generateMany(100)
      products.forEach(p => {
        p.tags = [...p.tags, 'premium']
      })
      // Ensure first 5 products have known IDs
      for (let i = 0; i < 5; i++) {
        products[i].id = `prod_${i + 1}`
      }
      return products
    },
    users: () => {
      const users = userGen.generateMany(5)
      users[0].role = 'admin'
      users[0].name = 'Admin User'
      return users
    },
    cart: () => ({
      id: `cart_${Date.now()}`,
      userId: 'user_1',
      items: [
        { productId: 'prod_1', quantity: 1, addedAt: new Date() },
        { productId: 'prod_2', quantity: 2, addedAt: new Date() },
        { productId: 'prod_3', quantity: 1, addedAt: new Date() },
        { productId: 'prod_4', quantity: 3, addedAt: new Date() },
        { productId: 'prod_5', quantity: 1, addedAt: new Date() }
      ],
      total: 999.99
    } as Cart)
  }
})

export const scenarios = scenarioManager.getAllScenarios()