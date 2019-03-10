---
title: 安装
type: guide
order: 1
vue_version: 2.6.8
gz_size: "33.19"
---

### 兼容性

SuperUI **不支持** IE8 及以下版本，因为 Vue 使用了 IE8 无法模拟的 ECMAScript 5 特性。但它支持所有[兼容 ECMAScript 5 的浏览器](https://caniuse.com/#feat=es5)。

### 更新日志

最新稳定版本：{{vue_version}}

每个版本的更新日志见 [GitHub](https://github.com/vuejs/vue/releases)。

## 直接用 `<script>` 引入

直接下载并用 `<script>` 标签引入，SuperUI会自动成注册全局组件。

<p class="tip">在开发环境下不要使用压缩版本，不然你就失去了所有常见错误相关的警告!</p>

<div id="downloads">
<a class="button" href="https://vuejs.org/js/vue.js" download>开发版本</a><span class="light info">包含完整的警告和调试模式</span>

<a class="button" href="https://vuejs.org/js/vue.min.js" download>生产版本</a><span class="light info">删除了警告，{{gz_size}}KB min+gzip</span>
</div>

## NPM

在用构建大型应用时推荐使用 NPM 安装<sup>[[1]](#footnote-1)</sup>。NPM 能很好地和诸如 [webpack](https://webpack.js.org/) 或 [Browserify](http://browserify.org/) 模块打包器配合使用。

``` bash
# 最新稳定版
$ npm install super-ui
```
