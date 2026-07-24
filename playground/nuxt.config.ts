export default defineNuxtConfig({
  modules: ['../src/module', '@forge-kits/nuxt'],
  forgeApi: {
    credentials: false,
    auth:{
      autoFetch: false,
    }
  },
  forgeTelescope: {
    url: 'http://localhost:8000',
    enabled: true,
  },
})
