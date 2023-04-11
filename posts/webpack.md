
---
title: webpack
tags: 周记
---
# 介绍

webpack  可以用来打包前端页面依赖的静态资源，例如 js ，css ，图片，等等，也就是俗称的依赖管理。它比较适合单页面应用，只需要将所有的依赖打包到一个文件中就可以了。 对于多页面应用的依赖管理，则需要更加复杂，场景化的方案，这里不谈。
# 安装

```
npm install webpack -g
```
# 开始

webpack 是来打包静态资源的，那就先从打包 js 开始吧。
建一个 entry.js

```
document.write('It works');
```

建一个 index.html

```
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <script type="text/javascript" src="bundle.js" charset="utf-8"></script>
    </body>
</html>

```

开始打包：

```
webpack entry.js bundle.js
```

成功后会生成 bundle.js,先不要管它，在浏览器中打开 index.html，看看是否打印出 It works

如果 entry.js 中 require 了其他的 module，这个 module 也会被打包到 bundle.js 中。
## 项目实战
### webpack.config.js

实际项目中，webpack 应该安装到项目目录中，并将其保存成开发依赖。相关配置在webpack.config.js 中。

```
module.exports = {
    watch:true,
    devtool: 'source-map',
    entry: "app.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
```

loaders中引用了 css 的加载器，用于打包 css 到 bundle.js中。 其他更详细的配置可以参考[官方手册](https://webpack.github.io/docs/configuration.html)

在 package.json 中设置脚本

```
"build":"webpack --progress --colors --watch"
```

colors 选项用于输出彩色的打包报告。
watch 选项用于监测源文件的修改，并实时更新 bundle.js
### on grunt

 [grunt-webpack](https://www.npmjs.com/package/grunt-webpack) 只是 webpack 和 grunt 之间的中间件，所以需要同时安装 webpack 和 grunt-webpack

```
npm install grunt-webpack ---save-dev
```

在 Gruntfile.js 中加载 grunt-webpack
···
grunt.loadNpmTasks('grunt-webpack');
···

然后就可以使用 webpack了。
···
grunt.initConfig({
  webpack:{
    // webpack options
  }
}
···
### on gulp

gulp-webpack 内含 webpack，所以只需要独立安装它就可以

```
npm install gulp-webpack --save-dev
```

在 gulpfile.js 中定义  webpack task

```
var webpack = require('gulp-webpack');

gulp.task('webpack', function() {
  gulp.src('entry.js')
    .pipe(webpack(require('./webpack.config.js'))) //这里导入配置文件
    .pipe(gulp.dest('.'));
});
```
### es6 支持

webpack 默认只能打包 es5 文件，对于 es6 代码，目前最好的方案是用 babel。babel 是一个功能强大的代码编译器，可以编译 es6， react，等常见的 js 代码。
- 准备 babel 相关

```
  npm install babel-cli -D
```

创建 .babelrc 文件，配置 preset。

```
  {
  "presets": [
    "react",
    "es2015"
  ],
  "plugins":["transform-es2015-arrow-functions"]
`}
```

