
---
title: em 和 rem
tags: 
---
css 中的长度单位可以分为三类：
* 绝对单位，如 px，pt，等
* 分辨率相关，如 dpi
* 相对单位，em， rem，等

本篇介绍常用的，也是比较容易混淆的两个相对单位， em 和 rem。

## em
1em 代表的长度等于当前元素的 font-size。定义 p 的 font-size 为 24px，则 1em 表示 24px。

em 可以用于很多布局场合，比如，由 font-size 推导 margin 大小。
```css
p {
font-size: 24px; 
margin: 1em;
}
```
上面代码的物理效果是将 margin 设置为 24px，而且，margin 与 font-size 产生强关联。任何时候改变 font-size 值，margin 也会随之改变。在响应式布局中，经常需要调整 font-size，内外边距，高度，行高，等等长度单位。如果将这些属性值都替换为对应的 em，那就意味着如果比例关系不变（大多数情况如此），只需要在特定的 media query 里改变 font-size 就可以了。

## rem
rem 和 em 的意义接近，所不同的是，它的数值所参考的对象是文档的根元素，即 html 标签。

大多数浏览器默认 font-size 为 16px，为了便于计算，可以设置 html 的字体大小为 font-size: 62.5%，即 10px。那么， font-size 16px 即为 1.6rem， 依次类推。

> 直接将 html 的字体大小设定为 10px 的问题是，假如用户修改了设备或者浏览器的默认字体大小，页面也不会产生响应。

rem 的常见使用场景是在移动端设定版面的大小与viewport宽度或者高度正相关。比如，设计稿的宽度为 375 px，稿子上的 banner 宽度为 37.5px，那么，banner 的相对于viewport的宽度比例就是 37.5/375，即 10%。实际编写 css 时不可能就每一个数值都做心算求出对应的比例，使用 rem 可以省去这个过程。比如，将 1个 rem 设定为 viewport 宽度的 375分之一。

```css
html {
  font-size: calc(1/375 * 100vw);
}
```
则 1rem的长度为viewport宽度的 375 分之一，1/375*100 vw。将 banner 的宽度定义为 37.5rem，就得到了 37.5 * （1/375 * 100），计算结果同样是 10vw，即 10% viewport 宽度。这样一来，编写 css 的时候只需要将设计稿中标注的 px 替换为 rem，非常直观。

# 绝对长度和相对长度的适用场合
绝对长度适用于常规的内容元素，比如字号，图标。在不同尺寸的屏幕上，我们希望这些内容的物理尺寸保持一致（得益于设备的逻辑像素，我们并不需要对不同像素密度的屏幕做对应的适配）。

相对长度分两类，em 用于跟踪字号，来调整内外边距，行高，段间距。rem 用于跟踪逻辑像素变化，当我们希望版面布局在不同屏幕下的显示逻辑（排列组合方式）一致，比如，每行显示固定的四个盒子，则应当使用rem固定盒子大小。

# 学习资料
* https://www.w3.org/Style/Examples/007/units.en.html
* https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Values_and_units
* https://medium.com/code-better/css-units-for-font-size-px-em-rem-79f7e592bb97
* https://zellwk.com/blog/media-query-units/
* https://zellwk.com/blog/rem-vs-em/
* https://j.eremy.net/confused-about-rem-and-em/
