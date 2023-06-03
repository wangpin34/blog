
---
title: restful api - http 状态码规范
tags: 文章
---
很多 restful guide book 都给出了 http 状态码规范，基本规则如下。

* 2xx 指示成功，4xx指示客户端错误，5xx指示服务端错误
* 如果是客户端的请求参数有问题，比如访问（删改查）一个不存在或者权限不足的资源，或者请求中的 body 里的数据与后台的数据结构不一致， 使用 4xx。
* 如果是服务端的状态有问题，比如数据库连接错误，文件读写错误，乃至未能正确处理的异常（应该尽量避免），使用 5xx。

从收藏的文档中copy过来的，就不翻译了。

Code | Name| What does it mean?
--- | ---  | ---
200 | OK | All right!
201 | Created | If resource was created successfully.
400 | Bad Request | 4xx Client Error
401 |	Unauthorized | You are not logged in, e.g. using a valid access token
403 |	Forbidden	| You are authenticated but do not have access to what you are trying to do
404	| Not found	| The resource you are requesting does not exist(including parent resource does not exist)
405	| Method not allowed | The request type is not allowed, e.g. /users is a resource and POST /users is a valid action but PUT /users is not.
409 | Conflict | If resource already exists.
422	| Unprocessable entity | Validation failed. The request and the format is valid, however the request was unable to process. For instance when sent data does not pass validation tests.
500	| Server error | 5xx Server Error. An error occured on the server which was not the consumer's fault.

如果**觉得**以上状态码不能更具体的表述情况（某些业务中非常详细的返回信息），不建议另外找一个冷门的状态码来使用，一般更通用的做法是，在返回数据中包含额外的code 和 message，来表述具体情况。
```
{
 "code": "",
 "message": ""
}
```
设计 code 要有一定的规划，比如，对某个功能相关的错误设置相同前缀的 code，例如： 前缀 100
```
100200 user doesn't exist
100201 user data not valid 
100202 user account is not activited for preceed
```
比较复杂的错误代码设计，可以参考 oracle dbms。但通常，我们自己的微服务达不到这样的复杂度，所以，**适可而止**。



