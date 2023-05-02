
---
title: 学习createjs
tags: 周记
---
Createjs 是一个js图形库，提供简便的api用于创建图像。下面是学习的过程中整理下来的笔记。

[TOC]
# 安装
- 使用cdn资源

```
<script src="https://code.createjs.com/createjs-2015.11.26.min.js"></script>
```
- 从github上下载源码。
  create.js 共分为四个模块，相应的源码也分布在对应的repo中，可以分别下载。方便起见，建议使用上面提到的cdn。
# EASEL
## 入门

**easel**  的意思是黑板，画板。显而易见，它会提供绘制图像相关的功能。下面是一个简单的例子。

```
<canvas id="myCanvas"></canvas>

<script>
var stage = new createjs.Stage('myCanvas');//在canvas上创建一个显示容器，stage的含义是舞台
var circle = new createjs.Shape();//创建一个图形对象
circle.graphics.beginFill('red').drawCircle(0, 0, 40);//设置图形的颜色，形状
stage.addChild(circle);//将图形添加到容器的显示列表中
stage.update();//重新渲染。stage 不会主动渲染，所以必须在完成显示列表的更新后手动调用此方法
</script>
```

**stage** 可以理解为一个舞台，这个舞台上有很多演员（若干图形）。可以随时加入新演员，老演员也可以随时退出，不管加入还是退出，必须自己通知舞台的管理者--落幕（更新）。

从**stage** 的创建方式（基于一个已存在的 **canvas**）可以推断出，图像的展示是借用 **canvas** ，**easel**　提供了一些基本的抽象，比如 **shape**, **graphics**,  **drawCircle**，等等。

下面是几个重要的概念，了解一下，便于理解之后的内容：
- displayObject 可显示对象，比如上面的**shape**。
- displayList 显示列表，每个 **stage** 中都会包含一个 **displayList**， 它又包含很多 **displayObject**。从这里可以感觉到 **stage**的 “野心” 了，它会包含很多可显示的东西，比如图片，文字，视频，然后提供简单的方法，用于在这些东西中切换，显示某个或者某些对象。
## Ticker

**Ticker** 字面意思是时钟，它提供简单的类似setInterval，heart beat的功能。下面是简单的例子。

```
 createjs.Ticker.addEventListener("tick", handleTick);
 function handleTick(event) {
     // Actions carried out each tick (aka frame)
     if (!event.paused) {
         // Actions carried out when the Ticker is not paused.
     }
 }
```
## Stage

前面说过，**stage** 是 **displayObject** 的舞台。所以，它提供了一些方法，用于更新**displayList**，重新渲染，等等。
下面是一些常用方法。[官网文档](http://createjs.com/docs/easeljs/classes/Stage.html)
- addChild
- removeChild
- getChildAt
- getChildByName
- update
  update方法非常重要，当需要渲染 displayList 到 canvas 时，必须手动的调用。
- cache
## Shape

**Shape** 是绘制图形的基础对象。它有一个重要的属性 **graphics** -   图形对象，提供了诸如 **fill**, **drawCircle**，**drawRect** 等常用的图形绘制方法。

创建 shape 有两种办法:

```
//传递一个 graphics 对象到 shape 构造器
var graphics = new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 100);
var shape = new createjs.Shape(graphics);

//先创建 shape，在初始化对应的 graphics
var shape = new createjs.Shape();
shape.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);
```
## Bitmap

**Bitmap 是一种 displayObject** ，号称可以涵盖图像，视频，画布，暂时不明白视频和画布怎么搞？stage 不就是从把图像显示在画布上？ 

创建一个 Bitmap

``` javascript
var bitmap = new createjs.Bitmap("imagePath.jpg");
```

展示

``` javascript
stage.addChild(bitmap);
stage.update(); // 手动调用 update
```
## Filter

**filter** 就是常讲的滤镜。

