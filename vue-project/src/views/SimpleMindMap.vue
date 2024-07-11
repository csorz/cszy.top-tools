<script setup lang="ts">
import { onMounted } from 'vue';
import MindMap from "simple-mind-map";

onMounted(() => {
  const mindMap = new MindMap({
    el: document.getElementById("mindMapContainer"),
    data: {
      data: {
        text: "根节点",
      },
      children: [],
    },
  } as any);
})
</script>

<template>
  <main>
    <div id="mindMapContainer"></div>
  </main>
</template>

<style scoped>
#mindMapContainer {
  width: 720px;
  height: 720px;
}
#mindMapContainer * {
  margin: 0;
  padding: 0;
}
</style>