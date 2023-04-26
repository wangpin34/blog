
---
title: 周记 2019/8/9：开发 purify reader
tags: 文章
---
## 引子
老婆总是在小网站看网文，这些网站的排版和配色惨不忍睹，而且有大量的浮动广告，非常影响阅读体验。于是她会央求我将网文整个下载下来，这通常都要去折腾一下爬虫程序。有一天，我逆向思维了一下：与其费力下载网文，何不直接做一个阅读器来定制界面呢？本质上老婆只是想要舒服的阅读体验罢了。

于是接下来的几天我折腾了 Cordova 的内置 iframe，内置 browser，发现都很难满足需求。于是，我转而将目标瞄准了两个方向：
1. 一个 chrome extension
2. 一个可以运行在手机上的爬虫

这篇文章讲述开发这个 extension，即 purify reader 的故事。

## 第一版
首先我使用 create-react-app 创建了一个空项目，eject，改动了「webpack 相关的配置」[1](https://github.com/wangpin34/purify/commit/83ff5e0a35729a64a99994427bc60c75946cb728),[2](https://github.com/wangpin34/purify/commit/a21bffceba70fbf313c92214eb40f8248e309c62)（主要是去除build 文件的 hash），添加 minifest.json 和各种尺寸的图标。

界面相关的问题比较简单（对我来说），比较有挑战性的题目是如何准确的选取正文内容。我参考了stackoverflow 的一些回答，总结了以下的规则，优先级从高到低：

1. 选取 article，id/name/class 中包含 content/body 的 dom。
2. 选取 div/section/p

**最后将选取到的 html 内容插入 purify 的根节点**。
```html
<div id="purify-reader">
  <!-- 正文 html -->
</div>
```

按照以上规则我构建了第一版「选正文」函数。亲测对[笔趣阁](https://www.qu.la)有效。

## 认识 readability 和 第二版
第一版「选正文」函数在很多个人博客上效果并不理想，我急切的想要找到更优秀的算法来弥补这一块短板。这天在家里无聊的看小说，不料又想到这个问题。原来这个小问题已经成了我的心病。既然如此，那就再努力找一找吧。于是捧着手机一顿搜索，找到了这个 [python-readability](https://github.com/buriy/python-readability)。它的功能很单一，就是用来解析 html 文档的主要文字内容，即正文。按图索骥，我成功的找到 js 的实现：[readability](https://github.com/luin/readability)。

至此 purify 的第一块也是最亟需提升的短板被补上，完全集成 readability 之后我立刻找到之前第一版测试效果不佳的博客们进行再次的测试，所有正文都准确的提取出来了。惊喜之后是略带敬畏的思考，这个库是如何做到的呢？也许 8 月底我可以得到一个满意的答案。

## disable CSS 的各种尝试
上面两个版本结束之后，purify 已经可以满足基本的需求了，接下来是亟需解决的「样式」问题。

1. 隐藏原网页内容
2. 原网页设置了很多权重较高的样式如字体字号和颜色，purify 无法重置。

第一点比较简单，我将 purify 的 div 容器放在 body 之后，然后隐藏 body。
```css
body {
  display: none;
}
```
第二点，起初我想要采用的办法是 disable 原网页的 css（包括外部和内容样式）。
```javascript
Array.from(document.querySelectorAll('link[rel=stylesheet]')).forEach(function(i){i.disabled=true})
Array.from(document.querySelectorAll('style')).forEach(function(i){i.disabled=true})
```
问题是难以区分哪些是我的 extension 插入的 style（虽然我使用的 styled-components 所生成的 style 标签上会有 style version 可供 selector），哪些是原网页的。
所以还是得回归到最基础的概念，如何管理 css style 的优先级。我的办法是在 purify 容器里的每个 dom 标签上添加一个新的 class：purify，从而成功的覆盖原有的 css。也许未来我应该再移除原有的 id，name，class 属性，并在每个 purify 的 style value 后面添加 important，这个留待后续再优化吧。
## 总结
解锁了很多以前不了解或者不够重视的知识，如：
* readability（印象笔记的剪藏插件应该也是利用了相关的技术）
* how to disable style/link。值得注意的是，disabled 只是 dom 属性而非 html attribute，这意味着并不能通过像表单元素一样声明disabled
```html
<input disabled .../>
```
* css 权重，这是个复杂的课题，我现在的水平离熟练还有不小的差距。

以及启示：
通过爬虫将文章下载到手机，用最喜欢的app阅读，仍然在各方面吊打阅读器插件。毕竟，手机阅读的各种体验如滑动/点击翻页，从简便和灵敏上，都远胜过 pc 网页上的点击翻页，更何况通过我们还要忍受网页的缓慢加载。所以，接下来我的计划是：
1 完善小说爬虫；
2 通过阅读源码来深入手机 reader 这个领域；

## 资源
* [readability](https://github.com/luin/readability)
* [mozilla readability](https://github.com/mozilla/readability)
* [python-readability](https://github.com/timbertson/python-readability)
* [Disable link tag](https://www.w3schools.com/jsref/prop_link_disabled.asp)
* [How to disable links](https://css-tricks.com/how-to-disable-links/)
* [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
