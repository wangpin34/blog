
---
title: Rxjs 初阶知识整理（二）: combineAll 的特别之处
tags: 文章
---
# 封面
![](https://user-images.githubusercontent.com/12655367/106919499-2a005000-6745-11eb-8880-4f5ae045e23f.jpg)

在前一篇 [Rxjs 初阶知识整理（一）: concat, combine, merge, switch](https://github.com/wangpin34/blog/issues/56) 介绍了四种 operator 在其之上衍生出来的高阶 all 和 map 类型的 operator。总结如下：

|Main|all|map|mapTo|
|---|---|---|---|
|concat|concatAll|concatMap|concatMapTo|
|combineLatest|combineAll|||
|merge|mergeAll|mergeMap|mergeMapTo|
|switch|switchAll|switchMap|switchMapTo|

除了 combineLatest，其他三组队形保持的还不错。那为什么 combineLatest 如此特立独行呢？

> Rxjs 官方对 observable 对订阅者发送 value 这个动作用 emit 表示，意思是发射。虽然听起来别扭，但先用着。

# 从 combineLatest 的命名开始
很明显，combineLatest 是由 combine + lastest 两个部分组成的。combine 部分的作用是 combine 输入的 observable 的 value。假设有两个 observable m 和 n，数据变化如下
```
m:  1 -> 2 -> 3
n:  ''a' -> 'b' -> 'c'
```
那么通过 combine 之后得到的结果依次为（假设 m 和 n 总在同一时刻发射新的 value）
```
(1, 'a') -> (2, 'b') -> (3, 'c')
```
上面的假设是一种理想情况，即作为源的 m 和 n 总在同事更新。实际情况肯定会出现有先有后，考虑到 js 其实是单线程的，可以认定是必然的。这种情况下，combine 应该如何运作呢？ Rxjs 给出的答案是，combine 应该输出 m 和 n 最后一次发射的 value。比如，当前 n 发射出新的 value 为 'b'， 那就用这个 'b' 和 m 最后一次发射的 value 1 组成结果 : （1, 'b'）。这其实就是 `Latest`。

所以 Rxjs 中没有 combine 取而代之的是 combineLatest，因为对于 combine 这个目的来说， Latest 是必然的，是刚需。

> When any observable emits a value, emit the last emitted value from each.

# combineAll 的特别之处
combineAll 处理的不再是一维空间的若干个 observable，而是 observable-of-observable。如：
```javascript
// emit every 1s, take 2
const source$ = interval(1000).pipe(take(2));
// map each emitted value from source to interval observable that takes 5 values
const example$ = source$.pipe(
  map(val =>
    interval(1000).pipe(
      map(i => `Result (${val}): ${i}`),
      take(5)
    )
  )
);

example$
  .pipe(combineAll())
  /*
  output:
  ["Result (0): 0", "Result (1): 0"]
  ["Result (0): 1", "Result (1): 0"]
  ["Result (0): 1", "Result (1): 1"]
  ["Result (0): 2", "Result (1): 1"]
  ["Result (0): 2", "Result (1): 2"]
  ["Result (0): 3", "Result (1): 2"]
  ["Result (0): 3", "Result (1): 3"]
  ["Result (0): 4", "Result (1): 3"]
  ["Result (0): 4", "Result (1): 4"]
*/
  .subscribe(console.log);
```
随着 source$ 持续的发射新值，example$ 会不停地创建 observable，直到 source$ 完成。此时，observable的数量稳定。combine 开始工作。

这个过程跟 concat 区别很大， concat 一点也不在乎 source$ (source observable）的完成与否，只要 example$ 创建好第一个 observable，concat 马上开始工作，等到第一个结束，就等待第二个，依次类推。

而 combine 必须等 source observable 完成，因为只有完成了，才不会再创建 observable，此时对这些 obseverable 进行 combine， 才能拿到全体 value。combine 的开始依赖于一个已经稳定的 observable 集合。

所以 combineAll 的特别之处在于，它的启动时间完全取决于 source observable 什么时候完成，如果 source observable 的完成很慢甚至根本没有具体的完成时间，那么，你会看到使用 combineAll 的地方好像死掉了。

# 总结
combineLatest：当任何一个 observable 发射新值，将所有 observable 的最新值汇总发射出去。
combineAll：当 source observable 完成时，对生成的 observable  启用 combineLatest。

> have fun with Rxjs




