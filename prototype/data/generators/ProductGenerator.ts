import { MockDataGenerator } from './MockDataGenerator'
import type { Product } from '~/types/product'

export class ProductGenerator extends MockDataGenerator<Product> {
  private productCount = 0

  constructor() {
    super()

    this.register('id', () => {
      this.productCount++
      return `prod_${this.productCount}_${Date.now()}`
    })

    this.register('name', () => this.generateProductName())
    this.register('description', () => this.generateDescription())
    this.register('price', () => this.generatePrice())
    this.register('category', () => this.generateCategory())
    this.register('inventory', () => Math.floor(Math.random() * 100))
    this.register('rating', () => Number((3 + Math.random() * 2).toFixed(1)))
    this.register('images', () => this.generateImages())
    this.register('tags', () => this.generateTags())
  }

  private generateProductName(): string {
    const adjectives = ['Premium', 'Eco-Friendly', 'Smart', 'Wireless', 'Professional', 'Ultra', 'Compact']
    const products = ['Headphones', 'Keyboard', 'Monitor', 'Mouse', 'Laptop', 'Speaker', 'Camera', 'Tablet']
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const prod = products[Math.floor(Math.random() * products.length)]
    return `${adj} ${prod}`
  }

  private generateDescription(): string {
    const descriptions = [
      'High-quality product with premium features and exceptional performance.',
      'Designed for professionals who demand the best in their tools.',
      'Perfect for everyday use with outstanding reliability.',
      'Cutting-edge technology meets elegant design.',
      'Experience the difference with our innovative approach.'
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  private generatePrice(): number {
    const base = 20 + Math.random() * 980
    return Math.round(base * 100) / 100
  }

  private generateCategory(): string {
    const categories = ['Electronics', 'Computers', 'Audio', 'Accessories', 'Gaming']
    return categories[Math.floor(Math.random() * categories.length)]
  }

  private generateImages(): string[] {
    const count = 1 + Math.floor(Math.random() * 3)
    return Array.from({ length: count }, () =>
      `https://picsum.photos/seed/${Math.random()}/400/400`
    )
  }

  private generateTags(): string[] {
    const allTags = ['bestseller', 'new', 'sale', 'featured', 'limited', 'exclusive', 'trending']
    const count = Math.floor(Math.random() * 4)
    const tags: string[] = []

    for (let i = 0; i < count; i++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)]
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }

    return tags
  }
}