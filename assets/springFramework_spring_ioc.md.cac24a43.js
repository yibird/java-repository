import{_ as a,o as e,c as n,O as i}from"./chunks/framework.1e38657f.js";const _=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"springFramework/spring/ioc.md","filePath":"springFramework/spring/ioc.md","lastUpdated":1708792908000}'),o={name:"springFramework/spring/ioc.md"},t=i('<h2 id="_1-spring-ioc-容器" tabindex="-1">1.Spring IOC 容器 <a class="header-anchor" href="#_1-spring-ioc-容器" aria-label="Permalink to &quot;1.Spring IOC 容器&quot;">​</a></h2><h3 id="_1-1-什么是-springioc-容器" tabindex="-1">1.1 什么是 SpringIOC 容器 <a class="header-anchor" href="#_1-1-什么是-springioc-容器" aria-label="Permalink to &quot;1.1 什么是 SpringIOC 容器&quot;">​</a></h3><p>IoC 也称为依赖注入 (DI)。这是一个过程,其中对象仅通过构造函数参数、工厂方法的参数或在对象实例被构造或从工厂方法返回后在对象实例上设置的属性来定义它们的依赖项(即它们使用的其他对象),然后容器在创建 bean 时注入这些依赖项。这个过程基本上是 bean 本身的逆过程(因此得名控制反转),通过使用类的直接构造或诸如服务定位器模式之类的机制来控制其依赖项的实例化或位置。</p><h3 id="_1-2-spring-ioc-容器架构图" tabindex="-1">1.2 Spring IOC 容器架构图 <a class="header-anchor" href="#_1-2-spring-ioc-容器架构图" aria-label="Permalink to &quot;1.2 Spring IOC 容器架构图&quot;">​</a></h3><p>在 Spring 中<code>org.springframework.beans</code>和<code>org.springframework.context</code>包是 Spring 框架的 IoC 容器的基础。该 BeanFactory 接口提供了一种能够管理任何类型对象的高级配置机制。 ApplicationContext 是 的子接口 BeanFactory,BeanFactory 提供了配置框架和基本功能,而 ApplicationContext 添加了更多企业特定的功能。</p><ul><li>BeanFactory:BeanFactory 是 Spring IoC 容器的根接口,定义了容器的基本功能,如获取 Bean 实例、管理 Bean 的生命周期等。它是 IoC 容器的最基本形式。</li><li>ApplicationContext:ApplicationContext 是 BeanFactory 接口的子接口,它在 BeanFactory 的基础上添加了更多的功能,如国际化、事件传播、AOP 等。ApplicationContext 是 Spring 应用程序中最常用的 IoC 容器。容器通过读取配置元数据来获取有关要实例化、配置和组装哪些对象的指令。配置元数据以 XML、Java 注解或 Java 代码表示。它可以描述组成应用程序的对象以及这些对象之间丰富的相互依赖关系。</li><li>ClassPathXmlApplicationContext:一个 ApplicationContext 接口的实现类,它用于从类路径中加载 XML 配置文件来创建应用程序上下文。</li><li>FileSystemXmlApplicationContext:一个 ApplicationContext 接口的实现类,它用于从文件系统路径中加载 XML 配置文件来创建应用程序上下文。</li><li>XmlBeanDefinitionReader 类:XmlBeanDefinitionReader 是一个用于从 XML 配置文件中读取 Bean 定义的类。它将 Bean 定义解析为 BeanDefinition 对象。</li><li>BeanDefinition:表示一个 Bean 的定义,包括类名、作用域、属性等信息。IoC 容器使用 BeanDefinition 来创建和管理 Bean 实例。在 Java 中可以将一个类理解为一个 Bean,而在 Spring 中通过 BeanDefinition 描述一个 Bean。</li><li>DefaultListableBeanFactory 类:DefaultListableBeanFactory 是 BeanFactory 接口的一个实现,它提供了 Bean 的注册、创建和管理功能。它还继承了 XmlBeanDefinitionReader,可以将 XML 配置文件中的 Bean 定义加载到容器中。</li><li>AnnotationConfigApplicationContext 类: 一个 ApplicationContext 接口的实现类,它通过 Java 配置类来创建应用程序上下文,而不是依赖于 XML 配置文件。由于 XML 的方式配置较为繁琐,Spring 推荐通过 Java Config 装配 Bean。</li><li>GenericApplicationContext 类:一个 ApplicationContext 接口的通用实现,它可以通过编程方式注册 Bean 定义。</li></ul><h3 id="_1-3-classpathxmlapplicationcontext" tabindex="-1">1.3 ClassPathXmlApplicationContext <a class="header-anchor" href="#_1-3-classpathxmlapplicationcontext" aria-label="Permalink to &quot;1.3 ClassPathXmlApplicationContext&quot;">​</a></h3><h3 id="_1-4-filesystemxmlapplicationcontext" tabindex="-1">1.4 FileSystemXmlApplicationContext <a class="header-anchor" href="#_1-4-filesystemxmlapplicationcontext" aria-label="Permalink to &quot;1.4 FileSystemXmlApplicationContext&quot;">​</a></h3><h3 id="_1-4-annotationconfigapplicationcontext" tabindex="-1">1.4 AnnotationConfigApplicationContext <a class="header-anchor" href="#_1-4-annotationconfigapplicationcontext" aria-label="Permalink to &quot;1.4 AnnotationConfigApplicationContext&quot;">​</a></h3><h2 id="_2-bean-的注入与装配" tabindex="-1">2.Bean 的注入与装配 <a class="header-anchor" href="#_2-bean-的注入与装配" aria-label="Permalink to &quot;2.Bean 的注入与装配&quot;">​</a></h2><h3 id="_2-1-bean-的定义" tabindex="-1">2.1 Bean 的定义 <a class="header-anchor" href="#_2-1-bean-的定义" aria-label="Permalink to &quot;2.1 Bean 的定义&quot;">​</a></h3><h3 id="_2-2-bean-的注入" tabindex="-1">2.2 Bean 的注入 <a class="header-anchor" href="#_2-2-bean-的注入" aria-label="Permalink to &quot;2.2 Bean 的注入&quot;">​</a></h3><h3 id="_2-3-bean-的三种注入方式" tabindex="-1">2.3 Bean 的三种注入方式 <a class="header-anchor" href="#_2-3-bean-的三种注入方式" aria-label="Permalink to &quot;2.3 Bean 的三种注入方式&quot;">​</a></h3><p>在 Spring 中提供了属性注入、setter 注入、构造器注入三种方式。</p><h4 id="_2-3-1-属性注入" tabindex="-1">2.3.1 属性注入 <a class="header-anchor" href="#_2-3-1-属性注入" aria-label="Permalink to &quot;2.3.1 属性注入&quot;">​</a></h4><h4 id="_2-3-2-setter-注入" tabindex="-1">2.3.2 setter 注入 <a class="header-anchor" href="#_2-3-2-setter-注入" aria-label="Permalink to &quot;2.3.2 setter 注入&quot;">​</a></h4><h4 id="_2-3-3-构造器-注入" tabindex="-1">2.3.3 构造器 注入 <a class="header-anchor" href="#_2-3-3-构造器-注入" aria-label="Permalink to &quot;2.3.3 构造器 注入&quot;">​</a></h4><h3 id="_2-4-bean-的装配" tabindex="-1">2.4 Bean 的装配 <a class="header-anchor" href="#_2-4-bean-的装配" aria-label="Permalink to &quot;2.4 Bean 的装配&quot;">​</a></h3><h3 id="_2-5-bean-循环依赖问题" tabindex="-1">2.5 Bean 循环依赖问题 <a class="header-anchor" href="#_2-5-bean-循环依赖问题" aria-label="Permalink to &quot;2.5 Bean 循环依赖问题&quot;">​</a></h3><h2 id="_3-bean-的作用域" tabindex="-1">3.Bean 的作用域 <a class="header-anchor" href="#_3-bean-的作用域" aria-label="Permalink to &quot;3.Bean 的作用域&quot;">​</a></h2><h2 id="_4-条件化注入-bean" tabindex="-1">4.条件化注入 Bean <a class="header-anchor" href="#_4-条件化注入-bean" aria-label="Permalink to &quot;4.条件化注入 Bean&quot;">​</a></h2><p>在 Spring 中提供了一些注解,用于根据特定条件选择性地创建和管理 Bean,避免注入不必要的 Bean,从而优化应用启动速度。常用注解如下:</p><ul><li><code>@Conditional</code>:@Conditional 注解用于在创建 Bean 之前检查特定条件。可以使用它自定义一个实现了 Condition 接口的类,然后将这个类与 @Conditional 注解一起使用,以决定是否创建指定的 Bean。</li><li><code>@ConditionalOnBean</code>:该注解用于指定只有当指定的 Bean 存在于容器中时才会创建和配置当前 Bean。</li><li><code>@ConditionalOnMissingBean</code>:与 <code>@ConditionalOnBean</code> 相反,<code>@ConditionalOnMissingBean</code> 注解用于指定只有当指定的 Bean 不存在于容器中时才会创建和配置当前 Bean。</li><li><code>@ConditionalOnClass</code>:该注解用于指定只有当指定的类存在于类路径中时才会创建和配置当前 Bean。</li><li><code>@ConditionalOnProperty</code>:该注解用于指定只有当指定的配置属性存在且满足特定条件时才会创建和配置当前 Bean。</li><li><code>@ConditionalOnExpression</code>:该注解用于根据 SpEL 表达式的结果来决定是否创建和配置当前 Bean。</li><li><code>@ConditionalOnMissingClass</code>:该注解用于指定只有当指定的类不存在于类路径中时才会创建和配置当前 Bean。</li><li><code>@ConditionalOnWebApplication</code>:该注解用于指定只有当应用程序部署为 Web 应用时才会创建和配置当前 Bean。</li><li><code>@ConditionalOnNotWebApplication</code>:与 <code>@ConditionalOnWebApplication</code> 相反,<code>@ConditionalOnNotWebApplication</code> 注解用于指定只有当应用程序不是 Web 应用时才会创建和配置当前 Bean。</li></ul><h2 id="_5-动态注入-bean" tabindex="-1">5.动态注入 Bean <a class="header-anchor" href="#_5-动态注入-bean" aria-label="Permalink to &quot;5.动态注入 Bean&quot;">​</a></h2><p>在 Spring 框架中,有多种方式可以动态注册 Bean。动态注册 Bean 通常是在应用程序运行时根据特定条件或需求来添加新的 Bean 定义到 Spring 容器中。</p><ul><li>通过 BeanDefinitionRegistry 接口注册 Bean。</li><li>通过实现 ImportSelector 接口注册 Bean。</li><li>通过实现 ImportBeanDefinitionRegistrar 接口注册 Bean。</li><li>通过实现 BeanFactoryPostProcessor 接口注册 Bean。</li><li>通过实现 FactoryBean 接口创建 Bean 工厂注册 Bean。</li></ul><h2 id="_6-bean-的生命周期" tabindex="-1">6.Bean 的生命周期 <a class="header-anchor" href="#_6-bean-的生命周期" aria-label="Permalink to &quot;6.Bean 的生命周期&quot;">​</a></h2><h2 id="_7-bean-生命周期扩展" tabindex="-1">7.Bean 生命周期扩展 <a class="header-anchor" href="#_7-bean-生命周期扩展" aria-label="Permalink to &quot;7.Bean 生命周期扩展&quot;">​</a></h2>',28),l=[t];function r(c,d,s,p,h,B){return e(),n("div",null,l)}const C=a(o,[["render",r]]);export{_ as __pageData,C as default};
