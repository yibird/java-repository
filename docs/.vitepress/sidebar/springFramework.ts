export default {
  text: "Spring全家桶",
  collapsed: true,
  items: [
    {
      text: "Spring",
      collapsed: true,
      items: [
        {
          text: "Spring介绍",
          link: "/springFramework/spring/introduce.md",
        },
        {
          text: "IOC与Bean",
          link: "/springFramework/spring/ioc.md",
        },
        {
          text: "Spring配置管理与SpEl表达式",
          link: "/springFramework/spring/config&SpEl.md",
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
          text: "Spring测试",
          link: "/springFramework/spring/test.md",
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
              link: "/springFramework/springBoot/base/introduce.md",
            },
            {
              text: "SpringBoot整合Untertow",
              link: "/springFramework/springBoot/base/untertow.md",
            },
            {
              text: "SpringBoot参数验证",
              link: "/springFramework/springBoot/base/validator.md",
            },
            {
              text: "基于SpringBoot创建一个REST Ful风格API",
              link: "/springFramework/springBoot/base/restFul.md",
            },
            {
              text: "SpringBoot任务调度",
              link: "/springFramework/springBoot/base/taskScheduling.md",
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
            }
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
