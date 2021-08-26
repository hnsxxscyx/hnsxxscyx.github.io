$(function() {
    let model = {
        // 测试统一使用一种动画
        animate: {
            fadeIn: 'fadeIn'
        },
    }
    let view = {

    }
    let controller = {
        init() {
            // model.init()
            // view.init()
            $('#dowebok').fullpage({
                afterLoad: function(anchorLink, index) { $('.test').eq(index - 1).fadeIn(1000) },
                onLeave: function(index, nextIndex, direction) {
                    console.log(index, nextIndex)
                        // $('.test').eq(index - 1).hide();
                        // 把要移动的下一页隐藏起来好出动画
                    $('.test').eq(nextIndex - 1).hide()
                }
            })
        },
        pageEvent() {

        },
        animateEvent(type) {

        }
    }
    controller.init()
})