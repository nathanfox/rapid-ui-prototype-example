<template>
  <div class="prototype-container">
    <PrototypeBanner />

    <div class="content">
      <div class="header">
        <h1>User Profile</h1>
        <NuxtLink to="/prototype" class="back-link">← Back to Hub</NuxtLink>
      </div>

      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="!currentUser" class="login-section">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin" class="login-form">
          <input
            v-model="loginEmail"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model="loginPassword"
            type="password"
            placeholder="Password (any value works)"
          />
          <button type="submit" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="divider">OR</div>

        <h2>Register</h2>
        <form @submit.prevent="handleRegister" class="register-form">
          <input
            v-model="registerName"
            type="text"
            placeholder="Name"
            required
          />
          <input
            v-model="registerEmail"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model="registerPassword"
            type="password"
            placeholder="Password (any value works)"
          />
          <button type="submit" :disabled="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <div class="info-box">
          <p>💡 This is a prototype - any password will work!</p>
          <p>Try different user scenarios with the ScenarioSelector.</p>
        </div>
      </div>

      <div v-else class="user-profile">
        <div class="profile-card">
          <h2>Welcome, {{ currentUser.name }}!</h2>

          <div class="profile-info">
            <div class="info-row">
              <strong>Email:</strong> {{ currentUser.email }}
            </div>
            <div class="info-row">
              <strong>Role:</strong>
              <span class="role-badge" :class="currentUser.role">
                {{ currentUser.role }}
              </span>
            </div>
            <div class="info-row">
              <strong>User ID:</strong> {{ currentUser.id }}
            </div>
          </div>

          <h3>Preferences</h3>
          <div class="preferences">
            <div class="pref-row">
              <strong>Theme:</strong>
              <select v-model="currentUser.preferences.theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div class="pref-row">
              <strong>Language:</strong> {{ currentUser.preferences.language }}
            </div>
            <div class="pref-row">
              <strong>Notifications:</strong>
              <input
                type="checkbox"
                v-model="currentUser.preferences.notifications"
              />
              <span>{{ currentUser.preferences.notifications ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>

          <button @click="handleLogout" class="logout-btn">
            Logout
          </button>
        </div>

        <div class="user-list">
          <h3>All Users in System ({{ users.length }})</h3>
          <div class="user-grid">
            <div
              v-for="user in users"
              :key="user.id"
              class="user-card"
              :class="{ active: user.id === currentUser.id }"
            >
              <div class="user-name">{{ user.name }}</div>
              <div class="user-email">{{ user.email }}</div>
              <div class="user-role">{{ user.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ScenarioSelector />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/prototype/stores/user'
import ScenarioSelector from '~/prototype/components/ScenarioSelector.vue'
import PrototypeBanner from '~/prototype/components/PrototypeBanner.vue'

definePageMeta({
  middleware: 'prototype'
})

const userStore = useUserStore()
const { currentUser, users, loading, error } = storeToRefs(userStore)

// Login form
const loginEmail = ref('')
const loginPassword = ref('')

// Register form
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const handleLogin = async () => {
  await userStore.login(loginEmail.value, loginPassword.value)
  loginEmail.value = ''
  loginPassword.value = ''
}

const handleRegister = async () => {
  await userStore.register(registerName.value, registerEmail.value, registerPassword.value)
  registerName.value = ''
  registerEmail.value = ''
  registerPassword.value = ''
}

const handleLogout = async () => {
  await userStore.logout()
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

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.login-section {
  max-width: 600px;
  margin: 0 auto;
}

.login-form,
.register-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.login-form h2,
.register-form h2 {
  margin-top: 0;
  color: #333;
}

.login-form input,
.register-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-form button,
.register-form button {
  width: 100%;
  padding: 12px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.login-form button:hover:not(:disabled),
.register-form button:hover:not(:disabled) {
  background: #ff6b6b;
}

.login-form button:disabled,
.register-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 20px 0;
  color: #999;
  font-weight: bold;
}

.info-box {
  background: #d1ecf1;
  color: #0c5460;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
}

.info-box p {
  margin: 5px 0;
}

.user-profile {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-card h2 {
  color: #333;
  margin-top: 0;
}

.profile-card h3 {
  color: #666;
  margin-top: 30px;
  margin-bottom: 15px;
}

.profile-info,
.preferences {
  margin-bottom: 20px;
}

.info-row,
.pref-row {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-row:last-child,
.pref-row:last-child {
  border-bottom: none;
}

.info-row strong,
.pref-row strong {
  color: #666;
  min-width: 120px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #ff9800;
  color: white;
}

.role-badge.customer {
  background: #4caf50;
  color: white;
}

.preferences select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.logout-btn {
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.logout-btn:hover {
  background: #d32f2f;
}

.user-list {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-list h3 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
}

.user-grid {
  display: grid;
  gap: 15px;
}

.user-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  transition: all 0.3s;
}

.user-card.active {
  background: #fff3cd;
  border-color: #ff9800;
}

.user-card:hover {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.user-email {
  color: #666;
  font-size: 14px;
}

.user-role {
  margin-top: 5px;
  display: inline-block;
  padding: 2px 8px;
  background: #e9ecef;
  border-radius: 3px;
  font-size: 12px;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .user-profile {
    grid-template-columns: 1fr;
  }
}
</style>