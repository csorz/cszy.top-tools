/* @ts-disabled */ 
<script setup lang="ts">
import { ref } from 'vue'

const sRGBHex = ref('')
const rgb = ref('')
const error = ref('')
const win = window as any

function colorpicker() {
  if (!win?.EyeDropper) {
    error.value = '你的浏览器不支持 EyeDropper API'
  }
  const eyeDropper = new (win.EyeDropper)()
  const abortController = new AbortController()

  eyeDropper.open({
    signal: abortController.signal
  }).then((result: any) => {
    sRGBHex.value = result.sRGBHex
    rgb.value = hexToRgb(result.sRGBHex)
  }).catch((err: any) => {
    error.value = err
  })
}

function hexToRgb(hex: string) {
  // 移除可能存在的#号
  hex = hex.replace(/^#/, '');

  // 将十六进制颜色值转换为 RGB 值
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgb(${r},${g},${b})`
}
</script>

<template>
  <div class="view-content">
    <h1>仅支持chrome > 95</h1>
    <button @click="colorpicker()">打开拾色器</button>
    <p v-if="error"><span>{{ error }}</span></p>
    <p><span>{{ sRGBHex }}</span></p>
    <p><span>{{ rgb }}</span></p>
    <div class="color-block" :style="{ backgroundColor: sRGBHex}"></div>
  </div>
</template>

<style scoped>
.view-content {
  text-align: center;
}
.color-block { 
  display: inline-block;
  width: 100px;
  height: 100px;
}
</style>
