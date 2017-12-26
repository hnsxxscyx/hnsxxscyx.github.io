// 在这里进行组件的选择
// cfg为对象
let Component = function(cfg) {
        let ele = {}
        switch (cfg.type) {
            case 'text':
                ele = new ComponentText(cfg)
                break;
            case 'img':
                ele = new ComponentImg(cfg)
                break;
            case 'chart':
                ele = new ComponentChart(cfg)
            default:
                break;
        }
        return ele
    }
    // cfg的标准格式应该如下,具体图或字或表的变化而变化
    // css中必须添加宽度，以使用margin
    // cfg={
    //     type:'',
    //     animate:{in:{},out:{}},
    //     css:{},
    //     attr:{}
    // }