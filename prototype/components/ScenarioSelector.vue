<template>
  <div class="scenario-selector">
    <div class="scenario-header">
      <span class="icon">🧪</span>
      <span>Prototype Mode - Mock Data</span>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <select
      v-model="selectedScenario"
      @change="handleScenarioChange"
      :disabled="isLoading"
    >
      <option
        v-for="scenario in availableScenarios"
        :key="scenario.name"
        :value="scenario.name"
      >
        {{ scenario.description }}
      </option>
    </select>

    <button @click="refreshScenario" :disabled="isLoading">
      <span v-if="isLoading">Loading...</span>
      <span v-else>↻ Refresh</span>
    </button>

    <details class="scenario-info">
      <summary>Current Scenario Details</summary>
      <div class="scenario-details">
        <div class="detail-row">
          <strong>Scenario:</strong> {{ currentScenarioDetails.name }}
        </div>
        <div class="detail-row">
          <strong>Stores Modified:</strong>
          <span v-if="affectedStores.length > 0" class="stores-list">
            <span v-for="store in affectedStores" :key="store" class="store-tag">{{ store }}</span>
          </span>
          <span v-else class="no-stores">None (Error simulation)</span>
        </div>
        <div v-if="currentScenarioDetails.delay" class="detail-row">
          <strong>Simulated Delay:</strong> {{ currentScenarioDetails.delay }}ms
        </div>
        <div v-if="currentScenarioDetails.error" class="detail-row">
          <strong>Simulated Error:</strong> {{ currentScenarioDetails.error.message || currentScenarioDetails.error }}
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { useScenario } from '~/composables/useScenario'

const {
  availableScenarios,
  selectedScenario,
  currentScenarioDetails,
  isLoading,
  error,
  loadScenario,
  refreshScenario
} = useScenario()

const affectedStores = computed(() => {
  if (!currentScenarioDetails.value?.description) return []

  // Extract affected stores from the description
  const match = currentScenarioDetails.value.description.match(/\[Affects: ([^\]]+)\]/)
  if (match && match[1]) {
    if (match[1].includes('None')) return []
    return match[1].split(', ').map((s: string) => s.trim())
  }

  // Fallback to checking stores object
  if (!currentScenarioDetails.value?.stores) return []
  const stores = []
  if (currentScenarioDetails.value.stores.products) stores.push('Products')
  if (currentScenarioDetails.value.stores.users) stores.push('Users')
  if (currentScenarioDetails.value.stores.cart) stores.push('Cart')
  return stores
})

const handleScenarioChange = async () => {
  await loadScenario(selectedScenario.value)
}
</script>

<style scoped>
.scenario-selector {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 2px solid #ff9800;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 280px;
}

.scenario-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #ff6b6b;
}

.scenario-header .icon {
  font-size: 20px;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  background: white;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #ff9800;
}

select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button {
  padding: 6px 12px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

button:hover:not(:disabled) {
  background: #ff6b6b;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.scenario-info {
  margin-top: 12px;
}

.scenario-info summary {
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.scenario-info summary:hover {
  color: #ff9800;
}

.scenario-details {
  margin-top: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
}

.detail-row {
  margin-bottom: 8px;
  line-height: 1.4;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row strong {
  color: #666;
  margin-right: 8px;
}

.stores-list {
  display: inline-flex;
  gap: 6px;
}

.store-tag {
  background: #ff9800;
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
}

.no-stores {
  color: #999;
  font-style: italic;
}
</style>