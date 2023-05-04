
---
title: 2021/07/02: rvm, gem, brew 都是干什么用的
tags: 
---
## 封面图
![timothy-dykes-Lq1rOaigDoY-unsplash](https://user-images.githubusercontent.com/12655367/124245894-02c27900-db53-11eb-8ae8-f3f67e9c3764.jpg)

Photo by <a href="https://unsplash.com/@timothycdykes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Timothy Dykes</a> on <a href="https://unsplash.com/s/photos/brew?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

## 本周话题：rvm, gem, brew 都是干什么用的
学习 swift 开发，自然免不了接触软件包管理。在 Swift 和 Objective-C 的世界里，这个管理工具叫做 [CocoaPods](https://cocoapods.org/)。

```bash
gem install cocoapods
```

很不幸，当我安装 CocoaPods 的时候，遇到了一些错误。

从网络上寻找解决办法，答案五花八门。试了半天，却毫无进展。无奈之余，正好刚刚搜索答案时看到三个高频名词，rvm，gem，brew，不如先搞清楚它们是做什么的，也许会有新发现。

以下是当时总结的：
* [rvm](https://rvm.io/)：ruby 版本管理工具，可以设置当前版本/安装/卸载
* [gem](https://rubygems.org/): 全称 RubyGems，是 ruby 的软件包管理工具
* [brew](https://brew.sh/): 全称 Homebrew，macos 的软件包管理工具

搞清楚了上面这些，再看 CocoaPods 的安装错误。首先，它是一个 ruby 的软件包，它对 ruby 的版本有要求，这个要求，mac 预装的 ruby 可能无法满足。

什么都不动，重新尝试安装，果然，在密密麻麻的错误信息中，找到关于版本有冲突的 `警告`。虽然只是警告，但是直觉告诉我，这个警告必须优先解决。

麻溜的安装 rvm，再用 rvm 安装警告信息中提到的 ruby 的 “期望版本”，并将此版本设定为默认版本。

重装 CocoaPods，因为它既是 ruby 的软件包，又是 brew 的软件包，所以 gem 或者 brew 都可以。很快，屏幕上出现了安装成功的字样。马不停蹄的尝试 `pod install`，安装成功。

回顾一下，走上正确的解决方向，始于对基础概念，也就是三个高频名词的学习。如果不知道 gem 是用来安装 ruby 软件包的，我就无法知道 CocoaPods 是一个 ruby 软件包；不知道 CocoaPods 是一个 ruby 软件包，就不可能猜测 ruby 版本的问题；而不知道 rvm，即便了解 ruby 版本有问题，也无法找到最完美的办法解决冲突，因为系统预装的 ruby 不能随便更新。只有 rvm 这样的工具才能完美的解决这一切。

所以在尝试多个方案之后，最好的办法不是喝一杯水，继续尝试，而是，尝试把这些方案里提及最多的知识掌握好，然后结合自己的实际现象，再大胆假设，小心求证。这种方法，类似于体育运动里的专项训练，针对自己不懂的领域做定向强化。

在这个过程中，一定会浪费时间的，就比如上面提到的 brew，完全没有用到嘛。但这不代表方法本身有问题。而是，我们在选择方向的时候运气有多差。这样看来，我的运气其实还不差，选了三个，两个都用上了。

## 零碎学习 swift
本周还是花了些时间学习 swift，我觉得如果有余暇，学习一门新语言有很大的好处。
* 可以感受不同的语言特点，比如 swift 里计算属性，lazy 属性，属性观察器，wrapper，思考这样设计的好处，如果迁移到工作语言里，会是一件好事吗？如果是，如何做呢？
* 增加横向能力。比如，学会了 shell script 和 makefile，就不太会纠结构建问题；学会 python，就不太会纠结定时任务的扩展能力；学会了 typescript，就不太会依赖软件文档来描述接口。学会 swift 会赋予我什么能力，我还不知道，但是很期待。

那如何高效的学习一门新语言呢？

* 首先，在语言选择上，选择符合自己偏好的，尊重自己的口味和习惯。
* 其次，在具体学习上，抓主要矛盾，一般就是，变量常量，控制结构，基础类型，这就差不多了，可以开始写 hello world。
* 第二步比较熟练后，可以尝试下编写结构简单的应用，比如 todo，比如 user profile，而且避免涉及 I/O。

具体实践的时候，会反复的查阅文档，学习之前滤过的高级内容，比如错误处理，函数和类。等到第一个完整的 app 完成，这些基础内容也就掌握的差不多了。这个时候，就可以开始攻克几个常见的高难度场景：

* FileSystem
* Network
* Database

说了这么多，那，经过这几周的学习，我自己的成果呢？
1. 掌握了计算属性，属性观察者，属性包装器，扩展
2. 学会了 delegate 的使用方法
3. 学会了 error hander
4. 学会了 Core Data 的 schema 创建，增删改查
5. 学会了 RxSwift 的基础 subject，observable，operator，主要花费在 API 的熟练度上

距离做出第一个能看的 App 还有一段时间（主要是没有遵守上面的第二点，非要碰 FileSystem 和 Database），但是肉眼可见懂得越来越多，越来越熟练。这是进步，是好事。

## 当我学会了 Rxjs
我之前开发过一个项目脚手架工具。这个工具的 init 命令会依次展示选项让用户做选择，最后根据选择结果来初始化项目。管理选项的 package 是 [inquirer](https://www.npmjs.com/package/inquirer)，它本身提供了 reactive（使用 Rxjs） 选项，可以将一个  observable 序列作为选项的数据源，这样就能在运行时动态添加新选项。这是一个很棒的功能，在工具的 1.0 版本我就添加了对 Rxjs 的支持。虽然当时对动态添加选项并无要求。这相当于我铺好了线路，只是没有接通电器。

2.0 版本，动态选项成为必需品。而这对我而言甚至甚至谈不上挑战。inquirer 支持 Rxjs，我会用 Rxjs，唯一的问题只是将需求转化为代码。

3.0 版本，新需求依然与动态选项挂钩。

还记得无数次与同事聊过 Rxjs，我的话术，逐渐从 Rxjs 很酷，很强大，变成 Rxjs 很方便。我是从 React 项目里学到了 Rxjs，但是却在 cli 项目继续使用 Rxjs。在我的认识里，这样“跨项目”的软件，真的不太多。

再次强烈推荐。



  
