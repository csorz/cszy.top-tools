<script setup lang="ts">
import { onMounted } from 'vue';
import MindMap from "simple-mind-map";
import { v4 as uuidv4 } from 'uuid';
// import * as dataJson from "../assets/mind-map.json"
import Export from 'simple-mind-map/src/plugins/Export.js'
// import Export from 'simple-mind-map/src/Export.js' Use this path for versions below v0.6.0
import * as curriculumsJson from "../assets/curriculums.json"

const urlParams = new URLSearchParams(window.location.search);
const currentTheme = urlParams.get('t');

// 主题预览图
import themeImgMap from 'simple-mind-map-plugin-themes/themeImgMap'
// 主题颜色，填充、字体大小、字号
import themeList from 'simple-mind-map-plugin-themes/themeList'

// TODO 先默认，初始化时设置主题

console.log(themeList, themeImgMap)

MindMap.usePlugin(Export)

function getText(richText: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(richText, "text/html");
  return doc.body.textContent;
}

function nodeConcatenation (obj: any) {
  let newObj: any = {
    "data": {
      "text": `<p><span style=\"color: rgb(34, 34, 34); font-family: 微软雅黑, &quot;Microsoft YaHei&quot;; font-size: 12px; font-weight: normal; font-style: normal; text-decoration: none;\">${obj.name}</span></p>`,
      "richText": true,
      "expand": true,
      "isActive": false,
      "uid": uuidv4()
    }
  }
  if (obj.children) {
    newObj.children = obj.children.map((item: any) => {
      return nodeConcatenation(item)
    })
  } else {
    newObj.children = []
  }
  return newObj
}

function conversion(data: any) {
  console.log(typeof data, data)
  let newObj = {
    "layout": "mindMap",
    "root": null,
    "theme": {
      "template": currentTheme,
      // "config": { "backgroundColor": "#FFFFFF", "paddingX": 6, "paddingY": 11 }
    },
    "view": {
      "transform": {
        "scaleX": 1,
        "scaleY": 1,
        "shear": 0,
        "rotate": 0,
        "translateX": -228.00000000000017,
        "translateY": 3.9999999999999574,
        "originX": 0,
        "originY": 0,
        "a": 1,
        "b": 0,
        "c": 0,
        "d": 1,
        "e": -228.00000000000017,
        "f": 3.9999999999999574
      },
      "state": {
        "scale": 1,
        "x": -228.00000000000017,
        "y": 3.9999999999999574,
        "sx": 0,
        "sy": 0
      }
    }
  }

  newObj.root = nodeConcatenation(curriculumsJson)
  return newObj
}

onMounted(async () => {
  const mindMap = new MindMap({
    el: document.getElementById("mindMapContainer"),
  } as any);

  const data: any = conversion(curriculumsJson)
  if (data?.root) {
    mindMap.setFullData(data)
  } else {
  // 否则使用setData方法导入
    mindMap.setData(data)
  }

  // 确保渲染完毕后生成图片base64
  mindMap.render(async () => {
    // 导入数据后有可能新数据渲染在可视区域外了，所以为了更好的体验，可以复位一下视图的变换
    // mindMap.view.reset();
    
    // 清空主题
    mindMap.setThemeConfig({}, true)
    // 设置主题
    mindMap.setTheme(currentTheme)
    // 居中显示
    mindMap.view.fit();
    
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