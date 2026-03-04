分布式系统中生成唯一 ID 是一项重要任务,确保每个 ID 在整个系统中是唯一的且不会重复。分布式 ID 应具有如下特点:

- 唯一性:确保生成的 ID 在整个分布式系统中是唯一的,这是最基本的要求。任何重复的 ID 都可能导致数据冲突和一致性问题。
- 高可用和高性能:ID 生成服务必须高可用,即使在部分节点故障的情况下,整个系统依然能够生成唯一 ID。这可以通过冗余、故障转移和高可用架构来实现。ID 生成需要高效,不能成为系统的瓶颈。在高并发环境下,ID 生成服务需要能够承受高负载,快速响应请求。
- 有序性:在某些场景下,ID 的有序性是必要的。例如,订单系统中的订单号通常要求按时间顺序生成。有序 ID 可以方便地进行范围查询和排序。
  常见的分布式 ID 生成方案如下:
- 基于 UUID(Universally Unique Identifier)生成分布式 ID。
- 基于数据库步长生成分布式 ID。
- 基于中间件生成分布式 ID,例如 Redis、ETCD、Zookeeper 等等。
- 基于雪花算法生成分布式 ID。

## 1.UUID 生成分布式 ID

UUID (Universally Unique Identifier) 是一种常用的生成分布式 ID 的方法。它能够在分布式系统中生成唯一的 ID,不需要中心协调服务,具有高效性和独立性。UUID 通常有多种版本,其中最常用的是 UUID v4。UUID 的优缺点:

- 唯一性强:UUID 在全球范围内生成唯一 ID,冲突的概率极低。
- 去中心化:无需中心协调服务,每个节点可以独立生成 ID。
- 简单易用:生成和使用 UUID 非常简单,许多编程语言和库都内置了 UUID 生成功能。
- 高性能:生成 UUID 的计算量很小,不会成为系统的性能瓶颈。
- 不具有有序性:UUID 生成的 ID 是随机的,没有顺序性,不适合需要有序 ID 的场景。由于 UUID 的无序性,在关系型数据库主键设计中,使用 UUID 会导致 B+树等索引结构频繁分裂和重排,降低插入和查询性能。
- 空间占用大:UUID 通常是 128 位,通常以 32 个字符的字符串表示,占用空间较大,存储和传输的开销也较大。
- 可读性差:UUID 是长字符串,可读性差,不便于调试和日志分析。

## 2.数据库步长生成分布式 ID

基于数据库步长生成分布式 ID 是一种常见的分布式 ID 生成方案,适用于需要生成全局唯一且有序的 ID 的场景。其基本原理是利用数据库的自增特性,并通过预分配一定的步长来生成 ID。在分布式环境中,多个服务实例可以通过分配不同的步长来生成 ID。假设步长为 n,每个实例可以预分配 n 个 ID 段,这样就可以避免不同实例生成相同的 ID。
这种方式能保证 ID 是有序的,但是当遇到数据库实例扩缩容时,会影响步长,从而造成数据倾斜问题(数据库实例数据分布不均匀,有些实例数据量大,有些实例数据量小,无法良好的负载)。除此之外还存在着数据库瓶颈(频繁的读写会增加数据库瓶颈,为了保证 ID 的唯一性和连续性,通常需要对数据库表进行锁定操作,可能会出现锁竞争问题)、数据同步延迟问题,因此在实际生产环境中并不推荐使用。

## 3.中间件生成分布式 ID

使用中间件生成分布式 ID 是一种常见的解决方案,可以有效地解决 ID 生成的高并发、高可用性和一致性问题。

### 3.1 基于 Redis 生成分布式 ID

基于 Redis 生成分布式 ID 是一种高效的分布式 ID 生成方案,主要利用 Redis 的原子性操作和高性能特点来实现。在这种方案中,常用的 Redis 命令有 INCR、INCRBY 等,这些命令可以保证在高并发环境下生成的 ID 是唯一且有序的。由于 Redis 操作是基于内存的,因此生成 ID 效率非常高,通过 Redis 集群和持久化,可以实现高可用性。

```java
import redis.clients.jedis.Jedis;

public class RedisIdGenerator {
    private Jedis jedis;
    private String key;

    public RedisIdGenerator(String redisHost, int redisPort, String key) {
        this.jedis = new Jedis(redisHost, redisPort);
        this.key = key;
    }

    public long getNextId() {
        return jedis.incr(key);
    }

    public static void main(String[] args) {
        RedisIdGenerator idGenerator = new RedisIdGenerator("localhost", 6379, "idGenerator");
        for (int i = 0; i < 10; i++) {
            System.out.println(idGenerator.getNextId());
        }
    }
}
```

### 3.2 基于 Zookeeper 生成分布式 ID

基于 Zookeeper 生成分布式 ID 是一种可靠且高效的解决方案,特别适用于需要强一致性和高可用性的场景。Zookeeper 提供了分布式协调服务,可以通过创建有序节点来生成全局唯一且有序的 ID。

```java
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.ExponentialBackoffRetry;
import org.apache.zookeeper.CreateMode;

public class ZookeeperIdGenerator {
    private static final String ZK_ADDRESS = "localhost:2181";
    private static final String ZK_PATH = "/unique_id";

    private CuratorFramework client;

    public ZookeeperIdGenerator() {
        this.client = CuratorFrameworkFactory.builder()
                .connectString(ZK_ADDRESS)
                .retryPolicy(new ExponentialBackoffRetry(1000, 3))
                .build();
        this.client.start();
    }

    public String getNextId() throws Exception {
        String path = client.create()
                .creatingParentsIfNeeded()
                .withMode(CreateMode.PERSISTENT_SEQUENTIAL)
                .forPath(ZK_PATH);
        return path.substring(ZK_PATH.length());
    }

    public static void main(String[] args) throws Exception {
        ZookeeperIdGenerator idGenerator = new ZookeeperIdGenerator();
        for (int i = 0; i < 10; i++) {
            System.out.println(idGenerator.getNextId());
        }
    }
}
```

## 雪花算法生成分布式 ID

雪花算法(Snowflake)是 Twitter 开源的一种分布式 ID 生成算法,能够在分布式系统中生成唯一且有序的 ID。其生成的 ID 具有时间有序性和全局唯一性,适用于高并发环境。雪花算法生成的 ID 是一个 64 位的整数,其结构如下:

- 1 位符号位:始终为 0,表示正数。
- 41 位时间戳:记录当前时间戳,单位是毫秒。可以表示约 69 年的时间。
- 10 位数据中心和机器 ID:可以部署在 1024 个节点上(2^10 = 1024)。
- 5 位数据中心 ID:可以表示 32 个数据中心(2^5 = 32)。
- 5 位机器 ID:每个数据中心可以有 32 台机器(2^5 = 32)。
- 12 位序列号:在同一毫秒内生成的不同 ID。每毫秒最多可以生成 4096 个唯一 ID(2^12 = 4096)。

雪花算法通过时间戳、节点 ID 和序列号的组合,保证了在分布式系统中生成的 ID 具有全局唯一性,其优缺点如下:

- 高性能:生成 ID 的速度非常快,基本上是在内存中生成,不依赖于数据库等外部存储,性能较高。
- 全局唯一性:雪花算法生成的 ID 在分布式系统中是全局唯一的,可以满足大部分分布式系统的需求。
- 简单:算法本身比较简单,易于实现和部署。
- 趋势递增:生成的 ID 是趋势递增的,有利于数据库索引的性能。
- 灵活性:可以根据实际情况调整节点 ID 和数据中心 ID 的位数,以及序列号的位数,适应不同规模和需求的系统。
- 依赖时钟:生成 ID 的唯一性依赖于机器上的时钟,如果时钟回拨(时钟回拨是指计算机系统中时钟向过去移动的现象。通常情况下,计算机的时钟是由硬件提供并通过操作系统进行管理的,它们被用来记录和管理时间,包括生成时间戳和其他时间相关的操作。但由于手动调整时钟、硬件故障问题等问题会造成时钟回拨)可能会导致 ID 的重复或者不连续。
- 不支持分布式环境的时钟同步:如果在分布式环境中无法保证时钟同步,可能会导致唯一性问题。

### UidGenerator

### 美团 Leaf 算法
