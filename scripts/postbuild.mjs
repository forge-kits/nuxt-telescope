import { cpSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const clientSrc = resolve(root, 'src/client/.output/public')
const clientDst = resolve(root, 'dist/client')

const handlersSrc = resolve(root, 'src/server-handlers')
const handlersDst = resolve(root, 'dist/server-handlers')

if (existsSync(clientSrc)) {
  cpSync(clientSrc, clientDst, { recursive: true })
  console.log('✔ Copied client assets → dist/client')
} else {
  console.warn('⚠ Client build not found, skipping dist/client copy')
}

cpSync(handlersSrc, handlersDst, { recursive: true })
console.log('✔ Copied server-handlers → dist/server-handlers')
