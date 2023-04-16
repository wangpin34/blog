
---
title: jq 简介：简单实用的命令行 json 工具
tags: 
---
# 楔子
接触 jq 完全是源于 blog 这个项目。我需要每周一由 action 自动创建一个 issue。创建 issue 需要发送如下 POST 请求。
```
POST /repos/{owner}/{repo}/issues

{
  "title": "",
  "body": ""
}
```
> 具体的 API 定义可见 [create an issue](https://docs.github.com/en/rest/reference/issues#create-an-issue)

在 linux 里面（具体执行由 github action 负责）发送 http 请求是很方便的，比如 curl。但是 json 的处理不太方便。如果在 body 里手写 json 字符串，又太容易出错，也不方便扩展（比如使用变量）。
> 在 Nodejs 中构造 json body 是很方便的事情。但是却要引入 Nodejs。我觉得没有这个必要。

于是，我找到了 jq。

# 安装与配置
# 常用命令
# 参考资料
大部分内容来自于亲自实践，也参考了一些文章、教程。排名不分先后。
* [https://www.baeldung.com/linux/jq-command-json](https://www.baeldung.com/linux/jq-command-json)
* [How to Parse JSON Files on the Linux Command Line with jq](https://www.howtogeek.com/529219/how-to-parse-json-files-on-the-linux-command-line-with-jq/)




