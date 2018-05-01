class GuaButton extends GuaObject {
    constructor(canvas, x, y, w, h) {
        super(canvas)
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.canvas = canvas
        this.position = GuaPoint.new(x, y)
        this.size = GuaSize.new(w, h)
        this.draw(canvas)
    }
    draw() {
        let p1 = this.position
        let p2 = GuaPoint.new(this.position.x, this.position.y + this.size.h)
        let p3 = GuaPoint.new(this.position.x + this.size.w, this.position.y)
        let p4 = GuaPoint.new(this.position.x + this.size.w, this.position.y + this.size.h)
        this.canvas.drawLine(p1, p2, window.color)
        this.canvas.drawLine(p3, p4, window.color)
        this.canvas.drawLine(p1, p3, window.color)
        this.canvas.drawLine(p2, p4, window.color)
        this.canvas.render()
    }
}
