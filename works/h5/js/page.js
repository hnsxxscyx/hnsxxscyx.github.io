// 构造函数，返回一个DOM对象
// component应该是一个数组，里面包含组件对象
let Page = function(name, component) {
    component = component || []
    name = name || ''
    let pageDom = {
        init() {
            this.dom = $(`<div class="section ${name}"></div>`)
            this.addComponent()
            return this.dom
        },
        // 事件要绑定到组件上,不然不知道回调是什么
        // eventBind(obj) {
        //     obj.on('onLoad onLeave', function(event) {
        //         console.log('moveing')
        //         console.log(event.type)
        //     })
        // },
        addComponent() {
            if (component.length !== 0) {
                this.dom.append(component)
            }
        }
    }
    pageDom.init()
    return pageDom.dom
}