## 1.Spring IOC 容器

### 1.1 什么是 SpringIOC 容器

IoC 也称为依赖注入 (DI)。这是一个过程,其中对象仅通过构造函数参数、工厂方法的参数或在对象实例被构造或从工厂方法返回后在对象实例上设置的属性来定义它们的依赖项(即它们使用的其他对象),然后容器在创建 bean 时注入这些依赖项。这个过程基本上是 bean 本身的逆过程(因此得名控制反转),通过使用类的直接构造或诸如服务定位器模式之类的机制来控制其依赖项的实例化或位置。

### 1.2 Spring IOC 容器架构图

在 Spring 中`org.springframework.beans`和`org.springframework.context`包是 Spring 框架的 IoC 容器的基础。该 BeanFactory 接口提供了一种能够管理任何类型对象的高级配置机制。 ApplicationContext 是 的子接口 BeanFactory,BeanFactory 提供了配置框架和基本功能,而 ApplicationContext 添加了更多企业特定的功能。

- BeanFactory:BeanFactory 是 Spring IoC 容器的根接口,定义了容器的基本功能,如获取 Bean 实例、管理 Bean 的生命周期等。它是 IoC 容器的最基本形式。
- ApplicationContext:ApplicationContext 是 BeanFactory 接口的子接口,它在 BeanFactory 的基础上添加了更多的功能,如国际化、事件传播、AOP 等。ApplicationContext 是 Spring 应用程序中最常用的 IoC 容器。容器通过读取配置元数据来获取有关要实例化、配置和组装哪些对象的指令。配置元数据以 XML、Java 注解或 Java 代码表示。它可以描述组成应用程序的对象以及这些对象之间丰富的相互依赖关系。
- ClassPathXmlApplicationContext:一个 ApplicationContext 接口的实现类,它用于从类路径中加载 XML 配置文件来创建应用程序上下文。
- FileSystemXmlApplicationContext:一个 ApplicationContext 接口的实现类,它用于从文件系统路径中加载 XML 配置文件来创建应用程序上下文。
- XmlBeanDefinitionReader 类:XmlBeanDefinitionReader 是一个用于从 XML 配置文件中读取 Bean 定义的类。它将 Bean 定义解析为 BeanDefinition 对象。
- BeanDefinition:表示一个 Bean 的定义,包括类名、作用域、属性等信息。IoC 容器使用 BeanDefinition 来创建和管理 Bean 实例。在 Java 中可以将一个类理解为一个 Bean,而在 Spring 中通过 BeanDefinition 描述一个 Bean。
- DefaultListableBeanFactory 类:DefaultListableBeanFactory 是 BeanFactory 接口的一个实现,它提供了 Bean 的注册、创建和管理功能。它还继承了 XmlBeanDefinitionReader,可以将 XML 配置文件中的 Bean 定义加载到容器中。
- AnnotationConfigApplicationContext 类: 一个 ApplicationContext 接口的实现类,它通过 Java 配置类来创建应用程序上下文,而不是依赖于 XML 配置文件。由于 XML 的方式配置较为繁琐,Spring 推荐通过 Java Config 装配 Bean。
- GenericApplicationContext 类:一个 ApplicationContext 接口的通用实现,它可以通过编程方式注册 Bean 定义。

### 1.3 ClassPathXmlApplicationContext

### 1.4 FileSystemXmlApplicationContext

### 1.4 AnnotationConfigApplicationContext

## 2.Bean 的注入与装配

### 2.1 Bean 的定义

### 2.2 Bean 的注入

### 2.3 Bean 的三种注入方式

在 Spring 中提供了属性注入、setter 注入、构造器注入三种方式。

#### 2.3.1 属性注入

#### 2.3.2 setter 注入

#### 2.3.3 构造器 注入

### 2.4 Bean 的装配

### 2.5 Bean 循环依赖问题

## 3.Bean 的作用域

## 4.条件化注入 Bean

在 Spring 中提供了一些注解,用于根据特定条件选择性地创建和管理 Bean,避免注入不必要的 Bean,从而优化应用启动速度。常用注解如下:

- `@Conditional`:@Conditional 注解用于在创建 Bean 之前检查特定条件。可以使用它自定义一个实现了 Condition 接口的类,然后将这个类与 @Conditional 注解一起使用,以决定是否创建指定的 Bean。
- `@ConditionalOnBean`:该注解用于指定只有当指定的 Bean 存在于容器中时才会创建和配置当前 Bean。
- `@ConditionalOnMissingBean`:与 `@ConditionalOnBean` 相反,`@ConditionalOnMissingBean` 注解用于指定只有当指定的 Bean 不存在于容器中时才会创建和配置当前 Bean。
- `@ConditionalOnClass`:该注解用于指定只有当指定的类存在于类路径中时才会创建和配置当前 Bean。
- `@ConditionalOnProperty`:该注解用于指定只有当指定的配置属性存在且满足特定条件时才会创建和配置当前 Bean。
- `@ConditionalOnExpression`:该注解用于根据 SpEL 表达式的结果来决定是否创建和配置当前 Bean。
- `@ConditionalOnMissingClass`:该注解用于指定只有当指定的类不存在于类路径中时才会创建和配置当前 Bean。
- `@ConditionalOnWebApplication`:该注解用于指定只有当应用程序部署为 Web 应用时才会创建和配置当前 Bean。
- `@ConditionalOnNotWebApplication`:与 `@ConditionalOnWebApplication` 相反,`@ConditionalOnNotWebApplication` 注解用于指定只有当应用程序不是 Web 应用时才会创建和配置当前 Bean。

## 5.动态注入 Bean

在 Spring 框架中,有多种方式可以动态注册 Bean。动态注册 Bean 通常是在应用程序运行时根据特定条件或需求来添加新的 Bean 定义到 Spring 容器中。

- 通过 BeanDefinitionRegistry 接口注册 Bean。
- 通过实现 ImportSelector 接口注册 Bean。
- 通过实现 ImportBeanDefinitionRegistrar 接口注册 Bean。
- 通过实现 BeanFactoryPostProcessor 接口注册 Bean。
- 通过实现 FactoryBean 接口创建 Bean 工厂注册 Bean。

## 6.Bean 的生命周期

## 7.Bean 生命周期扩展
