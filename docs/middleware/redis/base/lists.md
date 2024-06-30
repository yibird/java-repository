## 1.基础篇

Redis 列表是一种存储 string 类型的线性有序结构,可以按照元素被推入列表中的顺序来存储元素。由于 List 可以存储 string,List 不仅可以存储文字数据,又可以存储二进制数据。Redis 列表通常用于:

- 实现堆栈和队列。
- 为后台工作系统构建队列管理。

虽然基于 Redis 可以实现分布式队列,但是存在着如下问题:

- 无法保证可靠性:Redis 的设计目标是提供高性能、低延迟的分布式系统,无法保证强一致性和可靠性,某些情况下,Redis 可能会出现丢失消息,或者在出现故障时无法提供持久化保证。
- 缺少 MQ 的高级特性:相较于专业级 MQ,基于 Redis 实现分布式队列虽然简单,但是不支持 MQ 的高级特性,例如消息重试、消息路由、持久化消息等。

## 2.应用篇

### 2.1 基于 List 结构实现队列

队列(queue)是一种采用先进先出(FIFO)策略的线性结构,通过 LPUSH、RPUSH 命令添加队列元素(入队),通过 LPOP、RPOP 命令移除队列元素(出队),从而保证先入队的元素先出队,后入队的元素后出队,即使用 LPUSH 入队元素,用 RPOP 出队元素(也可以使用 RPUSH 入队元素,LPOP 出队元素)。

DistributedQueue.class:

```java
package com.fly.structure.list;

import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

/**
 * @Description 基于List结构实现分布式队列, 队列遵循先进先出原则, 即最先被添加的最先被删除
 * @Author zchengfeng
 * @Date 2024/2/26 00:00:17
 */
@Component
public class DistributedQueue<E> {
    private final RedisTemplate<String, Object> redisTemplate;
    private ListOperations<String, Object> listOperations;
    private final static String PREFIX = "queue::";


    /**
     * 队列名称,可能存在多个队列,使用队列名称区分,队列名称也会作为Redis List结构的key
     */
    private String queueName;

    public DistributedQueue(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setQueueName(String queueName) {
        this.queueName = PREFIX + queueName;
    }

    /**
     * 检查队列名是否为null,为null将抛出NullPointerException
     */
    public void checkQueueName() {
        if (queueName == null) {
            throw new NullPointerException("queueName is empty");
        }
    }

    /**
     * 获取ListOperations实例用于List结构,避免多次调用opsForList()
     * 获取ListOperations实例
     *
     * @return ListOperations实例
     */
    public ListOperations<String, Object> getListOperations() {
        if (listOperations != null) {
            return listOperations;
        }
        listOperations = redisTemplate.opsForList();
        return listOperations;
    }

    /**
     * 向队列尾部添加元素(入队),添加成功返回true,否则返回false
     *
     * @param e 被添加元素
     * @return 添加结果
     */
    public boolean add(E e) {
        checkQueueName();
        try {
            getListOperations().leftPush(queueName, e);
        } catch (Exception ex) {
            return false;
        }
        return true;
    }

    /**
     * 从队列头部删除元素(出队),remove与poll()的区别在于,如果此队列为空,则抛出异常。
     *
     * @return 被删除的元素
     */
    public E remove() {
        if (size() == 0) {
            throw new NoSuchElementException();
        }
        return (E) getListOperations().rightPop(queueName, 1);
    }

    /**
     * 删除队列第一个元素并返回该元素,如果此队列为空,则返回null。
     *
     * @return 返回队列的头部元素
     */
    public E poll() {
        if (size() == 0) {
            return null;
        }
        return (E) getListOperations().rightPop(queueName);
    }

    /**
     * 删除队列最后一个元素并返回该元素,如果此队列为空,则返回null。
     *
     * @return 返回队列的尾部元素
     */
    public E peek() {
        if (size() == 0) {
            return null;
        }
        return (E) getListOperations().leftPop(queueName);
    }

    /**
     * 获取队列中所有元素。range start stop命令用于获取指定范围的元素,
     * 当stop为-1时表示获取至队列末尾。
     *
     * @return 队列中所有元素
     */
    public List<E> getItems() {
        checkQueueName();
        return (List<E>) getListOperations().range(queueName, 0, -1);
    }

    /**
     * 清除队列中所有元素。LTRIM key start stop用于修剪list中start至stop的元素,
     * 如果start大于stop就可以达到清除所有元素的效果
     */
    public void clear() {
        checkQueueName();
        getListOperations().trim(queueName, 1, 0);
    }


    /**
     * 获取队列的长度
     *
     * @return 队列的长度
     */
    public Long size() {
        checkQueueName();
        return getListOperations().size(queueName);
    }
}
```

DistributedQueue 测试类:

```java
package com.fly.structure.list;

import com.fly.RedisApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

/**
 * @Description DistributedQueue测试类
 * @Author zchengfeng
 * @Date 2024/2/26 00:26:08
 */
@SpringBootTest(classes = RedisApplication.class)
public class DistributedQueueTest {
    @Autowired
    private DistributedQueue<Object> queue;

    @Test
    public void queueTest() {
        queue.setQueueName("queue01");
        queue.add("element01");
        queue.add("element02");
        queue.add("element03");
        queue.add("element04");
        System.out.println("size:" + queue.size());
        // 出队操作,获取队头元素
        System.out.println("队头元素:" + queue.poll());
        System.out.println("size:" + queue.size());
        // 出队操作,获取队尾元素
        System.out.println("队尾元素:" + queue.peek());
        // 获取队列中所有元素
        List<Object> items = queue.getItems();
        for (Object item : items) {
            System.out.println("element:" + item);
        }
        // 清除所有元素
        queue.clear();
        System.out.println("size:" + queue.size());
    }
}
```

执行结果如下:

```java
size:4
队头元素:element01
size:3
队尾元素:element04
element:element03
element:element02
size:0
```

### 2.2 基于 List 结构实现阻塞队列

阻塞队列相较于普通队列,其区别在于当队列已满时,向队列插入元素将被阻塞,直到队列有空闲空间;当队列为空时,向队列删除元素时将被阻塞,直到队列中有可用元素。在 Redis 可以基于 BLPOP、BRPOP 命令从左端或右端阻塞地获取元素实现阻塞队列。当获取元素时,如果队列为空,则会阻塞等待,直到队列中有元素。

### 2.3 基于 List 结构实现栈

栈是遵守后进后出的线性结构,添加元素的操作被称为入栈,移除元素的操作被称为出栈。通过 list 结构的 LPUSH 和 LPOP 或 RPUSH 和 RPOP 命令可以实现入栈和出栈操作,LPUSH 和 RPUSH 命令用于分别向列表左端或右端添加元素,LPOP 和 RPOP 命令用于移除分别列表的最左端或最右端元素(即移除栈顶元素)。

## 3.原理篇
