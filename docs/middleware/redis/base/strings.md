## 1.基础篇

String 类型是 Redis 最基本的值类型,它是二进制安全的,且可以存储任意类型的数据,例如 JPEG 图像或序列化的 Java 对象。Redis 存储 String 类型时就检测存储值,例如 10086、-123 会被解释为整数(C 语言中的 Long 和 Int 类型),例如 1.23、-5.12 会被解释为浮点类型(C 语言的 Double 类型),例如"hello"、"one"会被解释为字符串类型。如果存储值是整数或浮点数并超过它们的限制范围,最终会被做为字符串存储,例如 123123123123123123123123123123 最终会被当做字符串存储,因为它超过了 long、int 类型容纳范围。Redis 存储整数时,允许执行 increment(自增)和 decrement(自减)操作,对于非整数类型执行 increment 或 decrement 时,会出现 ERR value is not an integer or out of range(ERR 值不是整数或超出范围)。 注意 String 值的最大长度为 512 MB。

**Redis 的 String 类型是由一个字节组成的序列,跟 Java 中的 ArrayList 类似,采用预分配冗余空间的方式来减少内存的频繁分配,String 类型内部使用 capacity(容量)表示当前字符串实际分配的空间,capacity 通常高于实际字符串的长度 len。当字符串小于 1MB 时,扩容时扩容容量是当前字符串的两倍;如果字符串超过 1MB,扩容时每扩容一次只会多扩容 1MB 的内存空间**。

Redis 以 K-V 的形式存储数据,使用 Redis Key 有以下几点注意事项:

- Redis Key 不宜过长。Redis 的 Key 是二进制安全的,意味着可以使用任何二进制序列作为 Redis 的 Key,当 Redis Key 过长时,会增加查询代价、消耗带宽、占用额外内存空间等问题。
- Redis key 也不宜过短,Redis Key 的命名要符合场景,良好的命名能提升可读性。虽然 Redis 的短 Key 会减少内存占用和带宽消耗,但往往需要根据业务场景进行取舍,推荐以业务标识 + key 名称作为最终存储 key。
- 当存储复杂的 Key 可以用特殊的符号分割。例如:user:100,又或者 id&1,通过这种特殊符号的分割,使得 Key 能存储更多有用的信息。
- Redis Key 允许的最大密钥大小为 512 MB。

### 1.1 Redis 数据库命令

Redis 是一个键值对数据库,无论是 String key、Hash Key 还是 List key,都会被存储到一个名为数据库的容器中,可以通过 Key 的名称对数据库中键值进行索引。默认情况下 Redis 分为 16 个数据库(0 到 15,默认将数据存储在第 0 个数据库)。Redis 不允许在同一个数据库下使用两个同名的 Key,但由于不同的数据库拥有不同的命名空间,所以在不同数据库中允许使用同名 Key。

| 命令                   | 描述                                                                                                                                                                                                                              | 时间复杂度                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| select db              | 切换数据库,默认情况下 Redis 分为 16 个数据库,所以的数据都被存储在第 0 个数据库中。例子: select 0 表示切换第一个数据库。                                                                                                           | O(1)                                 |
| dbsize                 | 返回当前数据库的 key 数量。                                                                                                                                                                                                       | O(1)                                 |
| move key db            | 将 key 移动到目标数据库(db),如果 key 不存在当前数据库,或目标数据库存在与 key 同名的键,则 move 命令将不做任何动作,只返回 0 表示移动失败。                                                                                          | O(1)                                 |
| flushdb [async\|sync]  | 清空当前数据库,async 表示以异步的方式清空当前数据库,sync 表示以同步的方式清空当前数据库。                                                                                                                                         | O(n),n 取决于 key 的数量             |
| flushall [async\|sync] | 清空所有数据库,async 表示以异步的方式清空所有数据库,sync 表示以同步的方式清空所有数据库。                                                                                                                                         | O(n),n 取决于所有数据库中 key 的数量 |
| swapdb                 | 互换数据库。swapdb 命令接收两个数据库号码作为输入,然后对指定的两个数据库进行互换,最后返回 OK 作为结果。swapdb 命令以非阻塞的方式交换两个数据库,执行速度非常快,而且也不会阻塞服务器,所以 swapdb 命令可以实现在线替换数据库的操作。 | O(1)                                 |

```shell
# 切换数据库
localhost:6379> select 1
OK
localhost:6379[1]> select 0
OK

# 设置键值对
localhost:6379> set k1 v1
OK
localhost:6379> set k2 v2
OK
# 返回当前数据库的key数量
localhost:6379> dbsize
(integer) 2

# 列出当前数据库所有key
localhost:6379> keys *
1) "k1"
2) "k2"
# 将k2移动到数据库1
localhost:6379> move k2 1
(integer) 1
localhost:6379> select 1
OK
localhost:6379[1]> keys *
1) "k2"
localhost:6379[1]>

# 清空数据库
localhost:6379[1]> flushdb ASYNC
OK
localhost:6379[1]> dbsize
(integer) 0

# 交换数据库
localhost:6379[1]> select 0
OK
localhost:6379> set k1 v1
OK
localhost:6379> select 1
OK
localhost:6379[1]> set k2 v2
OK
localhost:6379[1]> select 0
OK
localhost:6379> swapdb 0 1
OK
localhost:6379> keys *
1) "k2"
```

### 1.2 Redis Key 相关命令

| 命令                                                          | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 时间复杂度                                            |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| keys pattern                                                  | 返回数据库中与匹配符(pattern)相匹配的 Key 集合。全局匹配符: <br/> <li>\*:号用于匹配 0 个或多个任意字符。</li> <li>?:?号用于匹配单个字符。例 user_i?可以匹配 user_id、user_ip、user_im 等等。</li> <li>[]:[]用于匹配给定字符串中的单个字符。例如 user_i[abc]可以匹配 user_ia、user_id、user_ic,无法匹配 user_id、user_ie、user_i1。</li><li>[?-?]:用于匹配给定范围中的单个字符。例如:user_i[a-d]可以匹配 user_ia、user_ib、user_ic、user_id,无法匹配 user_ie、user_if。</li> | O(n),n 表示 key 的数量                                |
| scan cursor [MATCH pattern] [Count count] [Type type]         | SCAN 命令是 Redis 提供的一种迭代键空间的方式,用于替代旧的 KEYS 命令。SCAN 命令返回的是一个游标(cursor)和一批元素。cursor 表示当前游标,开始通常是 0。MATCH pattern 表示匹配指定模式的键。Count count 表示每次迭代返回的元素数量,避免一次性返回大量元素。TYPE type 用于过滤指定类型的键,如字符串、列表、哈希等。                                                                                                                                                              | O(n),n 表示游标每次返回的元素数量                     |
| sort key                                                      | sort 命令可以对列表元素、集合元素、有序集合元素进行排序。                                                                                                                                                                                                                                                                                                                                                                                                                   | O(n\*log(n)+m),n 为排序元素的数量,m 为命令返回的元素  |
| exists [key...]                                               | 判断一个 key 或多个 key 是否存在,返回存在的 key 数量。                                                                                                                                                                                                                                                                                                                                                                                                                      | 单个 key 为 O(1),多个 key 为 O(n),n 取决于 key 的数量 |
| type key                                                      | 返回 key 对应值的类型字符串。注意:由于 HyperLogLog 和位图(Bitmap)底层都是基于字符串键来实现的,所以 type 命令对于这两种类型都返回 string                                                                                                                                                                                                                                                                                                                                     | O(1)                                                  |
| rename key newkey                                             | 修改 key 名为 newkey,注意修改 key 名可能会覆盖 newkey                                                                                                                                                                                                                                                                                                                                                                                                                       | O(1)                                                  |
| renamenx key newkey                                           | 当 newkey 不存在时,修改 key 名为 newkey,如果 newkey 存在则修改失败。                                                                                                                                                                                                                                                                                                                                                                                                        | O(1)                                                  |
| del key [key...]                                              | 同步的删除多个 key                                                                                                                                                                                                                                                                                                                                                                                                                                                          | O(n),n 取决于 key 的数量                              |
| unlink key [key...]                                           | 以异步方式删除多个 key。del 命令删除 key 时,如果删除 key 非常大或 key 的数量非常多,那么服务器在删除过程中可能被阻塞。                                                                                                                                                                                                                                                                                                                                                       | O(n),n 取决于 key 的数量                              |
| set key value [EX seconds\|PX milliseconds\|KEEPTTL] [NX\|XX] | set 命令设置 key 对应的 value 值,EX 为过期时间(单位秒),PX 为过期时间(单位毫秒),NX 表示仅当 key 不存在时,set 才会生效,XX 表示仅当 key 存在时,set 才会生效。                                                                                                                                                                                                                                                                                                                  | O(1)                                                  |
| expire key seconds [NX\|XX\|GT\|LT]                           | 给 key 设置过期时间(单位秒),若 key 存在操作成功返回 1,若 key 不存在或操作失败返回 0。                                                                                                                                                                                                                                                                                                                                                                                       | O(1)                                                  |
| pexpire key milliseconds                                      | 给 key 设置过期时间(单位毫秒),与 expire 命令类似。                                                                                                                                                                                                                                                                                                                                                                                                                          | O(1)                                                  |
| expireat key timestamp                                        | 给 key 设置过期时间,参数是一个 unix 时间戳,与 expire 命令类似。                                                                                                                                                                                                                                                                                                                                                                                                             | O(1)                                                  |
| pexpireat key milliseconds-timestamp                          | 给 key 设置过期时间,参数是一个 unix(毫秒)时间戳。                                                                                                                                                                                                                                                                                                                                                                                                                           | O(1)                                                  |
| persist key                                                   | 移除 key 的过期时间,key 将持久保持,操作成功返回 1,否则返回 0。                                                                                                                                                                                                                                                                                                                                                                                                              | O(1)                                                  |
| pttl key                                                      | 以毫秒单位返回 key 的剩余过期时间,如果 key 不存在或已被删除返回-2,如果 key 无过期时间则返回-1。                                                                                                                                                                                                                                                                                                                                                                             | O(1)                                                  |
| ttl key                                                       | 以秒单位返回 key 的过期时间,类似 pttl 命名。                                                                                                                                                                                                                                                                                                                                                                                                                                | O(1)                                                  |
| set key value                                                 | 为 key 设置值,操作成功返回 1,否则返回 0                                                                                                                                                                                                                                                                                                                                                                                                                                     | O(1)                                                  |
| get key                                                       | 获取 key 对应的 value,如果 key 不存在则返回 nil。                                                                                                                                                                                                                                                                                                                                                                                                                           | O(1)                                                  |

```shell
# 设置键值对,key的过期时间为永久
localhost:6379> set k1 v1
OK
# 设置键值对,NX当指定key不存在时进行set,过期时间为1000000毫秒
localhost:6379> set k2 v2 NX PX 1000000
OK
# 设置键值对,XX表示仅当 key 存在时,set 才会生效,过期时间为1000000毫秒
localhost:6379> set k2 v2 XX PX 1000000
OK
# 获取key的类型
localhost:6379> type k1
string
localhost:6379> type k2
string
# 判断一个或多个key是否存在,返回存在的key数量
localhost:6379> exists k1
(integer) 1
localhost:6379> exists k1 k2
(integer) 2
# 修改key名
localhost:6379> rename k1 key1
OK
# 删除一个或多个key,返回删除key的数量
localhost:6379> del key1 k2
(integer) 2
localhost:6379> dbsize
(integer) 0


localhost:6379> set k1 v1
OK
localhost:6379> set k2 v2
OK
localhost:6379> set k_user1 v_user1
OK
localhost:6379> set k_user2 v_user2
OK
# 查看所有key
localhost:6379> keys *
1) "k_user2"
2) "k_user1"
3) "k1"
4) "k2"
# 查看匹配以k开头单个字符的所有key
localhost:6379> keys k?
1) "k1"
2) "k2"
# 查看匹配k_user从1到2范围内的所有key
localhost:6379> keys k_user[12]
1) "k_user2"
2) "k_user1"

# 迭代所有key,从游标0开始迭代
localhost:6379> scan 0
1) "0"
2) 1) "k_user2"
   2) "k2"
   3) "k_user1"
   4) "k1"
# 迭代所有key?(*表示匹配所有key),从游标0开始迭代,每次返回10个元素,
localhost:6379> scan 0 MATCH "*" COUNT 10
1) "0"
2) 1) "k_user2"
   2) "k2"
   3) "k_user1"
   4) "k1"
```

### 1.3 Redis String 结构命令

## 2.应用篇

- 分布式缓存。Redis 最为常见的应用场景就是作为分布式缓存,缓存机制是在不增加硬件设施且读多写少的前提下提升效率的最有效手段。在开发中缓存一般分为本地缓存(数据被缓存在单台机器上)和分布式缓存(数据可能被缓存在多台机器上),由于分布式缓存需要进行网络 IO 访问,而网络通常被认为是不可靠的,一旦网络出现波动,可能导致增加网络延迟。所以访问数据时优先读取本地缓存(本地缓存又被称为一级缓存),若未命中本地缓存时才会访问分布式缓存,分布式缓存是一个非常大的话题,包含缓存数据一致性问题(多级缓存一致性、数据库与缓存一致)、缓存穿透、缓存雪崩、缓存失效等等问题。
- 分布式锁。在并发编程中的锁机制用于解决多个线程(或协程)竞争多个资源问题,使其多个并行的线程(或协程)串行化访问资源,避免导致多个线程(或协程)操作资源而发生的数据安全问题。由于是编程语言提供的功能,无法应用于分布式环境,基于 Redis setnx 命令或 lua 脚本可以实现分布式环境下的锁机制。
- 计数器或分布式 ID 生成器。基于 String 类型 inc 和 decr 命令可以实现计数器,例如 ip 访问计数器、id 生成器等等。
- 限速器。为了保障系统的安全性和性能,并保证系统的重要资源避免滥用,应用程序通常会对用户的某些行为进行限制,例如:
  - 用户只能在 1 小时内调用 30 次接口,若调用次数超过 30 次则排队或拒绝服务。
  - 银行卡密码输错次数限制,如果一天之内银行卡密码输错 3 次,则银行卡被冻结,需要持卡人到营业厅或网点解封。
- 日志存储。String 类型的 append 命令可以向 key 追加内容,基于该特性可以实现日志存储。

### 2.1 基于 inc 实现分布式 ID 生成器

分布式 ID(分布式标识)通常是指在分布式系统中生成的唯一标识符或 ID。在分布式系统中,多个节点或组件可能同时生成标识符,因此需要一种机制来确保生成的 ID 在整个系统中是唯一的。INCR(Increment)是 Redis 中的一个原子递增命令,它用于将存储在指定键的整数值递增 1,借助 INCR 命令可以实现分布式 ID。当多个客户端同时使用相同的键进行递增操作时,由于 INCR 是原子操作,Redis 会确保递增的操作是互斥的,不会发生竞争条件,从而可以生成唯一的 ID。

```java
package com.fly.structure.string;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Objects;

IDGenerator.class:
/**
 * @Description 基于incr命令实现分布式ID
 * @Author zchengfeng
 * @Date 2024/2/25 22:11:10
 */
@Component
@AllArgsConstructor
public class IDGenerator {
    private RedisTemplate<String, Object> redisTemplate;
    private final static String PREFIX = "distributed::id";

    /**
     * 生成id
     *
     * @return 返回生成的id
     */
    public String generator() {
        /**
         * incr命令用于key存储的数字值增一,且具有原子性的,因此可以在分布式环境下保证生成的id是唯一的,
         * 可以调用increment(K key, long delta)方法指定delta设置id自增的步长
         */
        return Objects.requireNonNull(redisTemplate.opsForValue().increment(PREFIX)).toString();
    }

    /**
     * 生成id
     *
     * @param step id自增的步长
     * @return 返回生成的id
     */
    public String generator(int step) {
        return Objects.requireNonNull(redisTemplate.opsForValue().increment(PREFIX, step)).toString();
    }
}
```

IDGeneratorTest.class:

```java
package com.fly.structure.string;

import com.fly.RedisApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * @Description IDGenerator测试类
 * @Author zchengfeng
 * @Date 2024/2/25 22:39:02
 */
@SpringBootTest(classes = RedisApplication.class)
public class IDGeneratorTest {

    @Autowired
    private IDGenerator idGenerator;

    @Test
    public void generatorIdTest() {
        System.out.println("生成id:" + idGenerator.generator());
        System.out.println("生成id:" + idGenerator.generator(2));
    }
}

```

### 2.2 基于 INCR 命令实现计数器

由于 INCR、DECR 命令支持 key 对应数值的递增和递减操作,可以基于 INCR、DECR 命令实现计数器功能,例如 ip 计数器、访问次数计数器等等。

Counter.class:

```java
package com.fly.structure.string;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

/**
 * @Description 基于incr、decr命令计数器
 * @Author zchengfeng
 * @Date 2024/2/25 22:21:39
 */
@Component
@AllArgsConstructor
public class Counter {
    private final RedisTemplate<String, Object> redisTemplate;
    private final static String PREFIX = "ipCounter::";

    /**
     * 实现ip计数器
     *
     * @param ip ip地址
     * @return 返回指定ip的计数器
     */
    public Long ipCounter(String ip) {
        String key = PREFIX + ip;
        ValueOperations<String, Object> op = redisTemplate.opsForValue();
        // 判断redis是否存在计数器(key),如果不存在则将ip对应的计数器设置为1,否则使用incr命令计数器自增1
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            return op.increment(key, 1);
        }
        op.set(key, 1L);
        return 1L;
    }
}
```

Counter 测试类:

```java
package com.fly.structure.string;

import com.fly.RedisApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.security.SecureRandom;

/**
 * @Description Counter测试类
 * @Author zchengfeng
 * @Date 2024/2/25 22:38:29
 */
@SpringBootTest(classes = RedisApplication.class)
public class CounterTest {

    @Autowired
    private Counter counter;

    public static SecureRandom random = new SecureRandom();
    private final static String[] ipArr = {
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

    /**
     * 从指定ip列表中生成随机ip
     *
     * @param ipList ip列表
     * @return 生成随机ip
     */
    public static String getRandomIp(String[] ipList) {
        return ipList[random.nextInt(10)];
    }

    @Test
    public void ipCounterTest() {
        for (int i = 0; i < 30; i++) {
            String ip = getRandomIp(ipArr);
            // 获取ip对应的计数器
            Long count = counter.ipCounter(ip);
            System.out.println("ip:" + ip + "访问" + count + "次");
        }
    }
}
```

执行结果如下:

```txt
ip:210.40.121.40访问1次
ip:182.82.149.44访问1次
ip:139.214.204.146访问1次
ip:123.235.25.180访问1次
ip:222.22.181.244访问1次
ip:127.0.0.1访问1次
ip:222.22.181.244访问2次
ip:139.214.204.146访问2次
ip:182.82.149.44访问2次
ip:139.208.147.40访问1次
ip:222.22.181.244访问3次
ip:171.11.150.118访问1次
ip:139.208.147.40访问2次
ip:210.40.121.40访问2次
ip:139.214.204.146访问3次
ip:139.208.147.40访问3次
ip:139.214.204.146访问4次
ip:171.11.150.118访问2次
ip:210.40.121.40访问3次
ip:222.22.181.244访问4次
ip:182.82.149.44访问3次
ip:127.0.0.1访问2次
ip:123.234.241.63访问1次
ip:127.0.0.1访问3次
ip:222.22.181.244访问5次
ip:123.232.237.102访问1次
ip:222.22.181.244访问6次
ip:222.22.181.244访问7次
ip:123.232.237.102访问2次
ip:139.214.204.146访问5次
```

### 2.3 基于实现限速器

### 2.4 基于 append 命令实现日志追加

CommandAppender.class:

```java
package com.fly.structure.string;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;


/**
 * @Description 基于Redis append命令实现命令追加器
 * @Author zchengfeng
 * @Date 2024/2/25 23:30:42
 */
@Component
@AllArgsConstructor
public class CommandAppender {
    private final RedisTemplate<String, String> redisTemplate;
    private final static String PREFIX = "appender::";

    /**
     * 向指定命令组命令追加command
     *
     * @param groupName 命令组
     * @param command   命令
     */
    public void append(String groupName, String command) {
        // 判断分组名是否存在,若存在则使用append命令追加命令,否则通过set命令初始化命令
        if (Boolean.TRUE.equals(redisTemplate.hasKey(groupName))) {
            redisTemplate.opsForValue().append(groupName, command);
        } else {
            redisTemplate.opsForValue().set(groupName, command);
        }
    }

    public Object run(String groupName) {
        // 判断redis中是否存在指定分组名,不存在直接返回null,否则获取命令执行并返回结果
        if (Boolean.FALSE.equals(redisTemplate.hasKey(groupName))) {
            return null;
        }
        // 根据分组名获取所有命令
        String commands = redisTemplate.opsForValue().get(groupName);
        // ScriptEngineManager是Java中用于管理脚本引擎的类,用于在Java中嵌入各种脚本引擎,包括JavaScript、Python、Ruby等
        ScriptEngineManager manager = new ScriptEngineManager();
        // 获取JavaScript的ScriptEngine,注意JDK11后默认没有JavaScript引擎,需要引入JavaScript引擎依赖,例如引入nashorn引擎(nashorn-core)
        ScriptEngine engine = manager.getEngineByName("javascript");
        if (engine == null) {
            System.out.println("JavaScript engine not found");
            return null;
        }
        try {
            // 返回命令执行结果
            return engine.eval(commands);
        } catch (ScriptException e) {
            throw new RuntimeException(e);
        }
    }
}
```

CommandAppender 测试类:

```java
package com.fly.structure.string;

import com.fly.RedisApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * @Description CommandAppender测试类
 * @Author zchengfeng
 * @Date 2024/2/25 23:43:25
 */
@SpringBootTest(classes = RedisApplication.class)
public class CommandAppenderTest {
    @Autowired
    private CommandAppender commandAppender;

    @Test
    public void operationCommandTest() {
        String groupName = "JavaScript";
        commandAppender.append(groupName, "function add(a, b) { return a + b; }");
        commandAppender.append(groupName, "add(1,2)");
        final Object result = commandAppender.run(groupName);
        System.out.println("执行结果:" + result);
    }
}
```

执行结果如下:

```txt
执行结果:3.0
```

## 3.原理篇
