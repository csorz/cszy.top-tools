<script setup lang="ts">
import { onMounted } from 'vue';
import MindMap from "simple-mind-map";
import * as dataJson from "../assets/mind-map.json"
import Export from 'simple-mind-map/src/plugins/Export.js'
// import Export from 'simple-mind-map/src/Export.js' Use this path for versions below v0.6.0
import * as curriculumsJson from "../assets/curriculums.json"

MindMap.usePlugin(Export)

console.log('dataJSON', dataJson)

function conversion() {
  curriculumsJson.map(() => {
    
  })
}

onMounted(async () => {
  const mindMap = new MindMap({
    el: document.getElementById("mindMapContainer")
  } as any);

  if (dataJson.root) {
    mindMap.setFullData(dataJson)
  } else {
  // 否则使用setData方法导入
    mindMap.setData(dataJson)
  }
  // 导入数据后有可能新数据渲染在可视区域外了，所以为了更好的体验，可以复位一下视图的变换
  mindMap.view.reset();

  // 确保渲染完毕后生成图片base64
  mindMap.render(async () => {
    const imgRes = await mindMap.export('png', false)
    console.log('imgRes', imgRes)
  })
})
</script>

<template>
  <main>
    <div id="mindMapContainer"></div>
  </main>
</template>

<style scoped>
#mindMapContainer {
  width: 100%;
  height: 720px;
}
#mindMapContainer * {
  margin: 0;
  padding: 0;
}
</style>