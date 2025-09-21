# Rapid UI Prototype Example

A complete implementation of a GenAI-powered rapid prototyping system for Nuxt.js applications, demonstrating the concepts from the blog post ["Building a GenAI-Powered Rapid Prototyping System for Modern Web Applications"](https://www.nathanfox.net/p/building-a-genai-powered-rapid-prototyping).

## Overview

This repository showcases a **side-by-side architecture** where prototype and production components coexist in the same codebase. It enables teams to:

- **Validate UX early** with realistic mock data before production implementation
- **Test edge cases** through scenario-based data switching
- **Iterate rapidly** without production constraints
- **Migrate seamlessly** from prototype to production with minimal code changes

## Key Features

### 🎭 Dual-Mode Architecture
- Production pages at root routes (`/`, `/products`, `/cart`)
- Prototype pages at `/prototype/*` routes
- Runtime configuration via environment variables
- Single build artifact works in all environments

### 🔄 Scenario-Based Testing
- **8 Pre-configured scenarios**: Normal, Empty, Large Dataset, Error States, Cart Full, Out of Stock, Sale, Premium User
- **Dynamic data generation** - not hardcoded mock data
- **Multi-store updates** - scenarios can affect Products, Users, and Cart stores simultaneously
- **Visual scenario selector** for easy switching during demos

### 🏪 Pinia Store Architecture
- **Identical function names** between prototype and production stores
- **Different store IDs** prevent conflicts
- **Clean migration path** - only import paths differ between prototype/production
- **Composition API** throughout

### 🎨 Visual Differentiation
- Orange banners and borders in prototype mode
- Scenario selector widget shows current data state
- Clear visual indicators prevent confusion

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rapid-ui-prototype-example.git
cd rapid-ui-prototype-example

# Install dependencies
npm install
```

## Running the Application

### Development Mode (Prototypes Enabled)

```bash
# Run with prototypes enabled
ENABLE_PROTOTYPES=true npm run dev
```

Access the application at:
- **Production Home**: http://localhost:3000/
- **Prototype Hub**: http://localhost:3000/prototype
- **Prototype Products**: http://localhost:3000/prototype/products
- **Prototype Cart**: http://localhost:3000/prototype/cart
- **Prototype User**: http://localhost:3000/prototype/user

### Production Mode (Prototypes Disabled)

```bash
# Run without prototypes (404 on prototype routes)
npm run dev
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build with prototypes enabled
ENABLE_PROTOTYPES=true npm run preview

# Preview production build without prototypes
npm run preview
```

## Project Structure

```
rapid-ui-prototype-example/
├── pages/                    # Production pages
├── stores/                   # Production stores (would contain real implementations)
├── prototype/
│   ├── components/          # Prototype UI components
│   ├── stores/              # Mock stores with same function names
│   ├── data/
│   │   ├── generators/      # Dynamic data generators
│   │   └── scenarios/       # Scenario definitions
│   └── pages/              # Prototype pages
├── types/                   # Shared TypeScript types
├── composables/             # Vue composables
└── middleware/              # Route protection
```

## Using This as a GenAI Reference

This repository, combined with the blog post, serves as a complete reference for GenAI agents (like Claude, ChatGPT, or Copilot) to implement a similar prototyping system in your codebase.

### Framework Agnostic Patterns

While this example uses **Nuxt.js/Vue.js**, the patterns demonstrated are applicable to any modern web framework:

- **React/Next.js** - Use Redux/Zustand/MobX stores with the same dual-store pattern
- **Angular** - Implement services with mock/production variants
- **SvelteKit** - Create parallel store implementations
- **Remix/Solid/Qwik** - Apply the same separation of concerns

The core concepts remain the same:
1. Separate mock and production data layers
2. Scenario-based data switching
3. Side-by-side architecture
4. Runtime configuration
5. Clear migration paths

### How to Use with GenAI:

1. **Reference both resources** when prompting your GenAI agent:
   - This repository: https://github.com/yourusername/rapid-ui-prototype-example
   - Blog post: https://github.com/nathanfox/nathan-fox-net-posts/blob/develop/development-practices/genai-rapid-prototyping-system.md

2. **Example prompt for your GenAI agent:**
   ```
   I want to implement a rapid prototyping system in my [React/Vue/Angular/Svelte] application
   following the pattern from https://github.com/yourusername/rapid-ui-prototype-example
   and the blog post at https://github.com/nathanfox/nathan-fox-net-posts/blob/develop/development-practices/genai-rapid-prototyping-system.md

   My application uses [state management library] and I need to prototype [describe features].
   Please adapt the Nuxt/Vue patterns to my [framework] stack.
   Help me set up the dual-mode architecture with mock stores and scenario switching.
   ```

3. **The GenAI agent can reference**:
   - The complete working implementation patterns
   - Mock store architecture with scenario management
   - Data generator patterns for realistic mock data
   - UI component structure for prototype/production separation
   - Migration strategies from prototype to production

## Key Implementation Patterns

### Mock Store Pattern
```typescript
// prototype/stores/product.ts
export const useProductStore = defineStore('mockProduct', () => {
  // Same interface as production, different implementation
})

// stores/product.ts (production)
export const useProductStore = defineStore('product', () => {
  // Real API calls
})
```

### Scenario Management
```typescript
// Scenarios affect multiple stores simultaneously
{
  name: 'cart-full',
  description: 'Shopping Cart - Multiple items',
  stores: {
    products: () => generateProducts(50),
    users: () => generateUsers(5),
    cart: () => generateCartWithItems()
  }
}
```

### Migration Path
The only difference between prototype and production components:
```diff
- import { useProductStore } from '~/prototype/stores/product'
+ import { useProductStore } from '~/stores/product'
```

## Development Workflow

1. **Start with prototypes** - Build UI with mock data
2. **Test scenarios** - Validate edge cases and error states
3. **Get stakeholder approval** - Demo with realistic data
4. **GenAI-assisted migration** - Use your GenAI agent to:
   - Convert prototype components to production versions
   - Generate real API integration code based on mock store patterns
   - Identify differences between prototype and production implementations
   - Suggest optimizations for production code
5. **GenAI-powered synchronization** - Leverage GenAI to:
   - Keep prototypes updated when production code changes
   - Generate new mock scenarios based on production edge cases
   - Maintain consistency between prototype and production types/interfaces
6. **Maintain both** - Keep prototypes for future testing and onboarding

### Example GenAI Sync Prompts

**Prototype → Production:**
```
Here's my approved prototype component at prototype/components/ProductList.vue.
Generate the production version that:
- Uses the production store from ~/stores/product
- Adds proper error handling and loading states
- Includes performance optimizations
- Maintains the same user experience
```

**Production → Prototype:**
```
The production ProductList component has been updated with new filtering options.
Update the prototype version to match these changes while:
- Keeping the mock data functionality
- Maintaining all scenario testing capabilities
- Preserving the ScenarioSelector integration
```

## Environment Configuration

Create `.env` files for different environments:

```bash
# .env.development
ENABLE_PROTOTYPES=true

# .env.production
ENABLE_PROTOTYPES=false  # Or true for staging/demo environments
```

## Technologies Used

- **Nuxt 3** - Vue.js framework
- **Pinia** - State management
- **TypeScript** - Type safety
- **Vue 3 Composition API** - Modern Vue patterns

## Contributing

Contributions are welcome! This example can be extended with:
- Additional mock data generators
- More complex scenario definitions
- Different UI components for testing
- Alternative state management examples

## License

MIT

## Credits

- Blog post: ["Building a GenAI-Powered Rapid Prototyping System"](https://www.nathanfox.net/p/building-a-genai-powered-rapid-prototyping) by Nathan Fox
- Implementation example: This repository

## Support

For questions about implementing this pattern in your organization, visit [nathanfox.net](https://www.nathanfox.net/about) or refer to the blog post for detailed explanations of the concepts.