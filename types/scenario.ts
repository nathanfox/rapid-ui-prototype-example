export interface DataScenario<T = any> {
  name: string
  description: string
  data: () => T
  delay?: number
  error?: Error
}

export interface ScenarioDefinition {
  name: string
  description: string
  stores: {
    products?: () => any
    users?: () => any
    cart?: () => any
  }
  delay?: number
  error?: Error
}