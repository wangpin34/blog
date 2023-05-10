
---
title: 2019-11-14: 聊聊 Progressive Web Application
tags: 文章
---
如果想要全面深入的了解 PWA（Progressive Web Application 的简称），请移步 [Google 官方文档](https://codelabs.developers.google.com/codelabs/your-first-pwapp/#0)，包含原理，示例代码，刷一遍基本就明白了。这篇文章主要是聊聊个人的理解和感想。

##  Service Worker & Cache
首先要明确的一点是，PWA 的设计为提升 web app 的使用体验，我们都知道相比于 native app，web app 最大的缺点是离线体验很差：这是很委婉的说法，事实上根本没有离线体验。如果没有网络，或者网络很差，web app 根本无法使用。因为 web app 能够启动的基础是成功的从服务器下载资源文件（html/js/css等），没有网络，也就没有了一切。

从解决本质问题的角度出发，无障碍的存储资源文件是必须要做的事情。那么，PWA 是怎么解决这个问题的？分两部分：
1. 独立于页面进程运行的 backgroud process，即 service worker。通过下面这样的命令将源文件注册为 service worker:
```
navigator.serviceWorker.register('/service-worker.js')
```
在这个文件里包含 service worker 的配置，life cycle 及相关的资源管理。
3. 存储空间更大的 cache（相比session/local storage）

**之所以需要 service worker 这样的东西，目的在于将资源管理和 app 的既有功能从空间和时间上都隔离开来，以免互相影响。**

### Life cycle hooks
回顾一下我们在哪些技术中看到过 life cycle hooks（生命周期钩子）这样的术语，你有仔细思考过为什么要这样设计呢？

比如 Reactjs 的 componentDidMount，这个 life cycle 标志组件已经成功的渲染到真实 dom，你可以放心的做一些条件苛刻的操作。这些操作在其他地方执行的话，一定是不太合适的，甚至是有害的。

所以，life cycle hooks 是这样一种东西，系统的设计者需要使用者们，如你我，在系统动态变化的某个特定时间点，进行一些特定的操作。这些操作的具体内容当然是由使用者们来设定，但执行的时机，次数，则交由系统本身规划。

Service Worker 也规定了这样的三个 hook，依次是 install，activate，fetch。
* install
			当 service worker 成功安装后只触发一次。新版本的 service worker 注册成功后也会触发一次。
* activate
			当 service worker 开始接管管理权限后只触发一次。新版本的 service worker 注册成功后，当且仅当所有 tab 关闭并重新启动后触发。
* fetch
			当 install 和 activate 都成功完成之后，service-worker 接管控制权。每当有新的网络请求发生，fetch 触发。
			
前面说过，PWA 关注的问题是如何科学的缓存资源，对于 app 来说，资源无非分为两类：
	 1. 静态资源： html/js/css/图片等等
2. 动态资源： 数据

对于不变的静态资源，我们只需要保证每个版本缓存一次。**而动态资源随时都可能变化**，像对待静态资源一样处理肯定是不对的。我们期望动态资源能够尽量新并且兼顾离线可用，所以对其策略做一些微调：
1. 如果网络条件良好，使用服务器实时数据。
2. 如果网络出错，使用缓存数据，保证可用性。

然后，根据上面的结论，再结合前面 hooks 的运行时机，进一步得到下面的解法：
1. 在 install/activate 中缓存静态资源，因为 install 更早，所以更好的解法是在 install 中执行。
2. 在 fetch 中动态更新数据缓存。
			
### 关于更新
刚才没有细说的 activate 主要在 service worker 的更新中「大显身手」。我们假设当前运行的 service worker 为 S1，新版本为 S2。

当S2注册成功后，对应的 install 触发，在这里我们缓存 S2 相关的静态资源。此时 S1 仍然统治着一切，直到用户关闭所有运行此 app 的tab/窗口，然后重新启动 app。此时，S2 的 activate 触发。在这里，我们要完成更新迭代的所有工作：
1. 清除旧版静态资源，一般规则是如果 cache name 和当前的不一致，就删除。
2. 注意保护动态资源。

这里为什么要提一下「保护动态资源」，因为 S1 到 S2 的换代理论上只代表静态资源更替。动态资源依然有效。

## Installable
web app 另外一个缺点是入口太深，通常，你需要找到浏览器，输入地址，回车，然后等待启动。PWA 为 web app 提供了基本的可安装功能，用户可以选择安装，然后像使用 native app 一样操作 web app。而且一旦  app 新版上线，用户也无需在应用商店做任何操作，任何时候你打开 app，新版本就已经在面前。 真正做到了一次安装永远保持最新。

# 感想
以上我们总结了 PWA 提供的两个核心功能：

1. cache
2. installable

这两个功能完全解决了 web app 相较于 native app 的劣势：
1. 启动慢
2. 无法离线使用
3. 入口太深

同时，又继续保留着 web app 固有的优势：
1. 无需下载/安装
2. 无缝更新

目前唯一需要担心的兼容性。chrome 自不用说，firefox，opera，edge，甚至之前比较消极的 safari，都已经开始支持，或者已经将支持 PWA 列入计划。看起来，我们很快就能在主要浏览器中体验 PWA 了。对于前端工程师和用户来说，这都是个好消息。
