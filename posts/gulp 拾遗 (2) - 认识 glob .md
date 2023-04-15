
---
title: gulp 拾遗 (2) - 认识 glob 
tags: 文章
---
# gulp 拾遗 (2) - 认识 glob 
## 为什么要用 glob
gulp 的 [task](https://gulpjs.com/docs/en/getting-started/creating-tasks) 函数一般起自于 [src](https://gulpjs.com/docs/en/api/src) ：
```javascript
const { src, dest } = require('gulp');

function copy() {
  return src('input/*.js')
    .pipe(dest('output/'));
}
```
简单来说， **src** API 根据输入参数（input/*.js），从文件系统中读取文件流（stream），从而进行后续的操作。src 函数的第一个输入参数称为 pattern，是一个 glob 语句。glob 语句类似于 unix shell 中描述文件的方式。
```bash
ls ./input/*.js
```
glob 语句很容易理解，比如上面的 input/*.js，表示 input 目录下（不包含子目录），扩展名为 js 的**所有**文件。

如果想要自如的编写 gulp 脚本，掌握 glob 语句是必不可少的。事实上不只 gulp，其他构建工具如 webpack，也使用 glob 语句来匹配文件。我想原因无非有两个，一是因为 glob 语法非常简单，容易学习。另一方面， glob 借鉴了 unix/linux 中文件匹配的语法，而很多工程师都有 unix/linux 经验，学习成本很低。就像当年 android 使用 java 作为开发语言以至于收到很多 java 程序员的喜爱和支持。

## node-glob
目前，glob 最好的实现应该是 [node-glob](https://github.com/isaacs/node-glob)。下面是一个简单的例子，用于查找所有目录下的 js 文件。第一个参数称为 pattern，描述待匹配文件的路径特征；第二个参数是 options，提供一些增强的配置项，如配置工作目录，模式，排序规则，等等。第三个参数是回调函数。可以看到 glob 是异步函数。

```javascript
var glob = require("glob")

// options is optional
glob("**/*.js", options, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
})
```

### pattern
pattern 的类型是字符串或者字符串数组，每个字符串都可以包含以下几种关键字。
```
* 匹配 0 或多个字符
? 匹配 1 个字符
[...] 匹配一系列字符，比如 [a-z], [0-9]。如果第一个字符是 ！ 或 ^， 则匹配不在其中的字符。比如 [^a-z] 匹配不是 a-z 之外的字符。
!(pattern|pattern|pattern) 匹配不符合所有 pattern 的字符
?(pattern|pattern|pattern) 匹配 0 或 1 个符合其中一个 pattern 的内容
+(pattern|pattern|pattern) 匹配 1 或多个符合至少其中一个 pattern 的内容
*(a|b|c) 匹配 0 或多个符合至少其中一个 pattern 的内容
@(pattern|pat*|pat?erN) 匹配 1个至少符合其中一个 pattern 的内容
** 两个星号匹配 0 或多个目录
```
上面的规则不算太复杂（相比正则表达式），但仍需要搭配一些练习才能掌握。

### [options](https://gulpjs.com/docs/en/api/src#options)
options 中的选项很多，拣几个常用的讲一下。
#### cwd 
cwd 表示当前工作目录（current work directory）。也就是 process.cwd()，也即使 nodejs 脚本的执行目录。什么意思呢？比如，有个文件 index.js，我们在 /home/wangpin 下执行：
```bash
/home/wangpin $ node index.js
```
此时，cwd 是 /home/wangpin。
如果我们在 home 目录下启动 index.js：
```bash
/home $ node wangpin/index.js
```
此时，cwd 是 /home。

简单的说，** cwd 是我们运行脚本的目录，不是脚本的存放目录 **。

#### ignore
设置一个 pattern 用于忽略某些文件。虽然有 ! 和 ^ 可以用来做 exclude，但总体来说， pattern 是用来做 include，在其中夹杂复杂的 exclude 规则会让整个 pattern 变得非常难以理解。更简单的办法是利用 ignore option 来设置过滤规则。即
```
files -- pattern: include --> files -- ignore: exclude --> files
```
比如，选取 input 目录下的 js 文件，同时过滤掉 min.js 文件：
```javascript
glob('./input/*.js', {ignore: './input/*.min.js'})
```

## gulp 中的 glob
gulp 并没有直接使用 node-glob，它自己做了很多的封装，创造出了 [glob-stream](https://github.com/gulpjs/glob-stream)，[vinyl-fs](https://github.com/gulpjs/vinyl-fs) 等一系列满足自身需求，同时也很有现实意义的库。gulp 的官方文档中队 vinyl 和 glob 也做了详细的阐释，请移步 [concepts](https://gulpjs.com/docs/en/api/)。

## 其他脚本中的 glob
编写任何涉及到文件检索的脚本，glob 都应该是首选。比如，我们想要将 dist 目录中的所有文件上传到 aws s3。如果用 fs api 生写，仅仅是遍历所有文件，就需要下面这一大段代码：
```javascript
function deploy(src) {
  let totalFiles = []
  function listFiles(folder) {
    return fs.readdirAsync(folder)
      .then(function(list){
        list = list.map(function(f){
          return path.join(folder, f)
        })
        let files = list.filter(function(file){
          return fs.statSync(file).isFile()
        })
        totalFiles = totalFiles.concat(files)
        let folders = list.filter(function(file){
          return fs.statSync(file).isDirectory()
        })
          .map(function(folder){
            return listFiles(folder)
          })
        return Promise.all(folders)
      })
      .catch(function(e){
        console.error(e)
      })
  }

  return listFiles(src)
    .then(function(){
      return Promise.all(totalFiles.map(function(file){
        return put(file, src)
      }))
    })
}
```
这还没有涉及复杂的 include 和 exclude 规则，已经是比较**大**的函数了。
如果用 glob 重构一下呢？
```javascript
function deploy(globs, opts) {
  return (new Promise(function(resolve, reject){
      glob(globs, opts, function(err, files){
        if (err) {
          reject(err)
        }
        resolve(files.filter(function(file){
          return fs.statSync(file).isFile()
        }))
      })
    }))
    .then(function(files){
      return Promise.all(files.map(function(file){
        return put(file)
      }))
    })
}
```
代码量减少的同时，复杂的include/exclude部分由专业的 glob 来负责。

## 总结
glob 是简单而强大的文件匹配库，gulp，webpack 等构架工具都使用它来简单化文件匹配工作，某种意义上来说它已经是文件匹配的事实标准。glob 也可以用于其他涉及文件匹配的应用场景，不必拘泥于已有的场合。

文中提到的库，文档，及相关资料地址。
* [node-glob](https://github.com/isaacs/node-glob)
* [gulp concepts](https://gulpjs.com/docs/en/api/concepts)
* [gulp expaining globs](https://gulpjs.com/docs/en/getting-started/explaining-globs)







