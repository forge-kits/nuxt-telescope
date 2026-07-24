# @forge-kits/telescope

[![npm version](https://img.shields.io/npm/v/@forge-kits/telescope.svg)](https://www.npmjs.com/package/@forge-kits/telescope)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.17%2B%20%7C%204-00DC82?logo=nuxt.js)](https://nuxt.com)

A [Nuxt DevTools](https://devtools.nuxt.com) tab that gives you a real-time inspector for your [forge-kits](https://pypi.org/project/forge-kits/) FastAPI backend. Connects over WebSocket and streams every incoming request along with its SQL queries, logs, broadcasts, and cache operations — all in one panel without leaving your Nuxt dev environment.

> Only active in development mode (`nuxt dev`). Zero impact on production builds.

---

## Features

- **Request list** — method, path, status code, duration, timestamp
- **Request detail** — Info · Headers · Payload · Response · Queries · Logs · Broadcasts · Caches tabs
- **SQL inspector** — interpolated query with duration and source location
- **Log viewer** — level badge (DEBUG / INFO / WARNING / ERROR / CRITICAL), logger name, message, time
- **Broadcasts** — channel name, payload, duration
- **Caches** — operation (GET/SET), HIT/MISS badge, key, duration
- **Live filter** — search by path, filter by HTTP method or status class (2xx / 4xx …)
- **Auto-reconnect** — backs off up to 16 s when the backend is down, reconnects instantly on focus

---

## Requirements

- Nuxt `^3.17.0` or `^4.0.0`
- A forge-kits FastAPI backend with the Telescope middleware enabled (exposes `/_forge/telescope/ws`)

---

## Installation

```bash
npm install @forge-kits/telescope
```

---

## Setup

Add the module to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@forge-kits/telescope'],
})
```

That's it. The **Forge Telescope** tab appears in Nuxt DevTools automatically when you run `nuxt dev`.

---

## Configuration

```ts
export default defineNuxtConfig({
  modules: ['@forge-kits/telescope'],

  forgeTelescope: {
    url: 'http://localhost:8000', // base URL of your FastAPI backend
    enabled: true,                // set false to disable the tab entirely
  },
})
```

| Option    | Type      | Default                   | Description                                         |
|-----------|-----------|---------------------------|-----------------------------------------------------|
| `url`     | `string`  | `http://localhost:8000`   | Base URL of the forge-kits backend                  |
| `enabled` | `boolean` | `true`                    | Toggle the DevTools tab without removing the module |

## License

MIT
