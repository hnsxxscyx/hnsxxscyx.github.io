---
title: 开始sicp的旅程吧，scheme要跑起来
date: 2017-12-30 22:04:29
tags: [sicp,计算机基础]
categories: 编程
---
作为一只萌新，知识可不能仅靠工作上的摸索踩坑和单纯经验上的积累，深入基础是十分有必要滴，而且还得应付考试不是，考试是个好理由，不敢拒绝。
有需要也有必要补足计算机基础知识，那么作为野生程序员，咋么做呢？
参考前人的经验，首选自然是萧大的[编程入门指南](https://zhuanlan.zhihu.com/xiao-jing-mo/19959253),而我现在不应该再入门了吧，那自然搞起sicp啦。

### 为什么要学sicp
多人推荐，评分高，那就没的说了呗。大部分理由都可以参见这篇文章：[老赵书托（2）：计算机程序的构造与解释 - 老赵点滴 - 追求编程之美](http://blog.zhaojie.me/2009/07/recommended-reading-2-sicp.html)

### 为什么不学python版本的sicp
说实话学python版的的确效率高、收益大，不过我也有自己的考虑。

    - 我看过一遍python版的中文翻译，然而并不懂，和其他的python书看起来并没什么区别，或许我当年太弱鸡？
    - 基于上，python版的就要配合课程进行学习，然而时间决定了我目前不太能常看视频
    - 谁说的刷了老版的就看不了新版的哦，cs61扔入计划

### 准备工作
ok,开始了没什么疑问，然而刚刚上去我就经受了小小打击，那就是sicp所用的语言。
scheme应该是简单但强大的语言了吧，但着实小众，作为方言还有方言，怎么运行成了一个问题。依我目前的了解，有以下几种方法跑。

    - 云端跑
        - 好处
            - 复制粘贴即可运行
        - 坏处
            - 浏览器必须的
            - 联网必须的
            - 复杂了就玩不转了
    - 本地跑
        - Emacs + 插件
            - 好处
                - 未知，因为下载了并没有安装，但是听说这是个神级编译器，参见[一年成为 Emacs 高手 (像神一样使用编辑器)](https://github.com/redguardtoo/mastering-emacs-in-one-year-guide/blob/master/guide-zh.org)对手是vim等，以后有缘再见吧
            - 坏处
                - 没用过，上手需要熟悉一段时间
        - 开源包，如Racket、MIT Scheme
            - 参考[程序设计技术和方法](http://www.math.pku.edu.cn/teachers/qiuzy/progtech/)
            - 好处
                - 安装即用
            - 坏处
                - 在老婆的电脑上装了MIT Scheme，运行及其不便，可能因为我是萌新吧
                - windows不友好，自我感觉
                - Racket并不能做所有sicp的题目
        - 扩展包，如biwascheme
            - 此项目官网[biwascheme](http://www.biwascheme.org/)
            - 好处
                - 不仅能本地运行，还能使用本地JavaScript来跑，HTML中看结果，简直666
                - 不仅能在HTML里预览，还可以扔到JavaScript来跑，更加666。参见[Github](https://github.com/biwascheme/biwascheme)
            - 坏处
                - 未知

以上准备运行的参考资料：
1、[sicp学习前的几个准备资料](http://cocode.cc/t/sicp/7689)
2、[安装scheme解释器](http://tieba.baidu.com/p/1855833563)
3、[Scheme 编程环境的设置](http://www.yinwang.org/blog-cn/2013/04/11/scheme-setup)
4、[MIT-scheme](https://www.gnu.org/software/mit-scheme/)

### biwascheme的使用
好处多多，作为前端用起vscode又很方便，HTML预览也好，run code一键都很方便，那肯定是用它的咯。
How to use with HTML：
    ```
        <!DOCTYPE html>
        <html>
            <body>

            <div id="bs-console"></div>

            <script src="biwascheme.js">
                (define (test x)
                    (+ x x))
                (print (test 2))
            </script>

            </body>
        </html>
    ```
How to use with node.js to run a biwa script
    ```
        $ npm install biwascheme

        create a file a.scm:

        (display "Hello, world!") (newline)

        $ biwas a.scm
    ```
How to use from inside node.js as a module
    ```
        $ npm install biwascheme

        create a file server.js:

        var BiwaScheme = require("biwascheme"); BiwaScheme.run("(+ 1 2)"); // or // BiwaScheme.run_file("a.scm");

        $ node server.js
    ```

这样子可以愉快的刷题啦，希望可以帮到你们。
我这样子这么费时费力的记录还有时间看书吗，摔！