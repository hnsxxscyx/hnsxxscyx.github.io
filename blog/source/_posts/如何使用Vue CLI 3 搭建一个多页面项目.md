---
title: 北京之行
date: 2018-10-09 22:00:12
tags: [Vue]
---
#### 为什么要用vue来做多页面应用

- 熟悉vue开发模式
- 有大量封装好的组件来用
- 避免加载不必要的资源
- 多页面中的部分单页面

#### 如何配置

首先是[官方文档](https://cli.vuejs.org/zh/config/#pages)

其次是，(⊙o⊙)…，能搜到的都是2.x版本的，新版本连build目录都木有了（统一在vue.config.js中配置）

```javascript
module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: 'src/index/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    subpage: 'src/subpage/main.js'
  }
}
```

参考pages的配置示例，设置一下就行。（目录不要写错了⊙︿⊙）

然后启动devServer，注意这里devServer是没有设置路由的，URL必须加上.html后缀才能访问到输出文件。

#### 为什么要记录一下

其实踩了很多坑，比如config中目录写错了，demo中模块调不到（复制其他现成页面进来的），启动devServe如何不知道如何启动具体页面。

暴露了基础知识的不足，对webpack的原理完全不清楚，上来就是胡瞎用，需要加强。

那么加油咯。