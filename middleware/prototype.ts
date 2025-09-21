export default defineNuxtRouteMiddleware(() => {
  const { public: { enablePrototypes } } = useRuntimeConfig()

  if (!enablePrototypes) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found'
    })
  }
})