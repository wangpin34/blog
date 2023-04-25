
---
title:  unifiedjs 简介
tags: unifiedjs
---
![xps-8pb7Hq539Zw-unsplash](https://user-images.githubusercontent.com/12655367/136935807-fe7fba7b-0dd0-4392-9b24-c3161e639aac.jpg)
Photo by <a href="https://unsplash.com/@xps?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">XPS</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
[unifiedjs](https://unifiedjs.com/) 的目标是解析各种格式的信息，转化为结构化数据（`sytanx tree`）。`unifiedjs` 本身不提供解析（`parse`）的能力，需要搭载各种解析器（`parser`）完成具体的工作。

> We compile content to syntax trees and syntax trees to content. We also provide hundreds of packages to work on the trees in between. You can build on the unified collective to make all kinds of interesting things.
> 

比如，我们需要处理 `markdown` 信息，需要用的 `parser` 是 [remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse)，它将 `markdown` 信息转化为 [mdast](https://github.com/syntax-tree/mdast)，一种流行的描述 `markdown` 的 `syntax tree`。有了 `syntax tree`，就可以根据 `tree` 搞事情，比如各种 `stringify` 插件。

`unifiedjs` 将相关主题的插件打包成一个个工具箱，比如，对于 `markdown`，就有 [remark](https://unifiedjs.com/explore/package/remark/)。上面提到的 `remark-parse` 就是 `remark` 工具箱中的一员。

而对于 `markdown to react` 这样更加特异化的场景，也有对标的插件，他们的名字前缀都带着 `rehype`，[rehype](https://github.com/rehypejs/rehype) 是处理 `html` 数据的专家。他们的家族里有一个叫 [rehype-react](https://github.com/rehypejs/rehype-react)。在它的代码演示里可以看到如何从 `markdown` 到 `react` 这个过程。

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeReact from 'rehype-react'

const processor = unified()
  .use(remarkParse)
  .use(remarkSlug)
  .use(remarkToc)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeReact, {createElement: React.createElement})

class App extends React.Component {
  constructor() {
    super()
    this.state = {text: '# Hello\n\n## Table of Contents\n\n## @rhysd'}
    this.onChange = this.onChange.bind(this)
  }

  onChange(ev) {
    this.setState({text: ev.target.value})
  }

  render() {
    return (
      <div>
        <textarea value={this.state.text} onChange={this.onChange} />
        <div id="preview">{processor.processSync(this.state.text).result}</div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'))
```

代码太长懒得看？没关系，大概的步骤是这样。

1. `use(remarkParse)` 解析 `markdown` ，得到 `syntax tree`(`mdast`)
2. `use(remarkSlug)` 给标题节点添加锚点
3. `use(remarkToc)` 生成 `toc`（目录）节点
4. `use(remarkGfm)` 应用 [gfm](https://github.github.com/gfm/)，比如特有的 `table` 写法
5. `use(remarkRehype)` 将 `markdown syntax tree`(`mdast`) → `html syntax tree([hast](https://github.com/syntax-tree/hast)`)
6. `use(rehypeHighlight)` 使用 [highlight.js](https://github.com/isagalaev/highlight.js) 高亮代码片（分析代码结构，切分和标记不同的成分，比如关键字，变量，操作符号，等等。视觉效果需要加载对应的[主题](https://github.com/highlightjs/highlight.js/tree/main/src/styles) `css`）
7. `use(rehypeReact)` 将 `hast` 转化为 `react`

其中，2 ~5，6，都可以省略掉。核心步骤是：

1. `use(remarkParse)` 解析 `markdown` ，得到 markdown `syntax tree`，也就是 `mdast`
2. `use(remarkRehype)` 将 markdown `syntax tree`(`mdast`) → html `syntax tree`，也就是 [hast](https://github.com/syntax-tree/hast)
3. `use(rehypeReact)` 将 `hast` 转化为 `react`

简单的说，就是 `markdown` → `html` → `react`。

那为什么不直接从 `markdown` → `react` 呢？

如果直接做，那么 `unifiedjs` 就深度绑定到 `react` 上面。而这与 `unifiedjs` 的初衷无疑是相悖的。`unifiedjs` 想做的是灵活，多变，丰富的生态系统，而不是捆绑在某个具体实现上的工具。所以必须要用 `html` 作为中转，以便更多的其他实现，比如 [vue](https://github.com/medfreeman/remark-vue/)，比如 `angular`，来加入 `unifiedjs` 的大家庭。

# 常见问题

在 `create-react-app` 生成的项目中使用 `remark` 会有如下错误

```jsx
./node_modules/hast-util-to-text/index.js 363:65
Module parse failed: Identifier directly after number (363:65)
File was processed with these loaders:
 * ./node_modules/babel-loader/lib/index.js
You may need an additional loader to handle the result of these loaders.
|     //     break is the zero-width space character (U+200B), then the break is
|     //     removed, leaving behind the zero-width space.
>     if (lines[index].charCodeAt(lines[index].length - 1) === 0x20_0b
|     /* ZWSP */
|     || index < lines.length - 1 && lines[index + 1].charCodeAt(0) === 0x20_0b
hast-util-to-textModule parse failed: Identifier directly after number (363:65)
```

原因是 `./node_modules/hast-util-to-text/index.js`  使用了 [bigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)，bigInt 作为 es6引进的新特性，必须纳入构建流程。而 `create-react-app` 默认并不编译 `node_modules` 里面的代码。

解决的办法是将 `hast-util-to-text` 纳入构建，可以 eject 修改配置，也可以用 [craro](https://github.com/gsoft-inc/craco) 。

`craco.config.js`

```jsx
const path = require('path')
const fs = require('fs')
const cracoBabelLoader = require('craco-babel-loader')

// manage relative paths to packages
const appDirectory = fs.realpathSync(process.cwd())
const resolvePackage = (relativePath) => path.resolve(appDirectory, relativePath)

module.exports = {
  babel: {
    plugins: ['@babel/plugin-syntax-bigint'],
  },
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [resolvePackage('node_modules/hast-util-to-text')],
      },
    },
  ],
}
```

