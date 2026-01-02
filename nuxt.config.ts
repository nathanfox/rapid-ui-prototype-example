export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  nitro: {
    preset: 'static'
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      enablePrototypes: process.env.ENABLE_PROTOTYPES === 'true' || false
    }
  },
  pinia: {
    storesDirs: ['./stores/**', './prototype/stores/**']
  }
})