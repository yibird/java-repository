在企业级开发中,通常一个应用会连接多个数据源,每个数据源可能对应不同的业务模块。多数据源常应用于以下几个场景:

- **实现多租户**:多租户用于隔离不同租户产生的数据,多租户有多种实现方式,例如根据数据库实例、根据逻辑数据库、根据数据库字段区分不同租户数据,其成本从前到后越来越高。对于多租户的应用,可以根据不同租户选择对应数据源,从而实现租户级别的隔离和数据存储。
- **数据源的负载均衡**:当数据源需要保证高可用或出现性能瓶颈时,可以搭建多个数据源,根据负载均衡策略来选择合适的数据源,将请求均匀地分配到不同的数据源上,提高系统的整体性能、可用性和可伸缩性。
- **读写分离**:读写分离是一种请求分流的策略,读操作是一个数据源,写操作是另一个数据源,通过读写分离可以有效地提高数据库的读写性能。在读写分离场景下,可以根据读写操作选择合适的数据源,从而实现读写分离。
- **分库分表**:为了提高性能和扩展性,可能会将数据分散到多个数据库或表中,此时需要根据分片规则来选择正确的数据源,实现分库分表。
- **多数据库支持**:在实际开发中,一个应用可能需要同时连接多个不同类型的数据库,如关系型数据库、NoSQL 数据库等。根据业务需求选择不同类型的数据源,实现对多数据库的支持。

## SpringBoot 多数据源类图

- **DataSource**:DataSource 是`javax.sql`包下的一个接口,用于连接到此 DataSource 对象所表示的物理数据源的工厂。DataSource 是 DriverManager 功能的替代方案,是获取连接的首选方式。实现 DataSource 接口的对象通常将注册到基于 Java 命名和目录（JNDI）API 的命名服务。DataSource 接口由驱动程序供应商实现。有三种类型的实现：

  - 基本实现:生成一个标准 Connection 对象。
  - 连接池实现:生成一个 Connection 对象，该对象将自动参与连接池。此实现与中间层连接池管理器一起工作。
  - 分布式事务实现:生成一个 Connection 对象,该对象可以用于分布式事务，并且几乎总是参与连接池。此实现与中间层事务管理器一起工作，并且几乎总是与连接池管理器一起使用。

- **AbstractDataSource**:DataSource 实现的抽象基类,负责填充。此类上下文中的 Padding 表示 DataSource 接口中某些方法的默认实现,如 getLoginTimeout()、setLoginTimeout(int)等。
- **AbstractRoutingDataSource**:一个抽象类,位于`spring-jdbc`jar 包下(主流的 ORM 框架与 SpringBoot 启动器都使用了 spring-jdbc 模块,例如 Mybatis、Mybatisplus、SpringJPA 等等),该抽象类继承自 AbstractDataSource,间接实现了 DataSource 接口,用于在运行时根据查找键动态确定目标数据源（数据库）的方式,适用于在有多个数据库的情况下根据特定条件在它们之间进行切换。继承 AbstractRoutingDataSource 必须要重写 determineCurrentLookupKey()方法(高版本是重写 determineCurrentLookupKey,低版本是重写 determineDataSource),该方法用于动态确定当前使用的数据源的查找键(lookup key)。AbstractRoutingDataSource 的执行时机确切地取决于应用程序中访问数据库的时机,当通过数据源执行实际的数据库操作时,会调用 determineCurrentLookupKey()选择对应数据源。

## dynamic-datasource 多数据源组件

dynamic-datasource 是一个多数据源切换组件,具有如下特性:

- 支持 数据源分组 ，适用于多种场景 纯粹多库 读写分离 一主多从 混合模式。
- 支持数据库敏感配置信息 加密 ENC()。
- 支持每个数据库独立初始化表结构 schema 和数据库 database。
- 支持无数据源启动，支持懒加载数据源（需要的时候再创建连接）。
- 支持 自定义注解 ，需继承 DS(3.2.0+)。
- 提供并简化对 Druid，HikariCp，BeeCp，Dbcp2 的快速集成。
- 提供对 Mybatis-Plus，Quartz，ShardingJdbc，P6sy，Jndi 等组件的集成方案。
- 提供 自定义数据源来源 方案（如全从数据库加载）。
- 提供项目启动后 动态增加移除数据源 方案。
- 提供 Mybatis 环境下的 纯读写分离 方案。
- 提供使用 spel 动态参数 解析数据源方案。内置 spel，session，header，支持自定义。
- 支持 多层数据源嵌套切换 。（ServiceA >>> ServiceB >>> ServiceC）。
- 提供 基于 seata 的分布式事务方案。
- 提供 本地多数据源事务方案。

### dynamic-datasource 切换数据源

使用 dynamic-datasource 非常简单,添加 dynamic-datasource 集成 SpringBoot starter 包,并配置数据源,然后使用该组件提供`@DS`注解指定切换的数据源名称即可,如果不使用`@DS`注解或不指定数据源名称,则默认使用默认数据源。

- 定义 SQL 脚本,创建两个库用于区分不同数据源:

```sql
DROP DATABASE IF EXISTS db1;
CREATE DATABASE db1;
USE db1;
CREATE TABLE `user` (
id BIGINT ( 20 ) PRIMARY KEY AUTO_INCREMENT COMMENT '用户id',
username VARCHAR ( 50 ) NOT NULL COMMENT '用户名',
`password` VARCHAR ( 50 ) NOT NULL COMMENT '密码',
sex TINYINT(1) NOT NULL COMMENT '性别'
)  ENGINE = INNODB CHARACTER
    SET = utf8mb4 COLLATE = utf8mb4_general_ci row_format = dynamic COMMENT '用户表';

INSERT INTO `user`(username,`password`,sex) VALUES('db1-用户1','123123',0),
('db1-用户2','123123',0),
('db1-用户3','123456',1),
('db1-用户4','098765',1),
('db1-用户5','111111',0);


DROP DATABASE IF EXISTS db2;
CREATE DATABASE db2;
USE db2;
CREATE TABLE `user` (
id BIGINT ( 20 ) PRIMARY KEY AUTO_INCREMENT COMMENT '用户id',
username VARCHAR ( 50 ) NOT NULL COMMENT '用户名',
`password` VARCHAR ( 50 ) NOT NULL COMMENT '密码',
sex TINYINT(1) NOT NULL COMMENT '性别'
) ENGINE = INNODB CHARACTER
    SET = utf8mb4 COLLATE = utf8mb4_general_ci row_format = dynamic COMMENT '用户表';

INSERT INTO `user`(username,`password`,sex) VALUES('db2-用户1','123123',0),
('db2-用户2','123123',0),
('db2-用户3','123456',1),
('db2-用户4','098765',1),
('db2-用户5','111111',0);
```

- 添加 dynamic-datasource 集成 SpringBoot starter 包:

```groovy
// dynamic-datasource SpringBoot2.x集成starter
implementation 'com.baomidou:dynamic-datasource-spring-boot-starter:4.3.0'

// dynamic-datasource SpringBoot3.x集成starter
implementation 'com.baomidou:dynamic-datasource-spring-boot3-starter:4.3.0'
```

- 定义数据源配置:

```yaml
spring:
  # 数据源配置
  datasource:
    dynamic:
      # 默认的数据源或者数据源组,默认值即为master
      primary: master
      # 严格匹配数据源,默认false. true未匹配到指定数据源时抛异常,false使用默认数据源
      strict: false
      datasource:
        # 主数据源
        master:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://localhost:3306/db1
          username: root
          password: 123456
        # 从数据源
        slave:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://localhost:3306/db2
          username: root
          password: 123456
```

- 使用`@DS`注解指定数据源名称:

```java
package com.fly.service.impl;

import com.baomidou.dynamic.datasource.annotation.DS;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Description
 * @Author zchengfeng
 * @Date 2024/1/25 17:43:25
 */

@Service
public class UserServiceImpl {
    @Autowired()
    private JdbcTemplate jdbcTemplate;

    /**
     * 如果不使用@DS注解或未指定数据源名称,则使用默认数据源
     *
     * @return 返回用户列表
     */
    public List getUsers() {
        return jdbcTemplate.queryForList("select * from user");
    }

    /**
     * 指定使用slave数据源查询第一个用户
     *
     * @return 第一个用户
     */
    @DS("slave")
    public Object getFirstUser() {
        return jdbcTemplate.queryForList("select * from user limit 1");
    }
}
```

- 单元测试:

```java
package com.fly;

import com.fly.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest(classes = DynamicDataSourceApplication.class)
public class DynamicDataSourceTest {

    @Autowired
    UserServiceImpl userService;

    @Test
    public void test() {
        List users = userService.getUsers();
        System.out.println("users:" + users);
        Object firstUser = userService.getFirstUser();
        System.out.println("firstUser:" + firstUser);
    }
}
```

```txt
// 执行结果如下:
users:[{id=1, username=db1-用户1, password=123123, sex=false}, {id=2, username=db1-用户2, password=123123, sex=false}, {id=3, username=db1-用户3, password=123456, sex=true}, {id=4, username=db1-用户4, password=098765, sex=true}, {id=5, username=db1-用户5, password=111111, sex=false}]
firstUser:[{id=1, username=db2-用户1, password=123123, sex=false}]
```

### dynamic-datasource 自动装配原理

dynamic-datasource 提供了 SpringBoot 启动器,因此,可以从该依赖的`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`文件查看自动配置类,该配置文件中指定了`com.baomidou.dynamic.datasource.spring.boot.autoconfigure.DynamicDataSourceAutoConfiguration`作为配置类,DynamicDataSourceAutoConfiguration 源码如下:

```java

/**
 * 动态数据源核心自动配置类
 *
 * @author TaoYu Kanyuxia
 * @since 1.0.0
 */
@Slf4j
@Configuration(proxyBeanMethods = false)
@AutoConfigureBefore(
        value = DataSourceAutoConfiguration.class,
        name = {
                "com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceAutoConfigure",
                "com.alibaba.druid.spring.boot3.autoconfigure.DruidDataSourceAutoConfigure"
        })
@Import({DruidDynamicDataSourceConfiguration.class, DynamicDataSourceCreatorAutoConfiguration.class, DynamicDataSourceAopConfiguration.class, DynamicDataSourceAssistConfiguration.class})
@ConditionalOnProperty(prefix = DynamicDataSourceProperties.PREFIX, name = "enabled", havingValue = "true", matchIfMissing = true)
public class DynamicDataSourceAutoConfiguration implements InitializingBean {

    private final DynamicDataSourceProperties properties;

    private final List<DynamicDataSourcePropertiesCustomizer> dataSourcePropertiesCustomizers;

    public DynamicDataSourceAutoConfiguration(
            DynamicDataSourceProperties properties,
            ObjectProvider<List<DynamicDataSourcePropertiesCustomizer>> dataSourcePropertiesCustomizers) {
        this.properties = properties;
        this.dataSourcePropertiesCustomizers = dataSourcePropertiesCustomizers.getIfAvailable();
    }

    @Bean
    @ConditionalOnMissingBean
    public DataSource dataSource(List<DynamicDataSourceProvider> providers) {
        DynamicRoutingDataSource dataSource = new DynamicRoutingDataSource(providers);
        dataSource.setPrimary(properties.getPrimary());
        dataSource.setStrict(properties.getStrict());
        dataSource.setStrategy(properties.getStrategy());
        dataSource.setP6spy(properties.getP6spy());
        dataSource.setSeata(properties.getSeata());
        dataSource.setGraceDestroy(properties.getGraceDestroy());
        return dataSource;
    }

    @Override
    public void afterPropertiesSet() {
        if (!CollectionUtils.isEmpty(dataSourcePropertiesCustomizers)) {
            for (DynamicDataSourcePropertiesCustomizer customizer : dataSourcePropertiesCustomizers) {
                customizer.customize(properties);
            }
        }
    }

}
```

- **@Configuration**:该注解表示当前类是一个配置类,该类中定义的方法通常用于声明和定义 Spring Bean。proxyBeanMethods 参数控制是否启用方法代理,为 false 时表示禁用方法代理,每次调用 @Bean 注解的方法都返回实际的 Bean 实例,不进行拦截。
- **@AutoConfigureBefore**: 该注解是 Spring Boot 中用于控制自动配置类加载顺序的注解。通过使用这个注解,可以明确指定某个自动配置类应该在另一个之前被加载。为了防止和 SpringBoot 默认的启动器 DataSourceAutoConfiguration 和 Druid 自动配置类(DruidDataSourceAutoConfigure)产生冲突,设置该配置要在其自动配置之前进行配置。
- **@Import**:该注解是 Spring 中的一个配置注解,它用于将一个或多个配置类导入到当前配置类中,以便共享其中定义的 Bean 或其他配置信息。DynamicDataSourceAutoConfiguration 使用@Import 导入了 DruidDynamicDataSourceConfiguration、DynamicDataSourceCreatorAutoConfiguration、DynamicDataSourceAopConfiguration、DynamicDataSourceAssistConfiguration 四个类,其作用如下:
  - **DruidDynamicDataSourceConfiguration**:Druid 动态数据源配置类,复用 Druid 的自动配置。
  - **DynamicDataSourceCreatorAutoConfiguration**:该配置类用于向容器注入 DataSource 创建器(DataSourceCreator)的 bean,提供 7 种创建器(JNDI、Druid，Hikari、BeeCp、Dbcp2、Atomikos、基础,Bean 的加载顺序从左到右)。DataSourceCreator 是一个接口,提供了用于根据 DataSourceProperty 创建 DataSource 的方法。
  - **DynamicDataSourceAopConfiguration**:动态数据源核心自动配置类。
  - **DynamicDataSourceAssistConfiguration**:动态数据源核心自动配置类。
- **@ConditionalOnProperty**:根据属性值注入 Bean,@ConditionalOnProperty(prefix = DynamicDataSourceProperties.PREFIX, name = "enabled", havingValue = "true", matchIfMissing = true)表示配置`spring.datasource.dynamic.enable=false`来关闭动态数据源配置。

其中 DynamicDataSourceAopConfiguration 和 DynamicDataSourceAssistConfiguration 是数据源切换的核心类,这两个类向 Spring 容器注入了以下 beans:

- **DynamicDataSourceProvider**:多数据源加载接口,默认的实现为从 yml 信息(即 YmlDynamicDataSourceProvider)中加载所有数据源,也可以自定义实现从其他地方加载所有数据源。该接口提供了提供一个方法 loadDataSources 用于加载多个数据源(DataSources)。

```java
/**
 * 多数据源加载接口，默认的实现为从yml信息中加载所有数据源 你可以自己实现从其他地方加载所有数据源
 *
 * @author TaoYu Kanyuxia
 * @since 1.0.0
 */
public interface DynamicDataSourceProvider {

    /**
     * 加载所有数据源
     *
     * @return 所有数据源，key为数据源名称
     */
    Map<String, DataSource> loadDataSources();
}
```

- **Advisor(通知器)**:在 Spring AOP 中,Advisor（通知器）是一种对象，用于将切面逻辑（通知）与切点（连接点的匹配条件）关联起来。Advisor 封装了切面的信息，并告诉 Spring 在什么时候以及在哪里执行切面逻辑。在 DynamicDataSourceAopConfiguration 中定义了两种 Advisor,分别用于处理`@DS` 和`@DSTransactional` 注解,`@DS` 是数据源的核心注解,`@DSTransactional` 用于处理数据源的事务问题,其源码如下:

```java
// 使用DynamicDataSourceAnnotationInterceptor拦截器处理DynamicDataSourceAnnotationAdvisor通知器,当访问@DS注解时会触发DynamicDataSourceAnnotationInterceptor中的invoke()
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
@Bean
@ConditionalOnProperty(prefix = DynamicDataSourceProperties.PREFIX + ".aop", name = "enabled", havingValue = "true", matchIfMissing = true)
public Advisor dynamicDatasourceAnnotationAdvisor(DsProcessor dsProcessor) {
    DynamicDatasourceAopProperties aopProperties = properties.getAop();
    DynamicDataSourceAnnotationInterceptor interceptor = new DynamicDataSourceAnnotationInterceptor(aopProperties.getAllowedPublicOnly(), dsProcessor);
    DynamicDataSourceAnnotationAdvisor advisor = new DynamicDataSourceAnnotationAdvisor(interceptor, DS.class);
    advisor.setOrder(aopProperties.getOrder());
    return advisor;
}

@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
@Bean
@ConditionalOnProperty(prefix = DynamicDataSourceProperties.PREFIX, name = "seata", havingValue = "false", matchIfMissing = true)
public Advisor dynamicTransactionAdvisor() {
    DynamicDatasourceAopProperties aopProperties = properties.getAop();
    DynamicLocalTransactionInterceptor interceptor = new DynamicLocalTransactionInterceptor(aopProperties.getAllowedPublicOnly());
    return new DynamicDataSourceAnnotationAdvisor(interceptor, DSTransactional.class);
}
```

- **DsProcessor(处理器)**:数据源的处理器,用于解析配置的注解内容来决定使用什么数据源。

### dynamic-datasource 切换数据源原理

dynamic-datasource 通过@DS 注解切换数据源,当执行数据库操作时,会调用 AbstractRoutingDataSource 的 determineDataSource()选择对应数据源。dynamic-datasource 提供了 DynamicRoutingDataSource 类,该继承自 AbstractRoutingDataSource 抽象类重写了 determineDataSource()方法。切换数据源大致流程如下:

- 由于在自动装配时,向 Spring 容器注入两个 Advisor,当访问带有@DS 注解的类或方法时,会调用 DynamicDataSourceAnnotationInterceptor 拦截器中的 invoke()用于处理切面逻辑。invoke()中调用了 determineDatasourceKey()根据 MethodInvocation(方法请求)对象获取数据源名称。

```java
public class DynamicDataSourceAnnotationInterceptor implements MethodInterceptor {
    /**
     * The identification of SPEL.
     */
    private static final String DYNAMIC_PREFIX = "#";
    // 数据源解析器
    private final DataSourceClassResolver dataSourceClassResolver;
    private final DsProcessor dsProcessor;

    /**
     * init
     *
     * @param allowedPublicOnly allowedPublicOnly
     * @param dsProcessor       dsProcessor
     */
    public DynamicDataSourceAnnotationInterceptor(Boolean allowedPublicOnly, DsProcessor dsProcessor) {
        dataSourceClassResolver = new DataSourceClassResolver(allowedPublicOnly);
        this.dsProcessor = dsProcessor;
    }

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        String dsKey = determineDatasourceKey(invocation);
        // 入栈
        DynamicDataSourceContextHolder.push(dsKey);
        try {
            return invocation.proceed();
        } finally {
            // 出栈
            DynamicDataSourceContextHolder.poll();
        }
    }
    /**
     * Determine the key of the datasource
     *
     * @param invocation MethodInvocation
     * @return dsKey
     */
    private String determineDatasourceKey(MethodInvocation invocation) {
        String key = dataSourceClassResolver.findKey(invocation.getMethod(), invocation.getThis(), DS.class);
        return key.startsWith(DYNAMIC_PREFIX) ? dsProcessor.determineDatasource(invocation, key) : key;
    }
}
```

- determineDatasourceKey()通过 DataSourceClassResolver(数据源解析器)解析@DS 注解中的 SPEL 表达式后获取数据源名(例如`@DS("master")`解析后的数据源为 master),然后通过 DSProcessor(数据源执行器)执行 determineDatasource()决定数据源。DSProcessor 类中维护了一个 DsProcessor 实例,表示下一个执行器,当数据源名不匹配时,会调用下一个执行器。
- 获取数据源名称(dsKey)后,会将 dsKey 入栈到 DynamicDataSourceContextHolder 中,DynamicDataSourceContextHolder 是一个基于 ThreadLocal 的切换数据源工具类(ContextHolder 即上下文持久者,是 Java 领域上下文通信的一种模式,该模式的核心通过 ThreadLocal 存储上下文,以保证线程安全)。该类内部持有一个 ThreadLocal,用于存储所有数据源名称,ThreadLocal 为每个线程分配了一个 ArrayDeque 队列,虽然是队列,但实际上被当做栈使用,用于支持嵌套切换。

```java
public final class DynamicDataSourceContextHolder {

    /**
     * 为什么要用链表存储(准确的是栈)
     * <pre>
     * 为了支持嵌套切换，如ABC三个service都是不同的数据源
     * 其中A的某个业务要调B的方法，B的方法需要调用C的方法。一级一级调用切换，形成了链。
     * 传统的只设置当前线程的方式不能满足此业务需求，必须使用栈，后进先出。
     * </pre>
     */
    private static final ThreadLocal<Deque<String>> LOOKUP_KEY_HOLDER = new NamedThreadLocal<Deque<String>>("dynamic-datasource") {
        @Override
        protected Deque<String> initialValue() {
            return new ArrayDeque<>();
        }
    };

    private DynamicDataSourceContextHolder() {
    }

    /**
     * 获得当前线程数据源
     *
     * @return 数据源名称
     */
    public static String peek() {
        return LOOKUP_KEY_HOLDER.get().peek();
    }

    /**
     * 设置当前线程数据源
     * <p>
     * 如非必要不要手动调用，调用后确保最终清除
     * </p>
     *
     * @param ds 数据源名称
     * @return 数据源名称
     */
    public static String push(String ds) {
        String dataSourceStr = DsStrUtils.isEmpty(ds) ? "" : ds;
        LOOKUP_KEY_HOLDER.get().push(dataSourceStr);
        return dataSourceStr;
    }

    /**
     * 清空当前线程数据源
     * <p>
     * 如果当前线程是连续切换数据源 只会移除掉当前线程的数据源名称
     * </p>
     */
    public static void poll() {
        Deque<String> deque = LOOKUP_KEY_HOLDER.get();
        deque.poll();
        if (deque.isEmpty()) {
            LOOKUP_KEY_HOLDER.remove();
        }
    }

    /**
     * 强制清空本地线程
     * <p>
     * 防止内存泄漏，如手动调用了push可调用此方法确保清除
     * </p>
     */
    public static void clear() {
        LOOKUP_KEY_HOLDER.remove();
    }
}
```

- 由于 DynamicRoutingDataSource 实现了 InitializingBean 并重写了 afterPropertiesSet()方法,因此会在 Spring 容器在实例化和配置 Bean 时执行该方法。afterPropertiesSet()中遍历了 DynamicDataSourceProvider(多数据源提供者)集合中所有数据源并添加到分组数据源中(一个 map 集合,key 为分组名,value 为 DataSource)。DynamicRoutingDataSource 内部维护了两个 Map,一个用于存储所有数据源,一个用户存储分组数据源。

```java

/**
 * 核心动态数据源组件
 *
 * @author TaoYu Kanyuxia
 * @since 1.0.0
 */
@Slf4j
public class DynamicRoutingDataSource extends AbstractRoutingDataSource implements InitializingBean, DisposableBean {

    private static final String UNDERLINE = "_";
    /**
     * 所有数据库,使用ConcurrentHashMap保证线程安全
     */
    private final Map<String, DataSource> dataSourceMap = new ConcurrentHashMap<>();
    /**
     * 分组数据库,使用ConcurrentHashMap保证线程安全
     */
    private final Map<String, GroupDataSource> groupDataSources = new ConcurrentHashMap<>();
    /**
     * 动态数据源提供者集合,DynamicRoutingDataSource实现了InitializingBean接口并重写了afterPropertiesSet()方法,
     * 该方法在Spring 容器在实例化和配置 Bean时执行。afterPropertiesSet()中遍历了providers中所有数据源并添加到
     * 分组groupDataSources中
     */
    private final List<DynamicDataSourceProvider> providers;
    @Setter
    private Class<? extends DynamicDataSourceStrategy> strategy = LoadBalanceDynamicDataSourceStrategy.class;
    @Setter
    private String primary = "master";
    @Setter
    private Boolean strict = false;
    @Setter
    private Boolean p6spy = false;
    @Setter
    private Boolean seata = false;
    @Setter
    private Boolean graceDestroy = false;

    public DynamicRoutingDataSource(List<DynamicDataSourceProvider> providers) {
        this.providers = providers;
    }

    @Override
    protected String getPrimary() {
        return primary;
    }

    @Override
    public DataSource determineDataSource() {
        String dsKey = DynamicDataSourceContextHolder.peek();
        return getDataSource(dsKey);
    }


    private DataSource determinePrimaryDataSource() {
        log.debug("dynamic-datasource switch to the primary datasource");
        DataSource dataSource = dataSourceMap.get(primary);
        if (dataSource != null) {
            return dataSource;
        }
        GroupDataSource groupDataSource = groupDataSources.get(primary);
        if (groupDataSource != null) {
            return groupDataSource.determineDataSource();
        }
        throw new CannotFindDataSourceException("dynamic-datasource can not find primary datasource");
    }

    /**
     * 获取所有的数据源
     *
     * @return 当前所有数据源
     */
    public Map<String, DataSource> getDataSources() {
        return dataSourceMap;
    }

    /**
     * 获取的所有的分组数据源
     *
     * @return 当前所有的分组数据源
     */
    public Map<String, GroupDataSource> getGroupDataSources() {
        return groupDataSources;
    }

    /**
     * 获取数据源
     *
     * @param ds 数据源名称
     * @return 数据源
     */
    public DataSource getDataSource(String ds) {
        if (DsStrUtils.isEmpty(ds)) {
            return determinePrimaryDataSource();
        } else if (!groupDataSources.isEmpty() && groupDataSources.containsKey(ds)) {
            log.debug("dynamic-datasource switch to the datasource named [{}]", ds);
            return groupDataSources.get(ds).determineDataSource();
        } else if (dataSourceMap.containsKey(ds)) {
            log.debug("dynamic-datasource switch to the datasource named [{}]", ds);
            return dataSourceMap.get(ds);
        }
        if (strict) {
            throw new CannotFindDataSourceException("dynamic-datasource could not find a datasource named " + ds);
        }
        return determinePrimaryDataSource();
    }

    /**
     * 添加数据源
     *
     * @param ds         数据源名称
     * @param dataSource 数据源
     */
    public synchronized void addDataSource(String ds, DataSource dataSource) {
        DataSource oldDataSource = dataSourceMap.put(ds, dataSource);
        // 新数据源添加到分组
        this.addGroupDataSource(ds, dataSource);
        // 关闭老的数据源
        if (oldDataSource != null) {
            closeDataSource(ds, oldDataSource, graceDestroy);
        }
        log.info("dynamic-datasource - add a datasource named [{}] success", ds);
    }

    /**
     * 新数据源添加到分组
     *
     * @param ds         新数据源的名字
     * @param dataSource 新数据源
     */
    private void addGroupDataSource(String ds, DataSource dataSource) {
        if (ds.contains(UNDERLINE)) {
            String group = ds.split(UNDERLINE)[0];
            GroupDataSource groupDataSource = groupDataSources.get(group);
            if (groupDataSource == null) {
                try {
                    groupDataSource = new GroupDataSource(group, strategy.getDeclaredConstructor().newInstance());
                    groupDataSources.put(group, groupDataSource);
                } catch (Exception e) {
                    throw new RuntimeException("dynamic-datasource - add the datasource named " + ds + " error", e);
                }
            }
            groupDataSource.addDatasource(ds, dataSource);
        }
    }

    /**
     * 删除数据源
     *
     * @param ds 数据源名称
     */
    public synchronized void removeDataSource(String ds) {
        if (!DsStrUtils.hasText(ds)) {
            throw new RuntimeException("remove parameter could not be empty");
        }
        if (primary.equals(ds)) {
            throw new RuntimeException("could not remove primary datasource");
        }
        if (dataSourceMap.containsKey(ds)) {
            DataSource dataSource = dataSourceMap.remove(ds);
            closeDataSource(ds, dataSource, graceDestroy);
            if (ds.contains(UNDERLINE)) {
                String group = ds.split(UNDERLINE)[0];
                if (groupDataSources.containsKey(group)) {
                    DataSource oldDataSource = groupDataSources.get(group).removeDatasource(ds);
                    if (oldDataSource == null) {
                        log.warn("fail for remove datasource from group. dataSource: {} ,group: {}", ds, group);
                    }
                }
            }
            log.info("dynamic-datasource - remove the database named [{}] success", ds);
        } else {
            log.warn("dynamic-datasource - could not find a database named [{}]", ds);
        }
    }

    @Override
    public void destroy() {
        log.info("dynamic-datasource start closing ....");
        for (Map.Entry<String, DataSource> item : dataSourceMap.entrySet()) {
            closeDataSource(item.getKey(), item.getValue(), false);
        }
        log.info("dynamic-datasource all closed success,bye");
    }

    @Override
    public void afterPropertiesSet() {
        // 检查开启了配置但没有相关依赖
        checkEnv();
        // 添加并分组数据源
        Map<String, DataSource> dataSources = new HashMap<>(16);
        for (DynamicDataSourceProvider provider : providers) {
            Map<String, DataSource> dsMap = provider.loadDataSources();
            if (dsMap != null) {
                dataSources.putAll(dsMap);
            }
        }
        for (Map.Entry<String, DataSource> dsItem : dataSources.entrySet()) {
            addDataSource(dsItem.getKey(), dsItem.getValue());
        }
        // 检测默认数据源是否设置
        if (groupDataSources.containsKey(primary)) {
            log.info("dynamic-datasource initial loaded [{}] datasource,primary group datasource named [{}]", dataSources.size(), primary);
        } else if (dataSourceMap.containsKey(primary)) {
            log.info("dynamic-datasource initial loaded [{}] datasource,primary datasource named [{}]", dataSources.size(), primary);
        } else {
            log.warn("dynamic-datasource initial loaded [{}] datasource,Please add your primary datasource or check your configuration", dataSources.size());
        }
    }

    private void checkEnv() {
        if (p6spy) {
            try {
                Class.forName("com.p6spy.engine.spy.P6DataSource");
                log.info("dynamic-datasource detect P6SPY plugin and enabled it");
            } catch (Exception e) {
                throw new RuntimeException("dynamic-datasource enabled P6SPY ,however without p6spy dependency", e);
            }
        }
        if (seata) {
            try {
                Class.forName("io.seata.rm.datasource.DataSourceProxy");
                log.info("dynamic-datasource detect ALIBABA SEATA and enabled it");
            } catch (Exception e) {
                throw new RuntimeException("dynamic-datasource enabled ALIBABA SEATA,however without seata dependency", e);
            }
        }
    }

    /**
     * close db
     *
     * @param ds           dsName
     * @param dataSource   db
     * @param graceDestroy If true, close the connection after a delay.
     */
    private void closeDataSource(String ds, DataSource dataSource, boolean graceDestroy) {
        try {
            DataSource realDataSource = null;
            if (dataSource instanceof ItemDataSource) {
                realDataSource = ((ItemDataSource) dataSource).getRealDataSource();
            } else {
                if (seata) {
                    if (dataSource instanceof DataSourceProxy) {
                        DataSourceProxy dataSourceProxy = (DataSourceProxy) dataSource;
                        realDataSource = dataSourceProxy.getTargetDataSource();
                    }
                }
                if (p6spy) {
                    if (dataSource instanceof P6DataSource) {
                        Field realDataSourceField = P6DataSource.class.getDeclaredField("realDataSource");
                        realDataSourceField.setAccessible(true);
                        realDataSource = (DataSource) realDataSourceField.get(dataSource);
                    }
                }
            }
            if (null != realDataSource) {
                DataSourceDestroyer destroyer = new DefaultDataSourceDestroyer();
                if (graceDestroy) {
                    destroyer.asyncDestroy(ds, realDataSource);
                } else {
                    destroyer.destroy(ds, realDataSource);
                }
            }
        } catch (Exception e) {
            log.warn("dynamic-datasource closed datasource named [{}] failed", ds, e);
        }
    }

}
```

- 由于 DynamicRoutingDataSource 继承了 AbstractRoutingDataSource 并重写了 determineDataSource()方法,当访问数据库操作时,会调用该方法。determineDataSource()方法中调用了 DynamicDataSourceContextHolder.peek()获取数据源名称(dsKey),然后调用 getDataSource()根据数据源名称从所有数据源和分组数据源 Map 获取对应数据源。
- 执行 getDataSource()后,首先判断数据源(ds)是否为空,如果为空调用 determinePrimaryDataSource()使用默认数据源(master);如果分组数据源(groupDataSources)中存在该数据源则立即返回对应数据源,如果所有数据源(dataSourceMap)中存在该数据源则立即返回对应数据源,如果找不到数据源则会抛出 CannotFindDataSourceException 异常,否则将调用 determinePrimaryDataSource()使用默认数据源。至此

简单来说,dynamic-datasource 切换数据源实现原理基于 Spring 提供的 AbstractRoutingDataSource 抽象类,初始化时获取所有数据源并注册到 map 中,其中 key 为数据源名,value 为对应的 DataSource,当访问数据源注解时,通过 AOP 切面拦截获取目标数据源名,并将数据源名添加到 ThreadLocal 栈中。当访问数据库操作时,由于实现了 AbstractRoutingDataSource 类会调用 determineDataSource()方法,从 ThreadLocal 中出栈获取数据源名,根据数据源名从数据源 map 中获取 DataSource,从而实现了数据源切换。

## 自定义切换数据源注解
