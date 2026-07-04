export interface SqlRecord {
  sql: string
  duration_ms: number
  location: string
  params: unknown
}

export interface LogRecord {
  level: string
  logger: string
  message: string
  time: string
}

export interface EventRecord {
  event: string
  listeners: string[]
  background: boolean
}

export interface JobRecord {
  job: string
  status: string
  attempts: number
  duration_ms: number | null
  error: string | null
}

export interface TelescopeEntry {
  id: string
  method: string
  path: string
  query_string: string
  headers: Record<string, string>
  payload: unknown
  timestamp: string
  status: number | null
  duration_ms: number | null
  response_body: unknown
  queries: SqlRecord[]
  logs: LogRecord[]
  events: EventRecord[]
  jobs: JobRecord[]
}

// Module-level singletons so state persists across component re-renders
let ws: WebSocket | null = null
let reconnectDelay = 1000
let reconnectTimer: ReturnType<typeof setTimeout> | null = null


const entries = ref<TelescopeEntry[]>([])
const connected = ref(false)
const selected = ref<TelescopeEntry | null>(null)
const activeTab = ref<string>('info')
const searchQuery = ref('')
const methodFilter = ref('')
const statusFilter = ref('')

export function useTelescope() {
  function getBase(): string {
    if (import.meta.server) return 'http://localhost:8000/_forge/telescope'
    return new URLSearchParams(window.location.search).get('base')
      ?? 'http://localhost:8000/_forge/telescope'
  }

  function wsUrl() {
    return getBase().replace(/^http/, 'ws') + '/ws'
  }

  function connect() {
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
    ws = new WebSocket(wsUrl())

    ws.onopen = () => {
      connected.value = true
      reconnectDelay = 1000
    }

    ws.onmessage = ({ data }) => {
      try {
        const msg = JSON.parse(data)
        if (msg.type === 'init') {
          entries.value = msg.data ?? []
        }
        else if (msg.type === 'entry') {
          entries.value = [msg.data, ...entries.value].slice(0, 200)
        }
        else if (msg.type === 'clear') {
          entries.value = []
          selected.value = null
        }
      }
      catch {}
    }

    ws.onerror = () => { connected.value = false }

    ws.onclose = () => {
      connected.value = false
      if (!document.hidden) {
        reconnectTimer = setTimeout(() => { reconnectTimer = null; connect() }, reconnectDelay)
        reconnectDelay = Math.min(reconnectDelay * 2, 16000)
      }
    }
  }

  function clearAll() {
    ws?.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ type: 'clear' }))
  }

  function select(entry: TelescopeEntry | null) {
    selected.value = entry
    activeTab.value = 'info'
  }

  const filtered = computed(() => {
    const q = searchQuery.value.toLowerCase()
    const m = methodFilter.value
    const s = statusFilter.value
    return entries.value.filter((e) => {
      if (q && !e.path.toLowerCase().includes(q)) return false
      if (m && e.method !== m) return false
      if (s && !String(e.status ?? '').startsWith(s)) return false
      return true
    })
  })

  return {
    entries,
    filtered,
    connected,
    selected,
    activeTab,
    searchQuery,
    methodFilter,
    statusFilter,
    connect,
    clearAll,
    select,
  }
}
