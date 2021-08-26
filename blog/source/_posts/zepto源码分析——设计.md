---
title: zepto源码分析——设计
date: 2017-09-27 11:51:00
tags: [源码,JavaScript,zepto]
categories: 编程
---
### zepto对象
zepto或是jQuery的设计思想几乎是一致的，通过选择器获取一个DOM对象，然后对这个对象进行操作。
我们来看zepto对象是什么样子。
进入Zepto文档界面，打开控制台，使用$取一个元素，将它打印出来。
<!-- more -->
```
    <h3 id="download">下载 Zepto</h3>
```
这个元素用的是id呀，就它了

```
    let ele = $('#download')
    ele
    [h3#download, selector: "#download"]
    Array.isArray(ele)
    true
```

看起来是一个数组对象，但实际上并不是,isArray()不要骗人啊~
我们知道JavaScript中数组是Array对象的实例，那么ele是么？

```
    ele.__proto__.constructor === Array;
    false
    ele instanceof Array
    false
```

instanceof 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性。
显而易见，ele并不是Array构建出来的，用Array构建出来也没那么多方法用啊，除非大规模重写Array的__proto__对象，那不是太惨了。

#### 那么是谁构建了这个类数组对象？

我们先来看看$

    $
    ƒ (selector, context){
        return zepto.init(selector, context)

$是一个函数
来看看源码

    var Zepto = (function() {
    })()

    window.Zepto = Zepto
    window.$ === undefined && (window.$ = Zepto)

$被挂载到window上，要知道在浏览器中所有JavaScript 全局对象、函数以及变量均自动成为window 对象的成员，所以$是全局对象，且是Zepto函数，很明显Zepto函数是一个构造函数。

** 源代码解析部分请配合源代码和搜索食用 **

#### zepto.init

前面已经知道$是一个函数，参数为(selector,context)，返回一个函数，我们先来看看返回的函数是什么样子。
搜索到zepto.init，可以看到英文注释：
>     `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and takes a CSS selector and an optional context (and handles various special cases).
    // This method can be overriden in plugins.

简单来说就是这个方法类似jQuery的$.fn.init方法，传入一个CSS选择器和一个上下文。这个函数还能被插件改写。
显而易见，这是为了生成之前的类数组对象做准备，选取其中的dom与环境，来看看这个函数的内部。
$函数的作用有以下几种：

- 把普通DOM对象包装成zepto对象
- 当页面ready时加载函数
- 充当选择器选择DOM并将其包装成zepto对象
- 生成一个dom元素  

详情分析请看源代码解析部分。
加载函数部分比较好理解，我们先来看看是如何构建zepto对象的。
#### 构建zepto对象
当selector是选择器时，查找dom。

zepto.qsa()方法用来选择dom，使用字符串匹配后分别使用各种get方法进行选择dom，最后特殊情况使用querySelectorAll和querySelector。因为它俩的速度要慢得多

************
找到dom后把dom与selector传给zepto.Z这个构造函数。

    zepto.Z = function(dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || ''
        return dom
    }
    zepto.Z.prototype = $.fn

可以看到dom的隐式原型被指向$.fn,zepto.Z.prototype也被指向$.fn，因为隐式原型与显式原型的关系，实际上只要一个生效就生效了。
$.fn中定义了zepto类数组对象所有方法，通过原型链这些方法就可以共享啦。