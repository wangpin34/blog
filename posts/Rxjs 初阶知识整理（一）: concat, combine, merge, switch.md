
---
title: Rxjs 初阶知识整理（一）: concat, combine, merge, switch
tags: 文章
---
# 封面图

![bench-accounting-49027-unsplash](https://user-images.githubusercontent.com/12655367/106919499-2a005000-6745-11eb-8880-4f5ae045e23f.jpg)
图片来自于 Unsplash

# 四个常用 operator：concat，combine，merge 和 switch

Rxjs 包含很多名字相似的 `operator`，如 `concat` 和 `concatAll`。前者在官方文档里被归入 index，后者被归入 operator。我觉得他们的功能其实有联系性，所以放在一起讨论，暂且将他们都称为 operator。

concat 和 concatAll 的共同点在于`如何处理输入，生出输出`：它们都会将输入排队，第一个 observable 的输出先对接到输出 observable上，第一个complete，换第二个，依次类推。让我们把这个过程定义为 `核心`，因为接下来会有用到。

他们的区别如下：
concat 用于从若干个 observable 创建出一个新的 observable；
concatAll 用于从 high order observable（observable-of-observable）创建出一个新的 observable。

一个例子：
```javascript
concat(of(1,2,3), of(4,5,6))
of(1,2,3).pipe(map(val => of(val * 10)), concatAll())
```

简单来说 concat 处理 observables （注意这里的 `s`），concatAll 处理 `observable-of-observable`。

# and Map
你可能会发现还有一个名字里带 concat 的 operator，`concatMap`。它是做什么的呢？首先，你可能猜对了，concatMap 同前面两个 concat 和 concatAll 和核心是相同的：`如何处理输入，生出输出`。

concatMap 的特别之处在于。我们回到上面提到的代码：

```javascript
of(1,2,3).pipe(map(val => of(val * 10)), concatAll())
```
在 concatAll 之前，我们使用了 map，将 Number 转化为 observable<Number>，以便 concatAll 处理。如果使用 concatMap，这一步就可以省略，变成这样：
```javascript
of(1,2,3).pipe(concatMap(val => of(val * 10)))
```

# Let‘s go
上面介绍了 concat， concatAll 和 concatMap，关于应用场景介绍很少，主要介绍联系和区别。下面将我们得到的结果概括一下。

concat, concatAll 和 concatMap 共享一个`核心`（如何处理输入，生出输出）。区别在于：
* concat 处理 observables
* concatAll 处理 observable-of-observable
* concatMap 等于 map + concatAll，即使用 map 函数生成 observable-of-observable，然后处理

Rxjs 里面有很多前缀相同的 operator，也遵循 concat 家族的传统，所以上面的结论可以稍微抽象一下：

定义 operator 名为 op，那么，op，opAll，opMap 共享一个`核心`（如何处理输入，生出输出）。区别在于：
* op 处理 observables
* opAll 处理 observable-of-observable
* opMap 等于 map + opAll，即使用 map 函数生成 observable-of-observable，然后处理。

符合上述结论的有 `combineLatest`，`merge`，`switch`。其中，combineLatest 的情况比较特殊，它没有 map，而且 all 的全名叫做 combineAll，而不是 combineLatestAll。

# 思考
Rxjs operator 数量很多，本文只谈到其中 4 种，以及与其相关的 all, map（当然还有mapTo，不过mapTo和map联系非常紧密，不需要特别指出）。可以看到，通过名称之间的联系可以迅速的找到强相关的 operator。而建立系统或者脉络对于学习是很有帮助的。由此也可管中窥豹，一见 Rxjs 开发团队的专业和以人为本。值得尊敬和学习。

最后，列举下用本文的办法找到的相关性 operator，表格归类。

|Main|all|map|mapTo|
|---|---|---|---|
|concat|concatAll|concatMap|concatMapTo|
|combineLatest|combineAll|||
|merge|mergeAll|mergeMap|mergeMapTo|
|switch|switchAll|switchMap|switchMapTo|







