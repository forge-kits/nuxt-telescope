<script setup>
const api = useForgeApi()
const field = ref(null);
async function test() {
  await api.post('/test/',null,{params: { "id": field.value }})
}
</script>
<template>
  <h1>Test</h1>
  <input v-model="field" type="number" />
  <button @click="test">Test</button>
</template>
