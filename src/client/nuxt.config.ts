export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  ssr: false,
  devtools: { enabled: false },
  app: {
    baseURL: '/__forge_telescope/',
  },
})
