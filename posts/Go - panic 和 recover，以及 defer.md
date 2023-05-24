
---
title: Go - panic 和 recover，以及 defer
tags: go
---
Go 没有类似于 java 的 throw try catch 结构，取而代之的是 panic 和 recover。panic 用于中断程序抛出错误。

panic("Error message")

程序运行到 panic ，不会再继续执行，而是中断整个进程。除非，在合适的时机 recover。一般，将 recover 函数置于 defer 中，以保证函数退出时恢复 panic。

defer func(){
  if err := recover(); err != nil {
   //恢复错误，打印日志
  }
}()

## Defer
defer 关键字所标志的语句，**必定**会在此函数退出时（包括 panic）执行，所以，defer 经常用作清理现场（处理错误，关闭 reader，writer，channel），类似于其他语言的 finnally 关键字。

一个函数中可以有多个 defer 语句。他们的执行顺序和声明顺序相反 - 即先声明后执行（First in last out）。
