## 1.Spring Framework 整体架构

## 2.Bean 与 IOC 容器

### 2.1 Bean 的介绍

### 2.2 IOC 与 DI

### 2.3 Application 架构图

## 3.依赖注入的两种方式

在 Spring 框架中,注入(Injection)通常指的是依赖注入(Dependency Injection,简称 DI)。依赖注入是一种设计模式,它通过外部提供依赖对象(通常是其他类的实例)的方式,将依赖关系注入到对象中,而不是由对象自己负责创建或查找依赖对象。通过依赖注入可以解耦组件,提高代码的可维护性、可测试性和可扩展性。Spring 提供了多种方式来实现依赖注入,其中最常见的是构造器注入、属性注入和方法注入。

### 3.1 构造器注入

### 3.2 属性注入

### 3.3 方法注入

## 4.Bean 的装配

向 Spring IOC 容器注入 Bean 后,类之间 Bean 的相互调用行为通常被称为 Bean 的装配(wiring),即从 Spring IOC 容器获取 Bean 实例进行类与类之间的协作。当装配一个不存在 Spring IOC 容器的 Bean 时,会抛出 NoSuchBeanDefinitionException 运行时异常,即表示 Spring 容器无法找到该 Bean 定义,因此在装配 Bean 时,必须确保装配 Bean 被注入。Spring 提供了三种装配 Bean 的方式:

- 通过 Java Config(Java 配置类)装配 Bean。这种方式是 Spring 官方推荐的装配方式,由于 JavaConfig 是配置代码,一般不会侵入到业务逻辑代码中。通常会将 JavaConfig 放到单独的包中,使它与其他的应用程序逻辑分离开来,所以它的意图更加明确,使用方式上也更简单便捷。
- 自动化装配 Bean。自动化装配 Bean 能减少显式配置,建议尽可能使用自动装配,如果需要显式配置 Bean 时,推荐使用类型安全且比 Xml 形式更加强大的 Java Config,如果想要使用便利的 XML 命名空间,并且在 JavaConfig 中没有同样的实现时,才应该使用 XML。
- 定义`spring.xml`通过 Xml 形式装配 Bean。`spring.xml` 是 spring 的配置文件,以 XML 的形式描述 Bean 并将 Bean 注入 Spring 容器。相比较其他两种方式 XML 形式配置繁琐、类型安全差、对重构不友好,配置比较繁琐冗余。当项目的装配的 Bean 越来越多时,XML 中 Bean 的配置也会越来越多;配置 Bean 的元数据时一般要指定 Bean 的 class 属性(Bean 的类型),如果此时 class 对应的类型发生重命名或删除操作等其他操作,那么你也要改动 class 的属性的值,所以类型的安全性差。

### 4.1 基于 JavaConfig 装配 Bean

### 4.2 自动化装配 Bean

### 4.3 基于`spring.xml`通过 Xml 形式装配 Bean

## 5.Bean 的作用域

Spring 中的 Bean 是对普通 Java 对象的抽象(在 Spring 中通过),它描述了普通 Java 对象在 Spring 容器中的行为,例如 Bean 是否懒加载、Bean 作用范围、Bean 的依赖等等,Spring 为了 Bean 提供五种作用域,不同作用域下 Bean 的行为会有所不同。

### 5.1 @Scope 注解指定 Bean 作用域

### 5.2 @Lazy 注解指定 Bean 懒加载

### 5.3 @Order 注解指定 Bean 加载顺序

### 5.4 Spring Bean 为什么是默认单例的?

### 5.5 Spring Bean 是线程安全的吗?

## 条件化注入 Bean

## Bean 的生命周期

## Bean 的扩展

## 动态注入 Bean

## 总结
