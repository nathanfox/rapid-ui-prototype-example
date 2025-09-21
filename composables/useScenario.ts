import { scenarioManager } from '~/prototype/data/scenarios'

// Global state that persists across navigation
const globalSelectedScenario = ref('normal')
const globalScenarioDetails = ref<any>({})
const globalIsLoading = ref(false)
const globalError = ref<string | null>(null)
const hasInitialized = ref(false)

export const useScenario = () => {
  const selectedScenario = globalSelectedScenario
  const currentScenarioDetails = globalScenarioDetails
  const isLoading = globalIsLoading
  const error = globalError

  const availableScenarios = computed(() => scenarioManager.getAllScenarios())

  const loadScenario = async (name: string) => {
    isLoading.value = true
    error.value = null

    try {
      const scenario = scenarioManager.getScenario(name)
      if (!scenario) {
        throw new Error(`Scenario ${name} not found`)
      }

      await scenarioManager.loadScenario(name)
      currentScenarioDetails.value = scenario
      selectedScenario.value = name

      // If error scenario loaded successfully, stores should show error state
      if (scenario.error) {
        // Trigger error in stores by setting their error state
        const { useProductStore } = await import('~/prototype/stores/product')
        const { useUserStore } = await import('~/prototype/stores/user')
        const { useCartStore } = await import('~/prototype/stores/cart')

        const productStore = useProductStore()
        const userStore = useUserStore()
        const cartStore = useCartStore()

        // Set error state in stores
        productStore.setError(scenario.error.message)
        userStore.setError(scenario.error.message)
        cartStore.setError(scenario.error.message)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load scenario'
      console.error('Failed to load scenario:', e)

      // Also show error in UI
      currentScenarioDetails.value = {
        name: name,
        description: 'Error loading scenario',
        error: e instanceof Error ? e.message : 'Unknown error'
      }
    } finally {
      isLoading.value = false
    }
  }

  const refreshScenario = async () => {
    await loadScenario(selectedScenario.value)
  }

  // Load initial scenario only once
  onMounted(() => {
    if (!hasInitialized.value) {
      hasInitialized.value = true
      loadScenario('normal')
    }
  })

  return {
    availableScenarios: readonly(availableScenarios),
    selectedScenario,
    currentScenarioDetails: readonly(currentScenarioDetails),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadScenario,
    refreshScenario
  }
}