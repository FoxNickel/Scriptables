// @ts-nocheck
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// 
// iOS 桌面组件脚本 @「小件件」
// 开发说明：请从 Widget 类开始编写，注释请勿修改
// https://x.im3x.cn
// 

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule
const {
  Base
} = require("./「小件件」开发环境")

// @组件代码开始
class Widget extends Base {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render() {
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge()
      case 'medium':
        return await this.renderMedium()
      default:
        return await this.renderSmall()
    }
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall() {
    let widget = new ListWidget()

    widget.setPadding(0, 10, 0, 10)

    // 拉接口
    let response = await this.getData()
    console.log(`response = ${JSON.stringify(response)}`)

    // 背景图
    var imgUrl = response.bing_imgurl
    var img = await this.getImage(imgUrl)
    if (img == null) {
      let ctx = new DrawContext()
      ctx.size = new Size(100, 100)
      ctx.setFillColor(Color.yellow())
      ctx.fillRect(new Rect(0, 0, 100, 100))
      img = await ctx.getImage()
    } else {
      img = await this.shadowImage(img)
      this.shadowImage(img)
    }
    widget.backgroundImage = img

    // 标题
    let titleText = response.bing_title
    let title = widget.addText(titleText)
    title.font = Font.lightSystemFont(14)
    title.textColor = Color.white()
    title.centerAlignText()

    // 点击跳转bing
    widget.url = "https://cn.bing.com"

    return widget
  }

  /**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
  async shadowImage(img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.1))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    return await ctx.getImage()
  }

  /**
   * 渲染中尺寸组件
   */
  async renderMedium() {
    return await this.renderSmall()
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge() {
    return await this.renderMedium()
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData(json = true) {
    const api = "https://api.szfx.top/bing/api/?type=json"
    return this.httpGet(api, true, true)
  }

  /**
   * 加载远程图片
   * @param url string 图片地址
   * @return image
   */
  async getImage(url) {
    try {
      let req = new Request(url)
      return await req.loadImage()
    } catch (e) {
      return null
    }
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl(url) {
    Safari.openInApp(url, false)
  }

}
// @组件代码结束

const {
  Testing
} = require("./「小件件」开发环境")
await Testing(Widget)