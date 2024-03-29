AOP 是 Aspect-oriented Programming(面向切面编程)的简称,AOP 通过提供另一种思考程序结构的方式来补充面向对象编程(OOP)。在 OOP 中模块的基础单位是类,在 AOP 中模块的基础单位是切面,所以 AOP 相比较 OOP 处理粒度更细,Aop 能够实现跨越多种类型和对象的关注点(例如事务管理)的模块化。

虽然 IOC 和 AOP 作为 Spring 核心的功能,但 AOP 功能是独立的,AOP 补充了 Spring IoC 以提供一个非常强大的中间件解决方案。Spring 提供了 XML 配置文件和@AspectJ 注解风格两种方式自定义切面,相比较繁杂的配置文件官方更推荐使用注解形式编写切面。

说明:@AspectJ 指的是一种将方面声明为带有注解的常规 Java 类的风格。@AspectJ 样式由 AspectJ 项目作为 AspectJ 5 版本的一部分引入 。Spring 解释与 AspectJ 5 相同的注释,使用 AspectJ 提供的库进行切入点解析和匹配。但是,AOP 运行时仍然是纯 Spring AOP,并且不依赖于 AspectJ 编译器或编织器。
