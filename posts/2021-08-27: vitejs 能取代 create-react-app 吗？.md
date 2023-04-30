
---
title: 2021/08/27: vitejs 能取代 create-react-app 吗？
tags: 周记,文章,读书,健身,App,编程,ipfs
---
## 封面
![dan-dennis-HWN1xeXOziM-unsplash](https://user-images.githubusercontent.com/12655367/131099320-d3f845ea-af41-4472-ad1d-e6ca7d8c26ac.jpg)

Photo by <a href="https://unsplash.com/@cameramandan83?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Dan Dennis</a> on <a href="https://unsplash.com/t/back-to-school?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
## 本周主题: vitejs 能取代 create-react-app 吗？
这段时间在折腾 `vitejs`，目标是代替公司项目中的  `create-react-app`。综合我的使用体验和社区的评价，我的结论是：vitejs 速度自然是 create-react-app 拍马难及，但是现阶段，后者依然是最稳妥的选择。

> 关于 vitejs 为什么更快，看这个可以管中窥豹: [the problems](https://vitejs.dev/guide/why.html#the-problems)

为什么呢？

举一个简单的例子。我的项目依赖的一个 package 使用了 NodeJS 的 global 对象，vitejs 本身不支持这种做法，社区里也没有行得通的方案。按照作者 evan 的说法，用户应该主动迁移到其他适配 vitejs 的package，放弃老 package，这听起来是个非常「潇洒」的方案。但反对者也很多。

<img width="830" alt="Screen Shot 2021-08-27 at 3 25 31 PM" src="https://user-images.githubusercontent.com/12655367/131089340-6f769155-93f5-4315-aabf-56e97f214719.png">
<img width="831" alt="Screen Shot 2021-08-27 at 3 26 51 PM" src="https://user-images.githubusercontent.com/12655367/131089464-d59ee8d4-0d23-4b41-ad89-39a869b09ec7.png">

> 详情见[
vite does not seem to support es module that depends on nodejs builtins
](https://github.com/vitejs/vite/issues/728)

evan 似乎认为应该淘汰那些 outdated 的 package，但是忽视了「淘汰」的过程其实是很漫长的。在这漫长的时间里，如果 vitejs 不能做出积极的动作对所谓的 outdated 生态保持开放和友好，那我倒是有点担心 vitejs 的前景了。

其实利用新技术提高效率是很好的事情，但是如果完全不考虑原有生态的实际情况，就会造成相反的后果。还记得在之前的文章中讲过[2021/08/13: Deno 好不好用 ？](https://github.com/wangpin34/blog/issues/72)？如果 Deno 对 NPM 生态做好兼容，现在的局面绝对大不一样。可惜历史没有如果。

回过头来聊聊 create-react-app。create-react-app 底层使用 webpack，webpack 提供了相当完备的兼容性（准确的说是通过插件提供了兼容性）。比如，一个 package 内部使用了 nodejs 的 global 对象，如果不做兼容，浏览器环境是无法直接使用这个 package 的。这种兼容在不同的语境下可以叫做 shim 或者 ploymer。通过这些 shim 或者 ploymer，webpack 做到了对几乎所有环境的支持。速度虽然不够快，但是胜在全面。只要 vitejs 在全面这一项上没有接近或者超过 webpack，后者的地位就是不可撼动的。

我们可以憧憬 vitejs 更完善，或者为 vitejs 更完善这一伟大目标贡献力量，不管是完善文档， 还是开发 plugin（vitejs 的 roadmap 上很多未完成的plugin，比如上面提到的 rollup-plugin-node-globals）。我很认同 evan 的一句话，「如果觉得不好，就贡献力量让她更好，而不只是抱怨」。

## 读书
* 《哈利波特与火焰杯》100%
* 《哈利波特与凤凰社》10%
*  《象与骑象人》10%

《象与骑象人》让我想起了《思考，快与慢》。他们都认为人脑里有两个思维系统在运转，一个速度快耗损低，一个速度慢耗损高。前者是生而有之的，比如对食物和异性的亲近感（食色性也）。后者是后天习得，比如克制，比如逻辑性。前者在《象与骑象人》里被描述为大象，后者被描述为骑大象的人。通过大象也骑象人的比喻可以引申出很多东西，比如，大象力量强大，我们的生而有之的思维方式也非常强大，我们看到食物会开心，看到异性会开心，而且这种开心是不假思索的。骑象人的力量相比大象而言不值一提，但是骑象人掌控着缰绳。我们后天习得的能力从力量上讲非常弱小，我们无法**轻松**抵御美食的诱惑，异性的诱惑。我们会因为过度使用后天能力而疲惫，但我们可以毫无负担的享受过量的美食，美色，不知疲倦。

由上面的推论可以引申出更多的东西。比如，我们知道意志力是宝贵的，就不会轻易的浪费它。当我们意识到自己无法挣脱沉迷手机的状态时，更好的做法是与手机保持距离，或者删除手机上诱惑自己的东西，而不是奢求用宝贵的意志力来对抗原始而强大的欲望动力。
## 健身
`体重 - 0.0 kg`
## App
`N/A`
## 编程
* vitejs
* [ipfs](https://vinta.ws/code/ipfs-the-very-slow-distributed-permanent-web.html)
* `?.` , `??`

[?? 的规则]((https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator))：如果左边值为 `null` 或者 `undefined`，返回右边值。
```javascript
null ?? variable === variable
undefined ?? variable === variable
``` 

感觉和 || 有点像，但是有区别，[|| 的规则是](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR)：如果左边值可被转换为 `false`，则返回右边值。可以理解为先对左边值求布尔值，`Boolean(left)`。除了 `null` 和 `undefined`，`0` 和 `“”` 也会被转化为 `false`。所以
```javascript
null || variable === variable
undefined || variable === variable
0 || variable === variable
“” || variable === variable
```

`?.` 和 `TypeScript` 的 `!.` 有些像。[`?.` 的作用](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)是安全的访问对象属性。假设有一个对象 `person`，结构如下：
```
const person = {
  name: 'Bob',
  hometown: {
    name: 'shaanxi'
  }
}
```
我们知道 `hometown` 允许为空，表示用户没有提供。那么，下面的写法就是有风险的：
```javascript
person.hometown.name
```
你可能会熟悉这种繁琐的写法：
```javascript
person.hometown && person.hometown.name
```
这种写法可以被安全的替代为：
```
person.hometown?.name
```
如果 `hometown` 为空，表达式返回 `undefined`。

`TypeScript` 的 [`!.` 目的](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator)是告诉编译器，「运行时这个属性觉得不会空，您放心」。编译器就会认为这里是安全的，可以继续向下编译。但是如果程序员的判断错了，运行时为空，那还是会发生错误。简而言之，`!.` 只是编译时擦除错误。

```typescript
person.hometown!.name
```

总结一下，如果使用了 TypeScript，在访问对象内部属性时，如果不确定属性是否为空，推荐 `?.`，如果笃定属性不为空，推荐 `!.`。


