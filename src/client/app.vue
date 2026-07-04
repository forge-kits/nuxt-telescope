<script setup lang="ts">
const { connect, selected } = useTelescope()

const detailHeight = ref(300)
const isDragging = ref(false)
const containerRef = ref<HTMLElement>()

function startDrag(e: MouseEvent) {
  e.preventDefault()
  isDragging.value = true

  const startY = e.clientY
  const startHeight = detailHeight.value

  function onMove(e: MouseEvent) {
    const delta = startY - e.clientY
    const containerH = containerRef.value?.clientHeight ?? window.innerHeight
    detailHeight.value = Math.min(Math.max(startHeight + delta, 80), containerH - 80)
  }

  function onUp() {
    isDragging.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

onMounted(() => {
  connect()
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) connect()
  })
})
</script>

<template>
  <div ref="containerRef" class="h-screen flex flex-col font-mono text-sm overflow-hidden bg-[#111] text-[#e8e8e8]">
    <TToolbar />
    <div class="flex flex-col flex-1 min-h-0">
      <!-- List -->
      <div class="flex-1 min-h-0 overflow-hidden">
        <TRequestList />
      </div>

      <!-- Resize handle -->
      <div
        class="flex-shrink-0 h-[4px] border-t border-[#2a2a2a] cursor-row-resize flex items-center justify-center group hover:border-[#00dc82] transition-colors"
        :class="isDragging ? 'border-[#00dc82]' : ''"
        @mousedown="startDrag"
      >
        <div class="w-8 h-[2px] rounded-full bg-[#2a2a2a] group-hover:bg-[#00dc82] transition-colors" :class="isDragging ? 'bg-[#00dc82]' : ''" />
      </div>

      <!-- Detail panel -->
      <div
        class="flex-shrink-0 overflow-hidden"
        :style="{ height: detailHeight + 'px' }"
        :class="isDragging ? 'select-none' : ''"
      >
        <TRequestDetail />
      </div>
    </div>
  </div>
</template>
