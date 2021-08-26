let ComponentText = function(cfg) {
    cfg = cfg || {}
    let setTextDom = {
        init() {
            this.textDom = $(`<div>${cfg.text}</div>`)
            this.setAnimate()
            this.setCss()
            this.setAttr()
        },
        setAnimate() {
            let that = this
            that.textDom.on('onLoad', function(event) {
                setTimeout(function() {
                    that.textDom.animate(cfg.animate.in, cfg.animate.duration)
                }, cfg.animate.delay || 0)
            })
            that.textDom.on('onLeave', function(event) { that.setCss() })
        },
        setCss() {
            this.textDom.css(cfg.css)
        },
        setAttr() {
            this.textDom.attr(cfg.attr)
        }
    }
    setTextDom.init()
    return setTextDom.textDom
}