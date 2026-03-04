export default {
  text: "面试题",
  collapsed: true,
  items: [
    {
      text: "Java基础",
      link: "/caseInterview/base.md",
    },
    {
      text: "Java并发",
      link: "/caseInterview/concurrency.md",
    },
    {
      text: "Spring",
      link: "/caseInterview/spring.md",
    },
    {
      text: "DB",
      link: "/caseInterview/db.md",
    },
    {
      text: "ORM",
      link: "/caseInterview/orm.md",
    },
    {
      text: "中间件",
      link: "/caseInterview/middleware.md",
      items: [
        {
          text: "Redis",
          link: "/caseInterview/middleware/redis.md",
        },
        {
          text: "Mq",
          link: "/caseInterview/middleware/mq.md",
        },
        {
          text: "Elasticsearch",
          link: "/caseInterview/middleware/es.md",
        },
      ],
    },
    {
      text: "微服务",
      link: "/caseInterview/microservices.md",
    },
    {
      text: "JVM",
      link: "/caseInterview/jvm.md",
    },
  ],
};
