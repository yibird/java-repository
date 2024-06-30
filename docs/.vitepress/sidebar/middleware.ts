export default {
  text: "中间件(Middleware)",
  collapsed: true,
  items: [
    {
      text: "Redis",
      collapsed: true,
      items: [
        {
          text: "Redis基础",
          collapsed: true,
          items: [
            {
              text: "Redis介绍",
              link: "/middleware/redis/base/introduce.md",
            },
            {
              text: "字符串(Strings)",
              link: "/middleware/redis/base/strings.md",
            },
            {
              text: "列表(Lists)",
              link: "/middleware/redis/base/lists.md",
            },
            {
              text: "集合(Sets)",
              link: "/middleware/redis/base/sets.md",
            },
            {
              text: "有序集合(Sorted Sets)",
              link: "/middleware/redis/base/sortedSets.md",
            },
            {
              text: "散列(Hashes)",
              link: "/middleware/redis/base/hashes.md",
            },
            {
              text: "流(Streams)",
              link: "/middleware/redis/base/streams.md",
            },
            {
              text: "地理空间(Geospatial)",
              link: "/middleware/redis/base/geo.md",
            },
            {
              text: "超级日志(HyperLogLog)",
              link: "/middleware/redis/base/hyperLogLog.md",
            },
            {
              text: "位图(Bitmaps)",
              link: "/middleware/redis/base/bitmaps.md",
            },
            {
              text: "位字段(BitFields)",
              link: "/middleware/redis/base/bitFields.md",
            },
          ],
        },
        {
          text: "Redis高阶",
          collapsed: true,
          items: [
            {
              text: "发布与订阅",
              link: "/middleware/redis/advanced/publish&subscribe.md",
            },
            {
              text: "管道(Pipelining)与事务",
              link: "/middleware/redis/advanced/pipelining&transaction.md",
            },
            {
              text: "持久化机制",
              link: "/middleware/redis/advanced/persistence.md",
            },
            {
              text: "Lua脚本与Functions",
              link: "/middleware/redis/advanced/luaScript&Functions.md",
            },
            {
              text: "Redis Module(模块)",
              link: "/middleware/redis/advanced/module.md",
            },
          ],
        },
        {
          text: "Redis高可用",
          collapsed: true,
          items: [
            {
              text: "Redis Replication(主从复制)",
              link: "/middleware/redis/highAvailability/masterSlaveReplication.md",
            },
            {
              text: "Redis Sentinel(哨兵机制)",
              link: "/middleware/redis/highAvailability/sentinel.md",
            },
            {
              text: "Redis Cluster(集群)",
              link: "/middleware/redis/highAvailability/cluster.md",
            },
          ],
        },
        {
          text: "Redis生产实践",
          link: "/middleware/redis/recommend.md",
        },
      ],
    },
    {
      text: "MQ",
      collapsed: true,
      items: [
        {
          text: "MQ简介",
          link: "/middleware/mq/introduce.md",
        },
        {
          text: "RabbitMQ",
          collapsed: true,
          items: [
            {
              text: "初识RabbitMQ及核心概念",
              link: "",
            },
            {
              text: "RabbitMQ Cluster(集群)",
              link: "",
            },
            {
              text: "RabbitMQ最佳实践",
              link: "",
            },
          ],
        },
        {
          text: "RocketMQ",
          collapsed: true,
          items: [
            {
              text: "初识RocketMQ及核心概念",
              link: "",
            },
          ],
        },
        {
          text: "Kafka",
          collapsed: true,
          items: [
            {
              text: "初识Kafka及核心概念",
              link: "",
            },
          ],
        },
      ],
    },
    {
      text: "Web服务器",
      collapsed: true,
      items: [
        {
          text: "Nginx",
          link: "/middleware/nginx/base/productionPractice.md",
        },
        {
          text: "OpenResty",
          link: "",
        },
      ],
    },
    {
      text: "Keepalived",
      collapsed: true,
    },
  ],
};
