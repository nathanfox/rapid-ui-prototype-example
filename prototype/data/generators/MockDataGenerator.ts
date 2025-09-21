export class MockDataGenerator<T> {
  private generators: Map<keyof T, () => any> = new Map()

  register<K extends keyof T>(field: K, generator: () => T[K]): void {
    this.generators.set(field, generator)
  }

  generate(overrides?: Partial<T>): T {
    const generated = {} as T

    for (const [field, generator] of this.generators) {
      generated[field] = generator()
    }

    return { ...generated, ...overrides }
  }

  generateMany(count: number, overrides?: Partial<T>[]): T[] {
    return Array.from({ length: count }, (_, i) =>
      this.generate(overrides?.[i])
    )
  }
}