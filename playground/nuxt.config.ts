export default defineNuxtConfig({
  modules: ['../src/module'],
  forgeTelescope: {
    url: 'http://localhost:8000',
    enabled: true,
  },
})
