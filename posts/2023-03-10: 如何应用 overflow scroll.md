
---
title: 2023/03/10: 如何应用 overflow scroll
tags: web,css
---
overflow scroll 生效需要以下三个条件，缺一不可。
1.  两层 div（或者其他容器 tag）, 外层为 container，内层为 scroll view
2.  container 尺寸小于 scroll view（下面会将具体怎么实现）
3. container 设置 overflow scroll
```css
overflow: scroll
```
# 两个 div 的作用
可以将 container 认为是窗口，scroll view 是窗帘，拉动窗帘，窗帘相对窗口移动。蹩脚的比喻，对吗？不过对我来说足够了。
# 如何设置 container 尺寸小于 scroll view
通常的做法，给 container 固定的小尺寸。如：
```css
.container {
  width: 200px;
  height: 300px;
  overflow: scroll;
}

.scroll-view {
}
```
https://codepen.io/wangpin/pen/JjaOgRV
这可以保证大多数时候滚动条都会正常出现。在企业级管理后台中，内容区块通常占据独立的固定尺寸，这种方法比较可行。当然，也可以通过 grid，flex 等布局为 container 设置规定尺寸。不管使用什么手段，记住目标是 container 尺寸不随着 scroll view 尺寸伸缩。

# 当滚动条没有出现
尝试检查下面几项
1. container 尺寸是否小于 scroll view。可能设置了错误的响应式代码，container 的尺寸跟随 scroll view 的大小而伸缩。
2. overflow 是否设置在 container 上。常见的错误是设置在了 scroll view 上面


