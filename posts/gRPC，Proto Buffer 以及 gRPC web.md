
---
title: gRPC，Proto Buffer 以及 gRPC web
tags: 文章
---
![gRPC](https://grpc.io/img/landing-2.svg) 

`gRPC` 是一种通信方式。它的特点是，客户端使用预先设定好的接口名和参数与后端通信。如：

```javascript
const userResp = client.getUser(userReq)
```
作为对比，普通的 restful 接口的调用方式:
```javascript
const userResp = fetch('/user', id).json()
```
调用 `restful` 接口，需要指定接口地址（/user），参数（id），格式化返回数据。

而 `gRPC` 使用预定义的接口名（getUser）和参数 （userReq），以及内置的数据格式。

 `gRPC`只是规范，引入实践之前，必须解决下面两个问题，如何定义接口，如何使用接口，这叫做具体的`实现`。 `Proto Buffer` 是目前最流行的实现，并且提供了丰富的工具链以支持不同的编程语言。
# Proto Buffer
狭义上的 `Proto Buffer` 类似一种模型定义语言，yaml。使用 `Proto Buffer` 编写的文件要以`.proto`为扩展名，下面是一个例子，echo.proto
```proto
syntax = "proto3";

message EchoRequest {
  string message = 1;
}

message EchoResponse {
  string message = 1;
}

service EchoService {
  rpc Echo(EchoRequest) returns (EchoResponse);
}
```
上面的代码定义了两个 message 类型，一个 service 和内部接口。```Proto Buffer```支持 import 语法，从本地文件系统或者网络上导入第三方 message 或者 service。

定义好模型，接下来就是将模型编译成特定编程语言可以调用的库，或者叫做 sdk。

# 编译器
 [Protoc](https://github.com/protocolbuffers/protobuf) 是由 Google 团队负责维护，目前支持 `Java`, `Python`, `C#`, `C++` 等主流编程语言。可以访问 https://developers.google.com/protocol-buffers/docs/tutorials 查看具体的资料。

除了官方的支持以外，也有很多其他编程语言的支持，比如 javascript/nodejs 相关的 https://github.com/grpc/grpc-web。下载安装好 `grpc-web` 后运行以下命令，就可以编译出 web 版本的 sdk。
```bash
protoc -I=$DIR echo.proto \
    --js_out=import_style=commonjs:$OUT_DIR \
    --grpc-web_out=import_style=commonjs,mode=grpcwebtext:$OUT_DIR
```

# proto-buffer vs swagger(openAPI)
proto-buffer 和 swagger 当然是不同的东西，前者服务于 gRPC，后者服务于 openAPI。忽略规范和实现上的细节，我们发现他们的定位或者说扮演的角色是一致的：为某一种数据通信规范提供定义，自动生成 model 和 service（swagger 的各种 code-gen）。可以讲 proto-buffer 和 swagger 看作是对数据通信规范的实现。如果未来有其他新型的通信规范出炉，类似的配套实现也一定会随之出现。问题在于，谁会是下一个实现的贡献者。






