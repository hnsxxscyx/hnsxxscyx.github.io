---
title: zepto源码分析——序
date: 2017-09-27 11:00:12
tags: [源码,JavaScript,zepto,自述]
categories: 编程
---

### 为什么17年还要读zepto的源码？
问这个问题首先要清除为什么读源码。[程序员阅读源码是一种什么心态？源码对编程意义何在？如何才能更好阅读代码？](!https://www.zhihu.com/question/29765945)这个问题高票答案基本上已经解释的很好了，但我还想再补充几点。
<!-- more -->
    - 向优秀的人学习，这个毫无疑问。
    - 人大多是依靠模仿学习的，想要模仿，必须先了解。
    - 巩固基础，而基础有多重要就不用说了吧。

确实mvvm框架极火爆，也的确好用，但是依我现在目前的水平来看（js基础不是很牢，计算机基础也跟不上），学习优秀库是一个极其方便且好用的学习以及复习策略。

### 为什么是zepto？
zepto大家都说好。
还有一点是在几个月以前我已经根据前辈的源码分析熟悉了一遍并自己仿制了一个类zepto的库，重拾起来应该更轻松。
还有一点，zepto的分析已经有很多人进行了，资料也很多，基本上没什么大问题，但是大都有一点缺点，就是不够通俗易懂。依我来看前端JavaScript水平的差距是巨大的。初学者可能一点一点的啃过基础大部头，以为自己已经了解了JavaScript，却被实际的各种用法所困惑。
我作为一个初学者，希望可以通过阅读和拆析zepto的源码来略微的垫高这一沟壑。

### 究竟怎么阅读？
读之前首先一定要会用吧，如果不会用建议去看看zepto的文档，和jQuery很像。
会了基本的用法之后就可以准备阅读了。
首先需要源代码的源文件，其次要找好的资料。

#### 什么才算是好的资料？
在我看来至少要满足以下几点：

    - 语句通顺易懂
    - 不办弄概念
    - 最好能引导人进行主动阅读
    - 对一些概念进行扩展

在zepto源码分析的诸多资料中，个人认为称的上好的资料应当是王福朋老师的[zepto设计和源码分析](!http://www.imooc.com/learn/745),在慕课网上的课程讲解十分详细，但个人推荐阅读[文字版](!https://www.kancloud.cn/wangfupeng/zepto-design-srouce/173689).
在js进阶的资料中，个人认为最好的应当是曾探老师的[JavaScript设计模式与开发实践](!https://book.douban.com/subject/26382780/)