
---
title: [译] 三个小tip，提高微服务的弹性
tags: 译
---
原文 [http://blog.christianposta.com/microservices/3-easy-things-to-do-to-make-your-microservices-more-resilient/](http://blog.christianposta.com/microservices/3-easy-things-to-do-to-make-your-microservices-more-resilient/)

## 承诺和后备方案
总结：毫无疑问，每一个微服务都应该准确的承诺自己能够完成的工作。在此基础上，微服务们互相协作，完成一个浩大的工程。但是同时，我们应该知道，每一个微服务都有可能因为各种原因，无法兑现承诺。在此情况下，微服务应该有后背方案，以便在依赖的微服务无法工作时依然能够提供必要的功能。

原文：
>Promises and Fall backs
Promise theory, first introduced by Mark Burgess to describe how IT systems interact with each other, shows us that our systems may or may not be as well-behaved as we’d like. A service provider publishes its “intent” to “do something” and it may or may not do that “something”. In many ways it’s how we as humans interact with each other as well. The more we look at microservices as independent, autonomous “agents” in a complex system, the more we have to respect this autonomy by understanding these systems are voluntarily intending to provide some service and at times will be unable.

Mark Burgess 第一次提出**承诺“”理论，用于描述 IT 系统如何互相交互协作。IT系统可能无法按照它所承诺的那样正常工作。一个微服务宣称自己能够做某些事情，实际它可能无法正常工作。这和我们人类互相交互的情况非常先进。实际上，我们越是将微服务看做一系列独立自助的服务构成的复杂系统，就越应该明白或者说接受它们可能部分无法工作。

>So what happens when things don’t go as planned? Let’s look at a non-computer example for a second. Say for a moment that I’m a consultant and I provide a service to my customers. Maybe I’m an architect that helps you build microservices architectures and I’ve promised to deliver an on-site architecture workshop. This is me volunteering to provide this service to you. What if my flight to your company site is cancelled (ie I was trying to fly through O’Hare :) )? Do I just call you up and say “sorry, cannot deliver the workshop, my flight was cancelled.” I suppose I could. Then next time you ask me to deliver a workshop you may second guess things. But maybe I say “sorry, my flight was cancelled, maybe I can find another flight?” or “maybe I can deliver it remote”, or “can we reschedule”? I’ve voluntarily promised to deliver a workshop on microservices so it’s incumbent on me to do what I can >to fulfill that service.

所以，当它们无法正常工作时，后果是什么呢？ 让我们先看看不那么“计算机”的例子。假如我现在是一个顾问，向客户提供服务。也许，我能帮你设计微服务架构。而且，我将要赶赴你的办公室，提供一个架构方案。如果我的航班被取消了，该怎么办呢？ 我只是打个电话告诉你：“抱歉，我的航班被取消了，不能按时交付架构方案”。我想，这个应该可以做到。下一次你再邀请我提供架构服务时，可能会猜到一些事情。但是也许我会说：“抱歉，我的航班被取消了，也许我可能找到另一个班次？”或者，“也许我们可以远程协作”，或者“我们可以重新约一个时间吗？” 我做过了承诺，所以我会尽力完成工作，不管用什么方式（后备方案）。

>It’s important to think this way when providing a service in a microservice architecture. What happens when collaborator services are unavailable? What fallback procedures are available to me? A lot of times this fallback may be dictated by the business. Maybe you returned a canned response. Maybe you call a different service as a back up. Maybe you do a simplified calculation yourself. Either way, in the face of some unexpected fault, you should think through what alternatives there are to help fulfill (or partially fulfill) the service promise.

在微服务架构中考虑这件事情，是非常重要的。如果其他微服务无法工作该怎么办？有哪些后备的方案？
很多时候，后备方案的选择取决于我们的商业逻辑。你可以返回一个特别的结果；调用另一个备用的微服务，或是自己做一些简单的计算。无论哪种方式，无论哪种错误，你都应该准备足够的备用方案，来尽力兑现当初许下的承诺。

## 消费者合同
微服务应该去验证其他服务返回的数据，但仅仅应该关心最关键的部分，而不是不分轻重统统验证。通过这种方式，微服务可以更好地适应彼此的变化。

Consumer contracts
原文：
>From our SOA days we’ve been ingrained to think of service contracts as something the service provider publishes. In the above discussion about promises, it would be the “intent” of the provider. However, from the above, we also see that the provider may also run into situations where it cannot fulfill its promise and maybe it returns something else. How should the consumers react?

从我们的SOA时代起，我们已经根深蒂固地将服务合同视为服务提供商发布的东西。 在上面关于承诺的讨论中，它将是提供者的“意图”。 但是，从上面我们也看到，提供者也可能遇到无法履行承诺的情况，也许还会返回其他内容。 消费者应该如何反应？

>The service provider provides a contract of some form (ie documents or schemas that describe the payload of the request and expected responses) and the consumers conform to these documents and implement their internal data models in terms of what the provider has decreed. Then consumers would unmarshall and maybe even validate the contents of the payload during these service interactions. Now if the provider ends up changing the contract (ie adding new fields) the unmarshalling and validation of these data payloads may break. That’s not good because we value our service autonomy. We should be able to make changes to a service without forcing ripple effect of changes on other services.

服务提供者提供某种形式的合同（即描述请求的有效载荷和预期响应的文档或模式），并且消费者符合这些文档并根据提供者的规定实施其内部数据模型。 然后，消费者将在这些服务交互期间解组并甚至验证有效载荷的内容。 现在，如果提供者最终更改合同（即添加新字段），则可能会破坏这些数据有效负载的解组和验证。 这不好，因为我们重视我们的服务自主权。 我们应该能够对服务进行更改，而不会对其他服务的更改造成连锁反应。

>A solution to this is based on the principle to be “conservative in what we send to a service and liberal in what we accept.” Basically, we do “just enough” validation of the response and pull out just the data we need instead of trying to do full data validation. This means our unmarshalling logic should be smart enough to work around the parts of the data model/response that it doesn’t know (or care) about. Moreover, if we can capture the parts of the response that consumers really care about, we can begin to return this in a feedback loop to the service providers to help them understand what’s actually being used across the service consumers and when they make changes what changes may be breaking changes. Ian Robinson from Thoughtworks covers this well in [Consumer Driven Contracts: A Service Evolution Pattern](http://martinfowler.com/articles/consumerDrivenContracts.html)

对此的解决方案基于以下原则：“发送数据的保守型和接受数据的自由性。”一般，我们对响应进行“足够”的验证并仅提取我们需要的数据而不是试图进行完整的数据验证。 这意味着我们的解析逻辑应该足够智能，以解决它不知道（或关心）的数据模型/响应部分。 此外，如果我们可以捕获消费者真正关心的响应部分，我们就可以开始在服务提供商的反馈循环中将其返回给服务提供商，以帮助他们了解服务消费者实际使用的内容以及他们什么样的修改会破坏这些内容。

## 幂等性消费者

>What happens when things go wrong? Or when services fail? A service may go down in the middle of a transaction. A mis-behaving service may be inadvertently pounding our service with requests. A consuming service may experience latency in the network (expect this in cloud deployments!) and may have timed-out and retried. A system that expects to receive once-and-only once delivery of a message is brittle by definition. If you build your services to be able to deal with these kinds of “unexpected” behavior they will be far more resilient. We need idempotent services.

当发生错误时，或者某些微服务损坏时，会出现什么问题呢？ 服务可能在事务处理中出错。出错的服务也可能请求其他服务。扮演消费者的服务可能会遇到网络中的延迟（假设部署在云端），出现延迟和重试。根据定义，期望一次只接受一个请求的系统是脆弱的。如果有一种服务，能够处理前面所列的所有的“意外”问题，这样的服务可以成为是具有弹性的 - 即使我们所需要的 “幂等服务”。

>One example is to not exchange messages between systems as “deltas”. These are not idempotent messages; if you receive a message multiple times that says “increment X by 20” , you will probably end up with an inconsistent value. Maybe prefer “current-value” type messages where if you receive them multiple times, they don’t add to any inconsistencies in the data.

一个例子是不在系统之间交换“增量”信息，因为它们不是幂等的；假设接收到多次的消息中都表述为“将x增加20”，那么最终可能会得到一个不一致的值。更好的办法是使用“当前值”作为消息内容，这样即使消息重复发送多次，也不会影响结果。

>Another option is to employ infrastructure that can filter out duplicates. For example, in a failover scenario, Apache ActiveMQ can filter out duplicates when a producer sends a message to the broker and then ends up failing over to a different broker for some reason; the broker index can track and identify duplicates and discard them.

一个办法是采用可以过滤重复数据的基础设施。例如，在故障转移方案中，Apache ActiveMQ 可以在生产者向代理发送消息时过滤掉重复项，然后由于某种原因最终故障转移到其他代理; 这些代理的索引可以跟踪和识别重复项并将其丢弃。

>Yet another option is to track unique identifiers in the messages you receive in your services and reject those that have been processed successfully. Storing this information in a LRU cache helps you quickly diagnose whether you’ve seen a message and either return a canned response, the original response, or ignore it. Apache Camel makes it really easy to build services that use this idempotent-consumer pattern.

另一个办法是跟踪消息中的唯一识别标记，当接收到的消息中包含已经成功处理的标记，就拒绝处理消息。将标记信息存储在 LRU 缓存中可以帮助诊断你是否看到过此消息，并返回预设响应，原始相依，或者忽略。Apache Camel 使得构建幂等消费者模式变得非常容易。
