
---
title: 2022/03/04: golang 不适合 web service 的 x 个理由
tags: 周记
---
## 封面
![tezos-FT1ePvQ1HlE-unsplash](https://user-images.githubusercontent.com/12655367/156737640-907c4d27-bdfd-4fc0-852f-d1a33a4d3a6c.jpg)


Photo by <a href="https://unsplash.com/@tezos?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">[Tezos](https://unsplash.com/@tezos?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)</a>

## 本周主题: golang 不适合 web service 的 x 个理由
作为一个不太经常写 golang 的人，最近写微服务写的快要累死了。这么累倒不是项目有多复杂，当然也绝对不简单。只不过，go 在某些方面的特点非常不契合这个微服务。简单总结这些痛点。

首先也是最重要的，对 json 不友好。go 没有 js 中 object 这个概念，对于 json 数据，必须用具体的数据类型给装起来。比如，有 json 数据 如下：
```json
{
  "name": "Bob",
  "hobbies": ["football"]
}
```
正常情况下就要先定义如下类型：
```go
type Person struct {
  Name string `json:"name"`
  Hobbies []string `json:"hobbies"`
}
```
然后用内置的 json 方法将数据（json string）塞进结构体：
```go
var person Person
err := json.Unmarshal([]byte(jsonString), &person)
```

这是最简单的情况，如果有可变字段，比如 person 含一个 timeline 字段，可以是 undefined (最开始的例子)，或者数组，或者 string ：
```json
{
   "name": "Bob",
  "hobbies": ["football"],
  "timeline": ["2022","2021","others"]
}
```
```json
{
   "name": "Bob",
  "hobbies": ["football"],
  "timeline": "timeline is hidden for privacy"
}
```
go 如何应对这样的情况？通常的做法，就是再定义 Person2, Person3 结构体。
```
type Person2 struct {
  Name string `json:"name"`
  Hobbies []string `json:"hobbies"`
  Timeline []string `json:"timeline"`
}
type Person3 struct {
  Name string `json:"name"`
  Hobbies []string `json:"hobbies"`
  Timeline string `json:"timeline"`
}
```
而这些，对于 nodejs 的微服务来说，根本就不是问题。即便用上 TypeScript，也只需要使用其内置的复合类型。

``` typescript
interface Person {
  name: string
  hobbies: []string
  timeline?: string | []string
}
```
而且，也不需要累赘的 json tags。

第二个痛点在于不支持 undefined，当然你可以说 nil。但是 nil 不支持基本类型。还记得前面的例子吗？

```go
type Person struct {
  Name string `json:"name"`
  Hobbies []string `json:"hobbies"`
  Timeline string `json:"timeline"`
}
```
虽然前端回传的 json 不包含 timeline，但是结构体里的 Timeline 是 string 类型，不可能为 nil，最少也是个空字符串。所以数据塞进去一看，Timeline 居然变成了空字符串。这在某些场合下，是非常严重的错误。比如 pathch API，前端只回传 name，但是 timeline 因为这个机制，被设置成空字符串。接下来更新数据库，原有的 timeline 被覆盖。（这里只是为了距离方便，实际timeline不会是前端回传的，这是个业务问题）。

在go里面想要表达 undefined，常用的做法是将 Timeline 声明为指针类型。比如：
```go
type Person struct {
  Name string `json:"name"`
  Hobbies []string `json:"hobbies"`
  Timeline *string `json:"timeline"`
}
```
这样当 patch  API 没有携带 timeline，结构体的 timeline 就是 nil，等价于 undefined。

第三个问题，是 generic 的缺失。老实说，静态类型又不支持范型，还是挺少见的。按照 go 社区的说法，这样做对执行效率友好。可是开发效率是真的低啊。同样一段逻辑，仅仅因为类型不同，就非常难以复用。即使勉强复用，也会因为类型转换而引发很多及其难以debug 的问题。比如
```go
func DoSomething(arg1 interface{}.) {
   // check type then choose the logic
}
```

假设 DoSomething 预期 arg1 和 arg2 的类型为 number 或者 string。正常情况下当然可以运行良好。但是如果有一个调用者，用 bool 类型的 arg 呢？编译器不能识别这样的错误，因为 bool 的确在 interface{} 的范畴内。

对于这样的情况，常用的办法，是声明这样的结构体。
```go
type ArgType string
const (
   ArgTypeString = "string"
   ArgTypeNumber = "number"
)
type Arg struct {
  Type ArgType
  StringVal string
  NumberVal number
}
```
然后：
```go
func DoSomething(arg1 Arg) {
   // check type then choose the logic
}
```
这样一来，误传 bool 参数的问题得到解决了。可是，更繁琐了。

总结一下 go 的三个缺点吧
1. json 不友好。
2. 不支持 undefined（换个说法可能更准确，但）。
3. 不支持 generic。
这三个缺点导致的结果就是，写某些代码特别啰嗦，而且复用性受限。运行效率兴许很高，但是开发效率感人。

感想就是，web 领域（重 IO 轻计算），开发体验上来说，动态类型还是远胜静态类型。我觉得理想的架构应该兼收并蓄，计算瓶颈部分，多用go，c 这样的静态类型语言，精准快速。io 瓶颈部分，多用动态类型（node，python，ruby），或者开发向友好的静态语言（例如java），提高开发效率。

最后，澄清一下我的观点。我相信一定有很多场合用 go 非常合适，但是处理多变的数据这一项，go 的确非常不适合。选择 go 作为开发语言，要好好的评估一下它的两面性。否则就会起到事倍功半的效果。

## 读书
《冰与火之歌》，前五卷，65%。
印象深刻的杀戮。
血色婚礼，黛西莫尔蒙被艾德蒙佛雷杀害，原文是“开膛破肚”，可怜的黛西。小琼恩安柏被砍掉头颅，文德尔曼德勒被一箭射入口中。凯特琳徒利在目睹罗柏身中数箭而死后，被割喉。
詹姆兰尼斯特被砍掉右手。
奥伯伦亲王被魔山黑血反杀。
## 其他
1. React 官网倡议对乌克兰人道援助。随后 [React issue](https://github.com/facebook/react/issues?q=is%3Aissue+is%3Aclosed) 被大量内容为质疑 React 官方立场的帖子淹没。

---

![github com_facebook_react_issues_q=is%3Aissue+is%3Aclosed(iPhone X) (1)](https://user-images.githubusercontent.com/12655367/156730121-a29b81cf-7deb-4429-92d1-55685baf3fb1.png)

几个有意思的issue：
* [Bug: 该不会明天还要上班写node和react呢吧](https://github.com/facebook/react/issues/23987)
* [Bug: 我李豪今天在此实名骂垃圾React，垃圾玩意儿！](https://github.com/facebook/react/issues/23613)
* [Bug: 今年kpi之一：将react项目重构成vue3项目～](https://github.com/facebook/react/issues/23601)
* [大家快来支持Vue呀](https://github.com/facebook/react/issues/23506)

很多人表示要弃暗投明，从此 React 换 Vue。但也有热心群众揭露， Vue 作者支持了乌克兰：
![156539275-c5775061-630b-4ca3-bc3a-c19145cea2a9](https://user-images.githubusercontent.com/12655367/156731428-d21dc11b-9973-487b-9a6b-4f61e3c696f3.png)

2. 华为宣布为乌克兰提供通讯设备及服务。
3. 黄金涨到了 390 rmb/g。看来`乱世黄金`没说错。
