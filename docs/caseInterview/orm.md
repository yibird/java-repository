## 1.什么是 Mybatis?

- Mybatis 是一个半 ORM（对象关系映射）框架，它内部封装了 JDBC，加载驱动、创建连接、创建 statement 等繁杂的过程，开发者开发时只需要关注如何编写 SQL 语句，可以严格控制 sql 执行性能，灵活度高。
- 作为一个半 ORM 框架，MyBatis 可以使用 XML 或注解来配置和映射原生信息，将 POJO 映射成数据库中的记录，避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。
- Mybaits 通过 xml 文件或注解的方式将要执行的各种 statement 配置起来，并通过 java 对象和 statement 中 sql 的动态参数进行映射生成最终执行的 sql 语句，最后由 mybatis 框架执行 sql 并将结果映射为 java 对象并返回。（从执行 sql 到返回 result 的过程）。
- 由于 MyBatis 专注于 SQL 本身，灵活度高，所以比较适合对性能的要求很高，或者需求变化较多的项目，如互联网项目。

## 2.Mybatis 优缺点?

- 灵活性好:Mybatis 基于 SQL 语句编程，相当灵活，不会对应用程序或者数据库的现有设计造成任何影响，SQL 写在 XML 里，解除 sql 与程序代码的耦合，便于统一管理；提供 XML 标签，支持编写动态 SQL 语句，并可重用。与 JDBC 相比，减少了 50%以上的代码量，消除了 JDBC 大量冗余的代码，不需要手动开关连接。
- 灵活的结果映射:它提供了强大的结果映射机制，可以处理一对一、一对多、多对多的关系映射，即便数据库字段和 Java 对象属性不完全匹配也能轻松映射。
- 与 Spring 的无缝集成度高:MyBatis 可以很好地与 Spring 框架集成，利用 Spring 的依赖注入和事务管理功能，简化开发工作。
- SQL 维护成本高:SQL 语句的编写工作量较大，尤其当字段多、关联表多时，对开发人员编写 SQL 语句的功底有一定要求。
- 可移植性差:SQL 语句依赖于数据库,导致数据库移植性差,无法随意更换数据库。

## 3.Mybatis 与 Hibernate 的区别?

MyBatis 和 Hibernate 是两个流行的 Java 持久层框架，它们都用于实现对象关系映射（ORM），即在 Java 对象和数据库表之间建立映射关系。尽管它们的目标相似，但它们的工作方式和设计理念有很大的不同。下面是 MyBatis 和 Hibernate 的一些主要区别:

- 抽象层次不同:Hibernate 是一个全功能的 ORM 框架,提供了高度抽象化的对象模型(HQL)。它能够自动处理大部分的数据持久化细节，例如事务管理、缓存、懒加载等，使开发者可以更专注于业务逻辑而不是数据访问细节。而 MyBatis 是一个半自动的 ORM 解决方案，它要求开发者编写 SQL 语句，并手动定义这些语句与 Java 对象之间的映射关系。这使得 MyBatis 更加灵活，可以更好地控制 SQL 查询。hibernate 通过它强大的映射结构和 hql 语言，大大降低了对象与数据库（Oracle、MySQL 等）的耦合性，而 mybatis 由于需要手写 sql，因此与数据库的耦合性直接取决于程序员写 sql 的方法，如果 sql 不具通用性而用了很多某数据库特性的 sql 语句的话，移植性也会随之降低很多，成本很高。
- 性能调优:由于其高度抽象，Hibernate 在某些情况下可能不如原生 SQL 或 MyBatis 高效(无法进行 SQL 调优)，尤其是在复杂的查询和大数据量的情况下。MyBatis 允许开发者直接编写 SQL,因此可以针对特定的数据库优化查询，通常在性能敏感的应用中表现更好。

## 4.#{}与${}的区别?

在 MyBatis 中，`#{}` 和`${}`是两种不同的参数处理方式，它们在预编译 SQL 语句和变量替换上有本质的区别:

- `#{}`:当使用`#{}` 语法时，MyBatis 会将参数值作为预编译语句（Prepared Statement）的一部分。这意味着 SQL 语句在执行前会被数据库驱动解析并编译，参数值在执行时动态填充，这样可以防止 SQL 注入攻击，并且在参数重复使用时提高性能。`#{}`是类型安全的,它支持类型转换,MyBatis 会根据传入参数的类型自动进行转换，比如将 Java 的 Date 类型转换为 SQL 的日期字符串。
- `${}`:`${}`直接将表达式的结果作为字符串替换到 SQL 语句中，不会进行预编译，因此它适用于那些需要动态生成 SQL 语法的部分，如表名、列名或者某些动态 SQL 片段。由于没有预编译,使用`${}` 替换的参数值可能会导致 SQL 注入攻击，所以不建议在参数值中使用这种方式。

## 5.Mybatis 动态 SQL 有什么用?

MyBatis 的动态 SQL 功能是其一大亮点,它允许在 SQL 查询中使用条件语句（如 trim、where、set、foreach、if、choose、when、otherwise、bind 等 9 种动态标签），从而使 SQL 语句可以根据不同的条件动态生成，极大地增强了 SQL 查询的灵活性和适应性,动态 SQL 常用于以下场景:

- 条件查询:动态 SQL 允许你根据参数值的真假条件来决定是否包含某个 SQL 子句。例如,根据用户输入的搜索条件来动态构建 WHERE 子句。
- 拼接条件:有时,需要根据业务逻辑动态地拼接 SQL 语句，例如拼接 ORDER BY 或 GROUP BY 子句。动态 SQL 可以根据需要添加或省略这些子句。
- 处理 null 值:当查询条件中包含可选参数时，如果参数为 NULL 或未提供，动态 SQL 可以避免在 SQL 语句中包含无效的条件，从而避免语法错误或不必要的数据库查询。
- 批量操作:动态 SQL 中的 foreach 元素可以用于处理集合参数，例如批量插入、批量更新或删除等操作，这在处理大量数据时非常有用。
- 优化查询性能:动态 SQL 可以让你根据不同的情况生成最优化的 SQL 语句，例如，根据数据库中的数据分布或索引情况，动态选择不同的查询策略。

MyBatis 的动态 SQL 功能主要依赖于 XML 配置文件中的特殊标签和 OGNL (Object-Graph Navigation Language) 表达式，它们被用来生成基于条件的 SQL 语句。当 MyBatis 解析映射文件并执行 SQL 语句时，它会根据提供的参数动态生成 SQL 语句。下面是动态 SQL 的工作原理：

- XML 配置解析:MyBatis 在启动时会加载所有的映射文件，并解析其中的 SQL 映射语句。当遇到动态 SQL 标签时，它会创建一个特殊的 SQL 语句构建器来处理这些标签。
  OGNL 表达式评估:动态 SQL 标签（如 `<if>`, `<choose>`, `<when>`, `<otherwise>`, `<foreach>` 等）通常包含 OGNL 表达式，这些表达式用于评估参数对象的属性。如果表达式的结果满足条件，那么相应的 SQL 片段就会被包括在最终生成的 SQL 语句中。
- SQL 语句生成:当 MyBatis 准备执行一个动态 SQL 映射时，它会检查所有动态 SQL 标签中的条件，并根据参数对象的属性值来决定哪些 SQL 片段应该被包含在内。这个过程可能涉及多个条件的评估和 SQL 片段的拼接。
- 预编译 SQL 语句:一旦动态 SQL 被完全解析和构建，MyBatis 就会生成一个最终的 SQL 语句字符串。对于大多数数据库，MyBatis 还会预编译这个 SQL 语句，以便在实际执行时能更快地传递参数和获取结果。
- 参数绑定:在 SQL 语句执行前，MyBatis 会将参数对象的属性值绑定到 SQL 语句中的占位符上。这有助于防止 SQL 注入攻击，同时也提高了 SQL 执行的效率。
- 执行 SQL 语句:最终，MyBatis 会通过 JDBC 连接执行预编译的 SQL 语句，同时将参数值正确地传递给数据库。

## 6.Mybatis 的 Xml 映射文件中,不同的 Xml 映射文件,id 是否可以重复？

## 当实体类中的属性名和表中的字段名不一样怎么办?

在 MyBatis 中，如果实体类（JavaBean）的属性名与数据库表中的字段名不一致，可以通过几种方式来解决这个问题:

- 使用别名:在 SQL 查询语句中，可以使用 AS 关键字为字段添加别名，使其与实体类的属性名匹配。
- 使用自定义结果映射规则:MyBatis 提供了 resultMap 元素,可以自定义结果映射规则,指定数据库字段与 Java 属性之间的映射关系。除了通过 resultMap 元素自定义结果映射规则外,Mybatis 也支持@Results 或 @ResultMap 注解方式自定义结果映射。

```java
@Select("SELECT id, name FROM users")
@Results({
    @Result(property = "userId", column = "id"),
    @Result(property = "userName", column = "name")
})
List<User> selectUsers();
```

## 如何在 mapper 中如何传递多个参数?

在 MyBatis 中，向 Mapper 传递多个参数有几种常用的方法:

- 使用@Param 注解:当需要传递多个参数时，可以使用 @Param 注解来为每个参数命名。这样在 SQL 映射文件中,可以通过参数名称来引用它们。
- 将多个参数封装成 map:可以将多个参数封装在一个 Map 对象中，然后传递给 Mapper 方法。在 SQL 映射文件中,可以通过 #{mapKey} 的方式引用参数。
- 将多个参数封装成 POJO 类:这种方式类似于 map,但可读性和可维护性更好。

## 7.一对一、一对多的关联查询?

在 MyBatis 中，处理一对一（One-to-One）和一对多（One-to-Many）的关联查询通常涉及到联合查询和结果映射。MyBatis 提供了 association 和 collection 元素来处理这些关系。

- `<collection>`:该元素用于处理一对多（1:N）或多对多 (N:M) 的关系映射。该元素提供如下属性:
  - property: 这个属性指定了 Java 对象中的集合属性名称，该属性将用来保存从数据库查询得到的多个结果。
  - ofType: 指定集合中每个元素的类型。这个属性允许你指定集合中元素的具体 Java 类型，这在 MyBatis 的早期版本中是必需的，但在新版本中可以省略，因为 MyBatis 能够自动推断类型。
  - column: 指定从 SQL 查询中获取的列名，该列名将用于填充集合中的对象属性。当有多个列时，可以使用逗号分隔的列名列表。
  - javaType: 指定集合本身的 Java 类型，例如 List, Set 等。如果省略，则默认为 List。
  - select: 如果你的查询涉及子查询，可以使用 select 属性来引用另一个 SQL 语句的 ID，这样可以实现嵌套查询。
- `<association>`:该元素用于处理一对一（1:1）或一对零或一（1:0..1）的关联关系映射。该元素提供如下属性:
  - property: 指定 Java 对象中用于存储关联对象的属性名称。这通常是实体类中的一个属性，用于存放另一个实体对象。
  - javaType: 指定关联对象的 Java 类型。这告诉 MyBatis 如何将查询结果转换成正确的 Java 对象。
  - column: 指定从 SQL 查询中获取的列名，这些列将用于填充关联对象的属性。如果关联对象的属性名与数据库列名相同，可以省略此属性。
  - select: 如果关联对象需要通过一个单独的查询来获取，可以使用此属性指定另一个映射 ID，MyBatis 会先执行这个映射 ID 对应的 SQL 语句，再将结果映射到关联对象上。这种方法称为嵌套查询（Nested Query）。

## Mybatis 的一级、二级缓存?

MyBatis 提供了一级缓存和二级缓存机制，用于改善应用程序的性能，减少对数据库的访问次数:

- 一级缓存:一级缓存是 MyBatis 默认开启的,基于 PerpetualCache 的 HashMap 本地缓存，它作用于同一个 SqlSession 的生命周期内。这意味着在同一个 SqlSession 中，如果两次执行相同的 SQL 语句（包括参数完全相同），MyBatis 会首先检查缓存中是否存在结果，如果存在，则直接从缓存中获取，而不会再次执行 SQL 语句。一级缓存是基于 SqlSession 的，当 SqlSession 关闭或提交事务后，缓存将会清空。当数据发生变更（如增删改操作）时,受影响的缓存数据会自动失效。
- 二级缓存:二级缓存与一级缓存其机制相同,默认也是采用 PerpetualCache，HashMap 存储,但二级缓存是在同一命名空间下的多个 SqlSession 之间共享的缓存，可以跨 SqlSession 使用,并且可自定义存储源(例如 Ehcache)。二级缓存需要显式启用，它提供了一种更持久的缓存解决方案，可以显著提高读取密集型应用的性能。当数据发生变更时，受影响的缓存数据需要手动清除，或者配置自动清除机制。

## Mybatis 的拦截器?

MyBatis 的拦截器(Interceptor)是一种强大的扩展点，允许开发者在 MyBatis 执行某些操作之前或之后添加自定义的逻辑。拦截器可以用来拦截 SQL 语句的执行、参数的设置、结果的处理等，从而实现诸如日志记录、性能监控、数据过滤、事务管理等功能。自定义拦截器需要实现 Mybatis 提供的 Interceptor 接口,并重写 intercept()方法。Interceptor 接口定义了以下方法:

- intercept(Invocation invocation): 这是核心方法，当 MyBatis 调用拦截的目标方法时，会先调用此方法。拦截器可以在这个方法中执行自己的逻辑，然后调用 invocation.proceed() 来继续执行目标方法，或者自己模拟目标方法的行为。
- Object plugin(Object target): 用于返回一个包装后的对象，可以返回原对象或对其进行代理。
- void setProperties(Properties properties): 用于初始化拦截器，可以在此方法中读取配置文件中的属性。

自定义统计 SQL 耗时拦截器:

```java
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;

import java.util.Properties;

/**
 * @Intercepts是Mybatis提供的一个注解,它告诉 MyBatis 此拦截器应当拦截哪些目标方法,可以使用此注解
 * 来指定一个或多个 Signature 对象，每个 Signature 对象都定义了要拦截的目标方法的特征。
 * Signature是一个对象,它由三个属性组成:
 * type:指定目标方法所在的类。type = Executor.class表示拦截 Executor 类的方法。
 * method:指定要拦截的方法名。method = "query"表示拦截名为 query 的方法。
 * args:一个数组,包含了目标方法的参数类型列表。args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}
 * 表示query 方法接收四个参数,类型分别为 MappedStatement, Object, RowBounds, 和 ResultHandler。
 */
@Intercepts({@Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})})
public class SqlExecutionTimeInterceptor implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        long startTime = System.currentTimeMillis();

        // 继续执行目标方法
        Object result = invocation.proceed();

        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;

        MappedStatement mappedStatement = (MappedStatement) invocation.getArgs()[0];
        BoundSql boundSql = mappedStatement.getBoundSql(invocation.getArgs()[1]);

        System.out.println("SQL: " + boundSql.getSql());
        System.out.println("Execution Time: " + executionTime + " ms");

        return result;
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
        // 可以在这里读取配置文件中的属性
    }
}
```

创建拦截器后需要向 Mybatis 注册,在 Mybatis 中注册拦截器分为 xml 和 Java 类两种注册方式:

```txt
// 使用xml方式注册拦截器
<configuration>
    <!-- ... other configurations ... -->

    <plugins>
        <plugin interceptor="com.example.SqlExecutionTimeInterceptor">
            <!-- 可以在这里添加配置参数 -->
        </plugin>
    </plugins>
</configuration>


// 使用Java类方式注册拦截器
Configuration config = new Configuration();
config.addInterceptor(new SqlExecutionTimeInterceptor());
```

## Mybatis 是如何进行分页的?分页插件的原理是什么?

## 使用 MyBatis 的 mapper 接口调用时有哪些要求?

- Mapper 接口方法名和 mapper.xml 中定义的每个 sql 的 id 相同；
- Mapper 接口方法的输入参数类型和 mapper.xml 中定义的每个 sql 的 parameterType 的类型相同。
- Mapper 接口方法的输出参数类型和 mapper.xml 中定义的每个 sql 的 resultType 的类型相同。
- Mapper.xml 文件中的 namespace 即是 mapper 接口的类路径。

## 什么是 MybatisPlus?

MyBatisPlus（通常缩写为 MP）是 MyBatis 的一个增强版，它旨在简化 MyBatis 的使用，提供更多的功能和更便捷的操作方式。MyBatisPlus 保留了 MyBatis 的核心功能，同时添加了一系列额外的功能，使得开发者可以更高效地进行数据库操作，减少重复代码的编写。MP 支持如下特性:

- 简化 CRUD 操作:MyBatisPlus 提供了自动化的 CRUD 方法，开发者可以通过简单的接口调用来完成常见的数据库操作，而无需手动编写 SQL 语句。
- 支持 Lambda 形式调用：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错。
- 支持主键自动生成：支持多达 4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自由配置，完美解决主键问题。
- 支持 ActiveRecord 模式：支持 ActiveRecord 形式调用，实体类只需继承 Model 类即可进行强大的 CRUD 操作。
- 支持自定义全局通用操作：支持全局通用方法注入（ Write once, use anywhere ）。
- 内置代码生成器：采用代码或者 Maven 插件可快速生成 Mapper 、 Model 、 Service 、 Controller 层代码，支持模板引擎，更有超多自定义配置等您来使用。
- 内置分页插件：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询。
- 分页插件支持多种数据库：支持 MySQL、MariaDB、Oracle、DB2、H2、HSQL、SQLite、Postgre、SQLServer 等多种数据库。
- 内置性能分析插件：可输出 SQL 语句以及其执行时间，建议开发测试时启用该功能，能快速揪出慢查询。
- 内置全局拦截插件：提供全表 delete 、 update 操作智能分析阻断，也可自定义拦截规则，预防误操作。
