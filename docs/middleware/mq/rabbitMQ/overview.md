RabbitMQ 是采用 Erlang 语言实现 AMQP(Advanced Message Queuing Protocol,高级消息队列协议)的消息中间件,它最初起源于金融系统用于在分布式系统中存储转发消息。RabbitMQ 支持如下特性:

- 可靠性:RabbitMQ 使用消息确认机制来保证消息投递和消费的可靠性,如持久化、传输确认及发布确认等。
- 低延迟:RabbitMQ 相较于其他 MQ,延迟可至微秒级。RabbitMQ 低延迟的原因:
  - 异步 IO:RabbitMQ 使用 Erlang/OTP 语言编写,Erlang/OTP 内置支持异步 IO,可以实现高效的网络通信。它使用 epoll 等多路复用技术,实现了高效的 IO 操作,从而降低了网络通信的延迟。
  - 消息缓存:RabbitMQ 使用消息缓存技术,将消息缓存在内存中,这样可以避免频繁的磁盘 IO 操作,从而提高了消息的传输速度。同时,RabbitMQ 还支持持久化消息,可以将消息持久化到磁盘中,保证消息不会因为服务器宕机而丢失。
  - 集群架构:RabbitMQ 支持集群架构,可以将消息队列分布到不同的节点上,从而实现负载均衡和高可用性。集群架构可以提高系统的并发性和可扩展性,从而减少消息传输的延迟。
  - 支持多种交换机类型:RabbitMQ 支持多种交换机类型,如直连交换机、扇形交换机、主题交换机等。这些交换机类型可以根据不同的业务场景进行选择,从而实现高效的消息路由和传输。
- 灵活的路由:在消息进入队列之前,通过交换器来路由消息。对于典型的路由功能,RabbitMQ 已经提供了一些内置的交换器来实现。针对更复杂的路由功能,可以将多个交换器绑定在一起,也可以通过插件机制来实现自己的交换器。
- 扩展性:多个 RabbitMQ 节点可以组成一个集群,也可以根据实际业务情况动态地扩展集群中节点。
- 高可用性:队列可以在集群中的机器上设置镜像,使得在部分节点出现问题的情况下队列仍然可用。
- 多种协议:RabbitMQ 除了原生支持 AMQP 协议,还支持 STOMP、MQTT 等多种消息中间件协议。
- 多语言客户端:RabbitMQ 几乎支持所有常用语言,比如 Java、Python、Ruby、PHP、C＃、JavaScript 等。
- 管理界面:RabbitMQ 提供了一个易用的用户界面,使得用户可以监控和管理消息、集群中的节点等。
- 插件机制:RabbitMQ 提供了许多插件,以实现从多方面进行扩展,也支持自定义插件。

由于采用 Erlang 语言开发,相较于 RocketMQ、Kafka,RabbitMQ 最大优势在于消息延迟低(微妙级),在高并发场景也有不俗的表现。

## 1.安装 RabbitMQ

### 1.1 Linux 系统安装 RabbitMQ

- 安装 ErLang 并解压。由于 RabbitMQ 是基于 Erlang 语言开发的,安装 RabbitMQ 前需要先安装 Erlang,RabbitMQ 与 Erlang 版本的兼容性可以查看,Erlang 最新版本为 25.3。

```shell
# 安装底层依赖库
yum -y install make gcc gcc-c++ kernel-devel m4 ncurses-devel openssl-devel

# Erlang/OTP版本树地址: https://erlang.org/download/otp_versions_tree.html

# 通过wget下载Erlang包,-P/usr/local表示将下载包存储在/usr/local目录
wget -P/usr/local https://github.com/erlang/otp/archive/OTP-25.3.tar.gz
# 解压安装包
tar -xvzf OTP-25.3.tar.gz
# 进入erlang安装包
cd otp-OTP-25.3
```

- 设置 Erlang 安装规则。

```shell
# 设置安装路径位于/usr/local/erlang下
./configure --prefix=/usr/local/erlang --with-ssl --enable-threads --enable-smp-support --enable-kernel-poll --enable-hipe --without-javac
```

- 编译并安装。

```shell
make && make install
```

- 添加 erlang 环境变量。

```shell
# 打开环境变量配置文件
vim /etc/profile

# 往配置文件加入以下内容
ERL_PATH=/usr/local/erlang/bin
PATH=$ERL_PATH:$PATH

# 使环境变量配置文件立马生效
source /etc/profile

# 终端输入以下命令测试,出现版本则说明安装成功了
erl
# 退出erlang shell
halt().
```

- 安装 rabbimq-server 并添加环境变量。

```shell
# rabbimq-server版本列表: https://github.com/rabbitmq/rabbitmq-server/releases
# rabbimq-server镜像加速: https://www.newbe.pro/Mirrors/Mirrors-RabbitMQ/

# 下载rabbimq-server最新版本,以unix命名的安装包表示Linux、MacOS和BSD系统的二进制包
wget -P/usr/local https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.11.11/rabbitmq-server-generic-unix-3.11.11.tar.xz
# 解压文件
tar -xvf rabbitmq-server-generic-unix-3.11.11.tar.xz
# 进入rabbimq-server目录
cd rabbitmq_server-3.11.11/

############ 配置RabbitMQ环境遍历
# 编辑环境变量配置文件
vim /etc/profile
# 加入以下内容,rabbitmq_server的安装路径在/usr/local/rabbitmq_server-3.11.11
PATH=$PATH:/usr/local/rabbitmq_server-3.11.11/sbin
#重载环境变量
source /etc/profile

# 开启RabbitMQ Web管理后台页面
rabbitmq-plugins enable rabbitmq_management
# 独立启动服务
rabbitmq-server -detached
```

- 访问 RabbitMQ 管理面板。RabbitMQ 除了通过命令操作 RabbitMQ Server,也内置了后台简化 RabbitMQ 管理,默认端口为 15672,默认账号和默认密码都是 guest。注意 guest 无法在远程环境下访问,因此需要创建新的用户并设置权限。

### 1.1 Docker 安装 RabbitMQ

```shell
# 启动rabbitmq容器
docker run -d -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

## 远程连接rabbitMQ会出现Not_Authorized,需要添加用户并设置为管理员
# 进入rabbitmq容器
docker exec -it rabbitmq /bin/bash
# 添加用户和密码
rabbitmqctl add_user test test
# 将test用户设置为管理员
rabbitmqctl set_user_tags test administrator
# 创建一个名为VHOST的VirtualHost(虚拟主机),VirtualHost用于逻辑层面隔离
rabbitmqctl add_vhost VHOST
# 为test用户设置虚拟主机和权限
rabbitmqctl set_permissions -p VHOST test ".*" ".*" ".*"
# 退出/bin/bash
exit

# 重新启动rabbitmq容器
docker restart rabbitmq
```

### 1.3 RabbitMQ 常用命令

```shell
# 查看版本
rabbitmqctl version

# 启动服务
rabbitmq-server -detached

# 停止服务
rabbitmqctl stop

# 查看插件列表
rabbitmq-plugins list

# 启用插件
rabbitmq-plugins enable 插件名

# 停用插件
rabbitmq-plugins disable 插件名

# 添加用户
rabbitmqctl add_user 用户名 密码

# 删除用户
rabbitmqctl delete_user 用户名

# 修改用户密码
rabbitmqctl change_password 用户名 新的密码

# 列出所有用户
rabbitmqctl list_users

# 查看所有用户权限
rabbitmqctl list_permissions
```

## 2.RabbitMQ 核心概念

- Producer:消息生产方。即消息的发送方,用于生产、发送消息的应用程序,消息生产者可以将消息发送至队列中。
- Message:即消息生产者发送的数据,消息可以是一串文字、一张图片,或者二进制数据。在 RabbitMQ 底层架构中,消息是通过二进制的数据流进行传输的。
- Exchange:交换机。用于接收 Producer 发送的消息,并将其路由到对应的 Queue 中。RabbitMQ 支持四种常用交换机类型(AMQP 也支持 System 和自定义类型):

  - fanout(扇出交换机):它会将所有发送到该交换器的消息路由到所有与该交换机绑定的队列中。
  - direct(直连交换机):direct 类型的交换机会将消息路由到 BindingKey 和 RoutingKey 完全匹配的队列中。
  - topic(主题交换机):topic 类型的交换机与 direct 类型的交换机类似,也是将消息路由到 BingdingKey 和 RoutingKey 相匹配的队列中,但 topic 交换机的匹配规则不同,BindingKey 和 RoutingKey 作为一个通过`.`号来分割字符串,其中 BindingKey 支持`*`和`#`两种特殊字符串进行模糊匹配,\*用于匹配单个单词,`#`用于匹配多个单词。
  - header(头交换机):header 类型的交换机根据消息内容中的 header 属性进行匹配路由,在绑定队列和交换器时制定一组键值对,当发送消息到交换器时,RabbitMQ 会获取到该消息的 headers(也是一个键值对的形式),对比其中的键值对是否完全匹配队列和交换器绑定时指定的键值对,如果完全匹配则消息会路由到该队列,否则不会路由到该队列。headers 类型的交换器性能会很差,而且也不实用,基本上不会看到它的存在。

- Binding:绑定,将 Exchange 与 Queue 进行绑定,用于将 Exchange 中的消息路由到指定的 Queue 中。
- Routing Key:路由键。一种用于指定 Exchange 将消息路由到哪个 Queue 的标识符。当消息生产者发送消息时,可以指定一个 Routing Key,当 BindingKey 和 Routing Key 匹配时,消息会被路由到对应的队列中
- Queue:队列。是 RabbitMQ 中用于存储消息的基本单元。Producer 将消息发送到队列,Consumer 从队列中获取消息。
- Consumer:消息消费方。即消息的接收方,用于监听、接收生产者发送的消息,它从 RabbitMQ 的消息队列中获取消息。
- Acknowledgement:确认机制(简称 ACK),用于确保消息已被 Consumer 正确接收。Consumer 在接收到消息后,会向 RabbitMQ 发送确认消息,RabbitMQ 在收到确认消息后,才会将消息从队列中删除。
- Dead Letter Exchange:死信交换机。用于接收处理失败的消息,并将其转发到指定的 Exchange 中。

## 3.Java 客户端连接 RabbitMQ

在 MQ 中消费的投递和消费是基于生产者和消费者模型实现的,生产者(Provider)用于向消息队列中投递消息,消费者(Consumer)通过 Push()或 Pull 方式从消息队列中消费消息,流程图如下:

RabbitMQ 支持 Java、.Net/C#等多种客户端用于操作 RabbitMQ Server,RabbitMQ 客户端库与 Java 版本兼容性如下:
|图书馆和分馆| 支持日期| 扩展支持| JDK 版本范围|
|-|-|-|-|
|AMQP 0.9.1 Java Client 5.x|目前支持| | 8, 11, 17, 19, 20, 21|
|AMQP 0.9.1 Java Client 4.x| 31 七月 2020| 31 十二月 2020| 6-8|
|Stream Java 客户端 0.x| 目前支持| | 8, 11, 17, 19, 20, 21|
| JMS Client 3.x | 目前支持| | 11, 17, 19, 20, 21 |
| JMS Client 2.x | 目前支持 | | 8, 11, 17, 19, 20, 21|
| JMS Client 1.x | 31 七月 2020| 31 十二月 2020| 6-8 |
| PerfTest 2.x |目前支持|| 8, 11, 17, 19, 20, 21|
| Hop 5.x |目前支持 || 11, 17, 19, 20, 21|
| Hop 4.x |31 三月 2023 |31 三月 2023| 11, 17, 19, 20|
| Hop 3.x |31 三月 2022| 31 七月 2022| 8, 11, 17|
| Reactor RabbitMQ 1.x |目前支持|| 8, 11, 17|

### 3.1 使用 amqp-client 连接 RabbitMQ

添加 AMQP 依赖:

```groovy
# 添加AMQP依赖
implementation 'com.rabbitmq:amqp-client:5.17.0'
```

#### 3.1.2 定义 RabbitMQ 工具类

定义 RabbitMQ 工具类简化 RabbitMQ 获取连接、获取 Channel(通道)、关闭连接操作。

```java
package com.fly.utils;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * RabbitMQ工具类
 */
public class RabbitMQUtil {
    // RabbitMQ虚拟主机
    private final static String VIRTUAL_HOST = "VHOST";
    // RabbitMQ连接主机地址
    private final static String HOST = "192.168.98.128";
    // RabbitMQ端口
    private final static int PORT = 5672;
    // RabbitMQ用户名
    private final static String USERNAME = "test";
    // RabbitMQ密码
    private final static String PASSWORD = "test";
    // 连接对象
    private static Connection conn;

    /**
     * 获取一个信道
     * @return Channel
     * @throws IOException io异常
     * @throws TimeoutException 超时异常
     */
    public static Channel getChannel() throws IOException, TimeoutException {
        return RabbitMQUtil.getChannel(VIRTUAL_HOST, HOST, PORT, USERNAME, PASSWORD);
    }

    /**
     * 获取一个信道
     * @param virtualHost 虚拟主机
     * @param host 主机地址
     * @param port 端口
     * @param username 用户名
     * @param password 密码
     * @return Channel
     * @throws IOException io异常
     * @throws TimeoutException 超时异常
     */
    public static Channel getChannel(String virtualHost, String host, int port, String username, String password) throws IOException, TimeoutException {
        // 创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setVirtualHost(virtualHost);
        factory.setHost(host);
        factory.setPort(port);
        factory.setUsername(username);
        factory.setPassword(password);
        // 获取连接对象
        conn = factory.newConnection();
        // 创建一个channel(通道)
        return conn.createChannel();
    }

    /**
     * 关闭连接
     * @throws IOException io异常
     */
    public static void closeConn() throws IOException {
        if (conn != null) {
            conn.close();
        }
    }
}
```

#### 3.1.3 定义消息生产者

定义消息生产者用于向 RabbitMQ Server 投递消息。

```java
package com.fly.client;

import com.fly.utils.RabbitMQUtil;
import com.rabbitmq.client.Channel;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * 消息生产者
 */
public class Producer {
    // 投递的队列名称
    private final static String QUEUE_NAME = "myQueue";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂获取一个信道
        Channel channel = RabbitMQUtil.getChannel();
        /**
         * 声明一个队列,如果该队列不存在,则创建它。queueDeclare参数如下:
         * - queue:队列名称。
         * - durable:是否声明一个持久化队列,为true时该队列将在服务器重新启动后存活。
         * - exclusive:是否声明一个排他队列,排他队列表示仅限于此连接。
         * - autoDelete:是否声明一个自动删除队列,则为true表示服务器将不再使用时该队列时将自动删除。
         * - arguments:队列的其他参数(构造参数)。
         */
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        String message = "这是一条消息";
        /**
         * basicPublish()用于消息,发布到不存在的exchange(交换机)将导致通道级协议异常,从而关闭通道。basicPublish()参数如下:
         * - exchange:将消息发布到的交换机。
         * - routingKey:路由键。routingKey用于表示向哪些队列发送消息。
         * - props:消息路由的属性。
         * - body:消息体。
         */
        channel.basicPublish("", QUEUE_NAME, null, message.getBytes("UTF-8"));
        // 关闭Channel和连接
        channel.close();
        RabbitMQUtil.closeConn();
    }
}
```

#### 3.1.4 定义消息消费者

定义消息消费者用于消费消息生产者向 RabbitMQ Server 投递的消息。

```java
package com.fly.client;

import com.fly.utils.RabbitMQUtil;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * 消息消费者
 */
public class Consumer {
    // 消费的队列名称
    private final static String QUEUE_NAME = "myQueue";
    public static void main(String[] args) throws IOException, TimeoutException {
        // 通过连接工厂获取一个信道
        Channel channel = RabbitMQUtil.getChannel();
       /**
         * basicConsume()用于消费消息,basicConsume有多个重载方法,basicConsume(String queue, Consumer callback)参数说明如下:
         * - queue:消费的队列名称。
         * - autoAck:表示是否自动确认消息。如果设置为 true,表示一旦消息被消费者接收,它将自动确认(acknowledge),这样 RabbitMQ
         * 将从队列中移除消息。如果设置为 false,则需要在消费者处理消息后手动调用 basicAck 方法进行消息确认
         * - callback:应用回调对象的接口,用于通过订阅从队列接收通知和消息。callback是一个接口,DefaultConsumer是Consumer接口的实现者,
         *
         * DefaultConsumer能满足大部分消费场景。Consumer接口提供如下方法:
         *  - handleConsumeOk(String consumerTag):调用任何Channel.basicConsume()注册消费者时调用。
         *  - handleCancelOk(String consumerTag):当调用Channel.basicCancel()取消消费者时调用。
         *  - handleCancel(String consumerTag):当使用者因调用Channel.basicCancel()以外的
         *  原因被取消时调用。例如队列已被删除。
         *  - handleShutdownSignal(String consumerTag, ShutdownSignalException sig):当通道或基础连接已关闭时调用。
         *  - handleRecoverOk(String consumerTag):当收到basic.recover-ok(恢复成功)作为对basic.recover的回复时调用。
         *  在此调用之前收到的所有未确认的消息都将被重新传递,之后收到的所有消息不会。
         *  handleDelivery(String consumerTag,Envelope envelope,AMQP.BasicProperties properties,byte[] body):
         * 当收到消费者的basic.deliver(投递)时调用。
         */
        channel.basicConsume(QUEUE_NAME, new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                String message = new String(body);
                String exchange = envelope.getExchange();
                long deliveryTag = envelope.getDeliveryTag();
                String routingKey = envelope.getRoutingKey();
                boolean redeliver = envelope.isRedeliver();
                System.out.println("consumerTag(消费标签):" + consumerTag);
                System.out.println("exchange(交换机):" + exchange);
                System.out.println("deliveryTag(投递标签):" + deliveryTag);
                System.out.println("routingKey(路由键):" + routingKey);
                System.out.println("redeliver(消息是否已投递):" + redeliver);
                System.out.println("properties(消息属性):" + properties);
                System.out.println("message(消息):" + message);
            }
        });
        // 关闭Channel和连接
        channel.close();
        RabbitMQUtil.closeConn();
    }
}
```

执行结果:

```txt
consumerTag(消费标签):amq.ctag-HvhNcRkq-NQD0upe9nudnA
exchange(交换机):
deliveryTag(投递标签):1
routingKey(路由键):myQueue
redeliver(消息是否已投递):false
properties(消息属性):#contentHeader<basic>(content-type=null, content-encoding=null, headers=null, delivery-mode=null, priority=null, correlation-id=null, reply-to=null, expiration=null, message-id=null, timestamp=null, type=null, user-id=null, app-id=null, cluster-id=null)
message(消息):这是一条消息
```

### 3.2 使用 Spring AMQP 连接 RabbitMQ Server

由于大部分企业级应用都是基于 Spring 开发,为了简化操作 RabbitMQ 通常会使用 Spring RabbitMQ 的集成库。Spring AMQP 是一个基于 Spring Framework 的开源项目,旨在提供与实现 Amqp 协议的消息代理进行交互的简便方法和类库。它提供了两个主要的部分:Spring AMQP Core 和 Spring AMQP RabbitMQ。Spring AMQP Core 提供了与任何兼容 Amqp 代理进行交互的通用接口,而 Spring AMQP RabbitMQ 则提供了专门与 RabbitMQ 代理进行交互的类库。spring-boot-starter-amqp 是一个用于在 Spring Boot 应用程序中方便地集成 AMQP 的启动器依赖,其底层使用 Spring AMQP,提供了 RabbitMQ 的自动配置,用于简化使用。

spring-boot-starter-amqp 提供 RabbitTemplate 用于在 Spring 应用程序中与 RabbitMQ 进行交互,它封装了 RabbitMQ 操作,它提供了各种方法来发送和接收消息、进行消息转换等。RabbitTemplate 常用方法如下:

- convertAndSend:转换消息(可以自动将 Java 对象转换为消息)并发送。convertAndSend 提供了多个重载方法。

```java
// 将消息(message)发送到默认交换机
void convertAndSend(Object message);
// 将消息(message)发送到指定的路由键(routingKey)
void convertAndSend(String routingKey, Object message);
// 将消息发送到指定的交换机(exchange)和路由键(routingKey)
void convertAndSend(String exchange, String routingKey, Object message);
/**
 * 将消息发送到指定的交换机和路由键,并附带消息属性。MessagePostProcessor(消息后置处理器,提供一个postProcessMessage方法,
 * 接收一个Message作为参数,并返回处理后的Message)是Spring AMQP提供的一个接口,它允许在消息发送之前对消息进行修改或增强。
 * 这个接口通常用于在消息发送到 RabbitMQ 之前对消息的属性、头部信息或内容进行调整。常见的用例包括添加自定义头部、设置消息
 * 的优先级、修改消息内容等。
 */
void convertAndSend(String exchange, String routingKey, Object message, MessagePostProcessor messagePostProcessor);
```

- send:发送消息。

```java
// 将消息(message)发送到默认交换机
void send(Message message);
// 将消息(message)发送到指定的路由键(routingKey)
void send(String routingKey, Message message);
// 将消息发送到指定的交换机(exchange)和路由键(routingKey)
void send(String exchange, String routingKey, Message message);
/**
 * 用于发送消息到指定的交换机和路由键,并附带相关的关联数据,适用于需要进行消息确认或跟踪的场景。
 * CorrelationData用于用于关联消息的元数据,可以在消息确认(ack)或返回(nack)时使用,通常用于跟踪消息的状态。
 */
void send(String exchange, String routingKey, Message message, CorrelationData correlationData);
```

- receive:接收消息。

```java
// 接收来自默认队列的消息
Message receive();
// 接收来自指定队列的消息
Message receive(String queueName);
// 从默认队列接收消息,如果在指定的超时时间内没有接收到消息,则返回 null
Message receive(long timeout);
// 从指定的队列接收消息,如果在指定的超时时间内没有接收到消息,则返回 null
Message receive(String queueName, long timeout);
```

- receiveAndConvert:接收消息并转换。

```java
// 从默认队列接收消息,并将其转换为 Java 对象。如果队列中没有消息,返回 null
Object receiveAndConvert();
// 从指定的队列接收消息,并将其转换为 Java 对象
Object receiveAndConvert(String queueName);
// 从默认队列接收消息,并将其转换为 Java 对象。如果在指定的超时时间内没有接收到消息,则返回 null
Object receiveAndConvert(long timeout);
// 从指定的队列接收消息,并将其转换为 Java 对象。如果在指定的超时时间内没有接收到消息,则返回 null
Object receiveAndConvert(String queueName, long timeout);
```

- convertSendAndReceive:用于在发送消息后接收响应消息。convertSendAndReceive 方法提供了一种简便的方法来实现请求-响应(RPC)的消息传递模式。

```java
/**
 * 将消息发送到默认的交换机和路由键,并等待响应消息。该方法会将发送的消息对象转换为 Message,
 * 并将接收到的响应消息转换为相应的 Java 对象。
 */
Object convertSendAndReceive(Object message);
/**
 * 将消息发送到默认的交换机,并使用指定的路由键,等待响应消息。接收到的响应消息对象 (Object)。
 * 如果没有响应,返回 null
 */
Object convertSendAndReceive(String routingKey, Object message);
/**
 * 将消息发送到指定的交换机和路由键,并等待响应消息。如果没有响应,返回 null
 */
Object convertSendAndReceive(String exchange, String routingKey, Object message);
/**
 * 将消息发送到指定的交换机和路由键,并在发送之前通过 MessagePostProcessor 对消息进行处理,等待响应消息。
 * 如果没有响应,返回 null
 */
Object convertSendAndReceive(String exchange, String routingKey, Object message, MessagePostProcessor messagePostProcessor);
```

- sendAndReceive:发送消息并接收响应,用于实现请求-响应(RPC)模式。

```java
/**
 * 将消息发送到默认的交换机和路由键,并等待响应消息。方法将发送的消息对象转换为 Message,\
 * 并将接收到的响应消息转换为相应的 Java 对象。如果没有响应,返回 null。
 */
Object convertSendAndReceive(Object message);
/**
 * 将消息发送到默认的交换机,并使用指定的路由键,等待响应消息。如果没有响应,返回 null。
 */
Object convertSendAndReceive(String routingKey, Object message);
/**
 * 将消息发送到指定的交换机和路由键,并等待响应消息。如果没有响应,返回 null。
 */
Object convertSendAndReceive(String exchange, String routingKey, Object message);
/**
 * 将消息发送到指定的交换机和路由键,并在发送之前通过 MessagePostProcessor 对消息进行处理,等待响应消息。
 * 如果没有响应,返回 null。
 */
Object convertSendAndReceive(String exchange, String routingKey, Object message, MessagePostProcessor messagePostProcessor);
```

- execute:用于执行一些需要直接与 RabbitMQ 通信的操作。

```java
/**
 * 使用提供的 ChannelCallback 执行自定义的 RabbitMQ 操作。此方法提供对底层 com.rabbitmq.client.Channel
 * 对象的直接访问,使用户可以执行低级别的操作。
 */
<T> T execute(ChannelCallback<T> action);
/**
 * 使用提供的 OperationsCallback 执行自定义的 RabbitMQ 操作。此方法提供了更高级别的操作接口,
 * 允许在 RabbitTemplate 上执行复杂的操作。
 */
<T> T execute(RabbitOperations.OperationsCallback<T> action);
```

#### 3.2.1 添加 spring-boot-starter-amqp 依赖

```groovy
implementation 'org.springframework.boot:spring-boot-starter-amqp'
```

#### 3.2.2 定义 springBoot 配置文件

```yaml
# application.yml
spring:
  rabbitmq:
    username: test # 用户名
    password: test # 密码
    port: 5672 # 端口
    host: 192.168.98.128 # 连接主机
    virtual-host: VHOST # 连接虚拟主机
```

#### 3.2.3 定义 RabbitMQ 配置类

```java
package com.fly.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    /**
     * 声明队列,RabbitTemplate 发送的队列如果不存在并不会创建队列,因此需要预先定义
     *
     * @return Queue
     */
    @Bean
    public Queue demoQueue() {
        /**
         * Queue提供多个构造方法,其中完整的构造方法为Queue(String name, boolean durable, boolean exclusive, boolean autoDelete):
         * - name:队列名称。
         * - durable:指定队列是否是持久化。如果设置为 true,队列会在 RabbitMQ 服务器重启后仍然存在。
         * 如果设置为 false,队列会在服务器重启后被删除(即临时队列)。默认值为 false。
         * - exclusive:指定队列是否是排他的。如果设置为 true,队列只能被声明它的连接使用,并在连接关闭时自动删除。默认值为 false。
         * - autoDelete:指定队列是否是自动删除的。如果设置为 true,当队列不再被使用时会自动被删除。默认值为 false。
         */
        return new Queue("test", true, false, false);
    }
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        return template;
    }
}
```

#### 3.2.4 通过 API 方式消费消息

```java
package com.fly;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.UnsupportedEncodingException;

/**
 * @Description 发送消息并消费消息
 * @Author zchengfeng
 * @Date 2023/3/22 18:19
 */
@SpringBootTest(classes = Application.class)
public class SendAndReceiveTest {

    @Autowired
    RabbitTemplate rabbitTemplate;

    /**
     * 发送消息
     */
    @Test
    public void sendMessageTest() {
        // 发送消息,send()提供路由key和消息实体两个参数
        rabbitTemplate.send("test", new Message("hello!".getBytes()));
    }

    /**
     * 接收消息
     */
    @Test
    public void receiveMessageTest() throws UnsupportedEncodingException {
        // 接收消息,参数为队列名称
        Message message = rabbitTemplate.receive("test");
        String messageBody = new String(message.getBody(), "UTF-8");
        System.out.println("message body:" + messageBody);
        System.out.println("message properties:" + message.getMessageProperties());
    }
}
```

#### 3.2.5 通过注解方式消费消息

Spring AMQP 提供了@RabbitListener 注解用于在 Spring Boot 应用程序中声明一个方法作为消息监听器,用于从指定的队列接收和处理消息。@RabbitListener 注解常用属性如下:

- queues:指定要监听的队列的名称数组,可以监听多个队列。
- containerFactory:指定要使用的消息监听容器工厂的名称。在配置文件中配置多个容器工厂时,可以用此属性指定使用哪个容器工厂。
- id:给监听器一个唯一的 ID,用于在应用程序中标识该监听器。
- concurrency:设置并发消费者的数量,表示可以同时处理多少个消息。
- ackMode:指定消息确认模式。可以是 AcknowledgeMode.NONE、AcknowledgeMode.AUTO 或 AcknowledgeMode.MANUAL。
- autoStartup:指定是否在启动时自动启动监听器,默认为 true。

```java
package com.fly.handler;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;

@Component
public class ReceiveHandler {
    /**
     * 监听队列
     * @param msg 表示接收到的消息体
     * @param message 消息实体,它包含了接收到的消息的详细信息,如消息体、属性、元数据等
     * @param channel 表示 AMQP 通道,可以通过它进行手动消息确认、拒绝等操作
     */
    @RabbitListener(queues = {"test"})
    public void receiveMessage(Object msg, Message message, Channel channel) throws UnsupportedEncodingException {
        System.out.println("message body:"+new String(message.getBody(),"UTF-8"));
    }
}

```
