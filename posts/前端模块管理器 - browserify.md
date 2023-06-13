
---
title: 前端模块管理器 - browserify
tags: 周记
---
# 介绍

browserify 是基于 nodejs 的一款用于编译打包 commonjs 代码的工具。它能解析 commonjs 风格的代码，打包它的依赖，最后转化成浏览器能够直接执行的 js 代码。
# 安装

```
npm install browserify -g
```
# 使用
## 打包文件

```
browserify src.js > bundle.js
```

成功后，src.js 依赖的（require引用）的模块也会被打包到 bundle.js 中。

-d （--debug）参数可以同时生成 source map

```
browserify -d src.js > bundle.js
```
## 将第三方依赖独立打包

有些时候，我们想要打包独立的模块，比如，将 jquery 打包成独立的 bundle ，而不是和业务 bundle 混合在一起。

```
  browserify -r jquery > jquery-bundle.js
```

> -r 参数的官方解释：
> --require, -r  A module name or file to bundle.require()
>                    Optionally use a colon separator to set the target.
> 大概意思是，可以根据 require 的 module 名词打包，如果不用这个参数，必须要指定到具体文件路径。而且，可以给 require 的 module 指定一个别名。
> 如:
> 
> ```
>  browserify -r jquery:jquery_alias > jquery-bundle.js
> ```

如果有 main.js 依赖 jquery

```
var $ = require('jquery');
$(window).click(function () { document.body.bgColor = 'red' });
```

默认会将 jquery 作为依赖打包进来。可以使用 exclude [module_name] 剔除依赖模块的代码

```
browserify main.js --exclude jquery > bundle.js
```

当然，在 html 中，还是需要先加载 jquery 的（是否能根据依赖关系从而按需加载呢?）。

```
<script src="jquery-bundle.js"></script>
<script src="bundle.js"></script>
```
## 浏览器中直接可用的 require 函数

当引入 bundle 之后，require 函数就被扩展到浏览器的 js 环境中了。可以打开 console 窗口实验。
script 标签或者外部 js 都可以直接使用 require 来引用预先定义并且通过 browserify 打包的模块。

比如  

```
var module = require('module-name');
```
## -r 参数的探索
### 当给 module 指定了别名的时候
# 最佳实践
## 单页应用（single  page application）

单页应用一般只有一个总调度 js ， index.js，这个 js 会加载执行其他相关的 js。 所以打包的时候，只需要打包 index.js 就可以了。缺点是如果项目复杂庞大起来， 打包好的 bundle 的体积会非常庞大。优点就是管理简单。
## 多页应用

多页应用，也就是比较传统的网站，一般的电商，论坛，门户网站都是这样的。
# 参考
- [官方文档](https://github.com/substack/node-browserify)
- [standalone-browserify-builds](http://www.forbeslindesay.co.uk/post/46324645400/standalone-browserify-builds)

