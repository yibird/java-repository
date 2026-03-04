日志是计算机系统、软件应用或网络设备在运行过程中自动记录的事件序列文件或数据流。这些记录包含了关于系统操作、用户活动、故障信息、警告以及其他重要事件的详细信息。日志可以分为多种类型,包括但不限于系统日志、安全日志、应用日志、错误日志和审核日志等。日志对于软件开发至关重要,它帮助开发者调试代码、监控应用运行状态、追踪错误以及进行性能分析。Java 日志体系经历了多年的发展,形成了多样化的日志框架和标准接口,主要分为以下几个阶段:
**System.out.println()**:在 Java 发展的早期,开发者主要通过 System.out.println()或 System.err.println()来输出日志信息,这种方式使用 IO 流方式输出日志,会阻塞主线程,而且不支持日志级别、日志持久化等高级特性,难以满足复杂应用的需求。

- **Java Util Logging (JUL)**:Java Util Logging(JUL)是 Java 平台标准版(Java SE)的一部分,从 Java 1.4 开始引入,位于 java.util.logging 包下。它是 Java 自带的一个轻量级日志框架,旨在为 Java 应用程序提供基本的日志记录功能。虽然不如 Log4j、Logback 等第三方日志框架那样功能全面和灵活,但其优势在于无需外部依赖,直接内置在 JDK 中,对于简单的日志记录需求或对集成复杂度有严格限制的场景非常适用。
- **SLF4J(Simple Logging Facade for Java)**:SLF4J 是位于各种日志框架之上的一个抽象层或门面(Facade)。它提供了一个统一的日志接口,使得开发者在编写代码时,可以不直接依赖任何特定的日志实现(如 Logback、Log4j、Java Util Logging 等),而是通过 SLF4J 的 API 来记录日志。这样一来,应用程序的日志逻辑与底层日志实现解耦,增加了灵活性和可移植性。
- **Log4j**:Log4j 是 Apache 软件基金会的一个开源项目,全称为 Apache Log4j,是 Java 平台上非常流行的日志记录工具。它提供了一种灵活且强大的方式来配置日志的生成过程,包括日志信息的输出目的地、布局(格式)、日志级别等,广泛应用于各种 Java 应用程序中。Log4j 的设计遵循了“Separation of Concerns”原则,即关注点分离,让开发者专注于业务逻辑,而不必担心日志的管理细节。
- **Logback**:Logback 是另一个非常受欢迎的日志库,专为 Java 平台设计,由 Ceki Gülcü 创建,他是 Log4j 原始作者之一。Logback 被视为 Log4j 的后续项目,旨在克服 Log4j 的一些局限性,并提供更好的性能和灵活性。Logback 是 SLF4J(Simple Logging Facade for Java)的参考实现,SLF4J 是一个为各种日志框架提供的简单外观或抽象层,允许用户在运行时切换日志实现。
- **Log4j2**:Log4j2 是 Apache Log4j 项目的第二代产品,它是一个先进的、高性能的日志记录框架,专为 Java 应用程序设计。Log4j2 是在 Log4j 1.x 基础上进行了大量改进,并且吸取了 Logback 等其他日志框架的优点。Log4j2 支持异步日志处理,在内部引入了无锁异步日志记录机制,显著提高了日志记录的吞吐量和降低了日志操作的延迟,从而减少了对应用性能的影响。由于使用更高效的算法和数据结构,Log4j2 在很多场景下的性能表现优于 Log4j 1.x 和 Logback,尤其是在高并发和大数据量日志处理场景下。

## Slf4j

Slf4j 内部基于门面模式实现,本身只提供了一个 slf4j-api-version.jar 包,这个 jar 中主要是日志的抽象接口,jar 中本身并没有对抽象出来的接口做实现。在阿里巴巴 Java 开发规范中明确要求应用中应强制使用 SLF4J 作为日志的门面接口,SLF4J 提供了一个统一的接口层,使得业务代码与具体的日志实现(如 Log4j、Logback、Java Util Logging 等)解耦,而且能够确保整个应用中日志处理方式的统一,便于维护和管理。SLF4J 在设计上支持更高效的日志处理,例如通过参数化日志消息减少不必要的字符串拼接操作,以及允许根据运行时环境动态调整日志级别。由于 SLF4J 内部仅提供抽象接口,其他日志组件可以针对不同的日志实现方案封装出不同的桥接组件(例如 logback-classic-version.jar,slf4j-log4j12-version.jar)。

```java
// 使用SLF4J
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
private static final Logger logger = LoggerFactory.getLogger(Test.class);

// 使用JCL
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
private static final Logger logger = LoggerFactory.getLogger(Test.class);
```

## LogBack

在 SpringBoot 应用中,默认使用 Logback 作为日志框架。Logback 由 logback-core、logback-classic、logback-access 三个模块组成。

- logback-core:属于 Logback 的基础模块,是其他两个模块的基础。
- logback-classic:可以看作 Log4j 的改进版本,同时 logback-classic 自身实现了 SLF4J API,使开发者可以在 Logback 框架与其他日志框架(如 Log4j 或 java.util.logging)之间自由切换。
- logback-access:与 Servlet 容器(如 Tomcat 和 Jetty)集成,以提供 HTTP 访问日志功能。
  Logback 的日志信息由如下部分组成:
- 时间日期:日志打印时间,精确到毫秒。
- 日志级别:日志级别分为 FATAL、ERROR、WARN、INFO、DEBUG、TRACE。
- 进程 ID:进程 ID 是指当前应用对应的 PID。
- 分隔符:分隔符用于区分实际日志消息的开始。
- 线程名称:当前打印日志线程的名称。
- 记录器名称:一般使用类名。
- 日志内容:日志输出的具体内容。
