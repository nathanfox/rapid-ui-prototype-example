# Nuxt Rapid Prototyping System Implementation Plan

## Project Overview

This project implements a GenAI-powered rapid prototyping system for Nuxt 3 applications, based on the concepts from the blog post "Building a GenAI-Powered Rapid Prototyping System for Modern Web Applications". The system enables parallel development of prototype and production components with mock data stores, scenario-based testing, and easy synchronization between prototype and production code.

## Core Concepts

### 1. Side-by-Side Architecture
- **Prototype and production coexist** in the same build
- **Runtime configuration** controls prototype visibility via `ENABLE_PROTOTYPES` environment variable
- **Separate routing** - prototypes accessible at `/prototype/*` paths
- **Same function names** - prototype stores export identical function names as production for easy migration
- **Different store IDs** - allows both stores to be active simultaneously in Pinia

### 2. Key Architecture Principles
- Centralize all data operations in Pinia stores
- Components remain data-source agnostic
- Clear separation between UI and data logic
- Scenario-based testing capabilities
- Single build artifact works in all environments

## Project Structure

```
rapid-ui-prototype-example/
├── docs/
│   └── implementation-plan.md          # This document
├── nuxt.config.ts                      # Nuxt configuration
├── package.json                         # Project dependencies
├── app.vue                             # Root app component
├── assets/
│   └── css/
│       └── main.css                   # Global styles
├── pages/
│   ├── index.vue                      # Production home page
│   └── prototype/                      # Prototype section (separate route)
│       ├── _middleware.ts              # Access control for prototypes
│       ├── index.vue                    # Prototype hub page
│       ├── products.vue                 # Prototype products page
│       └── checkout.vue                 # Prototype checkout page
├── components/                         # Production components
│   ├── products/
│   │   ├── ProductList.vue
│   │   ├── ProductCard.vue
│   │   └── ProductSearch.vue
│   └── cart/
│       └── ShoppingCart.vue
├── stores/                            # Production Pinia stores
│   ├── product.ts
│   ├── user.ts
│   └── cart.ts
├── prototype/                         # Prototype ecosystem
│   ├── components/
│   │   ├── ScenarioSelector.vue      # Scenario switching UI
│   │   ├── PrototypeBanner.vue       # Visual indicator
│   │   ├── products/
│   │   │   ├── ProductList.vue       # Prototype product list
│   │   │   ├── ProductCard.vue       # Prototype product card
│   │   │   └── ProductSearch.vue     # Prototype search
│   │   └── cart/
│   │       └── ShoppingCart.vue      # Prototype cart
│   ├── stores/
│   │   ├── base/
│   │   │   └── BaseMockStore.ts      # Base class for mock stores
│   │   ├── product.ts                # Mock product store (same function name!)
│   │   ├── user.ts                   # Mock user store (same function name!)
│   │   └── cart.ts                   # Mock cart store (same function name!)
│   ├── data/
│   │   ├── generators/
│   │   │   ├── MockDataGenerator.ts  # Base generator class
│   │   │   ├── ProductGenerator.ts   # Product data generator
│   │   │   ├── UserGenerator.ts      # User data generator
│   │   │   └── OrderGenerator.ts     # Order data generator
│   │   └── scenarios/
│   │       ├── ScenarioManager.ts    # Scenario management
│   │       ├── productScenarios.ts   # Product scenarios
│   │       ├── userScenarios.ts      # User scenarios
│   │       └── index.ts              # Scenario registry
│   ├── layouts/
│   │   └── prototype.vue              # Prototype layout with banner
│   └── utils/
│       ├── sync.ts                   # Sync metadata helpers
│       └── visual.ts                 # Visual differentiation utils
├── types/                             # Shared TypeScript types
│   ├── product.ts
│   ├── user.ts
│   ├── cart.ts
│   └── scenario.ts
├── plugins/
│   └── prototype-access.client.ts    # Client-side prototype access control
└── composables/
    ├── usePrototypeAccess.ts        # Prototype access control
    └── useScenario.ts                # Scenario management composable

```

## Implementation Phases

### Phase 1: Core Setup ✓
- [x] Initialize Nuxt 3 project structure
- [x] Configure TypeScript
- [ ] Install dependencies (Pinia, @pinia/nuxt)
- [ ] Setup base configuration

### Phase 2: Type System & Domain Models
Create shared type definitions that both prototype and production can use:

#### Product Types
```typescript
// types/product.ts
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inventory: number
  rating: number
  images: string[]
  tags: string[]
}

export interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'price' | 'rating' | 'name'
  sortOrder?: 'asc' | 'desc'
}
```

#### User Types
```typescript
// types/user.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}
```

#### Cart Types
```typescript
// types/cart.ts
export interface CartItem {
  productId: string
  quantity: number
  addedAt: Date
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  total: number
}
```

### Phase 3: Base Infrastructure

#### BaseMockStore Implementation
```typescript
// prototype/stores/base/BaseMockStore.ts
import type { DataScenario } from '~/types/scenario'

export abstract class BaseMockStore<T> {
  protected state: T
  protected scenarios: Map<string, DataScenario<T>>

  constructor(initialState: T) {
    this.state = initialState
    this.scenarios = new Map()
    this.registerDefaultScenarios()
  }

  abstract registerDefaultScenarios(): void

  loadScenario(name: string): void {
    const scenario = this.scenarios.get(name)
    if (scenario) {
      this.state = scenario.data()
      if (scenario.delay) {
        // Simulate network delay
      }
      if (scenario.error) {
        // Simulate error condition
      }
    }
  }
}
```

#### MockDataGenerator Pattern
```typescript
// prototype/data/generators/MockDataGenerator.ts
export class MockDataGenerator<T> {
  private generators: Map<keyof T, () => any> = new Map()

  register<K extends keyof T>(field: K, generator: () => T[K]): void {
    this.generators.set(field, generator)
  }

  generate(overrides?: Partial<T>): T {
    const generated = {} as T
    for (const [field, generator] of this.generators) {
      generated[field] = generator()
    }
    return { ...generated, ...overrides }
  }

  generateMany(count: number): T[] {
    return Array.from({ length: count }, () => this.generate())
  }
}
```

### Phase 4: Scenario Management System

#### ScenarioManager
```typescript
// prototype/data/scenarios/ScenarioManager.ts
import { useProductStore } from '~/prototype/stores/product'
import { useUserStore } from '~/prototype/stores/user'
import { useCartStore } from '~/prototype/stores/cart'

export interface ScenarioDefinition {
  name: string
  description: string
  stores: {
    products?: () => any
    users?: () => any
    cart?: () => any
  }
  delay?: number
  error?: Error
}

export class ScenarioManager {
  private scenarios: Map<string, ScenarioDefinition> = new Map()

  register(scenario: ScenarioDefinition): void {
    this.scenarios.set(scenario.name, scenario)
  }

  async loadScenario(name: string): Promise<void> {
    const scenario = this.scenarios.get(name)
    if (!scenario) throw new Error(`Scenario ${name} not found`)

    // Load data into each store (using same function names as production!)
    if (scenario.stores.products) {
      const productStore = useProductStore()  // From prototype/stores/product
      await productStore.loadData(scenario.stores.products())
    }

    if (scenario.stores.users) {
      const userStore = useUserStore()  // From prototype/stores/user
      await userStore.loadData(scenario.stores.users())
    }

    if (scenario.stores.cart) {
      const cartStore = useCartStore()  // From prototype/stores/cart
      await cartStore.loadData(scenario.stores.cart())
    }
  }
}
```

### Phase 5: ScenarioSelector Component

The ScenarioSelector component provides UI for switching between data scenarios:

```vue
<!-- prototype/components/ScenarioSelector.vue -->
<template>
  <div class="scenario-selector">
    <div class="scenario-header">
      <span class="icon">🧪</span>
      <span>Prototype Mode - Mock Data</span>
    </div>

    <select v-model="selectedScenario" @change="handleScenarioChange">
      <option v-for="scenario in availableScenarios" :key="scenario.name" :value="scenario.name">
        {{ scenario.description }}
      </option>
    </select>

    <button @click="refreshScenario">
      ↻ Refresh
    </button>

    <details class="scenario-info">
      <summary>Current Scenario Details</summary>
      <pre>{{ currentScenarioDetails }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { useScenario } from '~/composables/useScenario'

const {
  availableScenarios,
  selectedScenario,
  currentScenarioDetails,
  loadScenario,
  refreshScenario
} = useScenario()

const handleScenarioChange = async () => {
  await loadScenario(selectedScenario.value)
}
</script>
```

### Phase 6: Mock Stores Implementation

#### Mock Product Store (Note: Same function name as production!)
```typescript
// prototype/stores/product.ts
import { defineStore } from 'pinia'
import { ProductGenerator } from '../data/generators/ProductGenerator'
import type { Product, SearchFilters } from '~/types/product'

// Same function name as production, different store ID
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
      // Generate filtered results
      let results = products.value

      if (filters.query) {
        results = results.filter(p =>
          p.name.toLowerCase().includes(filters.query!.toLowerCase())
        )
      }

      if (filters.category) {
        results = results.filter(p => p.category === filters.category)
      }

      products.value = results
    } catch (e) {
      error.value = 'Failed to search products'
    } finally {
      loading.value = false
    }
  }

  const loadData = (data: Product[]) => {
    products.value = data
  }

  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    searchProducts,
    loadData
  }
})
```

### Phase 7: Example Scenarios

```typescript
// prototype/data/scenarios/productScenarios.ts
import { ProductGenerator } from '../generators/ProductGenerator'
import { UserGenerator } from '../generators/UserGenerator'

const productGen = new ProductGenerator()
const userGen = new UserGenerator()

export const scenarios = [
  {
    name: 'normal',
    description: 'Normal Operation - 20 products, 5 users',
    stores: {
      products: () => productGen.generateMany(20),
      users: () => userGen.generateMany(5),
      cart: () => ({ items: [], total: 0 })
    }
  },
  {
    name: 'empty',
    description: 'Empty State - No products',
    stores: {
      products: () => [],
      users: () => [userGen.generate()],
      cart: () => ({ items: [], total: 0 })
    }
  },
  {
    name: 'large',
    description: 'Performance Test - 1000 products',
    stores: {
      products: () => productGen.generateMany(1000),
      users: () => userGen.generateMany(100),
      cart: () => ({ items: [], total: 0 })
    },
    delay: 2000
  },
  {
    name: 'error',
    description: 'Error State - Network failure',
    stores: {},
    error: new Error('Network connection failed')
  },
  {
    name: 'cart-full',
    description: 'Shopping Cart - Multiple items',
    stores: {
      products: () => productGen.generateMany(50),
      users: () => [userGen.generate()],
      cart: () => ({
        items: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
          { productId: '3', quantity: 5 }
        ],
        total: 299.99
      })
    }
  }
]
```

### Phase 8: Visual Differentiation

```css
/* assets/css/main.css */

/* Prototype mode indicators */
.prototype-mode {
  position: relative;

  &::before {
    content: 'PROTOTYPE';
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(45deg, #ff6b6b, #ff9800);
    color: white;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: bold;
    z-index: 1000;
    border-radius: 0 0 0 4px;
  }
}

.prototype-banner {
  background: linear-gradient(90deg, #ff9800 0%, #ff5722 100%);
  color: white;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  .banner-icon {
    font-size: 20px;
    animation: pulse 2s infinite;
  }

  .banner-text {
    flex: 1;
    font-weight: 500;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.scenario-selector {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 2px solid #ff9800;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
  min-width: 280px;

  .scenario-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-weight: 600;
    color: #ff6b6b;

    .icon {
      font-size: 20px;
    }
  }

  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 8px;
    background: white;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #ff9800;
    }
  }

  button {
    padding: 6px 12px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      background: #ff6b6b;
    }
  }

  .scenario-info {
    margin-top: 12px;

    summary {
      cursor: pointer;
      font-size: 14px;
      color: #666;

      &:hover {
        color: #ff9800;
      }
    }

    pre {
      margin-top: 8px;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 12px;
      max-height: 200px;
      overflow-y: auto;
    }
  }
}
```

## Composables

### usePrototypeAccess
```typescript
// composables/usePrototypeAccess.ts
export const usePrototypeAccess = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  const isPrototypesEnabled = computed(() => config.public.enablePrototypes)
  const isPrototypePage = computed(() => route.path.startsWith('/prototype'))

  const canAccessPrototypes = computed(() => {
    // Check if prototypes are enabled via environment variable
    return isPrototypesEnabled.value
  })

  return {
    isPrototypesEnabled: readonly(isPrototypesEnabled),
    isPrototypePage: readonly(isPrototypePage),
    canAccessPrototypes: readonly(canAccessPrototypes)
  }
}
```

### useScenario
```typescript
// composables/useScenario.ts
import { scenarios } from '~/prototype/data/scenarios'
import { useProductStore } from '~/prototype/stores/product'
import { useUserStore } from '~/prototype/stores/user'
import { useCartStore } from '~/prototype/stores/cart'

export const useScenario = () => {
  const selectedScenario = ref('normal')
  const currentScenarioDetails = ref({})

  const availableScenarios = computed(() => scenarios)

  const loadScenario = async (name: string) => {
    const scenario = scenarios.find(s => s.name === name)
    if (!scenario) return

    // Load into stores (using same function names!)
    const productStore = useProductStore()  // From prototype/stores/product
    const userStore = useUserStore()        // From prototype/stores/user
    const cartStore = useCartStore()        // From prototype/stores/cart

    if (scenario.stores.products) {
      productStore.loadData(scenario.stores.products())
    }
    if (scenario.stores.users) {
      userStore.loadData(scenario.stores.users())
    }
    if (scenario.stores.cart) {
      cartStore.loadData(scenario.stores.cart())
    }

    currentScenarioDetails.value = scenario
  }

  const refreshScenario = () => {
    loadScenario(selectedScenario.value)
  }

  return {
    availableScenarios,
    selectedScenario,
    currentScenarioDetails,
    loadScenario,
    refreshScenario
  }
}
```

## Environment Configuration

### Development (.env.development)
```
ENABLE_PROTOTYPES=true
API_URL=http://localhost:3001
```

### Staging (.env.staging)
```
ENABLE_PROTOTYPES=true  # Can demo prototypes to stakeholders
API_URL=https://api.staging.com
```

### Production (.env.production)
```
ENABLE_PROTOTYPES=false  # Or true for internal users
API_URL=https://api.production.com
```

## Nuxt Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  typescript: {
    strict: true,
    typeCheck: true
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      enablePrototypes: process.env.ENABLE_PROTOTYPES === 'true' || false
    }
  },
  pinia: {
    storesDirs: ['./stores/**', './prototype/stores/**']  // Both loaded!
  }
})
```

## Prototype Access Middleware

```typescript
// pages/prototype/_middleware.ts
export default defineNuxtRouteMiddleware(() => {
  const { public: { enablePrototypes } } = useRuntimeConfig()

  if (!enablePrototypes) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found'
    })
  }
})
```

## Usage Examples

### Production Component
```vue
<!-- components/products/ProductList.vue -->
<template>
  <div class="product-list">
    <div v-if="loading">Loading products...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="products">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/stores/product'  // Production store

const store = useProductStore()
const { products, loading, error } = storeToRefs(store)

onMounted(() => {
  store.searchProducts({})
})
</script>
```

### Prototype Component (Nearly Identical!)
```vue
<!-- prototype/components/products/ProductList.vue -->
<template>
  <div class="product-list prototype-mode">
    <div v-if="loading">Loading products...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="products">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/prototype/stores/product'  // Mock store!

const store = useProductStore()  // Same function name, different import path!
const { products, loading, error } = storeToRefs(store)

onMounted(() => {
  store.searchProducts({})
})
</script>
```

### Navigation with Prototype Access Control
```vue
<!-- app.vue -->
<template>
  <div>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/products">Products</NuxtLink>

      <!-- Prototype link - controlled by environment -->
      <NuxtLink
        v-if="canAccessPrototypes"
        to="/prototype"
        class="prototype-link"
      >
        🧪 Prototypes
      </NuxtLink>
    </nav>

    <NuxtPage />
  </div>
</template>

<script setup>
import { usePrototypeAccess } from '~/composables/usePrototypeAccess'

const { canAccessPrototypes } = usePrototypeAccess()
</script>
```

## Benefits

1. **Early Validation**: Test UX with stakeholders before production implementation
2. **Rapid Iteration**: Make changes without production constraints
3. **Comprehensive Testing**: Test edge cases, errors, and performance scenarios
4. **Cost Reduction**: Catch issues before expensive production development
5. **Better Communication**: Stakeholders can interact with realistic prototypes
6. **Easy Migration**: Clear path from prototype to production

## Next Steps

1. Install dependencies: `npm install`
2. Create initial type definitions in `types/` folder
3. Implement base infrastructure classes
4. Build ScenarioSelector component
5. Create example mock stores and generators
6. Build prototype UI components
7. Test with different scenarios
8. Demonstrate to stakeholders
9. Migrate approved prototypes to production

## Commands

```bash
# Install dependencies
npm install

# Run development server with prototypes enabled
ENABLE_PROTOTYPES=true npm run dev

# Run production build (prototypes included but disabled by default)
npm run build

# Preview production build with prototypes enabled
ENABLE_PROTOTYPES=true npm run preview

# Preview production build without prototypes
npm run preview
```

## Key Benefits of This Architecture

### Side-by-Side Execution
- **Both stores active simultaneously** - Can compare prototype vs production in different tabs
- **Same function names** - Migration is just changing the import path
- **Different store IDs** - No conflicts in Pinia state management
- **Runtime control** - Use environment variables to enable/disable prototypes

### Easy Migration Path
1. Build prototype component importing from `~/prototype/stores/product`
2. Test and validate with stakeholders
3. Copy component to production location
4. Change import to `~/stores/product`
5. Done! No other code changes needed

### Clean Diffs for GenAI
When comparing prototype and production components:
```diff
- import { useProductStore } from '~/prototype/stores/product'
+ import { useProductStore } from '~/stores/product'
```
That's the only difference! Makes it easy for GenAI tools to sync changes.

## Notes

- Prototype components mirror production structure for easy migration
- All mock data is generated dynamically, not hardcoded
- Scenarios can simulate delays, errors, and edge cases
- Visual indicators ensure users know they're viewing prototypes
- Single build works everywhere with runtime configuration
- Prototypes accessible at `/prototype/*` routes when enabled