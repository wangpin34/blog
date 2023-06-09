
---
title: OAuth 2.0 入门
tags: 文章
---
OAuth 是 open authorization 的简写，意思是开放授权。下面是维基百科的解释：
> OAuth的标志
开放授权（OAuth）是一个开放标准，允许用户让第三方应用访问该用户在某一网站上存储的私密的资源（如照片，视频，联系人列表），而无需将用户名和密码提供给第三方应用。

>OAuth允许用户提供一个令牌，而不是用户名和密码来访问他们存放在特定服务提供者的数据。每一个令牌授权一个特定的网站（例如，视频编辑网站)在特定的时段（例如，接下来的2小时内）内访问特定的资源（例如仅仅是某一相册中的视频）。这样，OAuth让用户可以授权第三方网站访问他们存储在另外服务提供者的某些特定信息，而非所有内容。

某乎上有人做了一番形象化的解释：
> 打比方我约了一个空调工帮忙维修空调，但是这天我刚好不在家。我可以留一把钥匙给他，但又怕不安全。比如他可能回去配一把钥匙，他可能顺手拿走我家里的贵重物品。好在有 OAuth，我可以给他一把 OAuth 钥匙，这把钥匙只能在今天使用，明天就过期。并且，通过这把钥匙进入室内的人，只能看见空调，其他东西对他来说是隐藏的。最关键的是，如果我中途反悔，可以随时随地吊销这把钥匙，而在房间的空调工会被自动赶出来。

完全凭记忆默写出来，大概意思没有错。

OAuth 2.0是OAuth协议的下一版本，但不向下兼容OAuth 1.0。OAuth 2.0关注客户端开发者的简易性，同时为Web应用，桌面应用和手机，和起居室设备提供专门的认证流程。

本篇文章只讨论 2.0 版本。

## 授权方式
相比概念， OAuth 的具体内容更显复杂。我会先约定几个名词，再做一个小实验，使用 github 的 OAuth 来授权我的小 App。

* 资源服务器，这里指 github
* 授权服务器，这里也是 github，也许github后台有很多微服务分别管理，但对于我们的角度来看是一个整体
* 第三方 App，也就是下面的请求授权的 App
* 用户：App 的用户，同时拥有 Github 的账户
* 客户端 client： 这里指浏览器

### 准备工作
注册 App
![register-app-1](https://user-images.githubusercontent.com/12655367/43238163-9b226f3e-90bf-11e8-9af7-61e473ead662.PNG)
![register-app-2](https://user-images.githubusercontent.com/12655367/43238165-9c7150d0-90bf-11e8-9612-af0c52ae041a.PNG)
注意这里填写的 homepage url 和 authorization callback url。

```
homepage url: http://localhost:8080
authorization callback url: http://localhost:8080/callback.html
```

接下来，准备一个小项目
![project-folder](https://user-images.githubusercontent.com/12655367/43238238-f1e7659a-90bf-11e8-8fe1-25a312d16b10.PNG)
简单起见，安装静态文件server，这里使用 http-server
```
npm install http-server -g
```
这项目根目录，启动 server
```
http-server -p 8080
```
ok，到这里，应该能明白项目中 index.html 对应的是 homepage url，callback.html 对应的是 authorization callback url。

### 图示流程
熟悉的登录界面，用户选择使用github账户登录
![login](https://user-images.githubusercontent.com/12655367/43238405-afdc8c6a-90c0-11e8-9b75-0af0380fc31d.PNG)
页面跳转到github授权页面，注意地址栏的地址信息中包含了client id 和 redirect url
![authorized](https://user-images.githubusercontent.com/12655367/43238532-24f9b3a6-90c1-11e8-8384-175b2ff4fb52.PNG)
确认授权之后，页面跳转到 redirect url，也就是本地的 callback.html 页面，注意地址栏中的 code。这个code很关键，用于获取最终的 token。
![return-code](https://user-images.githubusercontent.com/12655367/43238339-7312360e-90c0-11e8-8239-ea71d433d93b.PNG)
callback.html 页面解析出 code，发送 ajax 请求获取 token
![get-token](https://user-images.githubusercontent.com/12655367/43238341-746943c6-90c0-11e8-962e-5a08ac4b0063.PNG)
得到的 token。
![got-token](https://user-images.githubusercontent.com/12655367/43238349-79ca38c0-90c0-11e8-90b8-ee1894b5384c.PNG)

[项目完整代码-github](https://github.com/woodstage/oauth-github-test)

### 取消授权
在本文最开始的地方，提到了 OAuth 的用户可以方便的取消授权 - 吊销令牌（revoke token）。
![revoke-token](https://user-images.githubusercontent.com/12655367/43238819-6473dc40-90c2-11e8-9510-c9fd025abc05.PNG)

### 总结
1. 注册 App， 填写 home page url， authorization callback url（授权回调页面），获取 client id， client secret。
2. client 端跳转到 github 的授权页面，携带 client id 等参数
3. 用户确认授权后，github 跳转回授权回调页面，携带 code
4. client 使用 code 和其他必要参数（client id，secret），请求 github 颁发 access token
5. 用户可以随时吊销令牌，终止授权
## 参考
* [开放授权](https://zh.wikipedia.org/wiki/%E5%BC%80%E6%94%BE%E6%8E%88%E6%9D%83)
