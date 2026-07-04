<script setup lang="ts">
const { connected, searchQuery, methodFilter, statusFilter, clearAll, filtered, entries } = useTelescope()

const METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']

function toggleStatus(v: string) {
  statusFilter.value = statusFilter.value === v ? '' : v
}
</script>

<template>
  <div class="flex items-center gap-2 px-3 h-10 border-b border-[#2a2a2a] flex-shrink-0 bg-[#111] select-none">
    <!-- Logo -->
    <div class="flex items-center gap-1.5 text-xs font-semibold text-[#00dc82] shrink-0 mr-1">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M11 8v3l2 2" />
      </svg>
      Forge Telescope
    </div>

    <!-- Search -->
    <input
      v-model="searchQuery"
      placeholder="Filter path…"
      class="flex-1 min-w-0 h-6 px-2 text-xs bg-[#1e1e1e] border border-[#2a2a2a] rounded text-[#e8e8e8] placeholder-[#555] outline-none focus:border-[#3a3a3a]"
    />

    <!-- Method -->
    <select
      v-model="methodFilter"
      class="h-6 px-1.5 text-xs bg-[#1e1e1e] border border-[#2a2a2a] rounded text-[#888] outline-none cursor-pointer shrink-0"
    >
      <option value="">All methods</option>
      <option v-for="m in METHODS" :key="m" :value="m">{{ m }}</option>
    </select>

    <!-- Status filters -->
    <div class="flex gap-1 shrink-0">
      <button
        v-for="[label, val] in [['2xx','2'],['4xx','4'],['5xx','5']] as const"
        :key="val"
        class="h-6 px-2 text-[10px] font-semibold rounded border transition-all cursor-pointer"
        :class="statusFilter === val
          ? 'border-[#00dc82] text-[#00dc82] bg-[#00dc82]/10'
          : 'border-[#2a2a2a] text-[#666] hover:text-[#e8e8e8]'"
        @click="toggleStatus(val)"
      >
        {{ label }}
      </button>
    </div>

    <!-- Live dot -->
    <div class="flex items-center gap-1.5 text-[11px] shrink-0" :class="connected ? 'text-[#00dc82]' : 'text-[#fbbf24]'">
      <span
        class="w-1.5 h-1.5 rounded-full"
        :class="connected ? 'bg-[#00dc82] shadow-[0_0_5px_#00dc82] animate-pulse' : 'bg-[#fbbf24]'"
      />
      {{ connected ? 'live' : 'connecting…' }}
    </div>

    <!-- Count -->
    <span class="text-[10px] text-[#888] bg-[#1e1e1e] border border-[#2a2a2a] rounded-full px-2 py-0.5 shrink-0">
      {{ filtered.length !== entries.length ? `${filtered.length} / ${entries.length}` : entries.length }}
    </span>

    <!-- Clear -->
    <button
      class="h-6 px-2.5 text-xs bg-[#1e1e1e] border border-[#2a2a2a] text-[#888] rounded hover:text-[#e8e8e8] hover:border-[#3a3a3a] transition-colors cursor-pointer shrink-0"
      @click="clearAll"
    >
      Clear
    </button>
  </div>
</template>
