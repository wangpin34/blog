
---
title: dead link 检测环节，需要吗？什么时候检测合适？
tags: 文章
---
公司的文档系统摒弃了之前的 rich text cms，换成 github + gatsby，github 用于保存文档内容（markdown 源文件和相关静态资源，目前最主要的是图片），gatsby引擎 + 定制主题生产页面。

文档的内容由 markdown 编写以后，有很多好处，编写效率高，迁移方便（纯文本随便复制黏贴，批量搜索替换）。页面风格灵活可控。但是缺点也是很明显的，不能“所见即所得”，以在编辑时就能根据实际情况调整内容。于是我开发了几款产品来试图解决了这个问题，经过一段时间的探索，最终定型下来的是一款简单的 chrome extension。当用户打开 github 的文件编辑页面，extension 就会被激活，预览框出现在编辑框右边，各占据一半屏幕宽度。用户可以一边编辑，一边预览编辑结果。

随着一段时间的试运行，很多新的需求和问题被收集起来，比如预览文档的宽度问题，mermaid chart 动态渲染问题，侧边栏导航的预览。而最近，一个新的问题进入视线：dead link 检测。什么意思呢？作为技术文档，段落中插入引用链接是非常频繁的。这些链接又分为站内和站外链接。站外链接通常是直接复制三方网站的网页链接，一般不存在 dead link，即网页地址错误（如果未来失效，则是另一种情况，这里不再展开）。而站内链接是由文档编写着根据相关文档的预期路径来填写。为什么不是线上链接呢？因为文档发布的位置根据不同的目的，会有所不同，开发阶段，测试阶段，开放阶段，文档都会存放在不同的路径上，这个链接就不可能是固定的。但是相对的路径是固定的，这个相对的路径，就是目前文档编写者添加站内链接时的使用的链接。

因为是“预期”的路径，所以不可复制线上的。又因为不是线上的地址，所以其有效性不容易辨别，通常的办法，对于我来说，是根据 markdown 文件的路径来判断被索引文档的位置，然后查看该文档是否存在。如果存在，则路径合法，则链接有效。否则，路径非法，链接无效。这就是一个坏链接。

从理论上讲，熟悉文档路径的相对关系之后，只要稍微注意，就能避免站内链接非法的错误，消除 dead link。但是实际中却又是另外一码事，不是每一个文档编写者都对规则了若指掌，存在理解上的似是而非。另一方面，我们得承认犯错是不可避免的，要求文档编写者永远正确是不对的。更好的办法是，提供一种自动化机制，来检测甚至修正错误链接。

好，我们明确了 dead link 检测环节的必要性。那么，怎么检测呢？

首选方案当然是已有的 chrome extension，但是问题在于，文档发布在 github enterprise，比如通过 hpid 登陆后才能查看，所以 chrome extension 的脚本根本没有权限发送 ajax call 来检测网页是否可达。

devops 和 qa 同事建议将检测流程放在 build 阶段，即 gatsby 生产页面的阶段。我们预期的结果是，在 build 的早期，比如加载 markdown 文件的时候，分析文档内容，查找并验证链接。但是这个方案有明显的缺陷，比如必须依赖 build 流程。很多文档编写者直接在 github 上操作，必须在提交后等待 build server 排期，运行，然后从报告中查看结果（如果有错误的话），这是一个很漫长的反馈，效果可想而知。简单来说，这个办法没法解决编辑时的错误，只能事后诸葛亮，那个时候 dead link 已经上线了。

以上的讨论过后，结论是，目前还不具备自行开发 dead link 的条件。我当时给出的解决办法是，chrome extension + 手动检测。当 extension 渲染出链接后，点击链接打开新页面，查看页面是否存在。当时来看，这个办法解决了部分问题。同时，又提供了一个 web app 同样部署在 github enterprise，在这个 app 里编写 markdown，使用第三方的 dead link 检测extension，同样可以迅速的发现 dead link。

但我一直没停止这样的憧憬：提供轻便快捷的办法可以验证站内链接的合法性。当文档编写者在 github 内部编辑链接时，能够及时得到链接是否合法的信息。

有必要再次说明为什么在当前的预览 extension 无法检测 dead link。常规的 dead link 检测办法是这样一个脚本：
```javascript

fetch(url, {method: 'HEAD'}).then(resp => resp.status === 200 ? 'exists' : 'not found')
```
既然是 javascript，自然受同源策略保护。在 extension 的域里面访问 github enterprise 自然被阻止。那么，在 content-script.js 里呢？它运行在 github 域。也不行，因为页面实际是部署在 github enterprise 的 pages 下，这也是不同的域。

”可恶的同源策略“。

让我改变思路的是这样一件事情。某天，再又处理了一堆 dead link 后（某几次频繁的文档上线，就会出现这样的问题），我坐下来思考。我们的文档放在 content 目录下，按照 httpd 服务器的策略来处理 request，比如，GET /v1/about，就会返回 content/v1/about.md 回去（当然是加工成 html 的内容）。

github 上 markdown 文件的路径，决定了未来 build 之后文件在网络上被访问时的路径，即链接。

那么，通过链接，反推文档的路径，然后检测这个路径代表的文件是否存在，不就可以证明链接是否合法吗？文件与 content-script.js 在同一个域，dead link 检测脚本畅通无阻。耶！

想通了这个关键，我开始尝试为 extension 添加新的代码，这个时候，我遇到了几个问题。

第一个问题是，因为想要在 content-script.js 使用 package 的内容，于是将其改造为 typescript 代码。因为相关的 babel 配置与 iframe app（预览页面，本质上是一个 create-react-app 生成的 app）冲突，被迫采用 [lerna](https://lerna.js.org/) 将项目分成三个 packages。
```
- shared : message 定义，相关函数
- chrome :  content-script.ts 
-  extension:  iframe app
```
然后因为使用 yarn， 又被迫学习了下 [yarn workspace](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/)。

还在如何构造 url 上花了一些功夫，走了一点弯路。npm 的 url-join 不支持 relative path，js 原生的 URL ，构造函数里的 base path 竟然对 absolute path 不起作用。折腾了一番，最后 file path 生成方法如下：

```typescript
const base = `${host}/${owner}/${repo}/blob/${branch}/content`
let filepath: string = link.indexOf('/') === 0 ? urljoin(base, link) : new URL(link, urljoin(base, docPath)).href
```
base 其实完全可以 hardcode，一时技痒，非得分析结构，然后重新构造，一点 hardcode 都不用，美其名曰以后移植到任何git风格的code base 都无缝使用。

docPath 就是当前文档的路径，对于相对链接，如`../../docs`，当然是相对于当前文档的路径。

最后，还有手写的 PromiseAny 和 checkFileExistence：

```typescript
async function PromiseAny<T>(promises: Array<Promise<T>>) {
  const total = promises.length
  return new Promise<T>((resolve, reject) => {
    let count = 0
    let resolved = false
    const errors: Error[] = []
    promises.forEach((promise, index) => {
      promise
        .then((d) => {
          count++
          if (!resolved) {
            resolved = true
            resolve(d)
          }
        })
        .catch((err) => {
          count++
          if (!resolved) {
            errors[index] = err
            if (count >= total) {
              reject(errors)
            }
          }
        })
    })
  })
}

async function checkFileExistence(filepath: string) {
  try {
    const resp = await fetch(filepath, { method: 'HEAD' })
    const status = resp.status
    if (status !== 200) {
      throw 'File not exists'
    }
    return true
  } catch {
    throw `failed to check existence of ${filepath}`
  }
}
```





