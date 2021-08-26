let ComponentChart = function(cfg) {
    // chart必须有宽高
    cfg = cfg || {}
    let setChartDom = {
        init() {
            this.chartDom = $(`<div></div>`)
            this.setCss()
            this.setAttr()
            let that = this
            this.chartDom.on('onLoad', function(event) {
                that.view(cfg.option)
            })
            this.chartDom.on('onLeave', function(event) {
                if (that.myChart) {
                    that.destory()
                }
            })
        },
        setCss() {
            this.chartDom.css(cfg.css)
        },
        setAttr() {
            this.chartDom.attr(cfg.attr)
        },
        view(option) {
            // chartDom需要原生dom
            this.myChart = echarts.init(this.chartDom[0])
            this.myChart.setOption(option)
        },
        destory() {
            this.myChart.clear()
        }
    }
    setChartDom.init()
    return setChartDom.chartDom
}