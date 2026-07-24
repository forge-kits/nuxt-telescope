<script setup lang="ts">
import type { TelescopeEntry } from '../composables/useTelescope'

const { filtered, selected, select } = useTelescope()

const METHOD_CLS: Record<string, string> = {
  GET: 'text-[#4f9eff] bg-[#4f9eff]/15',
  POST: 'text-[#00dc82] bg-[#00dc82]/15',
  PATCH: 'text-[#fbbf24] bg-[#fbbf24]/15',
  PUT: 'text-[#fb923c] bg-[#fb923c]/15',
  DELETE: 'text-[#f87171] bg-[#f87171]/15',
}

function statusCls(s: number | null) {
  if (!s) return 'text-[#e8e8e8]'
  if (s < 300) return 'text-[#00dc82]'
  if (s < 400) return 'text-[#22d3ee]'
  if (s < 500) return 'text-[#fbbf24]'
  return 'text-[#f87171]'
}

function durCls(ms: number | null) {
  if (!ms) return 'text-[#e8e8e8]'
  return ms > 2000 ? 'text-[#f87171]' : ms > 500 ? 'text-[#fbbf24]' : 'text-[#e8e8e8]'
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  return d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0')
}

function chips(e: TelescopeEntry) {
  return [
    e.queries.length && { t: `Q${e.queries.length}`, c: 'text-[#4f9eff] bg-[#4f9eff]/15' },
    e.logs.length && { t: `L${e.logs.length}`, c: 'text-[#c084fc] bg-[#c084fc]/15' },
    e.broadcasts?.length && { t: `B${e.broadcasts.length}`, c: 'text-[#fb923c] bg-[#fb923c]/15' },
    e.caches?.length && { t: `C${e.caches.length}`, c: 'text-[#22d3ee] bg-[#22d3ee]/15' },
  ].filter(Boolean) as { t: string, c: string }[]
}

const GRID = '68px 1fr 64px 80px 88px 96px'
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">

    <!-- Header -->
    <div
      class="grid px-3 h-7 border-b border-[#2a2a2a] shrink-0 items-center text-[10px] uppercase tracking-wide text-[#888] select-none"
      :style="{ gridTemplateColumns: GRID }"
    >
      <span>Method</span>
      <span>Path</span>
      <span class="text-right">Status</span>
      <span class="text-right">Time</span>
      <span>Info</span>
      <span class="text-right">At</span>
    </div>

    <!-- Rows -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="e in filtered"
        :key="e.id"
        class="grid px-3 h-8 items-center border-b border-[#2a2a2a]/50 cursor-pointer transition-colors hover:bg-[#1e1e1e]"
        :class="selected?.id === e.id ? 'bg-[#4f9eff]/5' : ''"
        :style="{ gridTemplateColumns: GRID }"
        @click="select(e)"
      >
        <div>
          <span
            class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded leading-none"
            :class="METHOD_CLS[e.method] ?? 'text-[#aaa] bg-[#aaa]/15'"
          >{{ e.method }}</span>
        </div>

        <span class="truncate text-xs text-[#e8e8e8]" :title="e.path">{{ e.path }}</span>

        <span class="text-right text-[11px] font-semibold" :class="statusCls(e.status)">
          {{ e.status ?? '—' }}
        </span>

        <span class="text-right text-[11px]" :class="durCls(e.duration_ms)">
          {{ e.duration_ms != null ? `${e.duration_ms}ms` : '—' }}
        </span>

        <div class="flex gap-0.5 items-center">
          <span
            v-for="c in chips(e)"
            :key="c.t"
            class="text-[9px] font-bold px-1 py-0.5 rounded leading-none"
            :class="c.c"
          >{{ c.t }}</span>
        </div>

        <span class="text-right text-[10px] text-[#e8e8e8]">{{ fmtTime(e.timestamp) }}</span>
      </div>

      <div v-if="filtered.length === 0" class="flex items-center justify-center h-20 text-xs text-[#888]">
        Waiting for requests…
      </div>
    </div>

  </div>
</template>
