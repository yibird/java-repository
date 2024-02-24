## 1.基础篇

String 类型是 Redis 最基本的值类型,它是二进制安全的,且可以存储任意类型的数据,例如 JPEG 图像或序列化的 Java 对象。Redis 存储 String 类型时就检测存储值,例如 10086、-123 会被解释为整数(C 语言中的 Long 和 Int 类型),例如 1.23、-5.12 会被解释为浮点类型(C 语言的 Double 类型),例如"hello"、"one"会被解释为字符串类型。如果存储值是整数或浮点数并超过它们的限制范围,最终会被做为字符串存储,例如 123123123123123123123123123123 最终会被当做字符串存储,因为它超过了 long、int 类型容纳范围。Redis 存储整数时,允许执行 increment(自增)和 decrement(自减)操作,对于非整数类型执行 increment 或 decrement 时,会出现 ERR value is not an integer or out of range(ERR 值不是整数或超出范围)。 注意 String 值的最大长度为 512 MB。

**Redis 的 String 类型是由一个字节组成的序列,跟 Java 中的 ArrayList 类似,采用预分配冗余空间的方式来减少内存的频繁分配,String 类型内部使用 capacity(容量)表示当前字符串实际分配的空间,capacity 通常高于实际字符串的长度 len。当字符串小于 1MB 时,扩容时扩容容量是当前字符串的两倍;如果字符串超过 1MB,扩容时每扩容一次只会多扩容 1MB 的内存空间**。

Redis 以 K-V 的形式存储数据,使用 Redis Key 有以下几点注意事项:

- Redis Key 不宜过长。Redis 的 Key 是二进制安全的,意味着可以使用任何二进制序列作为 Redis 的 Key,当 Redis Key 过长时,会增加查询代价、消耗带宽、占用额外内存空间等问题。
- Redis key 也不宜过短,Redis Key 的命名要符合场景,良好的命名能提升可读性。虽然 Redis 的短 Key 会减少内存占用和带宽消耗,但往往需要根据业务场景进行取舍,推荐以业务标识 + key 名称作为最终存储 key。
- 当存储复杂的 Key 可以用特殊的符号分割。例如:user:100,又或者 id&1,通过这种特殊符号的分割,使得 Key 能存储更多有用的信息。
- Redis Key 允许的最大密钥大小为 512 MB。

## 2.应用篇

- 分布式缓存。Redis 最为常见的应用场景就是作为分布式缓存,缓存机制是在不增加硬件设施且读多写少的前提下提升效率的最有效手段。在开发中缓存一般分为本地缓存(数据被缓存在单台机器上)和分布式缓存(数据可能被缓存在多台机器上),由于分布式缓存需要进行网络 IO 访问,而网络通常被认为是不可靠的,一旦网络出现波动,可能导致增加网络延迟。所以访问数据时优先读取本地缓存(本地缓存又被称为一级缓存),若未命中本地缓存时才会访问分布式缓存,分布式缓存是一个非常大的话题,包含缓存数据一致性问题(多级缓存一致性、数据库与缓存一致)、缓存穿透、缓存雪崩、缓存失效等等问题。
- 分布式锁。在并发编程中的锁机制用于解决多个线程(或协程)竞争多个资源问题,使其多个并行的线程(或协程)串行化访问资源,避免导致多个线程(或协程)操作资源而发生的数据安全问题。由于是编程语言提供的功能,无法应用于分布式环境,基于 Redis setnx 命令或 lua 脚本可以实现分布式环境下的锁机制。
- 计数器或分布式 ID 生成器。基于 String 类型 inc 和 decr 命令可以实现计数器,例如 ip 访问计数器、id 生成器等等。
- 限速器。为了保障系统的安全性和性能,并保证系统的重要资源避免滥用,应用程序通常会对用户的某些行为进行限制,例如:
  - 用户只能在 1 小时内调用 30 次接口,若调用次数超过 30 次则排队或拒绝服务。
  - 银行卡密码输错次数限制,如果一天之内银行卡密码输错 3 次,则银行卡被冻结,需要持卡人到营业厅或网点解封。
- 日志存储。String 类型的 append 命令可以向 key 追加内容,基于该特性可以实现日志存储。

### 2.1 基于 inc 和 decr 命令实现计数器

```java
package com.fly.test.base;

import com.fly.AppStart;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.junit4.SpringRunner;

import java.security.SecureRandom;

@SpringBootTest(classes = AppStart.class)
@RunWith(SpringRunner.class)
public class StringTest {

    public static String[] ipArr = {
        "127.0.0.1",
        "171.11.150.118",
        "139.214.204.146",
        "182.82.149.44",
        "222.22.181.244",
        "123.234.241.63",
        "123.232.237.102",
        "123.235.25.180",
        "139.208.147.40",
        "210.40.121.40"
        };

    public static SecureRandom random = new SecureRandom();

    @Autowired
    RedisTemplate redisTemplate;

    // 随机生成ip
    public static String getRandomIp() {
        return ipArr[random.nextInt(10)];
    }

    /**
    * ID生成器,如果key存在则通过inc命令自增1,否则设置一个key,初始值为0。
    */
    @Test
    public void idGenerator() {
        String key = "user_id";
        ValueOperations op = redisTemplate.opsForValue();
        if (redisTemplate.hasKey(key)) {
            op.increment(key);
        } else {
            op.set(key, 0);
        }
    }

    /**
    * ip计数器,以访问ip作为key,value为访问次数,当key不存在时设置1作为初始值,
    * 若存在key则通过inc命令自增1,每次自增前都需要判断访问次数是否大于访问阈值,
    * 若大于访问阈值则拒绝访问。注意:以访问ip作为key的方式可能会生成大量key,
    * 不易管理且性能消耗高,因为每次生成key Redis都需要进行内存分配,一般推荐将ip
    * 以hashMap存储,ip地址为hashKey,访问次数为value,这样可以避免大量key内存分配。
    */
    @Test
    public void ipCounter() {
        ValueOperations op = redisTemplate.opsForValue();
        for (int i = 0; i < 1000; i++) {
            String key = getRandomIp();
            if (redisTemplate.hasKey(key)) {
                // 访问次数大于20次则拒绝服务或排队
                if ((int) op.get(key) > 20) {
                    System.out.println("ip:" + key + "超出访问次数,拒绝服务!");
                    return;
                }
                // 每访问一次+1
                op.increment(key);
            } else {
                op.set(key, 1);
            }
        }
    }
}

```

### 2.2 基于实现限速器

### 2.2 基于 append 命令实现日志追加

## 3.原理篇
