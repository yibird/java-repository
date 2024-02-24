## 1.Redis 介绍

Redis 是一个基于 C 语言实现的内存存储的数据结构服务器,常用于非关系型数据库、高速缓存、消息队列代理。它支持字符串、哈希表、列表、集合、有序集合，位图，hyperloglogs 等数据结构。内置复制、Lua 脚本、LRU 收回、事务以及不同级别磁盘持久化功能,同时通过 Redis Sentinel 提供高可用,通过 Redis Cluster 提供自动分区。

### 1.1 Redis 特性

- 基于内存操作,性能极高。官方提供的基准测试单机 Redis 读的速度是 110000 次/s,写的速度是 81000 次/s。
- 支持丰富的数据结构。Redis 不仅支持简单的 Key-Value 类型的数据,同时也支持 Lists(列表)、Hashes(哈希)、Sets(集合)、Sorted sets(有序集合)、Bitmaps(位图)、Hyperloglogs(超日志,用于基数统计)、Geospatial indexes(地理空间索引,简称 GEO,用于地理位置经纬度存储与计算)、Streams(流)数据。
- 基于原子操作。Redis 采用单线程模型,它将每个命令都作为一个原子操作执行,因此 Redis 所有的命令都是原子性的,同时 Redis 事务还支持对多个操作合并后的原子性执行。
- Redis 支持事务、发布订阅(publish/subscribe)、Pipe(管道)等高级特性。
- 支持持久化。Redis 虽然基于内存操作,也支持 AOF、RDB、AOF+RDB 混合三种持久化方案。
- 支持高可用。Redis 支持主从复制、Redis Sentinel、Redis Cluster 三种集群模式保证高可用。

### 1.2 Redis 性能好的原因

- 基于内存操作,所以读写效率非常高。CPU、内存、磁盘是计算机的重要组成部分,处理速度从前往后排列(CPU 是内存的数千倍,甚至几万倍,内存是磁盘的数千倍),存储空间从前往后越来越大。Redis 对比非内存数据库,非内存数据库每次对数据的读写时都会进行 磁盘 IO 操作,而 IO 操作开销,耗时长。由于内存价格低廉,Redis 的瓶颈往往来自于 CPU、网络带宽等层面。
- Redis 采用非阻塞 IO、IO 多路复用网络模型,减少了线程切换时上下文的切换和竞争所带来的开销。
- Redis 采用了单线程模型,保证了每个操作的原子性,也减少了线程切换时上下文的切换和竞争所带来的开销。Redis 之所以采用单线程模型原因有如下三点:
  - 单线程模型比多线程模型简单,处理逻辑比较清晰。
  - 无需考虑各种锁问题保证线程安全,使用多线程可能会带来线程安全问题,一般通过加锁来解决线程安全问题,但加锁和释放锁的动作非常影响程序执行效率,而且还可能出现死锁。
  - 不存在多进程和多线程导致的切换而消耗 CPU。Redis 采用单线程模型,也意味着 Redis 无法充分利用 CPU,但可以增加 Redis Cluster 节点提升性能。
- Redis 存储结构多样化,不同的数据结构对数据存储进行了优化,从而有利于数据的存储与读取。
- Redis 采用自己实现的事件分离器,执行效率比较高,其内部采用了非阻塞的执行方式,吞吐能力比较大。

### 1.3 Redis、Memcached、Ehcache 常见缓存框架对比

Redis 常被用于分布式缓存等场景,Memcached、Ehcache 等主流缓存组件与 Redis 的区别如下:

- Memcached:Memcached 是一个基于内存的高性能、分布式 Key-Value 内存对象缓存系统,用于存储来自数据库调用、API 调用或页面呈现结果的任意数据(字符串、对象)的小块。
- Ehcache:Ehcache 是一个基于标准的开源缓存、可提高性能、卸载数据库并简化可扩展性。它是使用最广泛的基于 Java 的缓存，因为它健壮，经过验证，功能齐全，并与其他流行的库和框架集成。Ehcache 从进程内缓存一直扩展到具有 TB 级缓存的进程内/进程外混合部署。

|                | Ehcache            | Memcached                                                    | Redis                                                                                                                                                                                                                                                                                                                                           |
| -------------- | ------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 实现语言       | Java               | C                                                            | C                                                                                                                                                                                                                                                                                                                                               |
| 数据类型       | 不支持             | 不支持                                                       | 支持多种数据类型,如 String、List、Set、Hash、Sorted Set 等多种数据类型                                                                                                                                                                                                                                                                          |
| 支持客户端语言 | 仅支持 Java 客户端 | 支持 C/C++、PHP、 Java、Python、 Ruby、 Perl、Erlang、Lua 等 | 支持 ActionScript ActiveX/COM+ Bash Boomi C C# C++ Clojure Common Lisp Crystal D Dart Delphi Elixir emacs lisp Erlang Fancy gawk GNU Prolog Go Haskell Haxe Io Java Julia Kotlin Lasso Lua Matlab mruby Nim Node.js Objective-C OCaml Pascal Perl PHP PL/SQL Prolog Pure Data Python R Racket Rebol Ruby Rust Scala Scheme Smalltalk 等 30 多种 |

### 1.4 Redis 数据结构

Redis 支持多种数据类型结构,基本类型有字符串(String)、散列(Hashes)、列表(Lists)、集合(Sets)、有序集合(Sorted sets,简称 Zset),不常用类型有位数组(或者简单的位图,Bit arrays (or simply bitmaps))、HyperLogLogs(超日志)、Streams。

- String(字符串):二进制安全字符串。
- Lists(列表):根据插入顺序排序的一组元素的集合,它们基本上是链表。
- Sets(集合):元素唯一且未排序的集合。
- Sorted sets(有序集合):元素唯一且有序的集合,集合中的每个元素都与一个称为 score 的浮点数字值相关联,元素总是按它们的 score 排序,因此与 Sets 不同,可以检索一系列元素(例如,获取排行榜的前 10 名或后 10 名)。
- Hashes(哈希):是由与值关联的字段组成的映射。
- Bit arrays(位图):可以使用特殊命令像位数组一样处理字符串值:您可以设置和清除单个位,计数所有设置为 1 的位,找到第一个设置或未设置的位,等等。
- HyperLogLogs(超日志):这是一个概率数据结构,用于估计集合的基数。
- Streams(流):提供抽象日志数据类型的类地图项的仅追加集合。

### 1.4 Redis 版本历史

## 2.安装 Redis

### 2.1 Centos7 安装 Redis

- 下载 Redis7.x(目前最新稳定版为 7.0.2)安装包并上传到虚拟机(或服务器)。

```shell
# 安装方式1:从Redis官网下载安装包。地址:https://github.com/redis/redis/archive/7.0.2.tar.gz
# 安装方式2:通过wget下载Redis安装包
wget https://github.com/redis/redis/archive/7.0.2.tar.gz
```

- 解压安装包并编译 redis。

```shell
# (1).解压Redis安装包并进入解压后的目录
tar -xzvf 7.0.2.tar.gz && cd redis-7.0.2

# (2).安装gcc相关依赖。gcc即GNU编译器套件,GNU编译器套件包括C、C++、 Objective-C、 Fortran、Java、Ada和Go语言前端等编译器,由于Redis采用C语言进行开发,编译Redis依赖于gcc
yum install gcc-c++ autoconf automake

# (3).升级gcc编译器,默认情况下yum安装的gcc版本为4.8.5(可以通过 gcc -v 查看gcc版本),由于版本过低,在编译Redis时会报错
# (3-1).安装 scl 源
yum install -y centos-release-scl scl-utils-build
# (3.2) 安装9版本的gcc、gcc-c++、gdb工具链(toolchian)
yum install -y devtoolset-9-toolchain
# (3.3) 临时覆盖系统现有的gcc引用
scl enable devtoolset-9 bash
# (3.4) 查看 gcc 版本
gcc -v

# (4).编译。编译时会对运行环境和依赖进行检查
make

# (5).安装。安装分为默认安装和手动安装(推荐)
# (5.1) 默认安装
make install
# (5.2) 手动安装到指定目录。PREFIX用于指定redis安装目录的前缀
mkdir -p /usr/local/redis
make PREFIX=/usr/local/redis install

# (6).查看Redis安装后的文件,/usr/local/redis只包含一个bin目录
cd /usr/local/redis
cd bin

# bin目录下包含redis-benchmark、redis-check-rdb、redis-sentinel、redis-check-aof  redis-cli、redis-server几个文件,说明如下:
# redis-benchmark:redis基准测试文件。
# redis-check-rdb:redis rdb持久化方式文件。
# redis-sentinel:redis哨兵机制文件。
# redis-check-aof:redis aof持久化文件。
# redis-cli:redis 客户端文件。
# redis-server:redis服务文件。
```

- 启动 Redis Server。

```shell
# 从redis编译后的目录复制一份redis.conf(redis默认配置文件)到redis安装目录的bin目录下
cp /home/apple/package/redis-7.0.2/redis.conf /usr/local/redis/bin/

# 启动方式1:启用Redis服务,默认会使用redis提供redis.conf作为配置文件
./redis-server

# 启动方式2:启动redis-server指定redis配置文件(推荐)。
./redis-server redis.conf
```

- 使用 redis-cli 连接 Redis Server。redis-cli 是 Redis 的命令行客户端工具,用于与 Redis 服务器进行交互。通过 redis-cli,用户可以直接在命令行中执行 Redis 命令,查询和操作 Redis 数据库。

```shell
# 启动redis-cli方式1:默认启动。启动redis-cli后输入ping测试是否启动成功,出现PONG说明启动成功了
./redis-cli

# 启动redis-cli方式2:redis-cli除了默认启动外,还可以连接到指定服务器,只需通过-h参数指定redis-server服务器地址,-p参数指定redis-server的端口(默认6379),-a参数指定redis-serve的密码,例如 redis-cli -h 127.0.0.1 -p 6379
./redis-cli -h host -p port -a password
```

### 2.2 Redis 开机自启动配置

为了避免开关机频繁启动 Redis Server,可以设置开机自启动 Redis Server。

```shell
# (1).在系统服务目录中新建redis.service文件
vim /etc/systemd/system/redis.service

# 追加如下内容
[Unit]
Description=redis-server
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/redis/bin/redis-server /usr/local/redis/bin/redis.conf
PrivateTmp=true

[Install]
WantedBy=multi-user.target

# (2).重载系统服务
systemctl daemon-reload
# (2-1) 测试redis服务
systemctl start redis.service  # 启动redis服务
systemctl stop redis.service # 停止redis服务
systemctl restart redis.service # 重启redis服务
systemctl status redis.service # 重启redis服务

# (3).将redis.service服务加入开机自动启
systemctl enable redis.service
```

### 2.3 远程连接 Redis 服务

除了通过 redis-cli 连接 Redis 服务外,也可以通过图形化工具连接 Redis 服务。Redis 常用的图形化工具有 RedisInsight(Redis 官方图形化客户端)、Another Redis DeskTop Manager。远程连接 Redis 服务时需要注意 Redis 配置文件和防火墙两个步骤,否则将导致连接失败。redis.config 中需要修改三个配置(修改完毕后需重启 redis-server):

```text
(1).指定主机名或注释bind配置。redis.conf中有一个bind配置项,此配置项表示允许连接的主机host,默认是127.0.0.1(也就是本机访问),如果要远程访问则需要指定允许访问的主机名,或者将bind配置注释掉。

(2).将 protected-mode yes 配置修改为 protected-mode no,protected-mode表示是否启用保护模式,默认情况下启用保护模式,只有在以下情况下才应禁用它:第一您确定要让其他主机的客户端连接到Redis,即使未配置身份验证,也没有特定的接口集,第二使用"bind"指令显式列出。

(3).将 daemonize no 配置修改为 daemonize yes。daemonize表示是否以守护程序允许,如果daemonize为no 启动redis-server将会占用一个窗口
```

由于 Centos 防火墙配置可能导致无法远程连接 Redis Server,为此需要在防火墙开发 Redis 端口(默认端口 3306),防火墙配置如下:

```shell
# (1).查看已开放端口列表
firewall-cmd --list-ports

# (2).开启防火墙
systemctl start firewalld

# (3).防火墙开放6379端口,Redis默认端口为6379。--permanent表示永久生效,没有此参数重启机器后失效
firewall-cmd --zone=public --add-port=6379/tcp --permanent

# (4).重启防火墙
systemctl restart firewalld.service

# (5).验证6379端口是否开放
firewall-cmd --list-ports
```

## 3.Redis 客户端

Redis 支持 Java、Go、C#、C++等 50+多种客户,基本上涵盖了主流编程语言。在 Java 中最具代表性的 Redis 客户端有 Jedis、Lettuce、Redisson 等。除了 Jedis、Lettuce、Redisson 等客户端,SpringBoot 官方也提供了 `spring-boot-starter-redis` 依赖用于整合 Redis,`spring-boot-starter-redis` 内部集成了 Jedis、Lettuce(默认以 Lettuce 作为 Redis 客户端),Jedis 与 Lettuce 的切换仅需修改少量配置。

- Jedis:Jedis 是老牌的 Redis 的 Java 实现客户端,提供了比较全面的 Redis 命令的支持。用于 Jedis 使用阻塞的 I/O 模型,其方法调用都是同步的,程序流需要等到 sockets 处理完 I/O 才能执行,且不支持异步。Jedis 客户端实例不是线程安全的,需要通过连接池来保证 Jedis 实例安全。

- Lettuce(推荐):Lettuce 是一个高性能基于 Java 编写的 Redis 驱动框架( _[Jedis 与 Lettuce 基准测试](https://dzone.com/articles/redisson-pro-vs-jedis-which-is-faster)_),底层集成了 Project Reactor 提供天然的反应式编程,通信框架集成了 Netty 使用了非阻塞 IO,5.x 版本之后融合了 JDK1.8 的异步编程特性,在保证高性能的同时提供了十分丰富易用的 API,Lettuce 支持 Sentinel、群集、管道、自动重新连接和 Redis 数据模型等高级特性。Lettuce 支持同步异步两种通信模式(默认异步),且 API 是线程安全的,对于不是执行阻塞和事务操作,如 BLPOP 和 MULTI/EXEC,多个线程可以共享一个连接。

- Redisson(推荐):Redisson 是一个底层基于 Netty 具有内存数据网格(In-Memory Data Grid)功能的 Redis Java 客户端。它提供 Redis 复制、集群、哨兵、管道、自动重新连接等 Redis 高级特性,支持 Async(异步)、Reactive(反应式)、RxJava3 API。还提供了一系列的分布式的 Java 分布式对象、分布式数据结构、分布式锁和同步工具、诸多分布式服务、流行的编解码器。
  - Java 分布式对象:Object holder, Binary stream holder, Geospatial holder,BitSet(位图), AtomicLong, AtomicDouble,PublishSubscribe(发布订阅),Bloom filter(布隆过滤器), HyperLogLog。
  - 分布式数据结构:Map, Multimap、Set、List、SortedSet、ScoredSortedSet、LexSortedSet、Queue(队列)、Deque(双端队列)、Blocking Queue(阻塞队列)、Bounded Blocking Queue(有界阻塞队列)、Blocking Deque(阻塞双端队列)、Delayed Queue(延迟队列)、Priority Queue(优先级队列)、Priority Deque(优先双端队列)。
  - 分布式锁和同步工具:Lock, FairLock, MultiLock, RedLock, ReadWriteLock, Semaphore, PermitExpirableSemaphore, CountDownLatch
  - 分布式服务:Remote service, Live Object service, Executor service, Scheduler service, MapReduce service。
  - 流行的编解码器:JBoss Marshalling、Jackson JSON、Avro、Smile、CBOR、MsgPack、Kryo、Amazon Ion、LZ4、Snappy 和 JDK Serialization(JDK 序列化器)。

简单来说 Redisson 是一个高性能,提供丰富特性,支持开箱即用的 Redis Java 客户端,支持 Async(异步)、Reactive(反应式)、RxJava3 通信模式,而且 API 是线程安全的。

### 3.1 Jedis 连接 Redis

:::code-group

```xml [maven依赖]
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>4.3.1</version>
</dependency>
```

```groovy [gradle依赖]
implementation "redis.clients:jedis:4.3.1"
```

:::

```java
package com.fly.jedis;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisPooled;
import redis.clients.jedis.params.SetParams;

import java.util.Set;

/**
 * Jedis操作Redis
 */
public class JedisExample {
    private static final String HOST = "192.168.159.128";
    private static final int PORT = 6379;

    /**
     * 创建Jedis连接池,用于复用连接,提升性能,且线程安全。
     * 多个线程操作Jedis实例是非线程安全的,而且会创建大量Jedis实例,
     * 因为这意味着大量的套接字和连接,这也会导致奇怪的错误。
     *
     * @return
     */
    public static JedisPool createJedisPool() {
        // 初始化Jedis连接配置类
        JedisPoolConfig config = new JedisPoolConfig();
        // 连接池最大空闲连接数,默认8
        config.setMaxIdle(10);
        // 连接池最小空闲连接数,默认0
        config.setMinIdle(0);
        // 连接池最大连接数,默认8
        config.setMaxTotal(10);
        // 连接池最大等待毫秒数
        config.setMaxWaitMillis(100);
        // 根据连接池配置、HOST、PORT初始化Jedis连接池
        JedisPool jedisPool = new JedisPool(config, HOST, PORT);
        return jedisPool;
    }

    public static void main(String[] args) {
        System.out.println("=============== 方式1:Jedis实例操作Redis =================");
        JedisPool pool = JedisExample.createJedisPool();
        // 通过Jedis连接池获取一个Jedis实例,也可以通过new Jedis(HOST,PORT)初始化Jedis
        Jedis jedis = pool.getResource();
        // 设置key-value
        String key01Result = jedis.set("key01", "value01");
        String key02Result = jedis.set("key02", "value02");
        System.out.println(key01Result); // OK
        System.out.println(key02Result); // OK
        /**
         * 设置key的value。SetParams用于set key时设置key的参数,例如:
         *  - 设置策略,NX表示仅当key不存在时,set才会生效,XX表示仅当key存在时,set才会生效。
         *    - nx():等同于设置NX参数。
         *    - xx():等同于设置XX参数。
         *  - 过期时间单位,EX表示过期时间单位为秒,PX表示过期时间单位为毫秒:
         *    - exAt(long milliseconds):以秒为单位设置key的过期时间。-1表示永不过期,默认-1。
         *    - pxAt(long milliseconds):以毫秒为单位设置key的过期时间。-1表示永不过期,默认-1。
         *  - keepttl():以秒为单位返回key的存活时间。
         */
        SetParams setParams = new SetParams().nx().pxAt(5000);
        String key03Result = jedis.set("key03", "value03", setParams);
        System.out.println(key03Result); // OK

        // 获取所有key
        Set<String> keys = jedis.keys("*");
        System.out.println("keys:" + keys); // keys:["key02","key01","k2"]

        // 刪除key,返回删除key的数量
        Long key02DelResult = jedis.del("key02");
        System.out.println("删除key的数量:" + key02DelResult); // 删除key的数量:1

        // 根据key获取value
        System.out.println(jedis.get("key01")); // value01
        System.out.println(jedis.get("key02")); // null
        System.out.println(jedis.get("key03")); // null
        System.out.println("=================================");

        System.out.println("=============== JedisPooled实例操作Redis =================");
        JedisPooled pooled = new JedisPooled(HOST, PORT);
        System.out.println(pooled.set("k1", "v1")); // OK
        System.out.println(pooled.set("k2", "v2")); // OK
        System.out.println("del key length:" + pooled.del("k1")); // del key length:1
        System.out.println("k1 value:" + pooled.get("k1")); // k1 value:null
        System.out.println("k2 value:" + pooled.get("k2")); // k1 value:v2
        System.out.println("k1 是否存在:" + pooled.exists("k1")); // k1 是否存在:false
        System.out.println("k2 type:" + pooled.type("k2")); // k2 type:string
        // 根据表达式返回匹配的key,*表示任意
        Set<String> setKeys = pooled.keys("*");
        System.out.println("k2 type:" + setKeys.size()); // 2
    }
}
```

### 3.2 Lettuce 连接 Redis

:::code-group

```xml [maven依赖]
<dependency>
    <groupId>io.lettuce</groupId>
    <artifactId>lettuce-core</artifactId>
    <version>6.2.2.RELEASE</version>
</dependency>
```

```groovy [gradle依赖]
// lettuce依赖,lettuce是一个Redis客户端库,用于构建非阻塞反应式应用程序
implementation 'io.lettuce:lettuce-core:6.2.2.RELEASE'
```

:::

```java
package com.fly.lettuce;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.SetArgs;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisStringAsyncCommands;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.api.sync.RedisStringCommands;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
* Lettuce操作Redis
*/
public class LettuceExample {

    private static final String HOST = "192.168.159.128";
    private static final int PORT = 6379;

    static RedisClient client;
    static StatefulRedisConnection<String, String> connection;

    /**
     * 创建连接
     */
    public static void createConnection() {
        // 创建Redis客户端实例
        client = RedisClient.create(RedisURI.create(HOST, PORT));
        // 设置默认超时时间
        client.setDefaultTimeout(20, TimeUnit.SECONDS);
        // 获取Redis状态连接
        connection = client.connect();
    }

    /**
     * 关闭连接和客户端
     */
    public static void closeConnection() {
        if (connection != null) {
            connection.close();
        }
        if (client != null) {
            client.shutdown();
        }
    }

    public static void main(String[] args) {
        LettuceExample.createConnection();
        if (connection == null) return;
        /**
         * 同步接口,connection.sync()返回一个RedisCommands对象,RedisCommands对象是一个组合接口,继承子如下接口:
         * - BaseRedisCommands:Redis基本操作命令对象。提供了ping()、reset()、检查连接状态、订阅等方法。
         * - RedisAclCommands:Redis Acl操作命令对象。Acl用于提高Redis操作安全性。
         * - RedisClusterCommands:Redis集群操作命名对象。
         * - RedisServerCommands:Redis服务器操作命令对象,用于Redis服务器相关操作。
         * - RedisKeyCommands:Redis key操作命令对象。提供了key操作方法,例如key()、keys()...
         * - RedisListCommands:Redis List类型操作命令对象,用于操作List。
         * - RedisScriptingCommands:Redis脚本操作命令对象,用于Lua脚本操作。
         * - RedisSetCommands:Redis Set类型操作命令对象。
         * - RedisSortedSetCommands:Redis ZSet类型操作命令对象。
         * - RedisStringCommands:表示Redis String类型操作命令对象。
         * - RedisGeoCommands:Redis Geo(地理位置)类型操作命令。
         * - RedisHashCommands:Redis Hashmap类型操作命令对象。
         * - RedisStreamCommands:Redis Stream类型操作命令对象。
         * - RedisTransactionalCommands:Redis事务操作命名对象。
         * - RedisHLLCommands:Redis HyperLogLog(超日志)类型操作命令对象。
         */
        RedisCommands<String, String> commands = connection.sync();
        RedisStringCommands sync = connection.sync();
        // 设置key-value
        System.out.println(sync.set("key_01", "value_01")); // OK
        /**
         * 设置key-value并指定参数:
         * - nx():等同于set key时设置NX参数。NX表示仅当key不存在时,set才会生效。
         * - xx():等同于set key时设置XX参数。XX表示仅当key存在时,set才会生效。
         * - exAt(long timestamp):以秒为单位设置key的过期时间。-1表示永不过期,默认-1。
         * - pxAt(long timestamp):以毫秒为单位设置key的过期时间。-1表示永不过期,默认-1。
         * - keepttl():以秒为单位返回key的存活时间。
         */
        SetArgs setArgs = SetArgs.Builder.nx().pxAt(5000);
        System.out.println(sync.set("key_02", "value_02",setArgs)); // OK
        System.out.println(sync.get("key_01")); // value_01
        // 获取key的类型
        System.out.println(commands.type("key_01")); // string
        // 判断key是否存在,返回一个long类型,1表示存在,0表示不存在
        System.out.println(commands.exists("key_01111")); // 1
        // 根据表达式返回匹配的key,*表示任意
        List<String> keys = commands.keys("*");
        System.out.println("all key length:"+keys.size()); // all key length:2
        LettuceExample.closeConnection();
    }
}
```

### 3.3 Redisson 连接 Redis

:::code-group

```xml [maven依赖]
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.17.4</version>
</dependency>
```

```groovy [gradle依赖]
implementation 'org.redisson:redisson:3.17.4'
```

:::

## 4.SpringBoot 整合 Redis

SpringBoot 官方也提供了 `spring-boot-starter-redis` 依赖用于整合 Redis,该依赖内部集成了 Jedis 和 Lettuce,2.x 默认使用 Lettuce 作为 Redis 客户端(1.x 默认使用 Jedis 作为客户端)。注意:Lettuce 连接池与 common-pool2(apache common-pool2 是对象池模式的一种实现),切换 Lettuce 时需要添加 common-pool2。Redisson 官方也提供了 redisson-spring-boot-starter 用于 SpringBoot 和 Redisson 的集成。`spring-boot-starter-redis` 提供 RedisTemplate 模板类操作 Redis,该类基于模板设计模式实现,内部提供了诸多操作 Redis 的 api。
:::code-group

```xml [maven依赖]
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!-- commons-pool2是对象池模式的一种实现,lettuce连接池依赖于commons-pool2 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
    <version>2.11.1</version>
</dependency>
```

```groovy [gradle依赖]
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
// commons-pool2是对象池模式的一种实现,lettuce连接池依赖于commons-pool2
implementation 'org.apache.commons:commons-pool2:2.11.1'
```

:::

application.yml:

```yml
spring:
  redis:
    host: 172.16.178.130
    port: 6379
    username:
    password:
    # jedis客户端配置,启用jedis仅需配置jedis连接池
    #    jedis:
    #      pool:
    #        # jedis连接池最大连接数,默认8
    #        max-active: 8
    #        # jedis连接池最大空闲连接数,默认8
    #        max-idle: 8
    #        # jedis连接池最小空闲连接数,默认0
    #        min-idle: 0
    #        # jedis连接池最大等待时间(单位毫秒),默认-1ms
    #        max-wait: -1ms
    # lettuce客户端配置,启用lettuce仅需配置lettuce连接池,默认使用lettuce,使用lettuce需要添加commons-pool2依赖
    lettuce:
      pool:
        # lettuce连接池最大连接数,默认8
        max-active: 8
        # lettuce连接池最大空闲连接数,默认0
        max-idle: 0
        # lettuce连接池最小空闲连接数,默认0
        min-idle: 0
        # lettuce连接池最大等待时间(单位毫秒),默认-1ms
        max-wait: -1ms
```

### 4.1 RedisTemplate 方法

```txt
ValueOperations<K, V> opsForValue():获取用于操作String类型的对象,ops是operations的简写,opsForxxx表示xxx的操作。

ListOperations<K, V> opsForList():获取用于操作List类型的对象。

SetOperations<K, V> opsForSet():获取用于操作Set类型的对象。

ZSetOperations<K, V> opsForZSet():获取用于操作ZSet类型的对象。

HashOperations<K, HK, HV> opsForHash():获取用于操作Hashmap类型的对象。

StreamOperations<K, HK, HV> opsForStream():获取用于操作Stream类型的对象。

GeoOperations<K, V> opsForGeo():获取用于操作Geo(地理位置)类型的对象。

HyperLogLogOperations<K, V> opsForHyperLogLog():获取用于操作HyperLogLog(超日志)类型的对象。

ClusterOperations<K, V> opsForCluster():获取用于操作Redis Cluster(集群)对象。

Boolean move(K key, final int dbIndex):将指定key移动到指定数据库,返回一个布尔值。

void rename(K oldKey, K newKey):将oldKey名称修改为newKey。

Boolean delete(K key):删除指定key,返回一个布尔值表示是否删除成功。

Long delete(Collection<K> keys):删除多个指定key,返回删除key的数量。

Set<K> keys(K pattern):根据匹配表达式返回所匹配的key。

Boolean expire(K key, long timeout, TimeUnit unit):设置key,允许指定key的过期时间(timeout),过期时间单位(unit)。

Boolean hasKey(K key):判断key是否存在。

K randomKey():从数据库中随机获取一个key。

Long getExpire(K key, TimeUnit timeUnit):根据时间单位获取key的过期时间。

byte[] dump(K key):用于序列化指定key的value。

restore(K key, byte[] value, long timeToLive, TimeUnit unit):将DUMP的结果反序列化回Redis。key:序列化value存储的key,value:反序列的值,timeToLive:ttl,key的生存时间,unit:ttl时间单位。

RedisConnectionFactory getConnectionFactory():获取连接工厂。如果底层使用Lettuce作为客户端,则可以强转为LettuceConnectionFactory,如果底层使用Jedis作为客户端,则可以强转为JedisConnectionFactory。通过连接工厂获取客户端连接工厂能提供更为底层的操作。

void setConnectionFactory(RedisConnectionFactory connectionFactory):根据客户端连接工厂设置RedisTemplate连接工厂。
```

```java
package com.fly;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.DataType;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @SpringBootTest标识当前类是一个SpringBoot测试类, classes用于指定SpringBoot启动类
 */
@SpringBootTest(classes = RedisApplication.class)
public class RedisKeyTest {

    @Autowired
    RedisTemplate redisTemplate;

    /**
     * redis key 相关操作
     */
    @Test
    public void redisKeyTest() throws InterruptedException {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        ops.set("k_01","v_01");
        // 设置key-value并设置过期时间,过期时间为1分钟
        ops.set("k_02","v_02", Duration.ofMinutes(1));
        // 设置key-value并设置过期时间,过期时间为10000,时间单位毫秒
        ops.set("k_03","v_03",10000, TimeUnit.MILLISECONDS);
        // 仅当key不存在时set key,若key存在则不做任何操作,set key成功返回true,否则返回false
        Boolean bool1 = ops.setIfAbsent("k_04","v_04");
        Boolean bool2 = ops.setIfAbsent("k_01","v_01");
        System.out.println("bool1:"+bool1); // bool1:true
        System.out.println("bool2:"+bool2); // bool2:false

        // 仅当key存在时set key,若key不存在则不做任何操作,set key成功返回true,否则返回false
        Boolean bool3 = ops.setIfPresent("k_01", "v_01_01");
        Boolean bool4 = ops.setIfPresent("k_05", "v_05");
        System.out.println("bool3:"+bool3); // bool3:true
        System.out.println("bool4:"+bool4); // bool4:false

        // 匹配以k_为前缀的key,*表示匹配所有key
        Set<String> keys = redisTemplate.keys("k_*");
        System.out.println("keys length:"+keys.size());

        Thread.sleep(1000);

        // 返回key对应value的类型
        DataType type = redisTemplate.type("k_01");
        System.out.println("type:"+type.code()); // type:string

        // 删除指定key
        Boolean delBool = redisTemplate.delete("k_01");
        System.out.println("delBool:"+delBool); // delBool:true
        // 删除多个指定key
        Long batchDelLong = redisTemplate.delete(
                Stream.of("k_02","k_03")
                        .collect(Collectors.toList()));
        System.out.println("batchDelLong:"+batchDelLong); // batchDelLong:2

        // 判断key是否存在
        System.out.println(redisTemplate.hasKey("k_04")); // true
        System.out.println(redisTemplate.hasKey("k_00004")); // false
        // 判断key是否持久化
        System.out.println(redisTemplate.persist("k_04")); // false
        // 修改key名称
        redisTemplate.rename("k_04","k_004");
        System.out.println("k_004:"+ops.get("k_004")); // k_004:v_04

        // 用于序列化指定key,并返回序列化后的值
        byte[] keyBytes = redisTemplate.dump("k_004");
        /**
         * restore(K key, byte[] value, long timeToLive, TimeUnit unit):将DUMP的结果反序列化回Redis
         * - key:序列化value存储的key。
         * - value:反序列的值。
         * - timeToLive:ttl,key的生存时间。
         * - unit:ttl时间单位。
         */
        redisTemplate.restore("k_0004",keyBytes,60000L,TimeUnit.MILLISECONDS);
        System.out.println("k_0004:"+ops.get("k_0004")); // k_0004:v_04

        // rename(K oldKey, K newKey):修改key的名称,将oldKey修改为newKey
        redisTemplate.rename("k_0004","k_04");
        System.out.println("k_04:"+ops.get("k_04")); // k_04:v_04

        // move(K key, final int dbIndex):将key移动到指定数据库,默认所有key都存储在0号数据库
        Boolean moveBool = redisTemplate.move("k_04", 1);
        System.out.println("moveBool:"+moveBool); // moveBool:true
        Thread.sleep(200);
        System.out.println("k_04:"+ops.get("k_04")); // k_04:null

        // 获取Lettuce连接工厂
        LettuceConnectionFactory connFactory = (LettuceConnectionFactory)redisTemplate.getConnectionFactory();
        // 切换数据库(切换至1号数据库)
        connFactory.setDatabase(1);
        // 设置连接工厂
        redisTemplate.setConnectionFactory(connFactory);
        System.out.println("k_04:"+redisTemplate.opsForValue().get("k_04")); // k_04:v_04

        // 从数据库中随机获取一个key
        System.out.println("randomKey:"+redisTemplate.randomKey()); // randomKey:k_004
    }
}
```

### 4.2 RedisTemplate 序列化配置

RedisTemplate 是 SpringBoot Redis 整合包提供的用于操作 Redis 的模板类,提供了一列类操作 Redis 的 API,默认采用 JDK Serialization 进行序列化,实际上存储的是二进制字节码,可读性非常差,通过自定义 RedisTemplate Key、Value、HashKey、HashValue 的序列化策略。

```java
package com.fly.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.*;

/**
 * @author zchengfeng
 */
@Configuration
public class RedisConfiguration {

    /**
     * RedisTemplate是SpringBoot Redis整合包提供的用于操作Redis的模板类,提供了一列类操作
     * Redis的API,默认采用JdkSerialization进行序列化,set后的数据实际上存储的是
     * 二进制字节码,可读性非常差,通过自定义RedisTemplate
     * @param factory
     * @return
     */
     @Bean
     public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory factory){
         RedisTemplate<String, Object> template = new RedisTemplate<>();
         template.setConnectionFactory(factory);
         // Jackson2Json序列化
         Jackson2JsonRedisSerializer jackson2JsonRedisSerializer =
                    new Jackson2JsonRedisSerializer(Object.class);
         ObjectMapper objectMapper = new ObjectMapper();
         objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
         jackson2JsonRedisSerializer.setObjectMapper(objectMapper);

        StringRedisSerializer stringRedisSerializer= new StringRedisSerializer();

         /**
          * 设置key采用String序列化方式,
          * Redis存取默认使用JdkSerializationRedisSerializer序列化,
          * 这种序列化会key的前缀添加奇怪的字符,例如\xac\xed\x00\x05t\x00user_id,
          * 使用StringRedisSerializer序列化可以去掉这种字符
          */
         template.setKeySerializer(stringRedisSerializer);
         template.setValueSerializer(jackson2JsonRedisSerializer);
         // hash的key也采用String的序列化方式
         template.setHashKeySerializer(stringRedisSerializer);
         // hash的value序列化方式采用jackson
         template.setHashValueSerializer(jackson2JsonRedisSerializer);
         template.afterPropertiesSet();

         /*
          * 开启Redis事务,默认是关闭的。也可以手动开启事务,
          * 通过template.multi()开启事务,template.exec()关闭事务
          */
         // template.setEnableTransactionSupport(true);
         return template;
     }
}
```
