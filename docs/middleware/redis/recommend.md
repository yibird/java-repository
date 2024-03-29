## 1.优化 Redis 大 Key

Redis 大 Key 是指某个 key 对应的 value 值所占的内存空间比较大,可能会导致 Redis 内存不足、性能下降数据不均衡以及主从同步延迟等问题。判断 Redis 大 Key 并没有明确的标准,通常认为字符串类型的 key 对应的 value 值占用空间大于 1M,或者集合类型的元素数量超过 1w,就算作大 Key。Redis 大 Key 的评判标准应根据实际业务场景来综合评估,例如在高并发低延迟的系统中,value 大于 10K 或集合类数据量大于 3k 也会被评定为大 Key。在低并发允许存在部分延迟的系统中,Redis 大 Key 的评判标准会宽松很多。

### 1.1 Redis 大 Key 产生的影响

如果 Redis 中存在大 Key,可能会产生以下问题:

- 内存占用过高。大 Key 会占用大量内存,这可能导致 Redis 实例的内存占用增加,从而影响 Redis 的性能和稳定性。过大的 Key 可能导致 Redis 实例被操作系统强制杀死或导致 Redis 进行内存回收,从而影响服务可用性。
- 导致性能下降。大 Key 会占用大量内存空间,导致内存碎片增加,进而影响 Redis 的性能。对于大 Key 的操作,如读取、写入、删除等,都会消耗更多的 CPU 时间和内存资源。
- 网络传输慢。在进行数据传输时,大 Key 的传输成本可能较高,尤其是在不同的 Redis 节点之间进行数据迁移或复制时。大 Key 可能会增加网络负载,导致慢速的数据传输。
- 影响主从同步延迟。当 Redis 实例配置了主从同步时,大 Key 可能导致主从同步延迟。由于大 Key 占用较多内存,同步过程中需要传输大量数据,这会导致主从之间的网络传输延迟增加,进而影响数据一致性。
- 数据倾斜。在 Redis 集群模式中,某个数据分片的内存使用率远超其他数据分片,无法使数据分片的内存资源达到均衡。另外也可能造成 Redis 内存达到 maxmemory 参数定义的上限导致重要的 key 被逐出,甚至引发内存溢出。

### 1.2 Redis 大 Key 产生的原因

- 业务设计不合理。这是最常见的原因,避免将大量数据存储在一个 key 中,当存储大容量数据时应使用多个 key 对其进行拆分。例如:把全国数据按照省行政区拆分成 34 个 key,或者按照城市拆分成 300 个 key,可以进一步降低产生大 key 的概率。
- 没有预见 value 的动态增长问题。如果一直添加 value 数据,没有删除机制、过期机制或者限制数量,迟早出现大 key。例如:微博明星的粉丝列表、热门评论等。
- 过期时间设置不当。如果没有给某个 key 设置过期时间,或者过期时间设置较长。随着时间推移,value 数量快速累积,最终形成大 key。

### 1.3 Redis 大 Key 的排查方法

- 使用 SCAN 命令(SCAN 命令不会阻塞 Redis 实例)。SCAN 命令用于遍历所有键的命令,可以通过迭代的方式获取所有键。使用 SCAN 命令,结合 TYPE 命令判断键的类型,可以逐个检查键的大小和类型。

```shell
SCAN 0 COUNT 1000
```

- 使用 memory 命令查看 key 的大小(Redis4.0 及以上支持)。

```shell
# 查看name的内存占用大小(字节)
MEMORY USAGE name
(integer) 157481
```

- 通过 bigkeys 参数。在 redis-cli 中,--bigkeys 参数是用于查找 Redis 数据库中的大 Key 的一个选项。大 Key 是指占用大量内存空间的键,这可能会影响 Redis 实例的性能。

```shell
redis-cli -h 127.0.0.1 -p 6379 —bigkeys
```

- 使用 redis-rdb-tools。redis-rdb-tools 提供了 rdb-dump 命令,可以将 RDB 文件中的键和值导出,然后通过其他工具或脚本进行分析。

```shell
# 输出占用内存大于1kb,排名前3的keys。
rdb —commond memory —bytes 1024 —largest 3 dump.rbd
```

#### 1.4 Redis 大 Key 优化方案

- 分割大 Key: 尽量避免将大量数据集中在一个大 Key 中。可以将大数据集分割为多个小的 Key,以便更好地管理和利用 Redis 的特性。
- 使用数据结构: 根据具体的需求,选择合适的数据结构。例如,使用分布式列表、分布式集合或者分布式哈希表,以更有效地存储和访问数据。
- 优化查询和遍历: 对于需要进行查询和遍历的场景,选择合适的数据结构和查询方式,以提高效率。
- 定期清理不需要的数据: 定期清理不再需要的大 Key,以释放内存和维护 Redis 实例的稳定性。

## 2.缩短键值对的存储长度

在在 key 不变的情况下,value 值越大操作效率越慢,因为 Redis 对于同一种数据类型会使用不同的内部编码进行存储,比如字符串的内部编码就有三种:int（整数编码）、raw（优化内存分配的字符串编码）、embstr（动态字符串编码）,这是因为 Redis 的作者是想通过不同编码实现效率和空间的平衡,然而数据量越大使用的内部编码就越复杂,而越是复杂的内部编码存储的性能就越低。当键值对内容较大时,还会带来另外几个问题:

- 内容越大需要的持久化时间就越长,需要挂起的时间越长,Redis 的性能就会越低；
- 内容越大在网络上传输的内容就越多,需要的时间就越长,整体的运行速度就越低；
- 内容越大占用的内存就越多,就会更频繁的触发内存淘汰机制,从而给 Redis 带来了更多的运行负担。

因此在保证完整语义的同时,应尽量的缩短键值对的存储长度,必要时要对数据进行序列化和压缩再存储,以 Java 为例,序列化可以使用 protostuff 或 kryo,压缩可以使用 snappy。

## 3.启用 lazy free 特性

lazy free 特性是 Redis 4.0 新增的一个非常使用的功能,它可以理解为惰性删除或延迟删除。意思是在删除的时候提供异步延时释放键值的功能,把键值释放操作放在 BIO(Background I/O) 单独的子线程处理中,以减少删除删除对 Redis 主线程的阻塞,可以有效地避免删除 big key 时带来的性能和可用性问题。lazy free 对应了 4 种场景(默认都是关闭的):

```shell
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
slave-lazy-flush no
```

- lazyfree-lazy-eviction:表示当 Redis 运行内存超过 maxmeory 时,是否开启 lazy free 机制删除；
- lazyfree-lazy-expire:表示设置了过期时间的键值,当过期之后是否开启 lazy free 机制删除；
- lazyfree-lazy-server-del:有些指令在处理已存在的键时,会带有一个隐式的 del 键的操作,比如 rename 命令,当目标键已存在,Redis 会先删除目标键,如果这些目标键是一个 big key,就会造成阻塞删除的问题,此配置表示在这种场景中是否开启 lazy free 机制删除；
- slave-lazy-flush:针对 slave(从节点) 进行全量数据同步,slave 在加载 master 的 RDB 文件前,会运行 flushall 来清理自己的数据,它表示此时是否开启 lazy free 机制删除。

建议开启其中的 lazyfree-lazy-eviction、lazyfree-lazy-expire、lazyfree-lazy-server-del 等配置,这样可以有效的提高主线程的执行效率。

## 4.设置键值的过期时间

在实际开发中应根据业务情况,对键值设置合理的过期时间,这样 Redis 会自动清除过期的键值对,以节约对内存的占用,以避免键值过多的堆积,频繁的触发内存淘汰策略。

## 5.禁用长耗时的查询命令

Redis 绝大多数读写命令的时间复杂度都在 O(1) 到 O(N) 之间,当使用 O(N)命令时,数据越大查询的速度可能会越慢。因为 Redis 只用一个线程来做数据查询,如果这些指令耗时很长,就会阻塞 Redis,造成大量延时。常见命令优化策略如下:

- 禁止使用 keys 命令。keys 命令会阻塞 Redis 服务器的其他操作,而且在大数据集上执行可能导致性能下降。可以使用 SCAN 命令代替 KEYS 命令,SCAN 命令可以进行增量式的迭代,相比于 keys,SCAN 是非阻塞的,它可以分批次地获取键,适用于大数据集的情况。
- 通过机制严格控制 Hash、Set、Sorted Set 等结构的数据大小。
- 将排序、并集、交集等操作放在客户端执行,以减少 Redis 服务器运行压力。
- 删除 (del) 一个大数据的时候,可能会需要很长时间,所以建议用异步删除的方式 unlink,它会启动一个新的线程来删除目标数据,而不阻塞 Redis 的主线程。

## 6.使用 slowlog 优化耗时命令

slowlog 是 Redis 提供的用于记录慢查询的日志系统。通过 slowlog 命令,可以获取关于执行时间超过指定阈值的 Redis 命令的详细信息,有利于性能调优。慢查询有两个重要的配置项:

- slowlog-log-slower-than:用于设置慢查询的评定时间,也就是说超过此配置项的命令,将会被当成慢操作记录在慢查询日志中,它执行单位是微秒 (1 秒等于 1000000 微秒)；
- slowlog-max-len:用来配置慢查询日志的最大记录数。
  在实际开发中可以根据根据业务情况进行相应的配置,其中慢日志是按照插入的顺序倒序存入慢查询日志中,可以使用 `slowlog get n`来获取相关的慢查询日志,再找到这些慢查询对应的业务进行相关的优化。

## 7.合理使用 Pipeline

Pipeline (管道技术) 是客户端提供的一种批处理技术,用于一次处理多个 Redis 命令,使用 Pipeline 可以将多个命令一次性发送给 Redis 服务器,减少网络延迟,提高性能。当处理命令过多可能会导致服务器阻塞。

## 8.使用 Lua 脚本

当执行多个命令时,可以将多个命令封装成 Lua 脚本,通过 EVAL 命令一次性执行,减少网络开销和提高原子性。

## 使用集群或分片

Redis 提供主从同步、哨兵模式、Redis Cluster 三种方式搭建集群,Redis 集群可以大大提升 Redis 的处理能力和吞吐量。
