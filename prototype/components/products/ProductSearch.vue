<template>
  <div class="product-search">
    <input
      v-model="searchQuery"
      @keyup.enter="handleSearch"
      type="text"
      placeholder="Search products..."
      class="search-input"
    />
    <button @click="handleSearch" class="search-button">
      🔍 Search
    </button>
    <button @click="clearSearch" class="clear-button" v-if="searchQuery">
      ✕ Clear
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'search', query: string): void
}

const emit = defineEmits<Emits>()

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}
</script>

<style scoped>
.product-search {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #ff9800;
}

.search-button {
  padding: 12px 24px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background: #ff6b6b;
}

.clear-button {
  padding: 12px 20px;
  background: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.clear-button:hover {
  background: #444;
}
</style>