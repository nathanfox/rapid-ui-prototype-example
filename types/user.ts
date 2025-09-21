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