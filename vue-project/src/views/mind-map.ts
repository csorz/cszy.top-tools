import { v4 as uuid } from 'uuid'
import MindMap from 'simple-mind-map'
import Export from 'simple-mind-map/src/plugins/Export.js'
import themeImgMap from 'simple-mind-map-plugin-themes/themeImgMap'
import themeList from 'simple-mind-map-plugin-themes/themeList'

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
    themeList.forEach((item: { img: string; value: string; name: string }) => {
      item.img = themeImgMap[item.value] || undefined
    })
    return {
      themeList
    }
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
   * @param currentTheme string
   * @param data object
   * @returns
   */
  conversion(currentTheme: string, data: IActivityData) {
    return {
      layout: 'mindMap',
      root: this.nodeConcatenation(data),
      theme: {
        template: currentTheme
      }
    }
  }

  /**
   * 切换主题
  */
  changeTheme(theme: string) {
    this.theme = theme
    // 设置主题
    this.mindMap.setTheme(this.theme)
  }

  /**
   * @description 获取思维导图图片base64
   * @param width 图片宽度
   * @param height 图片高度
   * @param data 思维导图数据结构
   * @param theme 主题
   * @returns string base64图片
   */
  exportPng(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const mindMapData = this.conversion(this.theme, this.data)
        if (mindMapData?.root) {
          this.mindMap.setFullData(mindMapData)
        } else {
          // 否则使用setData方法导入
          this.mindMap.setData(mindMapData)
        }

        // 确保渲染完毕后生成图片base64
        this.mindMap.render(async () => {
          // 复位视图
          // this.mindMap.view.reset();
          // // 清空主题
          // this.mindMap.setThemeConfig({}, true)

          // 居中显示
          this.mindMap.view.fit(() => {}, false, undefined)
          // 导出图片base64
          const imgRes = await this.mindMap.export('png', true)
          resolve(imgRes)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  destroyed() {          
    // 移除节点
    this.el && document.body.removeChild(this.el)
    this.mindMap.destroyed()
    this.mindMap = null
  }
}