let ComponentImg = function(cfg) {
    cfg = cfg || {}
    let setImgDom = {
        init() {
            this.imgDom = $(`<img>`)
            this.setAnimate()
            this.setCss()
            this.setAttr()
        },
        setAnimate() {
            let that = this
            that.imgDom.on('onLoad', function(event) {
                setTimeout(function() {
                    that.imgDom.animate(cfg.animate.in, cfg.animate.duration)
                }, cfg.animate.delay || 0)
            })
            that.imgDom.on('onLeave', function() { that.setCss() })
        },
        setCss() {
            this.imgDom.css(cfg.css)
        },
        setAttr() {
            this.imgDom.attr(cfg.attr)
        }
    }
    setImgDom.init()
    return setImgDom.imgDom
}