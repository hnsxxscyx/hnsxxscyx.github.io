---
title: zepto源码分析——zepto对象好用的方法都是如何设计的
date: 2017-09-30 11:52:58
tags: [源码,JavaScript,zepto]
categories: 编程
---
zepto的核心方法一部分通过给$增加属性而给$(要知道$是一个函数，即是一个对象)，另一部分定义在$.fn这个属性上，然后将zepto.Z.prototype指向$.fn，即所有的Z对象的__proto__指向$.fn，于是可访问到其中的方法。
<!-- more -->
---------

