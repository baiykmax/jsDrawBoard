class GuaCanvas extends GuaObject {
    constructor(selector) {
        super()
        let canvas = _e(selector)
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.w = canvas.width
        this.h = canvas.height
        this.pixels = this.context.getImageData(0, 0, this.w, this.h)
        this.bytesPerPixel = 4
        // this.pixelBuffer = this.pixels.data
        /*getImageData() 方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据。
        对于 ImageData 对象中的每个像素，都存在着四方面的信息，即 RGBA 值：
        R - 红色 (0-255)
        G - 绿色 (0-255)
        B - 蓝色 (0-255)
        A - alpha 通道 (0-255; 0 是透明的，255 是完全可见的)
        color/alpha 以数组形式存在，并存储于 ImageData 对象的 data 属性中。
        提示：在操作完成数组中的 color/alpha 信息之后，
             可以使用 putImageData() 方法将图像数据拷贝回画布上。*/
        this.elements = []
    }
    addElement(element) {
        element.canvas = this
        this.elements.push(element)
    }
    addAction(element) {
        log('element', element)
        var self = this
        this.canvas.addEventListener('click', function(event) {
            var x = event.offsetX
            var y = event.offsetY
            var currentElement = false
            //
            if (element == self.elements.slice(-1)[0]) {
                currentElement = true
            }
            if (hasPoint(element, x, y)) {
                log('clicked 按钮')
                self.fillColor(element, GuaColor.red())
            } else {
                self.fillColor(element, GuaColor.white())
            }
        })
    }
    fillColor(element, color) {
        for (let x = element.x + 1; x < element.x + element.h; x++) {
            for (let y = element.y + 1; y < element.y + element.w; y++) {
                element.canvas._setPixel(x, y, color)
            }
        }
        element.canvas.render()
    }
    render() {
        // 执行这个函数后, 才会实际地把图像画出来
        // ES6 新语法, 取出想要的属性并赋值给变量, 不懂自己搜「ES6 新语法」
        let {pixels, context} = this
        context.putImageData(pixels, 0, 0)
    }
    clear(color=GuaColor.white()) {
        // color GuaColor
        // 用 color 填充整个 canvas
        // 遍历每个像素点, 设置像素点的颜色
        let {w, h} = this
        // 不超出 canvas 边界
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                this._setPixel(x, y, color)
            }
        }
        this.render()
    }
    _setPixel(x, y, color) {
        // color: GuaColor
        // 这个函数用来设置像素点, _ 开头表示这是一个内部函数, 这是我们的约定
        x = int(x)
        y = int(y)
        // 用座标算像素下标
        let i = (y * this.w + x) * this.bytesPerPixel
        // 设置像素
        let p = this.pixels.data
        let {r, g, b, a} = color
        // 一个像素 4 字节, 分别表示 r g b a
        p[i] = r
        p[i+1] = g
        p[i+2] = b
        p[i+3] = a
    }
    drawPoint(point, color=GuaColor.black()) {
        // point: GuaPoint
        let {w, h} = this
        let p = point
        if (p.x >= 0 && p.x <= w) {
            if (p.y >= 0 && p.y <= h) {
                this._setPixel(p.x, p.y, color)
            }
        }
    }
    drawLine(p1, p2, color=GuaColor.black()) {
        // p1 p2 分别是起点和终点, GuaPoint 类型
        // color GuaColor
        // 使用 drawPoint 函数来画线
        let [x1, y1, x2, y2] = [p1.x, p1.y, p2.x, p2.y]
        let dx = x2 - x1
        let dy = y2 - y1

        if(Math.abs(dx) > Math.abs(dy)) {
            let xmin = Math.min(x1, x2)
            let xmax = Math.max(x1, x2)
            let ratio = dx == 0 ? 0 : dy / dx
            for(let x = xmin; x < xmax; x++) {
                let y = y1 + (x - x1) * ratio
                this.drawPoint(GuaPoint.new(x, y), color)
            }
        } else {
            let ymin = Math.min(y1, y2)
            let ymax = Math.max(y1, y2)
            let ratio = dy == 0 ? 0 : dx / dy
            for(let y = ymin; y < ymax + 1; y++) {
                let x = x1 + (y - y1) * ratio
                this.drawPoint(GuaPoint.new(x, y), color)
            }
        }
    }
    drawLine1(p1, p2, color=GuaColor.black()) {
        // p1 p2 分别是起点和终点, GuaPoint 类型
        // color GuaColor
        // 使用 drawPoint 函数来画线
        let [x1, y1, x2, y2] = [p1.x, p1.y, p2.x, p2.y]
        let dx = x1 - x2
        let dy = y1 - y2
        let exchange = false
        // log('xxx', x1, x2, y1,y2)
        // 保证高度小于宽度
        if (Math.abs(dx) < Math.abs(dy)) {
            //
            let tmp1 = x1
            x1 = y1
            y1 = tmp1
            //
            let tmp2 = x2
            x2 = y2
            y2 = tmp2
            //
            exchange = true
        }
        // 保证从左向右画
        // if (x1 > x2) {
        //     let tmp = x1
        //     x1 = x2
        //     x2 = tmp
        // }
        for(let x = x1; x <= x2; x++) {
            let ratio = (x2 - x1) == 0 ? 0 : (x - x1) / (x2 - x1)
            let y = y2*ratio + y1*(1.0 - ratio)
            // log(ratio, x1, x2, x, y)
            if (exchange) {
                this.drawPoint(GuaPoint.new(y, x), color)
            } else {
                this.drawPoint(GuaPoint.new(x, y), color)
            }
        }
    }
    drawLine2(p1, p2, color=GuaColor.black()) {
        // p1 p2 分别是起点和终点, GuaPoint 类型
        // color GuaColor
        // 使用 drawPoint 函数来画线
        const pointArr = []
        const num = getLength(p1, p2)
        for(let i = 0; i < num; i++) {
            const x = p1.x + (p2.x - p1.x) * i / num
            const y = p1.y + (p2.y - p1.y) * i / num
            const p = GuaPoint.new(x, y)
            pointArr.push(p)
        }
        pointArr.map(p => this.drawPoint(p, color))
        // log(pointArr, num)
    }
    drawRect(upperLeft, size, fillColor=GuaColor.white(), borderColor=GuaColor.black()) {
        // upperLeft: GuaPoint, 矩形左上角座标
        // size: GuaSize, 矩形尺寸
        // fillColor: GuaColor, 矩形的填充颜色, 默认为空, 表示不填充
        // borderColor: GuaColor, 矩形的的边框颜色, 默认伪黑色
        let [w, h] = [size.w, size.h]
        let p1 = upperLeft
        let p2 = GuaPoint.new(p1.x, p1.y + w)
        let p3 = GuaPoint.new(p1.x + h, p1.y)
        let p4 = GuaPoint.new(p1.x + h, p1.y + w)
        this.drawLine(p1, p2, borderColor)
        this.drawLine(p3, p4, borderColor)
        this.drawLine(p1, p3, borderColor)
        this.drawLine(p2, p4, borderColor)
        // fillColor
        for (let x = p1.x; x < p1.x + h; x++) {
            for (let y = p1.y; y < p1.y + w; y++) {
                this._setPixel(x, y, fillColor)
            }
        }
        this.render()
    }
    __debug_draw_demo() {
        // 这是一个 demo 函数, 用来给你看看如何设置像素
        // ES6 新语法, 取出想要的属性并赋值给变量, 不懂自己搜「ES6 新语法」
        let {context, pixels} = this
        // 获取像素数据, data 是一个数组
        let data = pixels.data
        // 一个像素 4 字节, 分别表示 r g b a
        for (let i = 0; i < data.length; i += 4) {
            let [r, g, b, a] = data.slice(i, i + 4)
            r = 0
            a = 0
            data[i] = r
            data[i+3] = a
        }
        // 将像素数据放在以 0,0 为起点的画布上
        context.putImageData(pixels, 0, 0)
    }
    //
    drawHistory(copyImageData) {
        let {context, pixels} = this
        let p = pixels.data
        let data =copyImageData.data
        // 获取像素数据, data 是一个数组
        // 一个像素 4 字节, 分别表示 r g b a
        for (let i = 0; i < data.length; i += 4) {
            let [r, g, b, a] = data.slice(i, i + 4)
            // 一个像素 4 字节, 分别表示 r g b a
            p[i] = r
            p[i+1] = g
            p[i+2] = b
            p[i+3] = a
        }
        // 将像素数据放在以 0,0 为起点的画布上
        context.putImageData(pixels, 0, 0)
    }
}
