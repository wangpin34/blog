
---
title: white-space, word-break 和 overflow-wrap，这三兄弟到底谁厉害？
tags: 文章
---
# 封面

![adam-jang-8pOTAtyd_Mc-unsplash](https://user-images.githubusercontent.com/12655367/110092746-e563e500-7dd4-11eb-84ac-d75d70d44bbb.jpg)


# 正文

处理文字排版中经常需要考虑的一个问题是换行，有三个 css rule 跟这个问题有关，依次是 [white-space](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space),  [word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break) 和 [overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap)。我时常寻思，这三个到底哪个最厉害，一个就能搞定所有问题。

> 本文只涵盖三者在定义上的区别，希望能根据定义来指导使用。因为过去习惯于复制黏贴或者各种乱试，虽然总能捣鼓出能用的 css，却总觉得根基不实，不知其所以然。井下下来想想，还是得从原始定义入手，然后在实战中印证理论，解释现象。

> 我个人的习惯是看 MDN，比较权威比较耐看。

## white-space

`white-space` 定义如何处理 `space`（空格和换行符），以及是否允许换行。
normal(default)：相邻space会合并。换行符无效，按需换行。
* `nowrap`：同 normal，但是不换行。
* `pre`：保留space。效果类似于 pre 元素。
* `pre-wrap`: 同 pre，同时按需换行。
* `pre-line`：同 pre-wrap，但是相邻space会合并。

> 按需换行，指的是避免文本溢出容器，所以换行。

## word-break

word-break 定义当文本溢出时否允许 break word - 切开文字，将较长的文字切分成若干段，分行显示。

> 中文，日文，韩文，三者合并简称为 `CJK`。

* `normal`(default): 使用默认的折叠规则，即 CJK 随意切（CJK不存在英文单词这种单位，可以任意换行），非 CJK 在空格，换行符，连字符（-）切
* `break-all`: 在任意位置切（除了中文，日文，韩文），显示效果最不好，因为所有的单词都会被切开，只为了视觉上两端对齐。
* `keep-all`：不切 CJK，即 CJK 在一行显示。非 CJK 规则同 normal，即在空格，换行符，连字符（-）切
* `break-word`（已废弃）：相当于 normal，只有过长的单词会被切。未废弃前效果最好。

## overflow-wrap

最有用的 break-word 被废弃，没关系，还有 `overflow-wrap`。overflow-wrap 的前身是 `word-wrap`，由 Microsoft 首先实现，后来被很多浏览器引进。现在作为标准，改名为 overflow-wrap。text-wrap 作为别名还将继续存在一段时间。
* `normal`（default）：在 space 处换行
* `anywhere`：在任意位置换行
* `break-word`：通过anywhere，区别是：
> The only difference in the documentation between the two is that overflow-wrap: anywhere DOES "consider soft wrap opportunities introduced by the word break" when it is "calculating min-content intrinsic sizes", while overflow-wrap: break-word does NOT.

没看懂，但是看起来 anywhere 更好，因为它考虑了 size 因素，size 在大多数情况下都是很重要的。再要深挖估计要看 spec，这是我不愿的。嘿嘿。

# 总结

>最后总结一下，white-space 定义如何处理 space，你是想保留文本里面的各种空格，换行符，某些场合对原始的文本结构很看重，比如 code sample，比如作家的文章（万一人家的多个空格有非凡的意义呢）。

>word-break 和 overflow-wrap 的关系比较紧密，overflow-wrap 负责在哪换行，是在 space 处呢，还是只要迫不得已，就到处可以换行（其实实际上只有那种很长的超链接才需要这样处理，大可以只对 a 标签做对应设置）。word-break 定义换行的时候怎么处理具体的 word，而且将 word 分为 CJK 和非 CJK。

这样看起来，好像 overflow-wrap 和 white-space 的功能有重叠，毕竟white-space 可以设置 nowrap 阻止换行。回顾前面的总结，overflow-wrap 规定在哪里换行（插入换行符），也就是说，到底换不换，不归它管。如果 white-space 不允许，那就谁也换不了。是这样吗？

实验结果证明了，确实是这样的。所以 white-space 可以做为禁止换行的总司令，一声令下，都不需要换行。

*** 所以，white-space 是最厉害的，其次是 overflow-wrap，毕竟人家管理在哪换行，word-break 最一般，只能做做 break word 这样的小事情。***

> white-space > overflow-wrap > word-break

最后：一个场景，比如作家的文章，原始格式很重要，那么，white-space：pre-wrap，就比较合适，尽量还原原始格式，同时兼顾“不溢出”这个基本需要。overflow-wrap：anywhere，word-break 不需要额外设置。







