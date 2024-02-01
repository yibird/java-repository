export default {
  text: "SpringFramework",
  collapsed: true,
  items: [
    {
      text: "Spring",
      collapsed: true,
      items: [
        {
          text: "IOC容器",
          link: "/springFramework/spring/ioc.md",
        },
        {
          text: "配置管理",
          link: "/springFramework/spring/config.md",
        },
        {
          text: "SpEl表达式",
          link: "/springFramework/spring/spEl.md",
        },
        {
          text: "AOP",
          link: "/springFramework/spring/aop.md",
        },
        {
          text: "事务",
          link: "/springFramework/spring/transaction.md",
        },
        {
          text: "Spring Event",
          link: "/springFramework/spring/event.md",
        },
        {
          text: "SpringFlux",
          link: "/springFramework/spring/springFlux.md",
        },
        {
          text: "Spring工具类",
          link: "/springFramework/spring/util.md",
        },
        {
          text: "Spring单元测试与Mock",
          link: "/springFramework/spring/test.md",
        },
        {
          text: "Spring扩展",
          link: "/springFramework/spring/expand.md",
        },
      ],
    },
    {
      text: "SpringMVC",
      collapsed: true,
      items: [],
    },
    {
      text: "SpringBoot",
      collapsed: true,
      items: [
        {
          text: "基础篇",
          collapsed: true,
          items: [
            {
              text: "SpringBoot介绍",
              link: "/springFramework/springBoot/base/base.md",
            },
            {
              text: "SpringBoot构建RestFul风格Api",
              link: "/springFramework/springBoot/base/restFul.md",
            },
            {
              text: "SpringBoot多数据源",
              link: "/springFramework/springBoot/base/multipleDataSources.md",
            },
            {
              text: "SpringBoot自动装配原理",
              link: "/springFramework/springBoot/base/principle.md",
            },
          ],
        },
        {
          text: "数据访问篇",
          collapsed: true,
          items: [
            {
              text: "SpringBoot集成MybatisPlus",
              link: "/springFramework/springBoot/dataAccess/mybatisPlus.md",
            },
            {
              text: "SpringBoot集成Jpa",
              link: "/springFramework/springBoot/dataAccess/jpa.md",
            },
          ],
        },
        {
          text: "日志篇",
          collapsed: true,
          items: [
            {
              text: "Java日志体系",
              link: "/springFramework/springBoot/logger/logSystem.md",
            },
            {
              text: "SpringBoot集成Logback",
              link: "/springFramework/springBoot/logger/logback.md",
            },
            {
              text: "SpringBoot集成Log4j",
              link: "/springFramework/springBoot/logger/log4j.md",
            },
            {
              text: "SpringBoot集成Log4j2",
              link: "/springFramework/springBoot/logger/log4j2.md",
            },
          ],
        },
        {
          text: "文档管理篇",
          collapsed: true,
          items: [
            {
              text: "SpringBoot集成Swagger3",
              link: "/springFramework/springBoot/docs/swagger.md",
            },
            {
              text: "SpringBoot集成SpringDoc",
              link: "/springFramework/springBoot/docs/springDoc.md",
            },
          ],
        },
        {
          text: "监控篇",
          collapsed: true,
          items: [
            {
              text: "SpringBoot集成Actuator",
              link: "/springFramework/springBoot/monitor/actuator.md",
            },
            {
              text: "SpringAdmin",
              link: "/springFramework/springBoot/monitor/springAdmin.md",
            },
          ],
        },
        {
          text: "功能应用篇",
          collapsed: true,
          items: [
            {
              text: "参数验证",
              link: "/springFramework/springBoot/application/validator.md",
            },
            {
              text: "配置加密",
              link: "/springFramework/springBoot/application/configEncryption.md",
            },
            {
              text: "接口限流",
              link: "/springFramework/springBoot/application/rateLimiting.md",
            },
            {
              text: "接口幂等性",
              link: "/springFramework/springBoot/application/idempotent.md",
            },
            {
              text: "接口超时重试",
              link: "/springFramework/springBoot/application/retry.md",
            },
            {
              text: "接口加解密",
              link: "/springFramework/springBoot/application/encryption.md",
            },
          ],
        },
        {
          text: "业务篇",
          items: [],
        },
      ],
    },
    {
      text: "SpringSecurity",
      collapsed: true,
      items: [
        {
          text: "SpringSecurity认证",
          link: "/springFramework/springSecurity/authenticate.md",
        },
        {
          text: "SpringSecurity授权",
          link: "/springFramework/springSecurity/authorized.md",
        },
        {
          text: "SpringSecurity之OAuth2验证授权标准",
          link: "/springFramework/springSecurity/oauth2.md",
        },
      ],
    },
  ],
};
