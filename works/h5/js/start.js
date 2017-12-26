$(function() {
    let makeObj = {
        // 使用字面量构建对象太繁琐和不可复用，使用函数来构建对象的各项参数
        // type有几个val也得有几个
        animate(animate) {
            // 动画大多相似，只是最终位置不同，设置动画类型与最终位置即可配置出大部分动画
            // 上下只设计距离顶部的位置，左右只设置距离左边的位置
            // 对设计稿进行rem转化
            let duration = animate.duration == undefined ? 500 : animate.duration
            let obj = { in: {},
                out: {},
                // 字符串不能识别
                duration: parseInt(duration),
                delay: animate.delay
            }
            let aniProp = Object.keys(animate),
                type = [],
                val = []
            for (let i of aniProp) {
                switch (i) {
                    case 'type':
                        type = animate.type.split(' ')
                        break;
                    case 'val':
                        val = animate.val.split(' ')
                        break;
                    case 'delay':
                        break;
                    default:
                        obj.in[i] = animate[i]
                        break;
                }
            }
            for (let i = 0; i < type.length; i++) {
                obj.in[type[i]] = val[i] / 64 + 'rem'
            }
            return obj
        },
        css(css) {
            // 这个也太复杂了现在，或许应该做一个对css对象的遍历以完成对象构建

            let obj = {}
            let cssProp = Object.keys(css)
            for (let i of cssProp) {
                switch (i) {
                    case 'padding':
                        obj.padding = css.padding.split(' ').map(function(item) {
                            return item / 64 + 'rem '
                        }).join(' ')
                        break;
                    case 'center':
                        obj.left = '50%'
                        obj.transform = 'translate(-50%,0%)'
                        break;
                    case 'opacity':
                        obj.opacity = css[i]
                        break;
                    default:
                        if (typeof parseInt(css[i]) === 'number' && !isNaN(parseInt(css[i]))) {
                            obj[i] = css[i] / 64 + 'rem'
                        } else {
                            obj[i] = css[i]
                        }
                        break;
                }
            }
            return obj
        },
        componentCfg(type, animate, css, attr, text, option) {
            let obj = {
                type: type,
                animate: this.animate(animate),
                css: this.css(css),
                attr: attr,
                text: text,
                option: option
            }
            return obj
        },
        footer() {
            return {
                cfg: makeObj.componentCfg('img', { type: 'left', val: '0' }, { bottom: '0' }, { src: './imgs/footer.png', class: 'footer' })
            }
        },
        caption(text, paddingLeft = 210) {
            return {
                // 18更偏向原设计
                cfg: makeObj.componentCfg('text', { type: 'left', val: '0' }, { left: -566, fontSize: 40, padding: '18 0 0 ' + paddingLeft, whiteSpace: 'nowrap', color: 'white' }, { class: 'caption' }, text)
            }
        }
    }
    let char = {
        footer: '',
    }
    let model = {
        // face: {
        //     logo: {
        //         cfg: makeObj.componentCfg('img', { type: 'top', val: '236' }, { center: true, top: 0 }, { src: './imgs/face_logo.png' })
        //     },
        //     slogan: {
        //         cfg: makeObj.componentCfg('img', { type: 'top', val: '430', opacity: 1 }, { center: true, top: 700, opacity: 0 }, { src: './imgs/face_slogan.png' })
        //     },
        //     img_left: {
        //         cfg: makeObj.componentCfg('img', { type: 'left bottom', val: '0 0' }, { bottom: '-300', left: '-370', }, { src: './imgs/face_img_left.png' })
        //     },
        //     img_right: {
        //         cfg: makeObj.componentCfg('img', { type: 'right bottom', val: '0 0' }, { bottom: '-300', right: '-370', }, { src: './imgs/face_img_right.png' })
        //     },
        //     footer: makeObj.footer()
        // },
        // page2: {
        //     caption: makeObj.caption('核心理念'),
        //     // slogan: makeObj.componentCfg('img', { type: 'left bottom', val: '0 0' }, { bottom: '-300', left: '-370' }, { src: './imgs/p1_slogan.png' })
        //     slogan: {
        //         cfg: makeObj.componentCfg('img', { type: 'top', val: '308', opacity: 1 }, { center: true, top: '100', opacity: 0 }, { src: './imgs/p1_slogan.png' })
        //     },
        //     text: {
        //         cfg: makeObj.componentCfg('text', { type: 'bottom', val: '412', opacity: 1 }, {
        //             center: true,
        //             bottom: '-100',
        //             opacity: 0,
        //             padding: '42 44 0 34',
        //             background: 'url("./imgs/description_bg.gif") no-repeat',
        //             backgroundSize: 'cover',
        //             width: 520,
        //             height: 336,
        //             fontSize: 23,
        //             color: '#fff',
        //         }, {}, '2013年，慕课网的诞生引领中国IT职业 从教育进入新时代； 高质量实战课程、全新教学模式、实时 互动学习，以领先优势打造行业品牌； 迄今为止，慕课网已成为中国规模最大、 互动性最高的IT技能学习平')
        //     },
        //     pepple: {
        //         cfg: makeObj.componentCfg('img', { type: 'bottom', val: '76', opacity: 1 }, { center: true, bottom: -100, opacity: 0 }, { src: './imgs/p1_people.png' })
        //     },
        //     footer: makeObj.footer()
        // },
        // page3: {
        //     caption: makeObj.caption('课程方向分布', 174),
        //     text: {
        //         cfg: makeObj.componentCfg('text', { type: 'top', val: '366', opacity: 1 }, {
        //             center: true,
        //             top: 100,
        //             opacity: 0,
        //             fontSize: 23,
        //             fontWeight: 'bold',
        //             color: '#000',
        //             whiteSpace: 'nowrap',
        //         }, {}, '课程分布前端开发占到40%')
        //     },
        //     chart: {
        //         cfg: makeObj.componentCfg('chart', {}, { width: 600, height: 400, center: true, bottom: 364 }, {}, '', {
        //             xAxis: {
        //                 type: 'category',
        //                 boundaryGap: false,
        //                 splitLine: {
        //                     show: true,
        //                     areaStyle: {
        //                         lineStyle: ['#f4f4f4']
        //                     }
        //                 },
        //                 axisLabel: {
        //                     margin: 24,
        //                 },
        //                 data: [{
        //                     value: "前端开发",
        //                     textStyle: {
        //                         fontSize: 20,
        //                         baseLine: 'bottom'
        //                     },
        //                 }, {
        //                     value: "移动开发",
        //                     textStyle: {
        //                         fontSize: 20,
        //                         baseLine: 'bottom'
        //                     },
        //                 }, {
        //                     value: "后端开发",
        //                     textStyle: {
        //                         fontSize: 20,
        //                         baseLine: 'bottom'
        //                     },
        //                 }, {
        //                     value: "图像处理",
        //                     textStyle: {
        //                         fontSize: 20,
        //                         baseLine: 'bottom'
        //                     },
        //                 }, {
        //                     value: "数据处理",
        //                     textStyle: {
        //                         fontSize: 20,
        //                         baseLine: 'bottom'
        //                     }
        //                 }],

        //             },

        //             yAxis: {
        //                 show: true,
        //                 boundaryGap: false,
        //                 data: [0, 10, 20, 30, 40, 50],
        //                 // 
        //                 axisTick: {
        //                     show: false,
        //                 },
        //                 axisLabel: {
        //                     show: false,
        //                 },
        //                 // 
        //                 splitLine: {
        //                     show: true,

        //                 },
        //                 splitArea: {
        //                     show: true,
        //                     areaStyle: {
        //                         color: ['#d2e2ff', '#fff']
        //                     }
        //                 },
        //                 axisLabel: {
        //                     formatter: '{value}%'
        //                 }
        //             },

        //             series: [{
        //                 name: '销量',
        //                 type: 'line',
        //                 areaStyle: {
        //                     normal: {
        //                         color: ['#ffb2b2'],
        //                         opacity: 0.7
        //                     }
        //                 },
        //                 itemStyle: {
        //                     normal: {
        //                         label: {
        //                             show: true,
        //                             formatter: function(p) {
        //                                 return p.data * 10 + '%'
        //                             }
        //                         }
        //                     }
        //                 },
        //                 lineStyle: {
        //                     normal: {
        //                         color: ['#ff7260'],
        //                         opacity: 1
        //                     }
        //                 },
        //                 data: [4, 2, 2.9, 0.1, 1]
        //             }]
        //         })
        //     },
        //     footer: makeObj.footer()
        // },
        //         page4: {
        //             caption: makeObj.caption('移动开发'),
        //             chart: {
        //                 cfg: makeObj.componentCfg('chart', {}, { width: 534, height: 340, center: true, bottom: 406 }, {}, '', {
        //                     series: [{
        //                         type: 'pie',
        //                         radius: [0, 150],
        //                         minAngle: 20,
        //                         label: {
        //                             normal: {
        //                                 show: true,
        //                                 formatter: `{b}
        // {c}%`,
        //                                 textStyle: {
        //                                     color: '#000',
        //                                     fontSize: 21
        //                                 }
        //                             }
        //                         },
        //                         color: ['#5ddbd8', '#99c0ff', '#ffad69', '#ff7676'],
        //                         data: [{
        //                             name: 'IOS',
        //                             value: 25
        //                         }, {
        //                             name: 'Cocos2d-x',
        //                             value: 2
        //                         }, {
        //                             name: 'Unity-3D',
        //                             value: 2
        //                         }, {
        //                             name: 'Android',
        //                             value: 71
        //                         }]
        //                     }]
        //                 })
        //             },
        //             text: {
        //                 cfg: makeObj.componentCfg('text', { type: 'bottom', val: '260', opacity: 1 }, {
        //                     center: true,
        //                     bottom: -100,
        //                     opacity: 0,
        //                     fontSize: 23,
        //                     fontWeight: 'bold',
        //                     color: '#000',
        //                     whiteSpace: 'nowrap',
        //                 }, {}, '移动开发课程中Android比例最大')
        //             },
        //             footer: makeObj.footer()
        //         },
        // page5: {
        //     caption: makeObj.caption('前端开发'),
        //     chart: {
        //         cfg: makeObj.componentCfg('chart', {}, { width: 570, height: 600, center: true, bottom: 200 }, {}, '', {
        //             series: [{
        //                 type: 'bar',
        //                 data: [{
        //                     value: 32,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#ff7676',
        //                         }
        //                     },
        //                 }, {
        //                     value: 21,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#99c0ff',
        //                         }
        //                     },
        //                 }, {
        //                     value: 10,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#99c0ff',
        //                         }
        //                     },
        //                 }, {
        //                     value: 10,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#99c0ff',
        //                         }
        //                     },
        //                 }, {
        //                     value: 4,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#99c0ff',
        //                         }
        //                     },
        //                 }, {
        //                     value: 4,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#99c0ff',
        //                         }
        //                     },
        //                 }, {
        //                     value: 3,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#99c0ff',
        //                         }
        //                     },
        //                 }, {
        //                     value: 2,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#99c0ff',
        //                         }
        //                     },
        //                 }, {
        //                     value: 2,
        //                     itemStyle: {
        //                         normal: {
        //                             color: '#99c0ff',
        //                         }
        //                     },
        //                 }, ],
        //                 label: {
        //                     normal: {
        //                         show: true,
        //                         position: 'right',
        //                         formatter: '{c}%',
        //                         color: '#fff',
        //                     },
        //                 },
        //             }],
        //             grid: {
        //                 left: '18%',
        //                 right: 0,
        //                 top: 0,
        //                 bottom: 0
        //             },
        //             xAxis: {
        //                 show: false,
        //                 type: 'value',
        //             },
        //             yAxis: {
        //                 show: true,
        //                 type: 'category',
        //                 // y轴从下到上
        //                 inverse: true,
        //                 axisLine: {
        //                     show: false,
        //                 },
        //                 axisTick: {
        //                     show: false,
        //                 },
        //                 axisLabel: {
        //                     margin: 30,
        //                 },
        //                 label: {
        //                     normal: {
        //                         show: true,
        //                         position: 'inside'
        //                     }
        //                 },
        //                 data: ['JavaSript', 'HTML/CSS', 'CSS3', 'HTML5', 'jQuery', 'Webapp', 'Node.js', 'Bootstrap', 'Angular']
        //             }
        //         })
        //     },
        //     footer: makeObj.footer()
        // },
        page6: {
            caption: makeObj.caption('后端处理'),
            chart: {
                cfg: makeObj.componentCfg('chart', {}, { width: 570, height: 600, center: true, bottom: 200 }, {}, '', {
                    series: [{
                        type: 'radar',

                    }]
                })
            },
            text: {
                cfg: makeObj.componentCfg('text', { type: 'bottom', val: '194', opacity: 1 }, {
                    center: true,
                    bottom: -100,
                    opacity: 0,
                    fontSize: 23,
                    fontWeight: 'bold',
                    color: '#000',
                    whiteSpace: 'nowrap',
                }, {}, '前端开发课程中Java课程占比最大')
            },
            footer: makeObj.footer()
        },
        page7: {
            caption: makeObj.caption('报名人数过万课程分布', 90),

            footer: makeObj.footer()
        },
        page8: {
            caption: makeObj.caption('课程难度级别分布', 134),
            text: {
                cfg: makeObj.componentCfg('text', { type: 'bottom', val: '142', opacity: 1 }, {
                    center: true,
                    bottom: -100,
                    opacity: 0,
                    fontSize: 23,
                    fontWeight: 'bold',
                    color: '#000',
                    whiteSpace: 'nowrap',
                }, {}, '课程难度分布，中级课程占到45')
            },
            footer: makeObj.footer()
        },
        tail: {

            back: {
                cfg: makeObj.componentCfg('img', { type: 'top', val: '46' }, { top: -10, center: true }, { src: './imgs/tail_back.png' })
            },
            share: {
                cfg: makeObj.componentCfg('img', { type: 'top right', val: '0 66' }, { top: -128, right: -120 }, { src: './imgs/tail_share.png' })
            },
            logo: {
                cfg: makeObj.componentCfg('img', { type: 'top', val: '408', opacity: 1 }, { top: -10, center: true, opacity: 0 }, { src: './imgs/tail_logo.png' })
            },
            slogan: {
                cfg: makeObj.componentCfg('img', { type: 'bottom', val: '510', opacity: 1 }, { bottom: 0, center: true, opacity: 0 }, { src: './imgs/tail_slogan.png' })
            },
            footer: makeObj.footer()
        }
    }
    let obj = {
        init() {
            let pageName = Object.keys(model)
            for (let i of pageName) {
                view.render(this.newPage(i))
            }
        },
        newPage(name) {
            let component = []
                // 因为只是普通对象，所以直接使用for in
                // 不做单独函数而是合并进来
            for (let i in model[name]) {
                // 自动生成一个class,是对model的处理
                if (model[name][i].cfg.attr.class == undefined) {
                    model[name][i].cfg.attr.class = ''
                }
                model[name][i].cfg.attr.class += ` ${name}_${i} component`
                component.push(new Component(model[name][i].cfg))
            }
            let page = new Page(name, component)
            return page
        },
    }
    let view = {
        init() {
            obj.init()
            this.render()
            this.fullpage()
        },
        render(page) {
            $('#dowebok').append(page)
        },
        fullpage() {
            $('#dowebok').fullpage({
                afterLoad(anchorLink, index) {
                    $('.section>.fp-tableCell').eq(index - 1).children().trigger('onLoad')
                },
                onLeave(index, nextIndex, direction) {
                    $('.section>.fp-tableCell').eq(nextIndex - 1).children().trigger('onLeave')
                },
                afterRender() {
                    $('.active>.fp-tableCell').children().trigger('onLoad')
                }
            })
        }
    }
    view.init()

})