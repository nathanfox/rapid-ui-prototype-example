<template>
  <div class="prototype-banner">
    <span class="banner-icon">🧪</span>
    <span class="banner-text">
      PROTOTYPE MODE - You are viewing mock data and prototype components
    </span>
    <NuxtLink to="/" class="exit-link">
      Exit to Production →
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// No logic needed for this component
</script>

<style scoped>
.prototype-banner {
  background: linear-gradient(90deg, #ff9800 0%, #ff5722 100%);
  color: white;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.banner-icon {
  font-size: 20px;
  animation: pulse 2s infinite;
}

.banner-text {
  flex: 1;
  font-weight: 500;
}

.exit-link {
  color: white;
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid white;
  border-radius: 4px;
  transition: background 0.3s;
}

.exit-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>