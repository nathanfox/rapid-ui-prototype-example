import type { ScenarioDefinition } from '~/types/scenario'

export class ScenarioManager {
  private scenarios: Map<string, ScenarioDefinition> = new Map()

  register(scenario: ScenarioDefinition): void {
    this.scenarios.set(scenario.name, scenario)
  }

  getScenario(name: string): ScenarioDefinition | undefined {
    return this.scenarios.get(name)
  }

  getAllScenarios(): ScenarioDefinition[] {
    return Array.from(this.scenarios.values())
  }

  async loadScenario(name: string, preserveCart: boolean = false): Promise<void> {
    const scenario = this.scenarios.get(name)
    if (!scenario) throw new Error(`Scenario ${name} not found`)

    // Import stores dynamically to avoid circular dependencies
    const { useProductStore } = await import('~/prototype/stores/product')
    const { useUserStore } = await import('~/prototype/stores/user')
    const { useCartStore } = await import('~/prototype/stores/cart')

    // Simulate delay if specified
    if (scenario.delay) {
      await new Promise(resolve => setTimeout(resolve, scenario.delay))
    }

    // Simulate error if specified
    if (scenario.error) {
      throw scenario.error
    }

    // Load data into each store
    if (scenario.stores.products) {
      const productStore = useProductStore()
      productStore.loadData(scenario.stores.products())
    }

    if (scenario.stores.users) {
      const userStore = useUserStore()
      userStore.loadData(scenario.stores.users())
    }

    // Only update cart if scenario explicitly defines cart data and preserveCart is false
    if (scenario.stores.cart && !preserveCart) {
      const cartStore = useCartStore()
      cartStore.loadData(scenario.stores.cart())
    }
  }
}