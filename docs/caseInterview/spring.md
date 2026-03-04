## Spring 框架中的核心模块有哪些？它们分别负责什么功能?

Spring 框架是一个全面的、模块化的应用平台,它由多个核心模块组成,每个模块专注于特定的功能领域,但它们可以协同工作以构建复杂的企业级应用。以下是 Spring 框架的核心模块及其主要职责:

- Spring Core:提供了框架的基础,定义了基本的 Bean 工厂,用于读取配置元数据并创建和管理 Bean 对象。包含了 IoC（控制反转）和 DI（依赖注入）功能,以及资源访问、事件传播、消息资源和国际化支持等。
- Spring Context:建立在 Spring Core 之上,提供了 BeanFactory 的高级功能,如国际化支持、事件传播、资源加载和事务管理。它还引入了 ApplicationContext 接口,这是 BeanFactory 的扩展,提供了更广泛的配置功能,如从 XML、JSON、YAML 等格式加载配置,以及对 Bean 的生命周期进行管理。
- Spring AOP:支持面向切面编程,允许在运行时将横切关注点（如日志记录、事务管理）编织到应用程序的普通代码中,而无需显式编码。
- Spring DAO:提供了数据访问异常层次结构,简化了 JDBC、Hibernate 和 JPA 等数据访问技术的使用,减少了常见的数据访问代码的编写量。
- Spring ORM:包含了对流行 ORM 框架（如 Hibernate、JPA、iBatis/MyBatis）的支持,提供了统一的异常层次结构,使得 ORM 技术的使用更加一致和方便。
- Spring Web:提供了基础的 Web 应用功能,如 Web 请求和响应处理、Servlet 监听器、过滤器等。
- Spring Web MVC:实现了 MVC（Model-View-Controller）模式,提供了高度可配置的 MVC 实现,用于构建 Web 应用,包括视图解析、表单绑定、数据验证等功能。
- Spring Test:提供了对 Spring 组件进行单元测试和集成测试的支持,包括 Mock 对象的创建和控制反转测试支持。
- Spring Aspects:为 AOP 功能提供了额外的支持,包括对 AspectJ 的支持。
- Spring Instrumentation:提供了类加载器级别的类仪器化支持,用于在运行时修改字节码,例如 Tomcat 启动器类加载器的支持。
- Spring Web Services:支持构建和消费 Web 服务,包括 SOAP 和 RESTful 服务。
- Spring Security（虽然不是核心模块,但经常与 Spring 框架一起使用）:提供了全面的安全服务,包括认证、授权和安全配置。

每个模块都是可插拔的,可以根据应用的需求选择性地使用。Spring 框架的核心设计理念是“不要重复发明轮子”,它提供了大量现成的解决方案,使得开发者可以专注于业务逻辑的开发,而不需要关心底层的基础设施。

## 什么是 IOC?什么是 DI?

IOC(Inversion of Control,控制反转)和 DI(Dependency Injection,依赖注入) 是软件工程中常提到的概念,尤其是在面向对象编程和现代框架设计中:

- **IOC(控制反转)**:控制反转（IOC）是一种设计原则,它提倡将程序的控制流从常规的程序代码中“倒转”出来,交由框架或容器来管理。在传统的程序设计中,对象直接控制其行为和依赖关系的创建和管理。而在使用 IOC 的情况下,对象的控制权被"反转",由外部的容器或框架来负责对象的生命周期、依赖关系的创建和管理。IOC 的一个核心思想是降低代码之间的耦合度,使得各个组件可以更加独立地开发和测试,同时也更容易替换和扩展。在 IOC 中,对象不再直接控制其行为,而是依赖于外部环境或框架来协调和控制其行为。IOC 除了降低耦合度外,也可以提升性能,在单例模式下,IOC 存储对象实例,当再次获取对象时并不会重新创建实例,而是会复用已有实例,已减少创建对象产生的资源开销,从而提升性能。
- **DI(依赖注入)**:依赖注入(DI)是一种实现 IOC 的具体技术。DI 是将对象所依赖的其他对象（即依赖）在其创建时或运行时自动注入给它,而不是由对象自己去创建或寻找依赖。通过 DI,对象在其生命周期的某个点上接收其所需的依赖,这些依赖可以是通过构造器、setter 方法或字段注入的。

## IOC 容器的工作流程?

## Spring 中的 Bean 是什么?如何定义和配置 Bean?

在 Spring 框架中,Bean 是构成应用程序的核心组成部分,它代表了应用程序中的对象,这些对象由 Spring IoC（Inverse of Control,控制反转）容器管理。在 Spring 中 Bean 可以是任何对象,例如业务逻辑组件、DAO（Data Access Object）、服务层对象、控制器等等。Spring 容器负责创建 Bean 实例,管理它们的生命周期,以及配置和组装 Bean 之间的依赖关系。

在 Spring 框架中,BeanDefinition 接口是描述一个 Bean 的元数据的标准方式。BeanDefinition 接口定义了 Bean 的配置信息,包括 Bean 的类信息、作用域、生命周期回调方法、依赖关系以及其他配置属性,Spring 使用 BeanDefinition 来创建和管理 Bean 实例。当 Spring 容器初始化时,它会读取配置元数据（如 XML 配置文件或 Java 配置类）,并将这些信息转化为 BeanDefinition 对象。这些 BeanDefinition 对象随后被存储在 DefaultListableBeanFactory 或 ConfigurableListableBeanFactory 中,这些工厂类负责根据 BeanDefinition 信息创建和管理 Bean 实例。例如,当在 XML 配置文件中定义一个 Bean 时,Spring 会将这些配置信息转换为 BeanDefinition。同样,当你使用@Configuration 类和@Bean 注解时,Spring 也会在运行时生成相应的 BeanDefinition。

在 Spring 框架中,定义和配置 Bean 可以通过多种方式进行,主要分为 XML 配置、基于注解的配置和 Java 配置三类:

- **基于 XML 配置**:在早期版本的 Spring 中,主要通过 XML 文件来定义和配置 Bean。在 XML 配置文件中,使用`<bean>`标签来声明一个 Bean,id 或 name 属性用来标识这个 Bean,class 属性指定 Bean 所对应的全限定类名。此外,还可以通过`<property>`标签来配置 Bean 的属性值,以及通过`<constructor-arg>`标签来配置构造函数参数。由于存在以下问题,Spring 官方并不推荐基于 XML 定义 Bean,而是推荐使用基于注解或 Java 类配置定义 Bean:
  - 类型安全问题:XML 配置缺乏类型安全,在配置文件中可能会引用错误的 Bean ID 或属性名,而这类错误只能在运行时捕获。相比之下,基于注解和 Java 配置的方式提供了编译时的类型检查,这有助于在开发阶段发现和修复错误。
  - 分离关注点:XML 配置将配置逻辑与业务代码分离,这在小规模项目中可能不是问题,但在大型项目中可能导致配置分散且难以维护。Java 配置允许将配置逻辑内联到 Java 代码中,有助于保持代码的一致性和连贯性。
  - 可读性和可维护性:XML 配置文件可能会变得冗长和复杂,尤其是在大型项目中,这增加了阅读和维护的难度。Java 配置通常更加紧凑,且易于理解。
  - 灵活性和表达力:Java 配置提供了更多的灵活性,可以轻松地嵌入复杂的逻辑,如条件性 Bean 注册、动态 Bean 注册等。XML 配置虽然可以通过自定义的命名空间和处理器实现类似功能,但通常较为繁琐。
- **基于注解配置**:从 Spring 2.5 开始,Spring 引入了基于注解的配置方式,这允许开发者在代码中直接注解 Bean 类,而无需额外的 XML 配置。常用的注解有:
  - @Component:用于标记一个普通的 Java 类作为 Spring 的 Bean。
  - @Service 和 @Repository:它们都是@Component 的特化,分别用于业务逻辑层和服务层的 Bean。
  - @Controller:用于 Web 层的 Bean。
  - @Autowired:用于自动装配 Bean 的依赖项。
  - @Qualifier:用于解决同类型多个 Bean 的歧义问题。
  - @Configuration:用于标记配置类,可以替代 XML 配置文件。
  - @Bean:在@Configuration 类中使用,声明一个 Bean。
- **基于 Java 类配置**:基于 Java 类的配置是 Spring 框架中一种现代且灵活的配置方式,Java 配置是基于注解配置的进一步发展,它允许使用纯 Java 代码来定义和管理 Spring 容器中的 Bean。基于 Java 类配置通常使用@Configuration 和@Bean 注解:
  - @Configuration:@Configuration 注解用于标记一个类作为 Spring 的配置类。Spring 会扫描这些类,并从中提取 Bean 定义。一个@Configuration 类可以包含一个或多个@Bean 方法,用于声明和配置 Bean。
  - @Bean:@Bean 注解用于@Configuration 类中的方法,表示该方法的返回值应该作为一个 Bean 注册到 Spring 容器中。@Bean 方法可以有参数,这些参数可以是其他@Bean 方法的返回值,从而实现依赖注入。

## Spring 支持哪几种注入方式?

在 Spring 主要支持三种注入方式:

- **构造注入(Constructor Injection)**:构造器注入是指在类的构造函数中注入依赖项。这种方式确保了类的依赖性在创建对象时就已经确定,有利于实现不可变对象和更严格的依赖性检查。构造器注入还能帮助编译器或 IDE 提前发现依赖项的类型错误。
- **Setter 注入**:设值注入是通过类中的 setter 方法注入依赖项。这是 Spring 最早的注入方式之一,但它可能导致对象在某些时候处于未完全初始化的状态。设值注入提供了一定程度的灵活性,比如可以在运行时动态改变依赖。
- **字段注入(Field Injection)**:字段注入是在类的字段上直接使用注解(如@Autowired)来注入依赖项。这种方式简化了代码,但可能会降低代码的可读性和可测试性,因为它隐式地处理依赖注入。字段注入通常被认为不如构造器注入优雅,但在某些情况下,如注入复杂结构或多个依赖项时,它可以简化代码。

## @Autowired 与@Resource 的区别?

@Autowired 和@Resource 都是用于依赖注入的注解,但它们存在如下区别:

- 来源不同:@Autowired 是 Spring 框架提供的注解,专门用于自动装配 Bean,只能在 Spring 环境下使用。@Resource 是 JSR-250 规范的一部分,后来被整合到 Java Persistence API (JPA)中,它不仅可以在 Spring 中使用,也可以在其他 Java EE 容器中使用。
- 注入测策略不同:@Autowired 默认按照类型匹配注入依赖,这意味着 Spring 会查找容器中与注解所标记的变量类型相匹配的唯一 Bean。如果有多个匹配的 Bean,可以通过@Qualifier 注解进一步指定要注入哪个 Bean(当匹配多个 Bean 时,@Autowired 会根据注入的属性名注入 Bean,如果没有确定优先级,则会抛出异常)。@Resource 默认按照名称匹配注入依赖,如果没有找到与名称匹配的 Bean,则会退回到类型匹配。名称可以是通过 name 属性显式指定的,或者默认为字段或方法的名称。@Autowired 要求注入的依赖是必须的,如果找不到匹配的 Bean,Spring 将会抛出异常。但是,可以通过设置@Autowired(required=false)来改变这种行为,使其成为可选注入。@Resource 的行为则取决于容器,但在 Spring 中,如果找不到匹配的 Bean,它将注入 null,除非指定了 lookup 或 shareable 属性来改变这种行为。

## Spring 中允许定义多个相同 id 的 Bean 吗?

在 Spring 框架中,不允许为容器注册多个具有相同 ID 的 Bean 定义。Spring 容器将 Bean 的 ID 视为唯一标识符,用于区分和检索不同的 Bean 实例。如果你尝试注册两个具有相同 ID 的 Bean 定义,Spring 容器会抛出一个 BeanDefinitionStoreException 异常,指示存在重复的 Bean ID。然而,即使不能使用相同的 ID,仍然可以通过其他方式在 Spring 中管理和使用多个相似的 Bean 实例:

- 使用别名(Aliases):虽然不能有两个相同的主 ID,但可以为一个 Bean 定义创建多个别名。这些别名可以用于像主 ID 一样引用同一个 Bean 实例。
- 使用集合类型的 Bean:可以定义一个集合类型的 Bean（如 List 或 Set）,并将多个相同类型的 Bean 实例放入这个集合中。这样,就可以通过集合 Bean 的 ID 来访问所有的相关 Bean 实例。

## Spring Bean 的作用域有哪些?

在 Spring 中提供了 Singleton、Prototype、Request、Session、GlobalSession 五种作用域,每种作用域决定了 Bean 的生命周期和可见性:

- **Singleton**:在 Singleton 作用域下,一个 Bean 定义在 Spring IoC 容器中只会存在一个实例。无论有多少个请求,容器都将返回相同的 Bean 实例。Spring Bean 默认作用域是 Singleton。
- **Prototype**:Prototype 作用域意味着每次从容器中请求 Bean 时,都会创建一个新的实例。与 Singleton 相反,Prototype Bean 的生命周期完全由客户端代码控制,容器不会管理其生命周期。Prototype 作用域适用于那些需要在每次请求时都有新实例的 Bean。
- **Request**:在 Web 应用中,Request 作用域意味着每次 HTTP 请求都会创建一个新的 Bean 实例。这个 Bean 将存活于整个请求周期,直到响应被发送给客户端。
  Request 作用域仅在 WebApplicationContext 环境下可用。
- **Session**:Session 作用域表示 Bean 在一个 HTTP Session 中存在。即在一个用户的会话期间,Bean 实例将被共享。当用户会话结束时,Bean 实例也将被销毁。Request 作用域仅在 WebApplicationContext 环境下可用。
- **GlobalSession**:GlobalSession 作用域类似于 Session 作用域,但是它是为了 Portlet 应用设计的,其中的 Bean 实例将在全局会话中共享。
  GlobalSession 作用域同样只在 WebApplicationContext 环境下可用,特别是在 Portlet 环境中。

在 Spring 中可以通过@Scope 注解或 XML 配置文件中的`<bean>`标签的 scope 属性来指定作用域。

## 什么是 BeanFactory?

## Spring Bean 的生命周期?

Spring 框架中的 Bean 有着明确的生命周期,这个生命周期涵盖了从 Bean 的创建到销毁的全过程。Spring Bean 生命周期的主要阶段:

- Bean 的实例化阶段:Spring 容器读取配置元数据（如 XML 配置文件或注解）,然后使用 Bean 的默认构造器或指定构造器来创建 Bean 实例。如果 Bean 定义中包含 init-method 或实现 InitializingBean 接口,此时 Bean 实例还没有调用初始化方法。
- Bean 依赖注入阶段:在实例化之后,Spring 开始注入 Bean 的依赖。这包括通过构造器、setter 方法或字段注入依赖。依赖注入完成后,Bean 通常已经具备了大部分的运行时状态。
- Bean 的初始化阶段:一旦依赖注入完成,Spring 会调用 Bean 的初始化方法,这可以是通过 init-method 属性指定的方法,或者是实现 InitializingBean 接口的 afterPropertiesSet()方法。这些方法用于执行额外的初始化逻辑,如打开资源、建立连接等。
- Bean 的活动期阶段:在初始化之后,Bean 进入活动期,此时 Bean 可以被应用程序使用。在 Singleton 作用域下,Bean 实例将被缓存,以便后续请求可以重用它。在 Prototype 作用域下,每次请求都会创建一个新的 Bean 实例。
- Bean 的销毁销毁阶段:当 Spring 容器关闭时,对于 Singleton 作用域的 Bean,Spring 会调用其销毁方法（如果定义了 destroy-method 属性或实现了 DisposableBean 接口的 destroy()方法）。销毁方法用于释放 Bean 占用的资源,如关闭连接、释放锁等。

Spring 提供了一些生命周期回调方法,允许开发者在 Bean 的生命周期的特定点插入自定义的代码:

- @PostConstruct:这是一个 JSR-250 注解,用于标记在依赖注入完成后立即执行的初始化方法。
- @PreDestroy:同样是一个 JSR-250 注解,用于标记在容器销毁 Bean 前执行的清理方法。

## Spring Bean 为什么是单例的?

在 Spring 框架中,Bean 默认是单例（Singleton）模式的。这意味着对于每一个 Bean 定义,在 Spring 容器中只会存在一个实例。Spring 将 Bean 设计为单例的出于以下原因:

- 性能优化:单例模式可以减少对象的创建次数,从而节省内存资源和提高应用程序的性能。由于不需要每次请求都创建新的对象,所以减少了构造函数的调用和对象初始化的时间。
- 线程安全:如果 Bean 没有可变状态或其状态不会被多个线程共享修改,那么使用单例模式可以避免线程安全问题。因为对象在整个应用生命周期中只被创建一次,所以在多线程环境中不会出现同步问题。
- 依赖注入更加清晰:Spring 的依赖注入功能更加适用于单例模式。当一个 Bean 引用另一个 Bean 时,如果后者是单例的,那么前者可以直接引用而不用担心会有多个实例存在。这简化了依赖管理,使得 Bean 之间的关系更清晰。

尽管单例模式在许多情况下都很适用,但也有不适合使用它的场景。例如,如果一个 Bean 需要维护每个用户会话的状态,那么使用原型（Prototype）作用域可能更合适,因为这样可以为每个 HTTP 请求创建一个新的 Bean 实例。

## Spring Bean 是线程安全的吗?

线程安全是多线程环境中至关重要的,因为它可以防止数据竞争和不一致状态,确保程序的正确性和可靠性。Spring 框架本身并不保证 Bean 的线程安全性,但是它提供了一些机制和最佳实践来帮助开发者创建线程安全的 Bean,Bean 是否线程安全取决于 Bean 的实现以及它如何被使用。

- Singleton 作用域:Spring 中的 Singleton Bean 默认情况下是线程安全的,只要它们满足以下条件:
- Bean 没有可变状态,即它是无状态的（Stateless）。
- 或者,Bean 的可变状态是线程局部的（ThreadLocal）,每个线程有自己的状态副本。
- 或者,Bean 实现了必要的同步措施,以确保对共享状态的访问是线程安全的。
- Prototype 作用域:Prototype 作用域下 Bean 为每次请求创建一个新的实例,因此每个线程或请求都有自己的 Bean 实例,自然避免了线程安全问题,但这也意味着无法利用 Singleton Bean 的缓存和性能优势。

## Spring 如何动态注册 Bean?

## Spring 如何解决循环依赖?

在 Spring 框架中,循环依赖指的是两个或多个 Bean 相互依赖对方的情况。例如,Bean A 依赖于 Bean B,而 Bean B 又依赖于 Bean A。这种情况下,如果处理不当,会导致容器无法正常完成 Bean 的初始化过程。Spring 框架为了解决循环依赖问题,尤其是在 Singleton 作用域下,采用了三级缓存的机制。这三级缓存分别在 Bean 的创建和初始化的不同阶段发挥作用,以确保 Bean 能够正确初始化,即便在存在循环依赖的情况下也是如此。以下是 Spring 的三级缓存机制及其作用的详细说明:

- 一级缓存(singletonObjects):这是 Spring 的顶级缓存,用于存放已经完全初始化完成的 Singleton Bean 实例。当容器接收到对某个 Singleton Bean 的请求时,它首先会检查这个缓存中是否存在对应的 Bean 实例。如果存在,直接返回该实例；如果不存在,则会进入后续的创建流程。
- 二级缓存(earlySingletonObjects):当一个 Singleton Bean 正在创建中,但还未完成初始化时,它的部分初始化实例会被存放在这个缓存中。这个缓存主要用于解决循环依赖问题。当一个 Bean A 依赖于另一个正在创建中的 Bean B 时,Spring 会从二级缓存中取出 Bean B 的部分初始化实例,提供给 Bean A 使用,从而避免了阻塞等待。
- 三级缓存(singletonFactories):这个缓存存放的是 Bean 的工厂对象,也就是 ObjectFactory 实例。当一个 Singleton Bean 正在创建中,但还未实例化时,它的工厂对象会被存放在这个缓存中。如果容器接收到对一个正在创建中的 Bean 的请求,它会从三级缓存中取出相应的工厂对象,然后调用该工厂对象的 getObject()方法来获取 Bean 的部分初始化实例。

循环依赖的解决过程:

- 创建 Bean A:当容器开始创建 Bean A 时,它首先检查一级缓存（singletonObjects）中是否存在 Bean A 的实例,如果没有,就进入创建流程。
  创建 Bean A 的过程中,容器会检测到 Bean A 依赖于 Bean B。此时,Bean B 还没有被创建,因此会触发 Bean B 的创建流程。
- 创建 Bean B:在创建 Bean B 的过程中,容器会发现 Bean B 依赖于 Bean A,但由于 Bean A 正在创建中,所以它会检查三级缓存（singletonFactories）中是否存在 Bean A 的工厂对象。
  如果存在,容器会从三级缓存中取出 Bean A 的工厂对象,并通过它获取 Bean A 的部分初始化实例。这个实例会被存放在二级缓存（earlySingletonObjects）中,然后提供给 Bean B 使用。
- 完成 Bean B 的初始化:完成 Bean B 的初始化后,其完全初始化的实例会被存放到一级缓存（singletonObjects）中。
- 完成 Bean A 的初始化:接下来,容器会继续完成 Bean A 的初始化。由于 Bean B 已经完全初始化,所以从一级缓存中取出 Bean B 的实例,完成 Bean A 的依赖注入。
  完成 Bean A 的初始化后,其完全初始化的实例也会被存放到一级缓存中。

通过这样的三级缓存机制,Spring 能够在 Singleton 作用域下有效解决循环依赖的问题,确保 Bean 的正确初始化和高效复用。不过,值得注意的是,这种机制只适用于 Singleton 作用域的 Bean,对于 Prototype 作用域的 Bean,循环依赖问题需要通过重构代码来解决。

## 什么是 Aop?

## Spring 中的事务管理是如何工作的?如何配置和使用事务?

## 什么是 Spring Event?

## 什么是 MVC 模式?什么是 SpringMVC?

MVC（Model-View-Controller）模式是一种广泛使用的软件架构模式,主要用于开发用户界面。MVC 模式将应用程序的输入、处理和输出功能分解为三个主要组件,这些组件分别是:

- Model(模型):模型组件负责管理应用程序的业务数据和业务逻辑。它直接与应用程序的数据源交互,执行业务规则,并保存应用程序状态。模型是独立于 UI 的,不包含任何显示逻辑。
- View(视图):视图组件负责呈现数据给用户。它从模型中获取数据,并将其展示为用户可以理解和操作的形式。视图是纯粹的 UI 组件,不处理业务逻辑,只是展示数据。
- Controller(控制器):控制器组件负责处理用户的输入,并将数据发送给模型进行处理,然后再从模型中获取更新后的数据,最后更新视图。控制器是用户与模型之间的中介,负责控制应用程序的流程。

MVC 模式的优点包括：

- 分离关注点:MVC 模式将应用程序的不同方面（数据、用户界面、控制逻辑）分离,使得代码更易于维护和扩展。
- 可重用性:由于模型独立于视图和控制器,因此模型组件可以被多个视图重用,而视图和控制器也可以独立于模型进行测试。
- 可维护性:由于各组件的职责清晰,因此更容易定位和解决问题。
  SpringMVC 是 Spring 框架的一个子模块,是一个基于 Model-View-Controller（MVC）设计模式的 Web 框架,它提供了一种灵活、强大且易于扩展的方式来处理 HTTP 请求和响应,同时利用了 Spring 框架的核心特性,如依赖注入(DI)和面向切面编程（AOP）。Spring MVC 框架提供了以下主要功能:

- 请求分发:DispatcherServlet 作为前端控制器,接收 HTTP 请求,然后将请求转发给适当的控制器。
- 控制器处理:控制器是处理请求的核心组件,它们负责处理具体的业务逻辑,从模型中获取数据,并将数据发送给视图渲染。
- 视图解析:Spring MVC 提供了视图解析器,它根据控制器返回的视图名称,解析出具体的视图组件,如 JSP、Thymeleaf 或 FreeMarker 模板。
- 模型数据绑定:Spring MVC 支持自动的数据绑定,可以将 HTTP 请求参数绑定到控制器方法的参数上,也可以将模型数据绑定到视图中。
- 异常处理:提供了异常处理机制,可以捕捉和处理控制器中的异常,并返回适当的视图或响应。
- 拦截器:拦截器可以处理预处理和后处理请求,例如身份验证、日志记录或性能监控。

## SpringMVC 的处理流程?

Spring MVC（Model-View-Controller）框架在处理一个 HTTP 请求时,遵循以下的处理流程:

- 接收请求:当一个 HTTP 请求到达服务器时,它首先被 Spring MVC 的前端控制器 DispatcherServlet 捕获。
- 处理器映射:DispatcherServlet 使用 HandlerMapping 接口的实现来查找处理该请求的合适控制器（Handler）。这通常是基于请求的 URL、HTTP 方法等信息进行匹配的。
- 模型填充:在调用控制器之前,HandlerAdapter 可能需要通过 DataBinder 来绑定请求参数到控制器方法的参数上。这包括类型转换和数据验证。
- 控制器执行:控制器方法执行具体的业务逻辑,可能会与服务层、数据访问层交互,获取或处理数据。
- 模型和视图返回:控制器方法通常返回一个 ModelAndView 对象,其中包含了要传给视图的数据（模型）以及视图的名称。有时候,控制器也可能只返回一个视图名称,而模型数据则通过@ModelAttribute 注解自动填充。
- 视图解析:DispatcherServlet 使用 ViewResolver 来解析视图名称,找到实际的视图对象。视图可以是 JSP、Thymeleaf 模板、FreeMarker 模板或其他任何视图技术。
- 渲染视图：解析出的视图会渲染模型数据,生成最终的 HTML 页面或其他类型的响应。
- 响应客户端:最终的响应内容被写回到 HTTP 响应中,发送回客户端。

## 什么是 SpringMVC 全局异常处理机制?

## SpringMVC 环境下如何处理跨域?

## 什么是 SpringBoot?

## SpringBoot 配置文件有哪些?

Spring Boot 支持多种配置文件格式,主要用于定义应用程序的属性和环境变量,常见的配置格式如下:

- application.properties:位于 src/main/resources 目录下,可以 Key-Value 的形式存储,常用于存储应用程序的默认配置。
- application.yaml 或 application.yml:位于 src/main/resources 目录下,功能与 application.properties 相同,使用 YAML (YAML Ain't Markup Language) 格式,提供了更丰富的数据结构表示能力。
- bootstrap.properties 或 bootstrap.yml/yaml:这些配置文件用于设置应用程序启动前的配置,如激活特定的配置文件或设置 Spring Cloud Config Server 的地址。它们在加载 application.\* 文件之前就被读取。
- .properties 或 .yml/yaml 文件在外部目录:Spring Boot 允许从外部目录加载配置文件,例如在 /config 目录下。这可以通过系统属性 spring.config.location 指定。
- 命令行参数:可以直接在运行应用时通过 -Dproperty=value 的形式传递配置属性。例如:`java -jar myapp.jar --server.port=9090`。
- Java 配置:在代码中通过 @ConfigurationProperties 注解或 Environment 接口直接配置属性。
- 系统环境变量:可以使用系统环境变量来覆盖配置文件中的属性。
- 默认属性:Spring Boot 提供了一些默认的配置属性,如果在其他地方没有指定,就会使用这些默认值。

Spring Boot 有一个特定的配置属性优先级,从高到低如下：

- 命令行参数。
- Java 系统属性（System.getProperties()）。
- 操作系统环境变量。
- application-{profile}.properties 或 application-{profile}.yml。
- application.properties 或 application.yml。
- 默认属性（通过 SpringApplication.setDefaultProperties）。

## SpringBoot 自动装配原理?

## 如何定义一个 SpringBoot start?
