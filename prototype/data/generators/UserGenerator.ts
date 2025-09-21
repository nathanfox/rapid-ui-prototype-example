import { MockDataGenerator } from './MockDataGenerator'
import type { User } from '~/types/user'

export class UserGenerator extends MockDataGenerator<User> {
  private userCount = 0

  constructor() {
    super()

    this.register('id', () => {
      this.userCount++
      return `user_${this.userCount}_${Date.now()}`
    })

    this.register('name', () => this.generateName())
    this.register('email', () => this.generateEmail())
    this.register('role', () => Math.random() > 0.9 ? 'admin' : 'customer')
    this.register('preferences', () => ({
      theme: Math.random() > 0.5 ? 'light' : 'dark',
      language: 'en',
      notifications: Math.random() > 0.3
    }))
  }

  private generateName(): string {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller']
    const first = firstNames[Math.floor(Math.random() * firstNames.length)]
    const last = lastNames[Math.floor(Math.random() * lastNames.length)]
    return `${first} ${last}`
  }

  private generateEmail(): string {
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com']
    const username = `user${Math.floor(Math.random() * 10000)}`
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return `${username}@${domain}`
  }
}