import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { UserGenerator } from '../data/generators/UserGenerator'
import type { User } from '~/types/user'

export const useUserStore = defineStore('mockUser', () => {
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const generator = new UserGenerator()

  const login = async (email: string, _password: string) => {
    loading.value = true
    error.value = null

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // Mock login - just find or create a user with that email
      let user = users.value.find(u => u.email === email)

      if (!user) {
        user = generator.generate({ email })
        users.value.push(user)
      }

      currentUser.value = user
      return user
    } catch (e) {
      error.value = 'Login failed'
      return null
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 200))
    currentUser.value = null
    loading.value = false
  }

  const register = async (name: string, email: string, _password: string) => {
    loading.value = true
    error.value = null

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      const user = generator.generate({ name, email })
      users.value.push(user)
      currentUser.value = user
      return user
    } catch (e) {
      error.value = 'Registration failed'
      return null
    } finally {
      loading.value = false
    }
  }

  const loadData = (data: User[]) => {
    users.value = data
    if (data.length > 0 && !currentUser.value) {
      currentUser.value = data[0]
    }
    error.value = null
  }

  const generateUsers = (count: number = 5) => {
    users.value = generator.generateMany(count)
    if (users.value.length > 0 && !currentUser.value) {
      currentUser.value = users.value[0]
    }
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
    loading.value = false
  }

  // Initialize with some users
  generateUsers(5)

  return {
    currentUser: readonly(currentUser),
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    login,
    logout,
    register,
    loadData,
    generateUsers,
    setError
  }
})