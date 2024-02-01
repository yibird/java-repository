## 1.Spring 事务介绍

Spring 事务管理是 Spring 框架中的重要特性之一,它提供了声明式事务和编程式事务两种方式进行事务的管理。Spring 事务本质上是对事务功能的抽象,其底层依赖于数据源的事务支持,如果数据源不支持事务(大部分关系型数据库都支持事务,例如 Mysql、PgSQL、Oracle),即使启用了事务也不会生效。

在 Spring 框架中,spring-tx 模块是用于提供声明式事务管理的模块。它包含了 Spring 框架的事务相关的核心功能,包括声明式事务的实现和事务管理的基本接口和类。大多数 ORM 集成 SpringBoot starter 内置了 spring-tx,例如`mybatis-plus-boot-starter`、`spring-boot-starter-data-jpa`、`spring-boot-starter-jdbc`,因此无需手动添加 spring-tx 依赖,否则需要手动添加 spring-tx。

```groovy
implementation 'org.springframework:spring-tx:6.0.11'
```

### 1.1 Spring 事务相关类介绍

- PlatformTransactionManager:Spring 事务的核心接口,定义了事务管理器的基本操作。
- DataSourceTransactionManager:实现了 PlatformTransactionManager 接口,用于管理基于 JDBC 的事务。例如 mybatis-spring 源码中实现了 DataSourceTransactionManager 接口,实现事务控制和管理。
- HibernateTransactionManager:实现了 PlatformTransactionManager 接口,用于管理基于 Hibernate 的事务。
- JpaTransactionManager:实现了 PlatformTransactionManager 接口,用于管理基于 JPA 的事务。
- TransactionDefinition:接口，定义了事务的属性,如隔离级别、传播行为、超时时间等。
- TransactionStatus:接口,表示当前事务的状态,如已提交、已回滚、已暂挂等。
- TransactionAspectSupport:Spring AOP 切面,用于处理事务相关的逻辑。
- TransactionInterceptor:Spring AOP 拦截器,用于拦截带有 @Transactional 注解的方法,启动和管理事务。

### 1.2 Spring 声明式事务

Spring 声明式事务采用注解或 XML 配置方式,通过在方法上或类上添加事务注解来声明事务,将事务的控制交给 Spring 容器来管理,开发人员无需关心事务管理的具体实现。声明式事务适用于大部分的事务场景,可以提高代码的可维护性和可读性。Spring 声明式事务的粒度是方法级,当遇到一些特殊情况下(例如对性能敏感),推荐使用编程式事务。

### 1.3 Spring 编程式事务

Spring 编程式事务需要在代码中通过编程的方式来管理事务,需要显式的调用事务管理器的接口,手动开启、提交或回滚事务。编程式事务的优点是可以更加灵活地控制事务,可以在事务的开始和结束处添加特定的逻辑处理,但是代码冗长、可维护性差,不适用于复杂的事务场景。Spring 编程式提供事务管理器和 TransactionTemplate(事务模板类)两种方式操作事务。

#### 1.3 基于事务管理器操作事务

- 定义数据源:

```properties
# mysql数据源配置
spring.datasource.url=jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=123456
```

- 配置事务管理器:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;


@Configuration
@EnableTransactionManagement // 启用事务管理器
public class TransactionManagementConfig {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.driverClassName}")
    private String driverClassName;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    // 配置数据源
    @Bean
    public DataSource dataSource() {
        // 创建驱动程序管理器数据源
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    // 向IOC容器注入PlatformTransactionManager实例
    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        // 创建一个JDBC事务管理器
        return new DataSourceTransactionManager(dataSource);
    }
}
```

- 使用事务管理器,实现事务的提交、回滚操作。

```java
public class MyService {

    @Autowired
    private PlatformTransactionManager transactionManager;

    public void operateWithTransaction() {
        // 根据默认事务管理器获取TransactionDefinition对象
        TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
        // 获取事务状态对象
        TransactionStatus transactionStatus = transactionManager
        	.getTransaction(transactionDefinition);

        try {
            // 在此进行数据库操作或其他需要事务的操作
            // 如果操作失败,将会回滚
            // 如果操作成功,将会提交
            transactionManager.commit(transactionStatus);
        } catch (Exception e) {
            transactionManager.rollback(transactionStatus);
            throw e;
        }
    }
}
```

#### 1.4.2 基于 TransactionTemplate 操作事务

TransactionTemplate 是 Spring 框架提供的一个用于编程式管理事务的工具类,它支持以编程式的方式手动控制事务的提交和回滚。TransactionTemplate 提供方法签名如下:

- `execute(TransactionCallback<T> action)`:在事务中执行给定 TransactionCallback 指定的操作,一般用于有返回值的事务操作。
- `executeWithoutResult(Consumer<TransactionStatus> action)`:在事务中执行给定 Runnable 指定的操作,一般用于无返回值的事务操作。
- setTransactionManager(@Nullable PlatformTransactionManager transactionManager):设置事务管理器。
- setPropagationBehavior(int propagationBehavior):设置事务传播行为。必须是 TransactionDefinition 接口中的传播常数之一。默认值为 PROPAGATION_REQUIRED。
- setPropagationBehaviorName(String constantName):通过 TransactionDefinition 中相应常量的名称设置传播行为,例如"propagation_REQUIRED"。
- setIsolationLevel(int isolationLevel):设置事务隔离级别。必须是 TransactionDefinition 接口中的隔离常数之一。默认值为 ISOLATION_Default。
- setIsolationLevelName(String constantName):根据 TransactionDefinition 中相应常量的名称设置隔离级别,例如"isolation_DEFAULT"。
- setName(String name):设置事务的名称,默认值为 null。
- setTimeout(int timeout):设置事务的超时时间(单位秒),默认值为 TIMEOUT_Default(-1,即事务永不超时)。
- setReadOnly(boolean readOnly):设置是否优化为只读事务,默认值为"false"。
- getTransactionManager():获取事务管理器,返回一个 PlatformTransactionManager 实例。
- afterPropertiesSet():
- getIsolationLevel():返回 int 类型,以表示事务隔离级别。
- getName():返回事务名称。
- getPropagationBehavior():返回 int 类型,以表示事务传播行为。
- getTimeout():返回 int 类型,表示事务的超时时间。

TransactionStatus 接口表示一个事务的状态,它包含当前事务的一些基本信息。TransactionStatus 提供的方法如下:

- isNewTransaction():是否是新的事务,而不是已有事务的一部分。
- Object createSavepoint():创建一个新的保存点。可以通过 rollbackToSavepoint 回滚到特定的保存点,并通过 releaseSavepoint 显式释放不再需要的保存点。
- setRollbackOnly():仅设置事务回滚。这指示事务管理器,事务的唯一可能结果可能是回滚,而不是引发异常,从而触发回滚。
- flush():将底层会话刷新到数据存储(如果适用),例如所有受影响的 Hibernate/JPA 会话。
- boolean hasSavepoint():返回此事务内部是否携带保存点，即是否已创建为基于保存点的嵌套事务。
- boolean isCompleted():返回此事务是否已完成,即是否已提交或回滚。
- boolean isNewTransaction():返回当前事务是否为新事务,以其他方式参与现有事务,或者可能一开始就不在实际事务中运行。
- boolean isRollbackOnly():返回事务是否已标记为仅回滚(由应用程序或事务基础结构)。
- releaseSavepoint(Object savepoint):显式释放给定的保存点。请注意,大多数事务管理器都会在事务完成时自动释放保存点。
- rollbackToSavepoint(Object savepoint):回滚到给定的保存点。保存点之后不会自动释放,可以显式调用 releaseSavepoint(Object),也可以依赖于事务完成时的自动释放。

TransactionTemplate 使用步骤如下:

- 配置 TransactionTemplate。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class TransactionConfig {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.driverClassName}")
    private String driverClassName;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    // 配置数据源
    @Bean
    public DataSource dataSource() {
        // 创建驱动程序管理器数据源
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    // 向IOC容器注入PlatformTransactionManager实例
    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        // 创建一个JDBC事务管理器
        return new DataSourceTransactionManager(dataSource);
    }

    /**
     * 向IOC容器注入TransactionTemplate实例,通过事务管理器创建一个
     * TransactionTemplate实例
     */
    @Bean
    public TransactionTemplate transactionTemplate(PlatformTransactionManager transactionManager) {
        return new TransactionTemplate(transactionManager);
    }
}
```

- 使用 TransactionTemplate 操作事务。

```java
package com.fly.security.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.function.Consumer;

@Service
@AllArgsConstructor
public class MyService {

    /**
     * TransactionTemplate提供方法如下:
     * - execute
     */
    private final TransactionTemplate template;

    public void operateWithTransaction() {
        // 执行事务且事务操作有返回值
        String execute = template.execute(new TransactionCallback<String>() {
            /**
             * 开始执行事务。如果execute正常执行则TransactionTemplate会自动提交事务,
             * 如果execute执行过程出现RuntimeException或手动调用TransactionStatus
             * 的setRollbackOnly()则会回滚事务
             */
            @Override
            public String doInTransaction(TransactionStatus status) {
                try {
                    // 业务逻辑
                } catch (Exception e) {
                    // 回滚事务
                    status.setRollbackOnly();
                    e.printStackTrace();
                }
                return "success";
            }
        });

        // 执行事务且事务操作无返回值,该方法内部调用了execute方法
        template.executeWithoutResult(new Consumer<TransactionStatus>() {
            // 执行事务
            @Override
            public void accept(TransactionStatus transactionStatus) {

            }
        });
    }
}
```

#### 1.4.3 TransactionalOperator 操作事务

TransactionalOperator 是 Spring Framework 6 中新增的功能,它提供声明式事务管理的编程式替代方案,适用于反应式编程。使用 TransactionalOperator 需要 spring 响应式和 r2dbc 模块支持:

- spring-boot-starter-webflux:Spring Boot 提供的用于构建响应式 Web 应用的启动器,其内部包含了响应式相关组件依赖,如 Reactor Core、Reactor Netty 等。
- spring-boot-starter-data-r2dbc:r2dbc 与 SpringBoot 的 starter。R2DBC(Reactive Relational Database Connectivity) 是一种响应式数据库连接规范和库,它为关系型数据库提供了非阻塞和基于 Reactor 的访问方式。R2DBC 通过响应式和非阻塞 IO,可以实现高效的数据库交互,是关系数据库接入的下一代解决方案。

TransactionalOperator 使用方式如下:

- 创建事务配置类,注入 TransactionalOperator 实例。

```java
package com.fly.config;

import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.reactive.TransactionalOperator;

import javax.sql.DataSource;

/**
 * @Description:
 * @Author: zchengfeng
 * @Date: 2023/8/4 03:55
 */
@Configuration
public class TransactionConfig {

    // 向IOC注入响应式事务管理器
    @Bean
    public ReactiveTransactionManager transactionManager(DataSource dataSource){
        ConnectionFactory factory = ConnectionFactories.get("r2dbc:postgresql://localhost/test");
        return new R2dbcTransactionManager(factory);
    }

    // 向IOC容器注入TransactionalOperator实例
    @Bean
    public TransactionalOperator transactionalOperator(ReactiveTransactionManager manager){
        return TransactionalOperator.create(manager);
    }
}
```

- 使用 TransactionalOperator 实现事务操作。

```java
package com.fly.service;

import lombok.AllArgsConstructor;
import org.reactivestreams.Publisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.ReactiveTransaction;
import org.springframework.transaction.reactive.TransactionCallback;
import org.springframework.transaction.reactive.TransactionalOperator;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;

@Service
@AllArgsConstructor
public class MyService {
    private final TransactionalOperator operator;

    public void test() {
        /**
         * 以事务方式执行Mono操作,Mono也可以是异步的,TransactionalOperator
         * 会订阅它的完成事件来决定事务提交。
         */
        Mono<String> result = operator.transactional(Mono.fromSupplier(() -> {
            return "success";
        }));

        /**
         * flux中所有的代码都会在同一事务中执行,flux也可以是异步的,
         * TransactionalOperator会追踪它的终止事件。
         */
        Flux<String> flux = Flux.fromStream(Arrays.stream(new String[]{
                "step 1", "step 2"
        }));
        operator.transactional(flux);

        // 执行事务
        operator.execute(new TransactionCallback<Object>() {
            // 开始执行事务
            @Override
            public Publisher<Object> doInTransaction(ReactiveTransaction status) {
                try {
                    // 执行业务逻辑
                } catch (Exception e) {
                    // 回滚事务
                    status.setRollbackOnly();
                    e.printStackTrace();
                }
                return null;
            }
        });
    }
}
```

### 1.4 事务事件监听

在 Spring 中,提供@TransactionalEventListener 注解监听事务的不同阶段的事件信息,注意:@TransactionalEventListener 注解只对声明式事务起作用，对编程式事务无效。仅适用于由 PlatformTransactionManager 管理的线程绑定事务。

@TransactionalEventListener 注解签名:

```java
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@EventListener
public @interface TransactionalEventListener {

	/**
	 * 将事件处理绑定到的阶段。默认为TransactionPhase.AFTER_COMMIT,
     * 如果没有正在进行的事务,则根本不会处理该事件,除非显式启用了fallbackExecution
	 */
	TransactionPhase phase() default TransactionPhase.AFTER_COMMIT;

	/**
	 * 如果没有事务正在运行,是否应处理事件。
	 */
	boolean fallbackExecution() default false;

	@AliasFor(annotation = EventListener.class, attribute = "classes")
	Class<?>[] value() default {};

	@AliasFor(annotation = EventListener.class, attribute = "classes")
	Class<?>[] classes() default {};

	/**
	 * 用于使事件处理具有条件的Spring Expression Language（SpEL）属性
	 */
	@AliasFor(annotation = EventListener.class, attribute = "condition")
	String condition() default "";

	/**
	 * 事务侦听器的可选标识符,默认为完全限定的声明方法的签名,
     * 例如mypackage.MyClass.myMethod()
	 */
	@AliasFor(annotation = EventListener.class, attribute = "id")
	String id() default "";

}
```

TransactionPhase 是一个事务阶段枚举,签名如下:

```java
public enum TransactionPhase {
  BEFORE_COMMIT, // 事务提交前触发
  AFTER_COMMIT, // 事务提交后触发
  AFTER_ROLLBACK, // 事务回滚触发
  AFTER_COMPLETION // 事务完成后 触发
}
```

创建事务组件类,提供四个方法用于监听事务不同阶段。

```java
package com.fly.service;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class TxListenerComponent {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUsersAfterCommit(String text) {
        System.out.println("AfterCommit收到事件通知:" + text);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMPLETION)
    public void handleUsersAfterCompletion(String text) {
        System.out.println("AfterCompletion收到事件通知:" + text);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void handleUsersAfterRollback(String text) {
        System.out.println("AfterRollback收到事件通知:" + text);
    }

    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleUsersBeforeCommit(String text) {
        System.out.println("BeforeCommit收到事件通知:" + text);
    }
}
```

事务发布类,用于在执行事务时发布事件,事务执行到不同阶段会触发相应的事务监听器,事务监听器可以获取 publish()发布事件。

```java
package com.fly.service;

import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;


@Component
@AllArgsConstructor
public class TxPublisher {
    private final TransactionTemplate transactionTemplate;
    // 事件发布器接口,用于发布Spring应用事件(ApplicationEvent)
    private final ApplicationEventPublisher publisher;

    public void method() {
       transactionTemplate.execute(new TransactionCallback<>() {
           @Override
           public Object doInTransaction(TransactionStatus status) {
               // 执行业务逻辑...
               return null;
           }
       });
        // 发布事件
        publisher.publishEvent(new CustomEvent("CustomEvent"));
    }

    // 自定义事件,继承自ApplicationEvent抽象类
    public class CustomEvent extends ApplicationEvent {
        public CustomEvent(Object source) {
            super(source);
        }
    }
}
```

## 2.事务的七种传播特性

在 Spring 中,事务传播机制是控制多个事务方法之间相互调用的行为方式。Spring 中共支持 7 种事务传播机制,它们是：

- REQUIRED:默认传播行为,如果当前存在事务则加入,如果不存在则创建一个新事务。REQUIRED 适合大部分业务场景,可以提高系统的整体性能。
- SUPPORTS:如果当前存在事务就加入,否则不使用事务。SUPPORTS 适合只读的业务方法,提高并发性能。
- MANDATORY:强制要求当前存在事务,如果不存在就抛出异常。MANDATORY 适合强制要求当前存在事务的情况,例如有些操作必须在事务中才能执行。MANDATORY 适合强制要求当前存在事务的情况,例如有些操作必须在事务中才能执行。
- REQUIRES_NEW:无论当前是否存在事务,都会创建一个新事务,如果存在则将当前事务挂起。REQUIRES_NEW 适合独立的业务操作,例如一个复杂的操作中需要多次提交,可以将其作为独立的事务操作。
- NOT_SUPPORTED:无论当前是否存在事务,都不使用事务执行方法,如果存在则先将事务挂起。NOT_SUPPORTED 适合一些查询性质的操作,例如统计报表等。
- NEVER:强制要求当前不存在事务,否则抛出异常。NEVER 适合强制要求当前不存在事务的情况,例如某些敏感操作。
- NESTED:当前的事务会在外层事务的基础上创建一个嵌套事务,如果外层不存在事务,则创建新事务。如果嵌套事务独立提交,则会将自己的事务与外层分开,否则两者合并提交。NESTED 适合一些需要在原有事务的基础上进行嵌套的情况。

## 3.Spring 事务源码分析

## 4.Spring 事务失效的场景

### 4.1 事务方法访问权限问题

由于 Spring 事务是基于 Spring AOP 实现的,而 AOP 的本质是动态代理,在 Spring 事务底层源码中,如果代理的事务方法非 public 修饰,执行 computeTransactionAttribute()时就会返回 null,表示事务属性不存在,那么也不会执行事务逻辑,从而导致事务失效。

### 4.2 事务方法使用 final 或 static 关键字导致事务失效

如果一个方法被声明为 final 或 static,则该方法不能被子类重写,无法使用动态代理代理该方法,这会导致 Spring 无法生成事务代理对象来管理事务。因此,为了避免事务失效,因避免使用 final 或 static 修饰。

### 4.3 事务方法内部调用

Spring 食物语是通过 Spring AOP 代理来实现的,在同一个类中,一个方法调用另一个方法时,调用方法时是直接调用目标对象的方法,而不是通过代理类调用,因此会导致事务不生效。解决办法:

- 将调用方法分为多个类,在一个类方法中调用另一个类的方法。
- 通过 AopContext.currentProxy()获取当前代理对象,通过代理对象调用方法。

### 4.4 事务方法所属类未被 Spring 管理

Spring 事务基于 Spring AOP 实现,也就是说 Spring IOC 容器获取 Bean 时,Spring 会为目标类创建代理处理事务,如果类未被 Spring 管理,Spring 找不到对应的 Bean,因此也无法创建代理类来处理事务。为了避免事务失效,应该将事务方法所属类注入 Spring IOC 容器,例如在类上添加@Service、@Component 等注解。

### 4.5 没有在 Spring 中启用事务管理器

Spring 事务管理器的作用是确保事务的一致性和完整性。当一个事务涉及多个数据库操作时,如果其中的任何一个操作失败,整个事务都应该被回滚,以保证数据的一致性和完整性。 Spring 事务管理器提供了一种简单而可靠的方式来管理这些操作,并确保它们被作为单个事务来处理。Spring 事务相关类如下:

- PlatformTransactionManager:该接口是所有 Spring 事务管理器的父接口,定义了基本的事务管理操作,例如:begin、commit、rollback。
- DataSourceTransactionManager:该事务管理器适用于 JDBC。它使用传入的数据源来创建数据库连接,然后利用 JDBC 事务来管理一系列 SQL 操作。
- HibernateTransactionManager:该事务管理器适用于 Hibernate。它使用传入的 Hibernate SessionFactory 来管理一系列 Hibernate 操作。
- JpaTransactionManager:该事务管理器适用于 JPA。它使用传入的 JPA EntityManagerFactory 来管理一系列 JPA 操作。

如果在 Spring 未启用事务管理器,即使在目标方法添加了@Transactional 注解,该方法也不会被 Spring 管理的事务代理拦截。注意:在 SpringBoot 中默认会自动配置事务管理器并开启事务支持。

### 4.6 多线程调用

Spring 事务是基于线程绑定的,每个线程都有自己的事务上下文,而多线程环境下可能会存在多个线程共享同一事务上下文的情况,从而导致事务失效。在 Spring 事务管理器中,通过 TransactionSynchronizationManager 类来管理事务上下文。TransactionSynchronizationManager 内部维护了一个 ThreadLocal 对象,用来存储当前线程的事务上下文。在事务开始时,TransactionSynchronizationManager 会将事务上下文绑定到当前线程的 ThreadLocal 对象中,当事务结束时,TransactionSynchronizationManager 会将事务上下文从 ThreadLocal 对象中移除。

### 4.7 数据源不支持事务

Spring 的事务管理底层依赖于数据库本身的事务支持,如果数据源不支持事务,即使添加了 Spring 事务也不会生效,例如 Mysql 的 MyISAM 存储引擎。

### 4.8 配置错误的@Transactional 注解

如果事务方法中使用了@Transactional(readOnly=true),但是在方法中进行了更新操作,此时会抛出异常导致事务失效。readOnly=true 表示一个只读事务,当在事务中更新对应数据时,会抛出异常,因此根据业务场景尽量将 readOnly 设置为 false,如果是读操作则设置为 true。

### 4.9 事务超时时间设置过短

如果设置了事务超时时间,但是执行业务耗时大于事务超时时间,则会出现事务超时,导致事务失效。对于这种情况可以不指定事务超时时间,或根据业务场景设置事务超时时间。

### 4.10 事务设置了错误的传播特性

在 Spring 中,事务传播机制是控制多个事务方法之间相互调用的行为方式。Spring 中共支持 7 种事务传播机制,它们是：

- REQUIRED:默认传播行为,如果当前存在事务则加入,如果不存在则创建一个新事务。REQUIRED 适合大部分业务场景,可以提高系统的整体性能。
- SUPPORTS:如果当前存在事务就加入,否则不使用事务。SUPPORTS 适合只读的业务方法,提高并发性能。
- MANDATORY:强制要求当前存在事务,如果不存在就抛出异常。MANDATORY 适合强制要求当前存在事务的情况,例如有些操作必须在事务中才能执行。MANDATORY 适合强制要求当前存在事务的情况,例如有些操作必须在事务中才能执行。
- REQUIRES_NEW:无论当前是否存在事务,都会创建一个新事务,如果存在则将当前事务挂起。REQUIRES_NEW 适合独立的业务操作,例如一个复杂的操作中需要多次提交,可以将其作为独立的事务操作。
- NOT_SUPPORTED:无论当前是否存在事务,都不使用事务执行方法,如果存在则先将事务挂起。NOT_SUPPORTED 适合一些查询性质的操作,例如统计报表等。
- NEVER:强制要求当前不存在事务,否则抛出异常。NEVER 适合强制要求当前不存在事务的情况,例如某些敏感操作。
- NESTED:当前的事务会在外层事务的基础上创建一个嵌套事务,如果外层不存在事务,则创建新事务。如果嵌套事务独立提交,则会将自己的事务与外层分开,否则两者合并提交。NESTED 适合一些需要在原有事务的基础上进行嵌套的情况。

使用 NOT_SUPPORTED 传播特性不支持事务,因此在需要事务的场景下,因避免使用 NOT_SUPPORTED 传播特性。

### 4.11 事务方法内部处理了异常,导致异常无法对外抛出

如果事务方法中发生的异常被捕获并处理,会导致异常无法正确的传播给事务管理器,从而导致事务失效。在 Spring 事务的 invokeWithinTransaction()方法中,当 Spring catch 到 Throwable 异常的时候,就会调用 completeTransactionAfterThrowing()方法进行事务回滚的逻辑。如果事务方法中发生的异常被捕获并处理,Spring 将无法捕获到异常,因此事务回滚的逻辑就不会执行,导致事务失效。在 Spring 事务方法中,当使用了 try/catch 处理异常时,应当在 catch 中抛出对应的异常。

### 4.12 手动抛出其他异常

Spring 事务默认只处理 RuntimeException 和 Error,对于普通 Exception 并不会进行事务回滚,除非,使用 rollbackFor 属性指定配置,例如@Transactional(rollbackFor=Exception.class)。

### 4.13 手动抛出其他异常

Spring 事务默认只处理 RuntimeException 和 Error,对于普通 Exception 并不会进行事务回滚,除非,使用 rollbackFor 属性指定配置,例如@Transactional(rollbackFor=Exception.class)。

### 4.14 事务注解被覆盖导致事务失效

如果父类事务中使用了事务注解,子类重写父类的事务方法也使用了事务注解,此时子类方法中的事务注解会覆盖了父类的注解(例如子类事务方法和父类事务方法的传播行为不同),Spring 将不会在父类的方法中启用事务。

### 4.15 rollbackFor 属性配置错误

Spring 事务注解的 rollbackFor 属性用于指定在哪些异常发生时需要回滚事务,当方法抛出 rollbackFor 属性中指定的异常或其子类异常时(rollbackFor 指定的异常只能是 Throwable 类或者其子类),事务将回滚;否则,事务不会回滚。该属性可以指定一个异常类或多个异常类,多个异常类以数组的形式指定。如果不指定 rollbackFor 属性,则默认情况下只有 RuntimeException 及其子类(如 Error)异常会触发事务回滚。如果事务方法中抛出的异常,不是 rollback 指定的异常类或及其子类,事务将不会生效。

### 4.16 嵌套事务回滚频繁

在 Spring 嵌套事务中,如果内层的事务方法出现了 RuntimeException 和 Error 异常并对外抛出,那么可能会导致外层的事务也会被回滚。
