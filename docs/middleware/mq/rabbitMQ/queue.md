## 队列 TTL

队列 TTL(Time-To-Live)是 RabbitMQ 中一个重要的队列属性,用于设置队列的过期时间。RabbitMQ 根据队列的 TTL 值会自动删除过期的空闲队列,即超过 TTL 时间后没有消费者监听且队列中没有消息的队列会被自动删除。设置合理的队列 TTL 可以避免队列暴增、消息堆积。队列过期后,需要重新声明才可使用,已有消息会被丢弃。所以队列 TTL 主要用于避免空闲队列积攒。队列 TTL 有以下两种方式:

- 设置队列的 TTL。
- 设置消息的 TTL。
  如果设置了队列的 TTL 属性,那么一旦消息过期,就会被队列丢弃,而第二种方式,消息即使过期,也不一定会被马上丢弃,因为消息是否过期是在即将投递到消费者之前判定的,如果当前队列有严重的消息积压情况,则已过期的消息也许还能存活较长时间。

### 设置队列 TTL

可以设置队列 x-expires 参数指定队列的 TTL(单位为毫秒,TTL 必须是一个正整数),RabbitMQ 保证,如果在过期时间内未使用该队列,则该队列将被删除,但不保证过期期限过后队列将如何及时删除。

```java
package com.fly.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class TTLQueue {
    @Bean
    public Queue ttlQueue() {
        Map<String, Object> arguments = new HashMap<>();
        // 设置队列中的消息过期时间为30分钟,如果在指定过期时间未消费,RabbitMQ会自动删除过期消息
        arguments.put("x-expires",10000);
        return QueueBuilder
                // 声明一个持久化队列
                .durable("ttl_queue")
                // 设置声明队列的参数
                .withArguments(arguments).build();
    }
}
```

### 设置消息 TTL

设置消息 TTL 分为设置队列 TTL 和消息 TTL:

- 设置队列 TTL:在声明队列时指定 x-message-ttl 参数设置队列中消息的过期时间,单位是毫秒。这种方式会作用于队列中的每条消息。

```java
package com.fly.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class TTLQueue {
    @Bean
    public Queue ttlQueue() {
        Map<String, Object> arguments = new HashMap<>();
        // 设置队列中的消息过期时间为30分钟,如果在指定过期时间未消费,RabbitMQ会自动删除过期消息
        arguments.put("x-message-ttl",1800000);
        return QueueBuilder
                // 声明一个持久化队列
                .durable("ttl_queue")
                // 设置声明队列的参数
                .withArguments(arguments).build();
    }
}
```

- 设置消息 TTL:在发送消息时单独指定消息过期时间。这种方式仅会作用于当前发送的消息。

```java
// 消息属性
MessageProperties properties = new MessageProperties();
// 设置消息过期时间
properties.setExpiration("1800000");
Message message = new Message("hello!".getBytes(),properties);
rabbitTemplate.send("","ttl_queue",message);
```

注意:如果同时设置队列 TTL 和消息 TTL,则优先使用 TTL 时间最小的值。

## 死信队列

死信队列(Dead Letter Queue,DLQ)是一种在消息中间件中常见的概念,用于处理无法被正常消费的消息。当消息无法被消费时,它会被发送到死信队列中,以便后续进行分析、处理或重新处理。死信队列常用于防止业务数据丢失,例如当消息消费异常时,将消息投入死信队列中,后续通过定时任务或者人工干预进行手动消费,又例如用户下单后指定时间未支付自动失效。死信队列产生的原因如下:

- 消息 TTL 过期。
- 队列达到最大长度,无法将消息投递到队列。
- 消息被拒绝(basic.reject 或 basic.nack)并且 requeue=false。

### 定义队列配置类

DeadQueueConfig 中分别定义了普通和死信相关的队列、交换机、路由 key,并声明了队列与交换机的绑定关系。普通队列绑定普通交换机,当生产者向普通交换机投递消息时,交换机会根据路由 key 将消息投递到有绑定关系的队列中。在普通队列声明中通过 x-dead-letter-exchange 设置队列的死信交换机,当出现消息过期、消费失败或队列已满等情况导致消息无法被正常消费时,普通队列会将消息路由至 x-dead-letter-routing-key 设置的死信路由 key。由于死信队列与死信交换机设置了绑定关系,消息最终会被路由至死信队列中,以便后续通过定时任务或者人工干预进行手动消费。

```java
package com.fly.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * 死信队列配置
 */
@Configuration
public class DeadQueueConfig {
    // 普通队列
    public static final String NORMAL_QUEUE = "normal_queue";
    // 普通交换机
    public static final String DEAD_QUEUE = "dead_queue";
    // 死信队列
    public static final String NORMAL_EXCHANGE = "normal_exchange";
    // 死信交换机
    public static final String DEAD_EXCHANGE = "dead_exchange";
    // 普通交换机和普通队列的路由key
    public static final String NORMAL_ROUTING_KEY = "normal-routing-key";
    // 死信交换机和死信队列的路由key
    public static final String DEAD_ROUTING_KEY = "dead-routing-key";

    /**
     * 声明普通队列。当普通队列中出现消息过期、消费失败或队列已满等情况导致消息无法被正常消费
     * 时,消息会被投递到死信队列中,以便后续通过定时任务或者人工干预进行手动消费。
     *
     * @return Queue
     */
    @Bean
    public Queue normalQueue() {
        Map<String, Object> arguments = new HashMap<>();
        /**
         * 设置队列投递的死信交换机。队列中因为消息过期、消费失败或队列已满等情况导致
         * 消息无法被正常消费,此时消息会被投递到 x-dead-letter-exchange参数设置的
         * 死信交换机中,以便后续通过定时任务或者人工干预进行手动消费
         */
        arguments.put("x-dead-letter-exchange", DEAD_EXCHANGE);
        // 设置死信的路由key
        arguments.put("x-dead-letter-routing-key", DEAD_ROUTING_KEY);
        return QueueBuilder.durable(NORMAL_QUEUE)
                // 设置消息参数
                .withArguments(arguments).build();
    }


    /**
     * 声明死信队列
     *
     * @return Queue
     */
    @Bean
    public Queue deadQueue() {
        return QueueBuilder.durable(DEAD_QUEUE).build();
    }

    /**
     * 声明普通交换机
     *
     * @return DirectExchange
     */
    @Bean
    public DirectExchange normalExchange() {
        return new DirectExchange(NORMAL_EXCHANGE, true, false);
    }

    /**
     * 声明死信交换机
     *
     * @return DirectExchange
     */

    @Bean
    public DirectExchange deadExchange() {
        return new DirectExchange(DEAD_EXCHANGE, true, false);
    }


    /**
     * 声明普通队列和普通交换机的绑定关系。向交换机发送消息时,交换机会根据路由key将消息
     * 转发至有绑定关系的队列中
     *
     * @return Binding
     */
    @Bean
    public Binding normalBinding() {
        return BindingBuilder.bind(normalQueue()).to(normalExchange())
                // 设置路由key
                .with(NORMAL_ROUTING_KEY);
    }

    /**
     * 声明死信队列和死信交换机的绑定关系
     *
     * @return Binding
     */
    @Bean
    public Binding deadBinding() {
        return BindingBuilder.bind(deadQueue()).to(deadExchange())
                // 设置路由key
                .with(DEAD_ROUTING_KEY);
    }
}
```

### 消息过期消息被投递到死信队列

模拟死信队列消息过期的场景,在 runner()方法中向普通队列发送 10 条消息,由于没有消费者消费,因此 10s 后消息会被投递到死信队列中。

```java
package com.fly;

import com.fly.config.DeadQueueConfig;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DeadQueueApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeadQueueApplication.class);
    }

    /**
     * 模拟死信队列 消息过期的场景,向普通队列发送10条消息,由于没有消费者消费,
     * 因此10s后消息会被投递到死信队列中。
     *
     * @param rabbitTemplate
     * @return
     */
    @Bean
    public ApplicationRunner runner(RabbitTemplate rabbitTemplate) {

        return args -> {
            MessageProperties properties = new MessageProperties();
            // 设置消息过期时间
            properties.setExpiration("10000");
            for (int i = 0; i < 10; i++) {
                rabbitTemplate.send(DeadQueueConfig.NORMAL_EXCHANGE,
                        DeadQueueConfig.NORMAL_ROUTING_KEY,
                        new Message("hello!".getBytes(), properties)
                );
            }
        };
    }
}
```

### 队列已满消息被投递到死信队列

RabbitMQ 支持`x-max-length`设置队列的最大长度,向队列投递消息时,当队列到达最大长度,消息会被投递至死信队列中。

```java
@Bean
public Queue normalQueue() {
    Map<String, Object> arguments = new HashMap<>();
    /**
     * 设置队列投递的死信交换机。队列中因为消息过期、消费失败或队列已满等情况导致
     * 消息无法被正常消费,此时消息会被投递到 x-dead-letter-exchange参数设置的
     * 死信交换机中,以便后续通过定时任务或者人工干预进行手动消费
     */
    arguments.put("x-dead-letter-exchange", DEAD_EXCHANGE);
    // 设置死信的路由key
    arguments.put("x-dead-letter-routing-key", DEAD_ROUTING_KEY);
    // 设置队列最大长度
    arguments.put("x-max-length",5);
    return QueueBuilder.durable(NORMAL_QUEUE)
            // 设置消息参数
            .withArguments(arguments).build();
}
```

```java
package com.fly;

import com.fly.config.DeadQueueConfig;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DeadQueueApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeadQueueApplication.class);
    }

    /**
     * 模拟死信队列 消息过期的场景,向普通队列发送10条消息,由于没有消费者消费,
     * 因此10s后消息会被投递到死信队列中。
     *
     * @param rabbitTemplate
     * @return
     */
    @Bean
    public ApplicationRunner runner(RabbitTemplate rabbitTemplate) {

        return args -> {
            // 设置消息过期时间
            for (int i = 0; i < 10; i++) {
                rabbitTemplate.send(DeadQueueConfig.NORMAL_EXCHANGE,
                        DeadQueueConfig.NORMAL_ROUTING_KEY,
                        new Message("hello!".getBytes())
                );
            }
        };
    }
}
```

例如设置队列最大长度为 5,生产者向队列投递 10 条消息,会导致剩下 5 条消息无法投递成功,这 5 条消息将被投递到死信队列中。

### 消费被拒绝消息被投递到死信队列

```java
package com.fly;

import com.fly.config.DeadQueueConfig;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.IOException;

@SpringBootApplication
public class DeadQueueApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeadQueueApplication.class);
    }

    /**
     * 模拟死信队列 消息过期的场景,向普通队列发送10条消息,由于没有消费者消费,
     * 因此10s后消息会被投递到死信队列中。
     *
     * @param rabbitTemplate
     * @return
     */
    @Bean
    public ApplicationRunner runner(RabbitTemplate rabbitTemplate) {

        return args -> {
            // 设置消息过期时间
            for (int i = 0; i < 10; i++) {
                MessageProperties properties = new MessageProperties();
                // 设置消息id
                properties.setMessageId(i + "");
                rabbitTemplate.send(DeadQueueConfig.NORMAL_EXCHANGE,
                                    DeadQueueConfig.NORMAL_ROUTING_KEY,
                                    new Message("hello!".getBytes(), properties)
                                   );
            }
        };
    }

    /**
     * 消息消费者
     *
     * @param message 消息
     * @param channel 信道
     */
    @RabbitListener(queues = {DeadQueueConfig.NORMAL_QUEUE})
    public void handler(Message message, Channel channel) throws IOException {
        // 获取消息id
        int messageId = Integer.parseInt(message.getMessageProperties().getMessageId());
        // 获取消息投递标签
        long deliveryTag = message.getMessageProperties().getDeliveryTag();

        // 对消息id为偶数的消息处理失败
        if (messageId % 2 == 0) {
            // 消息处理失败不重试,只处理当前投递的消息
            channel.basicNack(deliveryTag, false, false);
        } else {
            // 消息处理成功
            channel.basicAck(deliveryTag, false);
        }
    }
}
```

向普通队列发送 10 条消息,消费者根据消息 id 决定消费情况,由于消息 id 为偶数的消息被消费拒绝,因此会有 5 条消息被投递到死信队列中,其他 5 条数据被手动应答,消费者应答后 RabbitMQ 会从队列中删除应答的消息。

### 消费死信队列

死信队列的作用是保证消费不正常的消息通过人工干预的方式正常消息,最常见的方式就是启动一个线程,定时的去手动消费死信队列中的消息。例如开启一个定时线程池,定时消费死信队列中的消息:

```java
package com.fly;

import com.fly.config.DeadQueueConfig;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.UnsupportedEncodingException;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class DeadQueueApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeadQueueApplication.class);
    }

    /**
     * 模拟死信队列 消息过期的场景,向普通队列发送10条消息,由于没有消费者消费,
     * 因此10s后消息会被投递到死信队列中。
     *
     * @param rabbitTemplate
     * @return
     */
    @Bean
    public ApplicationRunner runner(RabbitTemplate rabbitTemplate) {

        return args -> {
            MessageProperties properties = new MessageProperties();
            properties.setExpiration("3000");
            // 设置消息过期时间
            for (int i = 0; i < 10; i++) {
                rabbitTemplate.send(DeadQueueConfig.NORMAL_EXCHANGE,
                        DeadQueueConfig.NORMAL_ROUTING_KEY,
                        new Message(("hello" + i + "!").getBytes(), properties)
                );
            }

            // 创建一个核心线程为8的定时线程池
            ScheduledThreadPoolExecutor executor = new ScheduledThreadPoolExecutor(8);
            // 调度固定速率的任务,延迟执行时间为3000ms,每隔1000ms毫秒调度一次
            executor.scheduleAtFixedRate(() -> {
                Message message = rabbitTemplate.receive(DeadQueueConfig.DEAD_QUEUE);
                try {
                    System.out.println("message body:" + new String(message.getBody(),"UTF-8"));
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
            }, 3000, 1000, TimeUnit.MILLISECONDS);

        };
    }
}
```

## 延迟队列

延迟队列指的是消息进入队列后,不会立即被消费,而是在指定的时间后才能被消费,从而实现消息延迟处理的功能。延迟队列的主要应用场景是需要进行任务定时触发的情况,比如定时 30 分钟后投递邮件、短信、订单超时 30 分钟取消等。RabbitMQ 实现延迟队列的常用方式有两种:

- 基于 TTL(Time-To-Live)的延迟队列:可以在队列定义中设置 x-message-ttl 参数,用于指定消息的过期时间,单位是 ms。RabbitMQ 会根据这个属性自动删除过期的消息,从而实现延迟效果。
- 基于插件的延迟队列:比较典型的是 rabbitmq_delayed_message_exchange 插件,实现一个特殊的 Delayed Message Exchange。通过这个交换机发布消息,可以设置 headers 中的 x-delay 参数,来指定消息延迟时间。相比简单的 TTL 方式,使用延迟交换机插件可以更精确地控制消息延迟时间,且具备更强大的可靠性。

### 基于 TTL 实现延迟队列

由于 TTL 可以延迟指定时间使消息过期,当消息过期时消息将被投递到死信队列中,消费者可以一直消费死信队列,从而实现延迟队列。

### 基于插件实现延迟队列

rabbitmq_delayed_message_exchange 是一个 RabbitMQ 插件,可以实现延迟队列的功能。它的主要特点包括:

- 提供了一个新的交换机类型:x-delayed-message,可以实现消息延迟投递。
- 支持自定义的延迟时间,最小精度达到毫秒级。
- 延迟时间可以通过 AMQP Header 的 x-delay 字段设置,非常方便。
- 实现原理是交换机内部会 hold 住消息一段时间后再 route。
- 支持持久化,服务重启后仍可保证投递。
- 易用性高,使用简单。
  使用该插件可以便捷地实现订单超时、任务定时调度等需求。相比基于 TTL 的延迟队列,这个插件可以做到精确控制延时时间,性能也更加稳定。需要注意的是,该插件会占用更多服务器内存来 hold 消息。并且只适合少量消息的延迟场景。

- 安装并且启用:

```shell
mkdir /usr/local/rabbitmq-plugins
cd /usr/local/rabbitmq-plugins

# 下载rabbitmq-delayed-message-exchange插件
wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v3.12.0/rabbitmq_delayed_message_exchange-3.12.0.ez

# 下载的安装包需要存放在rabbit的plugins目录,由于使用docker启动rabbitmq,需要使用docker cp将本地安装包拷贝到rabbitmq容器内部
docker cp /usr/local/rabbitmq-plugins/rabbitmq_delayed_message_exchange-3.12.0.ez rabbitmq:/plugins

# 进入容器
docker exec -it rabbitmq /bin/bash

# 启用rabbitmq-delayed-message-exchange插件
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

- 定义延迟队列配置:

```java
package com.fly.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.CustomExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class DelayedQueueConfig {
    public static final String DELAYED_EXCHANGE_NAME = "delay.exchange";
    public static final String DELAYED_QUEUE_NAME = "delay.queue";
    public static final String DELAYED_ROUTING_KEY = "delay.routingkey";

    @Bean
    public Queue queue() {
        return new Queue(DELAYED_QUEUE_NAME);
    }

    /**
     * 自定义交换机
     * @return
     */
    @Bean
    public CustomExchange customExchange() {
        Map<String, Object> args = new HashMap<>();
        // 设置消息延迟类型为direct
        args.put("x-delayed-type", "direct");
        /**
         * 声明自定义交换机,构造函数如下:
         * - name:交换机名称。
         * - type:交换机类型、x-delayed-message表示一个延迟消息
         * - durable:是否将交换机设置为持久化。
         * - autoDelete:指定交换机是否是自动删除的。如果设置为 true,当交换机不再被使用时会自动被删除。默认值为 false。
         * - arguments:交换机的其他参数。
         */
        return new CustomExchange(DELAYED_EXCHANGE_NAME, "x-delayed-message", true, false, args);
    }

    /**
     * 定义队列和交换机的绑定关系
     * @param queue 队列
     * @param customExchange 自定义交换机
     * @return
     */
    @Bean
    public Binding bindingNotify(Queue queue, CustomExchange customExchange) {
        return BindingBuilder.bind(queue).to(customExchange).with(DELAYED_ROUTING_KEY).noargs();
    }
}
```

- 定义消息消费者:

```java
package com.fly.handler;

import com.fly.config.DelayedQueueConfig;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 延迟消息处理器
 */
@Component
public class DelayedMessageHandler {
    @RabbitListener(queues = {DelayedQueueConfig.DELAYED_QUEUE_NAME})
    public void handler(Message message, Channel channel) throws IOException {
        System.out.println("收到延迟消息,消息体:" + new String(message.getBody(), "UTF-8"));
        // 手动应答
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    }
}
```

- 定义消息发送者:

```java
package com.fly;

import com.fly.config.DelayedQueueConfig;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }

    @Bean
    public ApplicationRunner runner(RabbitTemplate rabbitTemplate) {
        return args -> {
            // 发送消息
            rabbitTemplate.convertAndSend(DelayedQueueConfig.DELAYED_EXCHANGE_NAME,
                    DelayedQueueConfig.DELAYED_ROUTING_KEY,
                    "hello!".getBytes(),
                    // 消息后置处理器
                    new MessagePostProcessor() {
                        @Override
                        public Message postProcessMessage(Message message) throws AmqpException {
                            // 设置消息的延迟时间
                            message.getMessageProperties().setDelay(10000);
                            return message;
                        }
                    }
            );
        };
    }
}
```

## 优先级队列

## 惰性队列

## 镜像队列
