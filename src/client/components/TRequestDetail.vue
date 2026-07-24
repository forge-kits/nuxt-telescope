<script setup lang="ts">
const { selected, activeTab, select } = useTelescope()

const e = computed(() => selected.value)

const tabs = computed(() => {
  const d = e.value
  if (!d) return []
  return [
    { id: 'info', label: 'Info' },
    { id: 'headers', label: 'Headers' },
    { id: 'payload', label: 'Payload' },
    { id: 'response', label: 'Response' },
    { id: 'queries', label: 'Queries', count: d.queries.length },
    { id: 'logs', label: 'Logs', count: d.logs.length },
    { id: 'broadcasts', label: 'Broadcasts', count: d.broadcasts?.length },
    { id: 'caches', label: 'Caches', count: d.caches?.length },
  ]
})

function statusCls(s: number | null) {
  if (!s) return 'text-[#888]'
  if (s < 300) return 'text-[#00dc82]'
  if (s < 400) return 'text-[#22d3ee]'
  if (s < 500) return 'text-[#fbbf24]'
  return 'text-[#f87171]'
}

function durCls(ms: number | null) {
  if (!ms) return ''
  return ms > 2000 ? 'text-[#f87171]' : ms > 500 ? 'text-[#fbbf24]' : ''
}

function pretty(v: unknown) {
  try { return JSON.stringify(v, null, 2) } catch { return String(v) }
}

function interpolateSql(sql: string, params: unknown): string {
  if (!params || !Array.isArray(params) || params.length === 0) return sql
  let i = 0
  return sql.replace(/\?/g, () => {
    const val = params[i++]
    if (val === null || val === undefined) return 'NULL'
    if (typeof val === 'string') return `'${val}'`
    return String(val)
  })
}

const expandedParams = ref<Record<number, boolean>>({})

const LEVEL_CLS: Record<string, string> = {
  DEBUG: 'text-[#94a3b8] bg-[#94a3b8]/10',
  INFO: 'text-[#4f9eff] bg-[#4f9eff]/10',
  WARNING: 'text-[#fbbf24] bg-[#fbbf24]/10',
  ERROR: 'text-[#f87171] bg-[#f87171]/10',
  CRITICAL: 'text-[#f87171] bg-[#f87171]/20',
}
</script>

<template>
  <!-- Empty state -->
  <div v-if="!e" class="h-full flex items-center justify-center text-xs text-[#888]">
    Select a request to inspect
  </div>

  <div v-else class="h-full flex flex-col">
    <!-- Tabs -->
    <div class="flex items-center border-b border-[#2a2a2a] flex-shrink-0 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-1 px-3 py-2 text-[11px] border-b-2 transition-colors whitespace-nowrap cursor-pointer"
        :class="activeTab === tab.id
          ? 'border-[#00dc82] text-[#00dc82]'
          : 'border-transparent text-[#aaa] hover:text-[#e8e8e8]'"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <span
          v-if="tab.count"
          class="text-[9px] px-1 rounded leading-none"
          :class="activeTab === tab.id ? 'bg-[#00dc82]/15 text-[#00dc82]' : 'bg-[#1e1e1e] text-[#aaa]'"
        >{{ tab.count }}</span>
      </button>
      <button class="ml-auto px-3 py-2 text-[#aaa] hover:text-[#e8e8e8] text-sm cursor-pointer" @click="select(null)">✕</button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-3 text-xs">

      <!-- INFO -->
      <template v-if="activeTab === 'info'">
        <div class="flex flex-wrap gap-4 mb-4">
          <div v-for="[lbl, val, cls] in [
            ['Method', e.method, 'text-[#e8e8e8]'],
            ['Status', String(e.status ?? '—'), statusCls(e.status)],
            ['Duration', e.duration_ms != null ? `${e.duration_ms}ms` : '—', durCls(e.duration_ms)],
            ['Time', new Date(e.timestamp).toLocaleTimeString(), 'text-[#e8e8e8]'],
          ] as const" :key="lbl">
            <div class="flex flex-col gap-0.5">
              <span class="text-[9px] text-[#888] uppercase tracking-wide">{{ lbl }}</span>
              <span class="font-medium" :class="cls">{{ val }}</span>
            </div>
          </div>
        </div>
        <div class="text-[9px] text-[#888] uppercase tracking-wide mb-1.5">Path</div>
        <pre class="bg-[#1e1e1e] border border-[#2a2a2a] rounded p-2.5 text-[11px] leading-relaxed whitespace-pre-wrap break-all">{{ e.path }}{{ e.query_string ? '?' + e.query_string : '' }}</pre>
      </template>

      <!-- HEADERS -->
      <template v-else-if="activeTab === 'headers'">
        <div v-if="!Object.keys(e.headers).length" class="text-[#888]">No headers</div>
        <div
          v-for="[k, v] in Object.entries(e.headers)"
          :key="k"
          class="grid gap-3 py-1.5 border-b border-[#2a2a2a]/50"
          style="grid-template-columns:180px 1fr"
        >
          <span class="text-[#888] truncate">{{ k }}</span>
          <span :class="v === '***' ? 'text-[#555] italic' : 'text-[#e8e8e8]'">{{ v }}</span>
        </div>
      </template>

      <!-- PAYLOAD -->
      <template v-else-if="activeTab === 'payload'">
        <div v-if="e.payload == null" class="text-[#888]">No payload</div>
        <pre v-else class="bg-[#1e1e1e] border border-[#2a2a2a] rounded p-2.5 text-[11px] leading-relaxed whitespace-pre-wrap break-all overflow-x-auto">{{ pretty(e.payload) }}</pre>
      </template>

      <!-- RESPONSE -->
      <template v-else-if="activeTab === 'response'">
        <div v-if="e.response_body == null" class="text-[#888]">No response body</div>
        <pre v-else class="bg-[#1e1e1e] border border-[#2a2a2a] rounded p-2.5 text-[11px] leading-relaxed whitespace-pre-wrap break-all overflow-x-auto">{{ pretty(e.response_body) }}</pre>
      </template>

      <!-- QUERIES -->
      <template v-else-if="activeTab === 'queries'">
        <div v-if="!e.queries.length" class="text-[#888]">No queries</div>
        <div v-for="(q, i) in e.queries" :key="i" class="bg-[#1a1a1a] border border-[#2a2a2a] rounded p-3 mb-2">
          <pre class="text-[11px] leading-relaxed whitespace-pre-wrap break-all text-[#e8e8e8] mb-2">{{ interpolateSql(q.sql, q.params) }}</pre>
          <div class="flex items-center gap-3 text-[10px] flex-wrap">
            <span :class="q.duration_ms > 500 ? 'text-[#fbbf24]' : 'text-[#888]'">{{ q.duration_ms }}ms</span>
            <span v-if="q.location" class="text-[#aaa] truncate flex-1" :title="q.location">{{ q.location }}</span>
            <button
              v-if="q.params && Array.isArray(q.params) && q.params.length"
              class="text-[#888] hover:text-[#e8e8e8] cursor-pointer ml-auto shrink-0"
              @click="expandedParams[i] = !expandedParams[i]"
            >
              params {{ expandedParams[i] ? '▲' : '▼' }}
            </button>
          </div>
          <pre v-if="expandedParams[i]" class="mt-2 bg-[#111] border border-[#2a2a2a] rounded p-2 text-[10px] whitespace-pre-wrap break-all text-[#888]">{{ pretty(q.params) }}</pre>
        </div>
      </template>

      <!-- LOGS -->
      <template v-else-if="activeTab === 'logs'">
        <div v-if="!e.logs.length" class="text-[#888]">No logs</div>
        <div
          v-for="(l, i) in e.logs"
          :key="i"
          class="flex gap-2 py-1.5 border-b border-[#2a2a2a]/50 items-baseline"
        >
          <span
            class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 w-16 text-center leading-none"
            :class="LEVEL_CLS[l.level] ?? 'text-[#888] bg-[#888]/10'"
          >{{ l.level }}</span>
          <span class="text-[#aaa] shrink-0 w-28 truncate text-[10px]" :title="l.logger">{{ l.logger }}</span>
          <span class="flex-1 break-words text-[#e8e8e8]">{{ l.message }}</span>
          <span class="text-[#aaa] text-[10px] shrink-0">{{ l.time }}</span>
        </div>
      </template>

      <!-- BROADCASTS -->
      <template v-else-if="activeTab === 'broadcasts'">
        <div v-if="!e.broadcasts?.length" class="text-[#888]">No broadcasts</div>
        <div v-for="(b, i) in e.broadcasts" :key="i" class="bg-[#1a1a1a] border border-[#2a2a2a] rounded p-3 mb-2">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[#fb923c] font-medium text-[11px]">{{ b.channel }}</span>
            <span class="text-[10px] text-[#888]">{{ b.duration_ms }}ms</span>
          </div>
          <pre class="text-[11px] leading-relaxed whitespace-pre-wrap break-all text-[#e8e8e8]">{{ pretty(b.payload) }}</pre>
        </div>
      </template>

      <!-- CACHES -->
      <template v-else-if="activeTab === 'caches'">
        <div v-if="!e.caches?.length" class="text-[#888]">No cache operations</div>
        <div
          v-for="(c, i) in e.caches"
          :key="i"
          class="flex items-center gap-3 py-1.5 border-b border-[#2a2a2a]/50 text-xs"
        >
          <span
            class="text-[9px] font-bold px-1.5 py-0.5 rounded w-8 text-center leading-none shrink-0"
            :class="c.op === 'get' ? 'text-[#4f9eff] bg-[#4f9eff]/15' : 'text-[#00dc82] bg-[#00dc82]/15'"
          >{{ c.op.toUpperCase() }}</span>
          <span
            v-if="c.op === 'get'"
            class="text-[9px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0"
            :class="c.hit ? 'text-[#00dc82] bg-[#00dc82]/15' : 'text-[#f87171] bg-[#f87171]/15'"
          >{{ c.hit ? 'HIT' : 'MISS' }}</span>
          <span v-else class="w-[42px] shrink-0" />
          <span class="flex-1 text-[#e8e8e8] truncate font-mono" :title="c.key">{{ c.key }}</span>
          <span class="text-[#888] text-[10px] shrink-0">{{ c.duration_ms }}ms</span>
        </div>
      </template>

    </div>
  </div>
</template>
