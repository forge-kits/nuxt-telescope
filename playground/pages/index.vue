<script setup lang="ts">
const API = 'http://localhost:8000/api/v1'

interface Test {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

const title = ref('')
const content = ref('')
const loading = ref(false)
const error = ref('')

const { data: items, refresh } = await useAsyncData<Test[]>(
  'tests',
  () => $fetch(`${API}/tests/`),
  { default: () => [] },
)

async function submit() {
  if (!title.value.trim() || !content.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    await $fetch(`${API}/tests/`, {
      method: 'POST',
      body: { title: title.value, content: content.value },
    })
    title.value = ''
    content.value = ''
    await refresh()
  } catch (e: any) {
    error.value = e?.data?.detail ?? 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="max-width:600px;margin:40px auto;font-family:sans-serif;padding:0 16px">
    <h1 style="font-size:20px;margin-bottom:24px">Tests</h1>

    <form style="display:flex;flex-direction:column;gap:10px;margin-bottom:32px" @submit.prevent="submit">
      <input
        v-model="title"
        placeholder="Title"
        required
        style="padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px"
      />
      <textarea
        v-model="content"
        placeholder="Content"
        rows="4"
        required
        style="padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;resize:vertical"
      />
      <div v-if="error" style="color:#ef4444;font-size:13px">{{ error }}</div>
      <button
        type="submit"
        :disabled="loading"
        style="padding:8px 20px;background:#18181b;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;width:fit-content"
      >
        {{ loading ? 'Saving…' : 'Save' }}
      </button>
    </form>

    <div v-if="items.length === 0" style="color:#6b7280;font-size:14px">No entries yet.</div>
    <div
      v-for="item in items"
      :key="item.id"
      style="border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;margin-bottom:10px"
    >
      <div style="font-weight:600;margin-bottom:4px">{{ item.title }}</div>
      <div style="font-size:14px;color:#374151;white-space:pre-wrap">{{ item.content }}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:8px">
        #{{ item.id }} · {{ new Date(item.created_at).toLocaleString() }}
      </div>
    </div>
  </div>
</template>
