import { existsSync } from 'node:fs'
import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  url: string
  enabled: boolean
}


export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-forgeapi-telescope',
    configKey: 'forgeTelescope',
    compatibility: { nuxt: '>=3.10.0' },
  },
  defaults: {
    url: 'http://localhost:8000',
    enabled: true,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (!nuxt.options.dev || !options.enabled) return

    const serverUrl = options.url.replace(/\/+$/, '')
    const base = encodeURIComponent(`${serverUrl}/_forge/telescope`)

    // dist/client (published) → src/client/.output/public (dev)
    const clientDist = existsSync(resolver.resolve('../dist/client'))
      ? resolver.resolve('../dist/client')
      : resolver.resolve('./client/.output/public')

    if (existsSync(clientDist)) {
      nuxt.hook('nitro:config', (nitroConfig) => {
        nitroConfig.publicAssets ??= []
        nitroConfig.publicAssets.push({
          dir: clientDist,
          baseURL: '/__forge_telescope',
          maxAge: 0,
        })
      })
    }
    else {
      addServerHandler({
        route: '/__forge_telescope',
        handler: resolver.resolve('./server-handlers/fallback.get'),
      })
    }

    nuxt.hook('devtools:customTabs', (tabs) => {
      tabs.push({
        name: 'forge-telescope',
        title: 'Forge Telescope',
        icon: '/__forge_telescope/icon.svg',
        view: {
          type: 'iframe',
          src: `/__forge_telescope/?base=${base}`,
        },
      })
    })
  },
})
