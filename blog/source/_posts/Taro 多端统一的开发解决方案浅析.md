---
title: Taro 多端统一的开发解决方案浅析
date: 2021-09-16 18:43:05
tags: [前端, Taro]
---
# 前言
![Taro](https://static001.infoq.cn/resource/image/0e/4c/0e62251a903c2341c3a8091a4773bb4c.jpg)  

同一个世界，同一个梦想。Write once, run everywhere 是每个开发者心中的梦。  

无需特别注意端的差异，把更多的精力放在业务与coding 上，无数的框架也在这个方向上持续改进和努力着。  

17年1月，微信小程序正式上线，与web 相近的开发方式与微信上亿的用户基数让小程序迅速在”前端圈“走红，无数小程序也在开发和被开发的路上。但因种种原因，原生微信小程序的开发方式并不尽如人意，前端生态的丰富资源及开发模式也无法直接被引入小程序的开发流程。  

为了改善开发小程序的开发体验及提交开发效率，Taro应运而生，它使用了类react 的语法，并且积极引入了前端流行的开发流程，并实现了一套代码多端复用（小程序、H5、React native)，在最近的大版本更新中，更是支持了React/Vue2/Vue3，让多端开发体验更加优雅和高效。  

让我们一起来看看Taro 是怎么做的。
# 尝试一下Taro build
我们可以新建一个空白的[Taro](https://docs.taro.zone/docs/2.x/GETTING-STARTED) 模板项目，然后使用taro build 命令将项目打包，我们再来一起看看Taro 做了什么。
我们先使用Taro 2 进行build看看。
## 小程序
由于小程序的原理大同小异，微信小程序几乎又是小程序的实际标准，所以build 小程序就以微信小程序来举例。

忽略掉模板代码，build 完成后多出了dist 文件夹，目录下就是产出的微信小程序项目文件。
目录结构如下：
```
|-- dist
|   |-- app.js
|   |-- app.json
|   |-- app.wxss
|   |-- project.config.json
|   |-- npm
|   |   |-- @tarojs
|   |       |-- taro
|   |       |   |-- index.js
|   |       |   |-- dist
|   |       |       |-- index.js
|   |       |-- taro-weapp
|   |           |-- index.js
|   |           |-- dist
|   |               |-- index.js
|   |-- pages
|       |-- index
|           |-- index.js
|           |-- index.json
|           |-- index.wxml
|           |-- index.wxss
```
从dist 文件夹可以看出，输出代码遵循了微信小程序所要求的[目录结构](https://developers.weixin.qq.com/miniprogram/dev/framework/structure.html)。    

我们从pages 入手，看一下打包后的文件。  

### pages 下的json, wxml 与wxss 文件
json 文件中的配置想很明显是微信小程序所要求的的[页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)项。  

再看wxml 文件，很明显可以看出它就是普通的微信小程序模板，只不过与Taro 原始项目文件相比多了一层block 标签。  

而wxss 文件也是普通的微信小程序[wxss](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html) 样式语言。  

由此可以简单推测，Taro 在转换为微信小程序时几乎把原代码转成了微信小程序所支持的语法，以此来在平台上运行。  

### pages 下的js 文件
js 文件是经过编译过的，不太方便阅读，但是某些函数基本上还是能一一对应的，比如在return 的_createClass 方法中仍然能看到react 生命周期函数，如componentWillMount、componentDidMount 等。  

在文件末尾，还可以看到js 文件导出了一个变量，并将此变量传入了createComponent 方法。
## h5
执行taro build --type h5，等build 完成后多出的是.temp 与dist文件夹，目录如下：
```
|-- .temp
|   |-- app.js
|   |-- app.scss
|   |-- index.html
|   |-- pages
|       |-- index
|           |-- index.js
|           |-- index.scss
|-- dist
|   |-- index.html
|   |-- chunk
|   |   |-- 2.js
|   |   |-- index_index.js
|   |-- css
|   |   |-- 2.css
|   |   |-- app.css
|   |   |-- index_index.css
|   |-- js
|       |-- app.js
```
从dist 目录下的文件来看，输出的文件似乎与普通web 应用打包后的文件没什么不同。但.temp 文件夹下就奇怪了，这个目录是干做什么用的？
### .temp 目录下的文件
我们先来看app.js, 除去taro 的某些api(如createHistory、initPxTransform)，它似乎与普通的React 语法没什么不同，同样的生命周期方法，同样最后使用了render方法，只不过是引入和使用了[Nerv](https://nerv.aotu.io/)，当然，Nerv 使用了和React 16一致的使用方式与API。  

再让我们去看pages 下的文件，又是典型的React 语法，只不过jsx 中使用的标签是微信小程序标签名，如View，Text。它们又是从@tarojs/components 引入的。
对比源代码后就更奇怪了，似乎.temp 目录只是将Nerv 引入了项目，究竟发生了什么？  

# 基本原理分析 - 如何把一套代码转换为另一套代码
让我们忽略其他所有的因素，回到问题最初的原点：我有一套代码，我想通过某些操作，直接让它在另一个运行环境运行，应该怎么做？  

答案很简单，把这套代码转译成目标运行环境所支持的代码就好，例如[PythonJs](https://github.com/PythonJS/PythonJS) 或者[Transcrypt](https://www.transcrypt.org)。实际上，Taro 2 正是这么做的。  

说起来简简单单，实际做起来可没那么容易，这样的代码转换其实就是编译原理的内容，作为计算机基础重要的专业课，涉及到语言和文法、词法分析、语法分析、中间代码生成和目标代码生成。
幸好，JavaScript 生态足够丰富，大量的工具可以直接使用。Taro 就在转换这个最核心的部分大量的借用了Babel 模块。  

## 编译
### Babel
[Babel](https://babeljs.io/)是JavaScript的转换编译器，日常开发中接触最多的就是使用其将ES6+ 代码转换为向后兼容的JavaScript 语法。但它能做的远不止这些。  

借助于[@babel/parser](https://babeljs.io/docs/en/babel-parser.html),Babel 可以解析JavaScript/TypeScript/JSX 等为AST(Abstract Syntax Tree)。当代码被转为AST 时，代码对于开发者来说只是一个遵循规则的树状数据结构，这时我们就可以对代码进行一系列的操作。比如我们常用的ESlint，就是将代码转换为了AST再对其进行语法检查、错误提示等（ESlint 使用的parser为[espree](https://github.com/eslint/espree))。  

![Babel](https://www.osvlabs.com/blog/wp-content/uploads/2022/02/babel.png)  

例如`let a = 1;`解析为AST 后就是：
 ```json
 {
  "type": "Program",
  "start": 0,
  "end": 10,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 10,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 9,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 8,
            "end": 9,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "let"
    }
  ],
  "sourceType": "module"
}
```
也可以使用[AST explorer](https://astexplorer.net/)来在线看一下一段代码被转换AST 的结构。  

代码转换为AST 之后，还需要对节点进行处理，[@babel/traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse)可以方便的遍历节点树，并且可以方便的对其进行删除、添加、替换。  

最后，借助于[@babel/generator](https://github.com/babel/babel/tree/master/packages/babel-generator), 我们可以将AST 转换为code。  

借助于babel的这几个package，已经可以方便的实现将遵循规范的源代码转换为目标代码这一流程。  

仅使用生态的力量是不够的，作为新兴的平台，小程序自己定义了一套DSL，所以由AST 转为小程序代码的工作只能Taro 自己来完成。  

转换小程序的这一部分的核心位于[taro-transformer-wx](https://github.com/NervJS/taro/tree/2.x/packages/taro-transformer-wx)。 从src/index.ts 的transform方法也可以看出，taro 在转换代码时的流程依然是解析、处理、生成这一流程。
## 运行
### 小程序的运行
编译让本不能运行的代码在环境中可以运行（比如ES6 被编译为ES5，就可以运行在绝大多数的浏览器环境），但并非所有的问题都需要靠编译来解决。  

在微信小程序中，页面使用[Page](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html) 方法传入一个对象，如果借助编译的话，那就是需要将Class 或者 Function 都编译为对象，并将属性一一对应起来。这样做不仅让编译的工作变得复杂多变，当出现异常时出错crash 的几率也变得特别高。  

Taro 使用了非常聪明的方法解决了这个问题，页面使用的是对象，那最终传给它一个对象不就完了？所以在小程序中，Taro 实现了createComponent 方法，将原本的Taro 类，转换为小程序所需要的Object。
[createComponent](https://github.com/NervJS/taro/blob/master/packages/taro-weapp/src/create-component.js) 方法主要做了三件事：将state 转换为小程序的data;将Taro 的生命周期映射到小程序生命周期；将事件处理函数映射到小程序的事件处理函数。  

映射生命周期与时间处理函数比较好理解，所以我们重点关注一下state 的转换。  

忽略掉其他因素，可以简单的将state 直接对应为小程序的data。但jsx 的写法多变，小程序的模板却无法像jsx 那样灵活，例如在render 函数中，生成了新变量（state 的数据先经过处理，如map、filter后再使用）。Taro 使用了一个_createData 方法来处理这种情况，render return 前所有定义变量或对props、state 产生新变量的操作，都会被编译到_createData方法来执行，并且在data 中创建一个新变量，使其可以映射到小程序的模板上。 

### h5 的运行
之前在build 时已经发现，h5 的build 会多出一个.temp 文件夹，里面的代码最为明显的改动似乎只是引入了Nerv。作为纯粹的web 框架，小程序组件肯定是不存在于web端的，如何使用小程序的组件，是使用h5 的第一个问题。  

首先最好想到的方法，是像小程序编译一样，将小程序的原生标签编译为对应的HTML 标签，例如使用div 直接替换view，对于没有可以直接映射的组件或标签，如swiper，就直接维护一套组件，根据小程序的表现来实现组件，这样就可以在浏览器中运行了。  

维护没有的组件没有什么问题，但view 与div 这种却不能一一对应。拿view 来说，在小程序中存在一些属性，如hover-class、hover-start-time 这些，在web 端并不存在。所以Taro 直接依照小程序，维护了一个实现小程序规范的web 版[组件](https://github.com/NervJS/taro/tree/master/packages/taro-components/src/components)，这样，在web段的表现也能与小程序一致了。  
其他方面，Taro 自行在web 端补足了小程序的api，由于小程序的输入输出都非常清晰，Taro 只需要使用web 端来实现这些[API](https://github.com/NervJS/taro/tree/master/packages/taro-h5/src/api)，同时还能方便的进行promise 的包装。  
# Taro3 的不同解
Taro2 只支持了类react 的写法，但是[Taro3](https://docs.taro.zone/docs/)支持使用 React/Vue/Nerv 等框架来开发小程序、h5等应用，这又是怎么做到的？  

从两个版本的简介中可以明显看出不同，Taro 2 时介绍Taro 为
> Taro 是一套遵循 React 语法规范的 多端开发 解决方案

而Taro 3则是**支持使用**React/Vue/Nerv 等框架来开发，甚至明确表示**可以使用完整的React/Vue/Vue3/Nerv 开发体验**。如果依照Taro 2 重编译的做法，恐怕Taro 要做巨量的工作来支持新语法，并且投入巨大的人力物力来维护生态。进一步来说，也绝对不可能打出使用完整的 xx框架开发体验，那么Taro 3 是怎么解决run everywhere 的问题的呢？  

在概述中，我们可以看到Taro 官方的说明：
> Taro 3 支持将 Web 框架直接运行在各平台，开发者使用的是真实的 React 和 Vue 等框架。

这是怎么实现的呢？似乎是框架作为运行时，可以跑在各个端上。  

我们将taro-cli 升级，再创建一些taro 的模板项目来看一看。  

首先选取框架为vue3，模板为vue3-vuex，然后执行taro build --type weapp，执行完毕后目录如下：
```
|-- dist
|   |-- app.js
|   |-- app.json
|   |-- app.wxss
|   |-- base.wxml
|   |-- comp.js
|   |-- comp.json
|   |-- comp.wxml
|   |-- custom-wrapper.js
|   |-- custom-wrapper.json
|   |-- custom-wrapper.wxml
|   |-- project.config.json
|   |-- runtime.js
|   |-- taro.js
|   |-- taro.js.LICENSE.txt
|   |-- utils.wxs
|   |-- vendors.js
|   |-- vendors.js.LICENSE.txt
|   |-- pages
|       |-- index
|           |-- index.js
|           |-- index.json
|           |-- index.wxml
|           |-- index.wxss
|-- src
    |-- app.config.js
    |-- app.js
    |-- app.scss
    |-- index.html
    |-- store.js
    |-- components
    |   |-- NumberDisplay.vue
    |   |-- NumberSubmit.vue
    |-- pages
        |-- index
            |-- index.config.js
            |-- index.vue
```

可以看出，模板代码中组件与页面都是.vue文件，编译后的则是小程序文件。奇怪的是，源代码中的components 并没有被生成对应的小程序组件，但却多了comp.xxx 一众文件，由comp.json 的内容可以看出，comp 即是编译后的自定义组件。而原模板组件中的样式，被编译到了pages/index.wxss 中。  

Taro 3 到底做了什么？  

让我们再次回归问题的原点，[小程序架构](https://developers.weixin.qq.com/community/develop/article/doc/000c8eba1ec3b8c7ce287954c53c13),Vue 虽然都借鉴了MVVM的设计，但与React 一样更类似于data => UI 的映射。如果说小程序团队有能力使用某种方式来实现数据到UI 的映射，那么React 与Vue作为浏览器层面的library，肯定是必须借助浏览器的API来实现映射的。  

这些API，其实就是DOM/BOM 的相关API，简单来说，就是我只需要新建、修改、删除DOM 节点的能力，我就可以实现data => UI 的映射。  

所以Taro next 改变了以往的思路，如果让操纵节点的API 跨端了，那么使用这些API 的框架也能跨端使用。更何况无论是小程序、React还是Vue都是使用Virtual Dom 的概念，并通过某些方式来使真实DOM 保持同步。  

Taro 这部分的实现位于[@tarojs/runtime](https://github.com/NervJS/taro/tree/next/packages/taro-runtime)，从[node.ts](https://github.com/NervJS/taro/blob/next/packages/taro-runtime/src/dom/node.ts) 可以看出，它实现了大量的DOM 标准化方法（如insertBefore,removeChild）。  

Vue 或是React 都自己维护着Virtual DOM，还需要一些操作让Virtual DOM 可以调取taro-runtime 的API，[@tarojs/react](https://github.com/NervJS/taro/tree/next/packages/taro-react)就是小程序专用的react 渲染器，它让React 的Virtual DOM 可以调用Taro 自实现的node API。  

在小程序编译阶段，Taro会将所有组件进行模板化处理，当Taro的 DOM tree 要渲染到页面上时，Taro 会基于组件的template 去动态的递归遍历渲染整棵树，这就是为什么上面编译出来的组件不会一一对应的原因，因为它们已经被模板化成为一个个的template了。