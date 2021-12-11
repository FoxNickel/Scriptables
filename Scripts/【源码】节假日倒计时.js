// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;
// @ts-nocheck
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: comments;
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
    currentDate() {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var week = date.getDay()
        var weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return {
            MM年dd日: month + "月" + day + "日",
            yyyy年MM年dd日: year + "年" + month + "月" + day + "日",
            week: weekArr[week],
            isFriday: week == 5,
            nextFriday: (5 - week + 7) % 7,
            yyyyMMdd: `${year}${month}${day}`,
            date: date
        }
    }

    /**
     * 初始化
     */
    constructor(arg) {
        super(arg)
        this.widgetSize = config.widgetFamily
    }

    /**
     * 渲染组件
     */
    async render() {
        if (this.widgetSize === 'medium') {
            return await this.renderMedium()
        } else if (this.widgetSize === 'large') {
            return await this.renderLarge()
        } else {
            return await this.renderSmall()
        }
    }

    async createBasicWidget(dateStr, week) {
        let widget = new ListWidget()
        // widget.url = 'https://m.okjike.com/topics/565ac9dd4b715411006b5ecd?s=ewoidSI6ICI1YzlmM2Q1MjdhN2FhMzAwMGY3MjhkNjgiCn0='
        widget.setPadding(0, 10, 0, 10)

        // 背景图
        // var imgUrl = "https://cn.bing.com/th?id=OHR.ShadowEverest_ZH-CN9951649290_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"
        // var img = await this.getImage("")
        // if (img == null) {
        //     let ctx = new DrawContext()
        //     ctx.size = new Size(100, 100)
        //     ctx.setFillColor(Color.yellow())
        //     ctx.fillRect(new Rect(0, 0, 100, 100))
        //     img = await ctx.getImage()
        // } else {
        //     img = await this.shadowImage(img)
        // }
        // widget.backgroundImage = img
        widget.backgroundColor = new Color("#EDEDED")

        // 时间
        var date = widget.addStack()
        var dateText = date.addText(dateStr)
        dateText.font = Font.lightSystemFont(14)
        date.addSpacer(3)
        var weekText = date.addText(week)
        weekText.font = Font.boldSystemFont(14)
        weekText.textColor = Color.red()

        widget.addSpacer(2)

        // 标题，这里要拉接口看是哪个时间
        const hodlidayResponse = await this.getData()
        const holidayList = hodlidayResponse.data.list
        const currentDate = this.currentDate().date
        const holidayDates = holidayList.map(item => {
            let date = this.dateFromString(`${item.date}`)
            console.log(`item1.date = ${date}`)
            return {
                date: date,
                name: item.holiday_cn
            }
        })
        console.log(`holidayDates = ${JSON.stringify(holidayDates)}`)
        console.log(`currentDate = ${currentDate}`)

        let nearstHoliday = holidayDates.find(item => {
            console.log(`item2.date = ${item.date}`)
            return item.date.getTime() > currentDate.getTime()
        })
        console.log(`nearstHoliday = ${JSON.stringify(nearstHoliday)}`)

        let dayDiff = this.getDays(currentDate, nearstHoliday.date)
        console.log(`dayDiff = ${dayDiff}`)

        var question = widget.addText(`距离${nearstHoliday.name}还有`)
        question.font = Font.headline()

        widget.addSpacer(35)
        let emoji = this.getEmotion(dayDiff)
        var answer = widget.addText(`${dayDiff}天 ${emoji}`)
        answer.font = Font.boldSystemFont(33)
        return widget
    }

    getEmotion(dayDiff) {
        console.log(`getEmotion:  dayDiff = ${dayDiff}`)
        if (dayDiff > 60) {
            return '😡'
        } else if (dayDiff > 45) {
            return '😤'
        } else if (dayDiff > 30) {
            return '😟'
        } else if (dayDiff > 21) {
            return '🙁'
        } else if (dayDiff > 14) {
            return '😳'
        } else if (dayDiff > 7) {
            return '😀'
        } else if (dayDiff > 3) {
            return '😊'
        } else if (dayDiff >= 1) {
            return '😎'
        } else {
            return ''
        }
    }

    async getData() {
        const url = "https://api.apihubs.cn/holiday/get?year=2022&holiday_today=1&holiday_legal=1&order_by=1&cn=1&size=31"
        const res = await this.httpGet(url, true, true)
        // console.log(`res = ${JSON.stringify(res)}`)
        // console.log(`first = ${res.data.list.length}`)
        return res
    }

    // 计算两个日期相差天数
    getDays(date1, date2) {
        console.log(`date1 = ${date1}, date2 = ${date2}`)
        var time1 = date1.getTime()
        var time2 = date2.getTime()
        var days = (time2 - time1) / (1000 * 60 * 60 * 24)
        return Math.ceil(days)
    }

    dateFromString(dateStr) {
        var year = dateStr.substring(0, 4)
        var month = dateStr.substring(4, 6)
        var day = dateStr.substring(6, 8)
        var time = "00:00:00"
        var ds = year + "/" + month + "/" + day + " " + time + " GMT+0800"
        return new Date(ds)
    }

    /**
     * 渲染小尺寸组件
     */
    async renderSmall() {
        var current = this.currentDate()
        let widget = await this.createBasicWidget(current.MM年dd日, current.week)
        return widget
    }

    /**
     * 渲染中尺寸组件
     */
    async renderMedium() {
        var current = this.currentDate()
        let widget = await this.createBasicWidget(current.yyyy年MM年dd日, current.week)
        return widget
    }

    /**
     * 渲染大尺寸组件
     */
    async renderLarge() {
        return await this.renderMedium()
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
     * 给图片加上半透明遮罩
     * @param img 要处理的图片对象
     * @return image
     */
    async shadowImage(img) {
        let ctx = new DrawContext()
        ctx.size = img.size
        ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
        // 图片遮罩颜色、透明度设置
        ctx.setFillColor(new Color("#000000", 0))
        ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
        return await ctx.getImage()
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