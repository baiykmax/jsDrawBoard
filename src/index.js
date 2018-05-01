// 函数名应该用 const 修饰, 这样不会被意外修改
const __main = function() {
    let canvas = GuaCanvas.new('#id-canvas')
    // 这是一个测试函数, 给你看原理的, 只是看看
    canvas.__debug_draw_demo()
    //
    var startX
    var startY
    var copyImageData
    var mouseDown = false
    var path = []
    window.color = GuaColor.black()
    // 绑定事件
    _e('.gua_color').addEventListener('click', event => {
        // 获取颜色
        var currentColor = _e('.gua_color').value
        var rgb = color2rgb(currentColor)
        var r = rgb[0]
        var g = rgb[1]
        var b = rgb[2]
        var a = 255
        window.color = GuaColor.new(r, g, b, a)
    })
    _e('.gua-button').addEventListener('click', event => {
        window.button = true
        window.pencil = false
        window.drawract = false
        window.drawline = false
    })
    _e('.gua-pencil').addEventListener('click', event => {
        window.pencil = true
        window.drawract = false
        window.drawline = false
        window.button = false
    })
    _e('.gua-draw-line').addEventListener('click', event => {
        window.drawline = true
        window.drawract = false
        window.pencil = false
        window.button = false
    })
    _e('.gua-draw-ract').addEventListener('click', event => {
        window.drawract = true
        window.drawline = false
        window.pencil = false
        window.button = false
    })
    _e('.gua-clear').addEventListener('click', event => {
        canvas.clear()
        copyImageData = undefined
        path = []
        canvas.elements = []
    })
    _e('.gua-save-image').addEventListener('click', event => {
        convertCanvas2Image(canvas.canvas)
    })
    canvas.canvas.addEventListener('mousedown', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        startX = x
        startY = y
        mouseDown = true
        // button
        if (window.button) {
            let v = GuaButton.new(canvas, x, y, 100, 100)
            canvas.addAction(v)
            canvas.addElement(v)
            log('canvas', canvas)
        }
        // 保存画布
        var imagedata = canvas.pixels
        copyImageData = new ImageData(new Uint8ClampedArray(imagedata.data), imagedata.width, imagedata.height)
        // copyImageData = new ImageData(imagedata.width, imagedata.height)
        // copyImageData.data.set(imagedata.data)
    })
    canvas.canvas.addEventListener('mousemove', function(event) {
        var x = event.offsetX
        var y = event.offsetY
        if (mouseDown) {
            // 渲染历史画布
            if (copyImageData != undefined) {
                canvas.drawHistory(copyImageData)
            }
            // 保存画笔路径
            let p = GuaPoint.new(event.offsetX, event.offsetY)
            path.push(p)
            let p1 = GuaPoint.new(startX, startY)
            let p3 = GuaPoint.new(x, startY)
            let p2 = GuaPoint.new(startX, y)
            let p4 = GuaPoint.new(x, y)
            // 画图
            if (window.drawline) {
                canvas.drawLine(p1, p4, window.color)
            } else if (window.drawract) {
                canvas.drawLine(p1, p2, window.color)
                canvas.drawLine(p3, p4, window.color)
                canvas.drawLine(p1, p3, window.color)
                canvas.drawLine(p2, p4, window.color)
            } else if (window.pencil) {
                log(path)
                for (var i = 0; i < path.length; i++) {
                    canvas.drawPoint(path[i], window.color)
                }
            }
            canvas.render()
        }
    })
    canvas.canvas.addEventListener('mouseup', function(event) {
        mouseDown = false
        window.button = false
    })
    // 渲染出来, 不调用这个函数就不会显示结果
    canvas.render()
}

__main()
