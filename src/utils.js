const log = console.log.bind(console)

const _e = (sel) => document.querySelector(sel)

const int = Math.floor

const getLength = (p1, p2) => {
    const dx = parseInt(Math.abs(p2.x - p1.x))
    const dy = parseInt(Math.abs(p2.y - p1.y))
    return Math.sqrt(dx * dx + dy * dy)
}

const color2rgb = (sColor) => {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    var sColor = sColor.toLowerCase()
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#"
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew
        }
        //处理六位的颜色值
        var sColorChange = []
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange
    } else {
        return sColor
    }
}

const convertCanvas2Image = (canvas) => {
    var image = new Image()
    image.src = canvas.toDataURL("image/png")
    return image
}

const hasPoint = (item, x, y) => {
    var xIn = x >= item.x && x <= item.x + item.w
    var yIn = y >= item.y && y <= item.y + item.h
    return xIn && yIn
}
