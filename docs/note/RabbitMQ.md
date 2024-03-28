---
layout: doc
title: redis
---

Producer(生产者) :生产消息的一方（邮件投递者）
Consumer(消费者) :消费消息的一方（邮件收件人）

## Exchange (交换器)
在 RabbitMQ 中，消息并不是直接被投递到 Queue(消息队列) 中的，中间还必须经过 Exchange(交换器) 这一层，Exchange(交换器) 会把我们的消息分配到对应的 Queue(消息队列) 中。Exchange(交换器) 用来接收生产者发送的消息并将这些消息路由给服务器中的队列中，如果路由不到，或许会返回给 Producer(生产者) ，或许会被直接丢弃掉 。

RabbitMQ 中通过 Binding(绑定) 将 Exchange(交换器) 与 Queue(消息队列) 关联起来，在绑定的时候一般会指定一个 BindingKey(绑定建) ,这样 RabbitMQ 就知道如何正确将消息路由到队列了。

## Queue (消息队列)
Queue(消息队列) 用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。

多个消费者可以订阅同一个队列，这时队列中的消息会被平均分摊（Round-Robin，即轮询）给多个消费者进行处理，而不是每个消费者都收到所有的消息并处理，这样避免消息被重复消费。

## Broker（消息中间件的服务节点）
对于 RabbitMQ 来说，一个 RabbitMQ Broker 可以简单地看作一个 RabbitMQ 服务节点，或者 RabbitMQ 服务实例。大多数情况下也可以将一个 RabbitMQ Broker 看作一台 RabbitMQ 服务器。

## Message (消息)
消息一般由 2 部分组成：消息头（或者说是标签 Label）和 消息体。消息体也可以称为 payLoad ,消息体是不透明的，而消息头则由一系列的可选属性组成，这些属性包括 routing-key（路由键）、priority（相对于其他消息的优先权）、delivery-mode（指出该消息可能需要持久性存储）等。生产者把消息交由 RabbitMQ 后，RabbitMQ 会根据消息头把消息发送给感兴趣的 Consumer(消费者)。

## 注意事项
### Exchange Types(交换器类型)
1. fanout

    > fanout 会把所有发送到该 Exchange 的消息路由到所有与它绑定的 Queue 中，不需要做任何判断操作，所以 fanout 类型是所有的交换机类型里面速度最快的。fanout 类型常用来广播消息。

2. direct

    > direct 类型的 Exchange 会把消息路由到那些 Bindingkey 与 RoutingKey 完全匹配的 Queue 中。

3. topic

    > topic 模糊匹配 使用点号 ‘.’ 分割

    BindingKey 中可以存在两种特殊字符串 “*” 和 “#” ，用于做模糊匹配，其中“*” 用于匹配一个单词，“#” 用于匹配多个单词(可以是零个)。

4. headers

    > 根据消息中的headers属性，进行键值对匹配

### 消息丢失

1. 消息未到达交换机

2. 消息未到达队列

3. 消费者未收到消息

### 生产者确认机制
RabbitMq提供了publisher confirm机制避免消息发送到MQ过程中丢失。消息发送到MQ之后，会返回一个结果给发送者，表示消息是否处理成功

* 回调方法重发
* 记录日志
* 保存到数据库定时重发，成功后删掉表中的数据

### MQ宕机
MQ默认是内存存储消息，可以开启消息持久化功能确保缓存在MQ中的消息不丢失
1. 交换机持久化 `new DirectExchange("simple.direct", true, false)`
2. 队列持久化 `QueueBuilder.durable("simple.queue").build()`
3. 消息持久化 `MessageBuilder.withBody().setDeliverMode(MessageDeliverMode.PERSISTENT).build()`

### 消费者确认机制
RabbitMQ支持消费者确认机制，即：消费者处理消息后向MQ发送ack回执，MQ收到ack回执后才会删除该消息
* manual：手动ack，业务代码执行完成后，调用api发送ack。
* auto：自动ack，由spring监测listener是否发生异常，没有异常返回ack，否则返回nack。
* none：关闭ack，MQ假定消费者获取到消息后会成功处理，因此消息投递后立即删除

利用Spring的retry机制，在消费者出现异常的时候本地重试，设置重试次数，当重试次数达到后，将消息发送给异常交换机，由人工手动处理

### 消息重复消费

* 业务标识唯一ID
* 幂等方案：分布式锁、数据库锁

### 大量消息堆积
1. 增加消费者
2. 消费者使用线程池消费
3. 扩大队列容积，提高堆积上限
   * 设置为惰性队列，基于硬盘存储，时效性降低