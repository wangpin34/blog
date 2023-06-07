
---
title: CORS：简单请求和非简单请求，背后的逻辑
tags: 文章
---
## 引子
熟悉 cors 的同学都应该知道，简单请求和非简单请求是两种不同类型的请求方式。对于后者，浏览器会先发送一个预检请求，询问后端是否允许访问。这个请求的 method 是 OPTIONS。

这边文章探讨的是，以上设计的内涵。抛砖引玉，欢迎大家留言分享看法，指正错误。
## CORS 的缺陷
CORS 解决了之前依靠 JSONP（json with padding）的一些问题：
使用 script 标签加载资源的方式请求后台API，由于不使用 Ajax，所以不能：
1. 使用除 GET 以外的其他 http method（restful api 废掉了）
2. 身份验证问题（不能自定义 header，各种 token 废掉了，唯一的办法是使用 cookie 来验证身份）
3. 脚本注入的危害

但是同源策略毕竟只是浏览器自己的策略，这意味着它无法阻止下面这个场景：
> 未获得许可的调用方，调用了有副作用的API
因为未获得许可，所以它不能获取到调用结果，但是，后台毕竟执行了 API 调用。所以，如果 API 有副作用（影响了数据，譬如转账，支付），则数据已经被非法修改了。

**非简单请求解决了这个问题**。

## OPTIONS method
下面是从 [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS) 上摘下来的一段话：
>The HTTP OPTIONS method is used to describe the communication options for the target resource. The client can specify a URL for the OPTIONS method, or an asterisk (*) to refer to the entire server.

上面这句话的大意是，OPTIONS 请求用于描述目标资源的通信选项。怎么理解这句话呢？我们知道， Restful 首先将数据抽象成资源，然后用 HTTP method 描述对资源的创建，查询，更新，删除（POST, CREATE, PUT/PATCH, DELETE）。所以，OPTIONS 可以看做是去**咨询**目标资源的**可用操作**。

根据 CORS 的定义， OPTIONS 作为预检请求(Preflighted requests)使用的 HTTP method，返回信息中包含以下内容在 HTTP 信息中：
```
Access-Control-Allow-Origin: http://foo.example //允许哪些 domain 访问
Access-Control-Allow-Methods: POST, GET, OPTIONS //允许使用的方法
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type //允许的 HTTP header
Access-Control-Max-Age: 86400 //预检请求的缓存时间
```
很多同学担心大量的预检请求会消耗网络资源，一般从两个角度来解决这个问题：
1. 设置缓存
2. 配置高速的 OPTIONS 请求应答




