import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  return `<!DOCTYPE html>
<html>
<body style="font-family:monospace;padding:2rem;background:#111;color:#e8e8e8">
  <h2 style="color:#00dc82">Forge Telescope</h2>
  <p style="color:#666">Client app not built yet.</p>
  <pre style="color:#fb923c">npm run build:client</pre>
  <p style="color:#666">Then restart the dev server.</p>
</body>
</html>`
})
