
---
title: Go 开发环境
tags: go,开发环境
---
任何语言的入门学习都离不开搭建开发环境这个问题。简易版的开发环境则一定包含 install，setup 和 run 三部分 - 即安装，配置，运行。

# Install
先说明一下我的开发机器：
MacBook Pro
处理器 2.7 GHz Intel Core i5
内存 8 GB 1867 MHz DDR3 
硬盘 256GB

检查或配置网络：由于 go 的安装包在 google api 服务器上（具体查看[官网](http://golang.org/)），由于众所周知的原因，需要学会科学上网才能正常下载这个安装包。

我个人使用 brew 检索和安装了 go 1.9，当然，通过浏览器或者其他任何下载工具也可以。

brew install go@1.9

# Setup
下载完成后，需要将 go 的 bin 文件添加到环境变量 PATH 中。另一个需要新建的环境变量是 GOPATH，此目录用于存放代码和package。

题外话，任何会添加新的系统命令的安装包都需要将可执行文件的目录添加到 PATH 中（所有系统都需要，只有存放 PATH 的地方有区别，osx 和 linux 都可以通过具体的文件来管理 PATH，而 windows 一般只需要在对应的编辑器中管理即可。这个角度说起来，windows更加傻瓜。 osx 和 linux 更加灵活直观但操作门槛也更高）。

全部配置完成后，就可以尝试 go 命令了

go version

# Run
按照约定，所有的 go 代码都应该放在 GOPATH/src 下。我们在 src 建立一个新项目叫做 learn-go，其目录结构如下

```
-
  index.go
```
目前只有一个源文件。内容如下：

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello World")
}
```
在项目根目录下执行：
```bash
go run index.go
```
结果：
```txt
Hello World
```

成功！
