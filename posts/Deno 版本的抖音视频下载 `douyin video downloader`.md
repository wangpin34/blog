
---
title: Deno 版本的抖音视频下载 `douyin video downloader`
tags: deno
---
# 楔子
项目空档期，找了些 idea 来练手。[douyin video downloader](https://github.com/pengson-wang/douyin-video-downloader) 是其中之一。刚开始的时候，只是写了些简单的代码，最多用用 arrow function 和 async await。后来，逻辑复杂度上来，需要封装些 class。再后来，downloader 部分需要比较复杂的数据结构，感觉不用 TS 实在没什么自信，于是上了 TS。由于是 idea 项目，也没有 publish 为 pkg 的打算（暂时），于是只用到了 ts-node 来执行 typescript。

但是，这依然不够完美，遇到了一些问题：
1. node-fetch v3 版本以后，都是 esmodule 发布，而 ts-node 执行时是将代码 parse 成 es5（我当时在 tsconfig.json 中compileroptions.target 设置为 es5），那么，所有的 import 都变成了 require。require esmodule 是不可以的。

我的做法是将 node-fetch 退回到 v2 版本，也许会引入 bug。没有深入研究。
2. 尝试 babel-cli 编译 ts 代码，babel 会将 puppeteer  的 page.evaluate(fn) 里的 fn 也纳入 编译， fn 变成了 fn + call helper 这种形式，比如 async 就会成为 call helper（babel 引入的 helper 或者说 polyfill）。而本质上来说，fn 只是作为 string 传递给 page，那 page 的 context 不可以访问那些 helper，就会报  reference undefined 异常。解决的办法是，将 fn 用 `` 包起来，也就是作为 string 传递给 page.evaluate。

我不喜欢这种做法，因为这会妨碍编写强大的代码。

所以最终我的决定是，这个项目不需要编译，唯一的用法就是 ts-node，也就是直接运行 ts。

等等，直接 ts，那不如试试 deno ?

于是有了这个项目：https://github.com/pengson-wang/douyin-video-downloader

# 初见
用 deno 的好处是，你会自然而然的觉得，没有义务去编译什么东西，import 的是 ts， 运行的是 ts，舒服。
而且，deno 内置的 module 也基本满足需要，比如 fs，path，甚至还有 node 迟迟没有加入的 fetch（每次用 node-fetch 都让人欲仙欲死）。
如果想用 nodejs 的 API，deno 也提供了一些实现。
其实 deno 还是有些诚意的，不是吗？
# 黑暗面
照例，说完了好处，得说说问题了。
内置 module 的质量不高，就拿 Deno.copy(reader, writer) 和 Response.getReader 举例，这两个 reader 的类型竟然是不同的。这就让非得写 ts 的我很尴尬了，最后被迫启用了  ts-ignore 大法。
三方 lib 还不如 npm 的好用，就拿 puppeteer 为例，npm 的，types 都有了，文档也够新（deno 的文档应该有问题，按照 sample 实现的跑不通，调整了几下才可以）。而 deno 的版本就要差一些了，文档不匹配，types 不提供（害的我花了好久去写 types）。
虽然说以上问题都是 ts 方面的，但是在 2022 年，还有人不用 ts 吗？生命苦短，我用 ts。
# 总结
坏话说了一堆，那么，deno 好不好呢。我记得曾经评价过 deno，当时的判断是 no，不过按照这次的感受来说，想说 yes 的冲动大了一点。我觉得这倒不一定是 deno 进步了，没有紧密的跟踪过它的发展，不敢下定论。但是我的心境与之前比是截然不同的，这几年，接触了太多太多 js 之外的东西，再去看待 deno，秉持的价值观就不同了。不过，现在的水平来说，我还发不了不了什么高论。不过可以确定的是，接下来会用 deno 做些有意思的小东西，想想还挺兴奋的。

