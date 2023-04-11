
---
title: 跨域问题之 CORS
tags: 文章
---
## 介绍
CORS 全称 Cross-Origin Resource Sharing，中文翻译为 **跨域资源共享**。 **CORS 是web服务器和浏览器之间的协议， web服务器声明，浏览器解析并实施**。

web服务器 -> 我允许来自 http://www.a.com/ 的 ajax 请求
浏览器 -> 晓得了

web服务器声明限制使用的方式是，在 response 中添加对应的 header。比如：

> Access-Control-Allow-Origin: http://www.a.com/

上面的 header 表示允许来自 http://www.a.com/ 的访问。 origin 指 http 请求发成的站点的 domain。比如，ajax 是从 http://www.a.com/home.html 发出，那么 origin 就是 http://www.a.com/ 。

具体的交互过程（简单请求）：
```
client            browser                        web server
   |    -> ajax      |           ->http request      |
   |               check headers <-http response     |
```
浏览器检查 header 发现允许访问，则将数据交付给 ajax，否则丢掉结果。

**可以为不同的 API 设置不同的 response header，所以， CORS 的控制粒度可以精准到 API 级别。**

## 两种请求
仅仅是编写前端代码，那么读到这里就可以结束了。**你只需要知道， CORS 是跨域访问服务器资源的最好的解决方案（jsonp走开），主流浏览器对于 CORS 都有很好的支持可以放心使用。而且对于现有后台服务的升级，很多时候只需要再加一层反向代理（nginx 在 response 返回客户端前追加一层 CORS 相关的 header）**。

如果还想深入，那么继续。

浏览器将 CORS 请求分为两类，简单请求和非简单请求，上面的流程介绍的是简单请求。

### 简单请求
满足下述所有条件的才可以称为简单请求。

使用下列方法之一：
* GET
* HEAD
* POST
Fetch 规范定义了对 CORS 安全的首部字段集合，不得人为设置该集合之外的其他首部字段。该集合为：
* Accept
* Accept-Language
* Content-Language
* Content-Type （需要注意额外的限制）
* DPR
* Downlink
* Save-Data
* Viewport-Width
* Width
Content-Type 的值仅限于下列三者之一：
* text/plain
* multipart/form-data
* application/x-www-form-urlencoded

### 非简单请求
对于非简单请求，浏览器会首先发出一个**预检请求**: HTTP OPTIONS 方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。这样做的目的是保护服务器的数据不会被影响。

当请求满足下述任一条件时，即应首先发送预检请求：

使用了下面任一 HTTP 方法：
* PUT
* DELETE
* CONNECT
* OPTIONS
* TRACE
* PATCH
人为设置了对 CORS 安全的首部字段集合之外的其他首部字段。该集合为：
* Accept
* Accept-Language
* Content-Language
* Content-Type (but note the additional requirements below)
* DPR
* Downlink
* Save-Data
* Viewport-Width
* Width
Content-Type 的值不属于下列之一:
* application/x-www-form-urlencoded
* multipart/form-data
* text/plain

### cookie
CORS 请求默认不会携带 cookie，需要**显式**开启。
```javascript
xmlHTTP.open('GET', url, true);
xmlHTTP.withCredentials = true;
```
如果携带 cookie，web服务器的CORS header 不能配置为

> Access-Control-Allow-Origin: *

这是为了防范恶意网站盗取用户信息。

## 其他文章和资料
* [Access_control_CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
* [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
* [Using CORS](https://www.html5rocks.com/en/tutorials/cors/)


