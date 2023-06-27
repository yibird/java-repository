export default {
  text: "微服务(Microservices)",
  collapsed: true,
  items: [
    {
      text: "分布式微服务理论基础",
      link: "/microservices/theory.md",
    },
    {
      text: "SpringCloud",
      collapsed: true,
      items: [
        {
          text: "服务治理——Eureka",
          link: "/microservices/springCloud/eureka.md",
        },
        {
          text: "服务调用——Ribbon和OpeFeign",
          link: "/microservices/springCloud/opeFeign.md",
        },
        {
          text: "配置中心——Apllo",
          link: "/microservices/springCloud/apllo.md",
        },
        {
          text: "断路器——Hystrix",
          link: "/microservices/springCloud/hystrix.md",
        },
        {
          text: "新的断路器——Resilience4j",
          link: "/microservices/springCloud/resilience4j.md",
        },
        {
          text: "网关——SpringCloud Gateway",
          link: "/microservices/springCloud/springCloudGateway.md",
        },
        {
          text: "服务监控——SpringCloud Sleuth+Zipkin",
          link: "/microservices/springCloud/springCloudSleuth.md",
        },
        {
          text: "新的服务监控——Skywalking",
          link: "/microservices/springCloud/skywalking.md",
        },
      ],
    },
    {
      text: "SpringAlibabaCloud",
      items: [],
    },
    {
      text: "分布式解决方案",
      collapsed: true,
      items: [
        {
          text: "分布式ID",
          link: "",
        },
        {
          text: "分布式会话",
          link: "",
        },
        {
          text: "分布式调度",
          link: "",
        },
        {
          text: "分布式事务",
          link: "",
        },
        {
          text: "分布式存储",
          link: "",
        },
      ],
    },
  ],
};
