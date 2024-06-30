## 1.MQ 介绍

MQ 是 Message Queue(消息队列)的简称,队列是一种先进先出的数据结构,队列当中存储的就是消息,消息的类型可以是文本字符串、JSON、内嵌对象、byte。消费者可以消费消息,消费一个消息队列就会删除一个消息,提供者可以提供消息,提供一个消息队列就会增加一个消息。当大量消息存储在队列当中且未被消费时,会造成大量消息堆积。MQ 常用于以下场景:

- 应用解耦:在项目启动之初来预测将来会碰到什么需求是极其困难的。消息中间件在处理过程中间插入了一个隐含的、基于数据的接口层,两边的处理过程都要实现这一接口,这允许你独立地扩展或修改两边的处理过程,只要确保它们遵守同样的接口约束即可。
- 削峰填谷:在访问量剧增的情况下,应用仍然需要继续发挥作用,但是这样的突发流量并不常见。如果以能处理这类峰值为标准而投入资源,无疑是巨大的浪费。使用消息中间件能够使关键组件支撑突发访问压力,不会因为突发的超负荷请求而完全崩溃。
- 异步通信:在很多时候应用不想也不需要立即处理消息。消息中间件提供了异步处理机制,允许应用把一些消息放入消息中间件中,但并不立即处理它,在之后需要的时候再慢慢处理。

## 2.MQ 常见问题

### 2.1 如何解决消息堆积问题?

### 2.2 如何保证消息的幂等性问题?

### 2.3 如何保证消息的可靠性,避免消息丢失？