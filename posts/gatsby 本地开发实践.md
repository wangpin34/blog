
---
title: gatsby 本地开发实践
tags: 文章
---
# 缘起
2019年末开始接手为 HPBP(`hp business platform`) 开发文档网站，底层是 [gatsbyjs](gatsbyjs.org)，上面是一堆 `React` 组件和编译相关的脚本。这个项目是我一个人在做，hp 的前端团队人少活多，一个人干几个项目是常有的事。

在这个略显孤独的开发过程中，我一个人从陌生到了解到熟悉，直到现在的心如止水。时间来到2021年1月，这个文档网站基本上已经处于`静止`状态，除了几个束之高阁的大需求，如 search，没什么新的工作要做了。趁这个闲暇的机会，整理总结一下这一年情况。

# 从 docz 到 gatsbyjs
其实，用 Markdown 来生成网站并不是个新鲜的概念，在 gatsbyjs 之前，有很多其他的建站工具实现了这个概念，仅仅我自己用过的，就有 `hexo`, `docz`。随便用哪个编程语言加上 markdown 在 google 上搜索一下，都会搜到很多类似的工具。所以这个东西本身一点也不新鲜。

`docz` 是一个比较新鲜的东西，因为这是我本人接触到的第一个可以在 markdown 里嵌入 jsx 代码，并且在网页上可以编辑并实施查看 jsx 结果。当然后面我知道这是 mdx 的魔法，但是当时确实非常激动。`Customer Portal UI` 这个项目的组件文档就是使用 `docz` 开发的。可惜 `Customer Portal` 这个项目先天不足，没能继续做下去。

对 `gatsbyjs` 的初印象是看到 Dan 的个人博客在使用，Dan 是我很尊敬的软件工程师，不仅仅是因为他是 Redux 的主要作者，他本人的诚恳和认真也是我很欣赏的特质。虽然如此，我也没有开始使用 gatsbyjs ，因为在我看来，建站的工具会一个就行了。直到项目里必须使用，我才开始正式的学习。

我以前玩过很多建站工具，但我依然得说， `gatsbyjs` 是非常好用的一个，甚至是最好用的一个。未来会不会被别的工具超越，我不敢说，但是目前看来，只要你会 React，对 GraphQL 感兴趣，那 `gatsbyjs` 极有可能成为你的心头好。我总结了它的几个优点：

* 使用 React（以及React社区广阔的技术选择） 带来的可编程姓
* 使用 GraphQL 带来的数据层灵活性
* 丰富的 gatsbyjs API 和 plugin
 
干巴巴的说可能没什么说服力，举几个例子
1. `gatsbyjs` 内部预置了 SSR，首屏如果传统网站一样快，站内跳转又具备 SPA 的优势。
> SPA(single page application）的优点是站内跳转不需要重新渲染所有部分，缺点是首屏（客户端第一次访问）比较慢。为了对付这个问题，各大 SPA 框架都‘发明’了自己的 SSR 框架，比如 Nextjs 之于 React。SSR 的全称是 server side rendering，简单来说，就是首屏的内容由服务端 'render‘ 完成再返回 client。
2. 对数站内数据的使用， `gatsbyjs` 提供了很多非常 `javascript` 的办法(GraphQL, PageContext)，因为是 `javascript`，所以 React 组件内可以通过对应的 API 来查询数据。
3. 因为 React 的缘故，页面部分的视图解耦非常容易，搭配 `typescript` 和 vscode 上丰富的插件，编程体验非常棒。
4. `gatsbyjs` 提供了很多 hooks 和 API，编译前期，可以从任何数据来源来构造数据层，然后在编译器，从这些数据层构造页面，动态制定页面模板，甚至定制页面的路径。

让人惊喜的地方实在说也说不完，要用一句话来总结的话，只能说：`gatsbyjs` 在保留核心稳定的前提下，开放了所有能开放的给用户，只要你想，什么都可以魔改。

# 本地开发优化

开发过程中，一般不会太需要频繁的修改 `build` 脚本，如 `gatsby-config.js`。但是一旦需要修改，我们必须清楚，修改脚本后需要重新启动进程才能生效。可是如果需要频繁启动，启动速度自然成为必须考虑的事情，谁也不想只是改动了几个命令就要等好几分钟才能完成重启。

`gatsby develop` 命令的启动速度受到引入资源的数量（通过 `gatsby-file-system`）和 plugin 复杂的影响，如果要追求更迅速的启动速度，势必要对 `config` 做一番面向 `develop` 的调整才是。

所以，在开始下面的内容之前，要先调整 gatsby-config.js 的内容。首先，添加两个新文件:

```bash
touch gatsby-config-dev.js 
touch gatsby-config-prod.js
```
将原始的 gatsby-config.js 的内容复制到 gatsby-config-dev.js 和 gatsby-config-prod.js。

修改 gatsby-config.js，按需加载配置
gatsby-config.js
```javascript
const devConf = require('./gatsby-config-dev')
const prodConf = require('./gatsby-config-prod')

let conf

if (process.env.NODE_ENV === 'development') {
  conf = devConf
} else {
  conf = prodConf
}

module.exports = conf
```

接下来，对 `gatsb-config-dev.js` 做必要的修建，目的是只加载必要的资源，尽量少的 `plugin`。
##  减少引入资源的数量
对于验证页面样式来说，build 所有的文档并不是必须的。一般，我们只需要验证几个典型的文档。所以，可以调整 `gatsby-plugin-filesystem` 的配置项，只引入少数几个文档。一般情况下，这样改是没问题的。但是如果需要经常修改，增加或减少文档，就会引起不必要的 change，而这些 change是不能 commit 到仓库的。如何技能足够灵活，有可以避免改动 `gatsby-config.js` 呢？最简单的办法将 `gatsby-plugin-filesystem`  的目录永久设置到一个临时目录，在启动之前，通过shell命令 copy 文档到这个目录。

## 移除不必要的 plugin
有两类 `plugin` 对于验证样式是没有必要的。
* runtime performance，比如生成 `pwa` 资源，生成缩略图，不同像素密度图片
* 特别吃资源的，比如 `mermaid plugin` 调用浏览器内核生成 svg 结果的

对于第二种，可以选择性加载，比如，当前的目标是验证其他样式，那就关闭，提高启动速度。当需要验证 `mermaid` 时，再手动打开。

# Makefile 的使用
调整 build 脚本的过程中，有些问题开始变得复杂起来。
* 本地开发启动之前，需要shell命令复制文件，如何存放这些命令，`package.json` 的 `scripts` 部分已经太拥挤了
* 很多命令之间有依赖关系，因为 scripts 部分越来越复杂，这些关系难以维护了，生怕哪天搞错了
* 厌倦了使用 `CROSS-ENV` 设置环境变量，一个一个 `&&` 心好累

虽然我知道此时正在阅读的你跟我一样只是个前端工程师罢了，但是我还是想推荐你使用 `Makefile` 解决上面的问题。 可能你这是你第一次听说 Makefile，或者你之前听过但是知道`Makefile` 一般都是用来编译 `C++` 项目的。但是 `Makefile` 真的是解决上面问题成本最低的办法了。

* Makefile 可以直接调用 shell 命令，像什么文件目录操作，几个简单的命令直接就完了, `mv`, `cp`。
* Makefile 里可以设置变量，函数，复用逻辑也很容易。
* 最重要的一点，` Makefile` 可以通过简单的声明来调用`node_modules` 里的 bin
```bash
PATH := ./node_modules/.bin:${PATH}
```

关于 `Makefile` 的详细用法，网络上有很多优秀的播客和教程，这里不做说明。可以参考：
* [Make 命令教程](https://www.ruanyifeng.com/blog/2015/02/make.html)
* [Makefile](https://gist.github.com/isaacs/62a2d1825d04437c6f08)

