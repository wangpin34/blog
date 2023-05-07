
---
title: gulp 拾遗 (1)
tags: 文章
---
# gulp 拾遗
## 楔子
最近一段时间，陆陆续续做了几个不大不小的前端项目。说它们小，是因为业务逻辑相对简单。事实上它们都不是独立的应用，而是围绕一个应用的周边设施。比如，邮件的 html 模板，OAuth 登陆页，等等。说它们大，是因为麻雀虽小但也五脏俱全，用于开发和部署的脚本，模板引擎，乃至项目本身是用到的react全家桶，任何一个点单独拿出来，都是可以大说特说的话题。

当然，本文还是将话题限制在 [gulp](https://gulpjs.com/) 方面。

负责过工程脚本的，对于 gulp，甚至在它之前的 [grunt](https://gruntjs.com/)，都不会太陌生。gulp 和 grunt 比较类似，但是 gulp 更简单易学。其他相关的名词如 [browserfily](http://browserify.org/)/[webpack](https://webpack.js.org/)/[rollup](https://rollupjs.org/guide/en)/[parcel](https://parceljs.org/) ，它们的用途是管理资源，相对来说，比较偏应用层。而 gulp 和 grunt 着重于任务管理，比较偏底层。事实上，上述四个打包工具也都有 gulp 的插件。

## Nodejs

编写任务函数的时候，经常要读写外部文件，这就免不了使用到 nodejs 的 [fs](https://nodejs.org/api/fs.html)（文件系统）模块。比如遍历文件夹，读取文件内容。相应的，文件路径的处理，离不开 [path](https://nodejs.org/api/path.html) 模块。[process](https://nodejs.org/api/process.html) 模块经常用于切换工作目录，读取命令行参数，终止进程，等等。 

如果需要将资源文件（html/js/css/images等等）部署到服务器，比如 aws s3，或者阿里云文件服务器，就需要结合对应的sdk上传文件。通常，你还需要告知服务器，待上传文件的 [mime type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)，以便用户浏览器正确的解析你的文件。

如果还需要调用某些远端 api 来更新数据，那就要借助 [request](https://github.com/request/request) 或者 [request-promise](https://github.com/request/request-promise)。

```javascript
request({url, method, body})
```

## gulp 任务
从 gulp 4.x 开始，任务的编写方式变成定义function，如
```javascript
function deploy(){...}

exports.deploy = deploy
```

而在此之前，编写任务使用下面的方式
```javascript
gulp.task('deploy', function(){...})
```

新的设计对自由度的提升很大，只要function的返回值是stream/promise/obserable，既可以当作一个合格的 task。这样，创建很多原子的 task，再通过各种方式串联/并联起来，构成各式符合需要的 task，就成了一件和 gulp 无关的事情。程序员可以专注于这些 task 的编写而不用顾及 gulp 本身的限制。我把这个变化称为以退为进，gulp 的作者们希望通过减少自己存在感的方式，来赢得更多的粉丝。事实上，这也一直是 gulp 的哲学。**尽量少做，将自由留给用户**。另一个领域也奉行这个原则的是 reactjs。

另一方面，gulp也在吸收自己社区优秀的设计，比如，gulp 也提供了串行(series)和并行(parallel)任务的原生支持, 不需要再借助第三方插件完成这两项工作。
```javascript
gulp.series(task1, task2, ...)
gulp.parallel(task1, task2, ...)
```

## 配制文件
很多时候我们需要使用到外部配置文件。nodejs 对 json 友好，直接 require 就能获取 json 文件的内容。
```javascript
require('config.json')
```
json 文件简单易懂，但作为配制文件，表达力并不强。这个仔细分辨起来，对我来说比较困难。我想可能是因为 json 文件太冗杂：大量于数据无用的字符如花括号，双引号，逗号，影响阅读。目前，很多大型项目使用 yaml 来作为标准配置文件，包括 由 json 转 yaml 的 spring，默认使用 yaml 的 swagger，等等。 

## 环境变量
有些关键/敏感信息的配置项不能硬写在文件中，比如数据库的用户名和密码。通常，运行环境会将这些信息配置在环境变量中，由我们的配置文件或者脚本自行读取。

本地开发一般也要维持这样的方式，即，从环境变量中读取配置数据，哪怕那个数据库就安装在本机上。这样是为了保证开发的配置方式和线上一致，避免低级错误。比如，有些程序员习惯直接修改配置文件，加入密码等敏感信息，如果这份修改不小心被提交到代码仓库，再被别有用心的人盗取，可能会引起严重的生产事故。因此，这些信息还是只存放在环境变量中的好。

有三种使用环境变量的方式：
1. 修改系统变量，好处是一次修改可多次使用，方便。缺点是多个项目使用同名不同值的变量（命名空间问题），引起冲突，而且，系统变量对所有应用程序开放，也不够安全。
2. 在某个命令行中 export。好处是临时声明比较安全。缺点是每次新打开的命令行都需要重新 export，麻烦。
3. 保存一份配置项在本地仓库。安全（可以设置较高的读权限），并且，规避了多个项目的命名冲突。比较流行的实现有 [dotenv](https://github.com/motdotla/dotenv)。只需要在项目根目录添加 .env 文件并保存配置项，就可以将配置设置在进程里。

综上，dotenv 是目前最好的方案。

## 总结
本文作为 gulp 系列的开篇，主要阐述下面几个观点。
* gulp 是基础的任务管理工具。
* 编写 gulp 脚本离不开 nodejs 的支持，常用模块有 fs，path，process 等。
* gulp 4.x 的任务编写更加简洁可扩展。
* 使用 yaml  作为配置管理文件 。
* 使用 dotenv 为本地开发提供环境变量。




