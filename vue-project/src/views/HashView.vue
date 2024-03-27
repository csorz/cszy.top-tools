<script setup lang="ts">
import { decode } from '@ytfee/npm-yt-ouid'
import { ref } from 'vue'
const log1 = ref()
const log2 = ref()
const log3 = ref('')
const loading = ref(false)
async function fileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  loading.value = true
  log1.value = null
  log2.value = null
  log3.value = ''
  if (file) {
    // 文件计算sha256并转ouid
    log1.value = await (window as any).YTOuidBrowserDataId(file)
    log2.value = await decode(log1.value.ouid)

    // ouid转sha256
    // web端
    let decoder = new TextDecoder('utf-8');
    log3.value = decoder.decode(log2.value.digest);
    // node端
    // Buffer.from(log2.value.digest).toString('hex') 
  }
  loading.value = false
}
</script>

<template>
  <div class="view-content">
    <h1>计算文件hash，<input type="file" @change="fileChange" /></h1>
    <h2 v-if="loading">计算中...</h2>
    <div v-else>
      <div v-if="log1">
        <h2>encode：</h2>
        <pre>{{ log1 }}</pre>
      </div>
      <br>
      <div v-if="log2">
        <h2>decode</h2>
        <pre>{{ log2 }}</pre>
      </div>
      <br>
      <div v-if="log3">
        <h2>ouid转sha256:</h2>
        <pre>{{ log3 }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
pre {
  word-wrap: break-word;
  white-space:pre-wrap;
}
</style>
