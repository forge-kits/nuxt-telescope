import type { Config } from 'tailwindcss'

export default {
  content: [
    './app.vue',
    './components/**/*.vue',
    './composables/**/*.ts',
  ],
  theme: {
    extend: {},
  },
} satisfies Config
