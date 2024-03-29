
---
title: Restful API 的设计
tags: 文章
---
# 引子

Restful API 是现在比较常见的HTTP API设计方案了。不管是不是真的理解，很多项目组都开始运用restful思想设计API。前几天部门领导莅临指导，更是反复强调要 restful。姑且认为他也是经过深入研究的吧。
# 优点和缺点

restful 开辟了一种简单的设计方案。它把网站，或者说后台服务看做对资源的管理，比如 创建，更新，获取和删除。针对这四类方法设计 API，使得架构清晰，易于管理。而且，充分的利用 http method 定义管理方式，使得，api 更易于理解和使用。

restful 的缺点就是，学习成本其实很高。它的指导原则比较简单，一切皆是资源，api 就是对资源的管理。那么问题来了，如何有效的抽象这些资源？ 比如， search 是非常常见的api，如果将它 restful 化？ 
# 基本原则

restful 认为一切皆是资源， API 应该是对资源的状态的转化。
## url 路径中只应该包含资源标识符

比如，创建订单，非 restful API 可能是这样的:

```
/createPO
```

这个业务中，PO是一种资源，restful 风格的 API 应该应该是

```
/PO
```

那么，如何标志这个API 是创建 PO 呢？ 
## 利用 http method 定义资源状态转化

上面的例子，可以使用 POST 方法定义创建 PO。

```
POST /PO
```

restful 主张用http method来标志资源状态的转化，有下面四种：
- POST 创建
- PUT 更新
- GET 获取
- DELETE 删除

所以，对于PO,它的创建，更新，获取，删除，API如下

```
POST /PO
PUT /PO/:id
GET /PO/:id
DELETE /PO/:id
```
# 实践和思考

理论上来讲，restful 是让 API 的设计变得简单了。抽象资源->定义对资源的操作。实际中要注意的是对资源的抽象应该在较高的层次。我见过很多的程序员都习惯从数据库的角度来抽象资源，比如，一个表就对应一个资源。这是没有意义的，这样的API只是变相的对数据表的操作，而非对资源的转化。因为很多表的数据本来是不应该被 API 操作的，而且，业务实体也不会映射到单一的数据表。说到底，API的用户，不管是第三方，还是前台，它们关心的并不是数据表的细节，而是业务实体的模型。

所以，实际上的 POST API，也许并不仅是创建一行数据，也许它也同时更新了某些数据，删除了某些数据，这些都可以依具体业务而定。因为创建资源并不等于在某个具体的表中插入数据，而是在高层次的业务实体上的**_创建**_。

上面的例子，其实实际业务一般不会这么简单，比如PO都会从属于某一个用户，所以API的结构会是下面这样,以 PUT 为例

```
PUT /user/:userid/PO/:poid
```

这里就引申出一个值得讨论的话题，如何设计从属关系？从业务实体上设计从属关系可能会遇到一些困难，比如，某些情况下，父资源的创建可能会依赖子资源的创建。我的建议是，如果开销不大的话，可以重新设计一下业务。
# 遇到困难的时候

有些时候会遇到一些设计上的困难，可能是由于对 restful 的认识不深，或者业务实在太奇葩。如果不牵涉什么商业机密的话，可以向社区或者论坛求助。

当项目进度非常紧张的时候，一切还是以进度为先。restful很好但也不能包治百病，总是会有完全没法使用的情况，那就先实现功能吧。
# 总结

技术的变革一般都是为了提高生产力的，restful的初衷也是。它提倡简单（理论上讲只要业务实体抽象的好就够了），纯粹（每个资源就四种操作）的 API 设计思想，需要使用者坚持信仰（坚持基本原则），适度灵活。

