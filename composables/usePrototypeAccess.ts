export const usePrototypeAccess = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  const isPrototypesEnabled = computed(() => config.public.enablePrototypes)
  const isPrototypePage = computed(() => route.path.startsWith('/prototype'))

  const canAccessPrototypes = computed(() => {
    // Check if prototypes are enabled via environment variable
    return isPrototypesEnabled.value
  })

  return {
    isPrototypesEnabled: readonly(isPrototypesEnabled),
    isPrototypePage: readonly(isPrototypePage),
    canAccessPrototypes: readonly(canAccessPrototypes)
  }
}