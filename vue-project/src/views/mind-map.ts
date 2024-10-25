import { v4 as uuid } from 'uuid'
import MindMap from 'simple-mind-map'
import Export from 'simple-mind-map/src/plugins/Export.js'
import Themes from 'simple-mind-map-plugin-themes'

// 注册主题
Themes.init(MindMap)
// 注册导出插件
MindMap.usePlugin(Export)

interface IActivityData {
  name: string
  children: IActivityData[] | []
}

interface IMindMapData {
  data: {
    text: string
    richText: boolean
    expand: boolean
    isActive: boolean
    uid: string
  }
  children: IMindMapData[]
}

export class MyMindMap {
  theme: string = 'default'
  el: any = null
  mindMap: any = null
  data: any = null

  constructor({width, height, theme, data}: {
    width: number
    height: number
    theme: string
    data: IActivityData
  }) {
    this.el = document.createElement('div')
    this.el.style.position = 'fixed'
    this.el.style.width = `${width}px`
    this.el.style.height = `${height}px`
    this.el.style.top = `-${height}px`
    this.el.style.left = `-${width}px`
    document.body.appendChild(this.el)
    this.mindMap = new MindMap({
      el: this.el,
      readonly: true,
      exportPaddingX: 20,
      exportPaddingY: 20,
      initRootNodePosition: ['left', 'center'],
    } as any)
    this.theme = theme
    this.data = data
  }

  /**
   * 主题列表
   * @returns object
   * @item dark: true
   * @item img: "/node_modules/simple-mind-map-plugin-themes/src/imgs/classic.jpg"
   * @item name: "脑图经典"
   * @item theme: {lineColor: '#fff', lineWidth: 3, generalizationLineWidth: 3, generalizationLineColor: '#fff', backgroundColor: 'rgb(58, 65, 68)', …}
   * @item value: "classic"
   */
  mindMapThemes() {
    return [
      {
        name: "默认",
        value: "default",
        theme: {},
        dark: false
      },
      ...Themes.lightList,
      ...Themes.darkList
    ]
  }

  /**
   * 创建级联节点
   * @param data object
   * @returns
   */
  nodeConcatenation(data: IActivityData): IMindMapData {
    return {
      data: {
        text: data.name,
        richText: false, // 如果设为true，导出图片可能文字缺失
        expand: true,
        isActive: false,
        uid: uuid()
      },
      children: data.children
        ? data.children.map((item: IActivityData) => {
            return this.nodeConcatenation(item)
          })
        : []
    }
  }

  /**
   * 数据转换：活动数据结构转为mind-map数据结构
   * @param data object
   * @returns
   */
  conversion(data: IActivityData) {
    return {
      layout: 'mindMap',
      root: this.nodeConcatenation(data),
    }
  }

  /**
   * @description 获取思维导图图片base64
   * @param width 图片宽度
   * @param height 图片高度
   * @param data 思维导图数据结构
   * @param theme 主题
   * @returns string base64图片
   */
  getMindMapImage({
    width,
    height,
    theme,
    data
  }: {
    width: number
    height: number
    theme: string
    data: IActivityData
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const el = document.createElement('div')
        el.style.position = 'fixed'
        el.style.width = `${width}px`
        el.style.height = `${height}px`
        el.style.top = `-${height}px`
        el.style.left = `-${width}px`
        document.body.appendChild(el)
        const mindMap = new MindMap({
          el,
          width,
          height,
          theme: theme,
          readonly: true,
          exportPaddingX: 20,
          exportPaddingY: 20,
          initRootNodePosition: ['left', 'center'],
        } as any) // 官方包就是any
  
        const mindMapData = this.conversion(data)
        if (mindMapData?.root) {
          mindMap.setFullData(mindMapData)
        } else {
          // 否则使用setData方法导入
          mindMap.setData(mindMapData)
        }
        // // 设置主题
        // mindMap.setTheme('')
        // // 清空主题
        // mindMap.setThemeConfig({}, true)
        // // 复位视图
        // mindMap.view.reset();
        // 确保渲染完毕后生成图片base64
        mindMap.render(async () => {
          // 居中显示
          mindMap.view.fit(() => {}, false, undefined)
          // 导出图片base64
          const imgRes = await mindMap.export('png', false)
          // 移除节点
          document.body.removeChild(el)
          mindMap.destroy()
          resolve(imgRes)
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}