## 1.Stream 介绍

Java Stream 是 Java 8 引入的一个功能强大的 API,用于对集合数据进行操作和处理,Stream 以一种声明式的方式处理数据,类似于 SQL 中的查询操作。Java Stream 特点:

- 流是对数据源的一种抽象,可以是集合、数组、I/O 通道等。
- 流不会直接存储数据,而是在管道中传输数据,数据源可以保持不变。
- 流的操作可以是中间操作或终端操作。中间操作返回一个新的流,允许对数据进行连续的处理和转换。终端操作触发流的处理并生成结果。
- 流的操作是延迟执行的,只有在终端操作调用时才会执行流的处理。

### 1.1 通过 Stream 工厂方法创建 Stream

Stream 提供了工厂方法用于创建 Stream:

- Stream.of(T... values):根据指定元素创建 Stream。
- Stream.empty():创建一个空的 Stream。
- Stream.iterate(seed, hasNext, next):通过迭代器创建 Stream,指定种子值、判断是否还有下一个元素的条件和获取下一个元素的操作。
- Stream.generate(supplier):通过生成器创建 Stream,指定生成元素的操作。注意:Stream.generate()方法创建的无限流(infinite stream)无法直接使用 collect()方法进行收集操作,因为无限流没有固定的大小,而 collect()需要知道流的大小才能完成收集操作。

### 1.2 Stream 操作

Stream 的操作根据类型可分为转换操作、终端操作、并行流操作。

- 转换操作:

  - filter(Predicate):根据指定条件过滤元素。
  - map(Function):对每个元素执行指定的映射操作。
  - flatMap(Function):将每个元素转换为流,并将所有流的元素合并为一个流。
  - distinct():去除重复的元素。
  - sorted():对元素进行排序。
  - limit(long):限制元素数量。
  - skip(long):跳过指定数量的元素。
  - peek():用于对 Stream 中的每个元素执行指定的操作,常用于调试和观察 Stream 的中间结果。
  - reduce():用于将 Stream 中的元素进行归约操作,得到一个最终的结果。
  - dropWhile(Predicate):用于从 Stream 中丢弃满足指定条件的元素,直到遇到第一个不满足条件的元素为止。
  - takeWhile(Predicate):用于从 Stream 中获取满足指定条件的连续元素,直到遇到第一个不满足条件的元素为止。
  - flatMap:将多维 Stream 拍平为一维 Stream。用于将一个 Stream 中的每个元素映射为一个新的 Stream,并将这些新的 Stream 合并成一个单一的 Stream。

- 终端操作:
  - forEach(Consumer):对每个元素执行指定的操作。
  - collect(Collector):将流的元素收集到一个集合或其他数据结构中。
  - count():返回流中的元素数量。
  - anyMatch(Predicate):判断流中是否有元素满足指定条件。
  - allMatch(Predicate):判断流中的所有元素是否都满足指定条件。
  - noneMatch(Predicate):判断流中是否没有元素满足指定条件。
  - findFirst():返回流中的第一个元素。
  - findAny():返回流中的任意一个元素。
- 并行流操作:
  - parallel():将流转换为并行流,以便并行处理数据。并行流可以在多个线程上并发地执行操作,以提高处理大量数据的效率,能大幅度提升 CPU 密集计算任务。parallel()底层通过将顺序流转换为并行流来实现并发处理,底层实现依赖于 Java 的 Fork/Join 框架。
    当调用 parallel()方法时,Stream 会被分割成多个小块,这些小块会被分配给不同的线程进行并发处理。每个线程会独立地处理分配给它的小块,并将结果合并起来以生成最终的结果。
  - sequential():将并行流转换为顺序流。

```java
package com.fly;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Test {
    public static void main(String[] args) {
        operateStream();
    }

    public static void operateStream() {
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee(1001, "刘强东", 230, 7000.0));
        employees.add(new Employee(1002, "马云", 20, 3000.0));
        employees.add(new Employee(1003, "马化腾", 50, 4500.0));
        employees.add(new Employee(1004, "马超", 10, 10000.0));
        employees.add(new Employee(1005, "张一鸣", 30, 12000.0));
        employees.add(new Employee(1005, "张一鸣", 30, 12000.0));
        employees.add(new Employee(1006, "张三鸣", 90, 12000.0));
        employees.add(new Employee(1007, "司马大圣", 111, 100000.0));
        employees.add(new Employee(1008, "欧阳神奇", 880, 20000.0));

        System.out.println();
        System.out.println("forEach:接受一个消费者接口用于遍历元素");
        employees.forEach(item -> System.out.print(item.getName() + " "));
        System.out.println();
        System.out.println();

        System.out.println("map:接受一个Function接口,用于对每个元素执行指定的映射操作");
        // 从Employee对象转换为item.getName()
        System.out.println(
                employees.stream().map(item -> item.getName()).collect(Collectors.joining(","))
        );
        System.out.println();

        System.out.println("filter:接受一个断言接口参数,根据断言函数的boolean返回值过滤遍历元素");
        // 过滤工资小于10000的员工,并以,号分割打印员工的名字
        System.out.println(
                employees.stream().filter(item -> item.getSalary() < 10000)
                        .map(item -> item.getName()).collect(Collectors.joining(","))
        );
        System.out.println();

        System.out.println("limit:指定截取长度用于截取Stream元素");
        // 截取Stream前三个元素,并以,号分割打印员工的名字
        System.out.println(
                employees.stream().limit(3)
                        .map(item -> item.getName()).collect(Collectors.joining(","))
        );
        System.out.println();

        System.out.println("skip:跳过元素,此方法会返回n条之后的数据,不含第n条");
        // 跳过Stream前三个元素,并以,号分割打印员工的名字
        System.out.println(
                employees.stream().skip(3)
                        .map(item -> item.getName()).collect(Collectors.joining(","))
        );
        System.out.println();

        System.out.println("用于对Stream中的每个元素执行指定的操作,常用于调试和观察Stream的中间结果");
        // 打印所有员工的名字
        System.out.println(employees.stream().peek(item -> item.getName()));
        System.out.println();

        System.out.println("distinct:去重Stream中重复的数据");
        // 去重Stream中重复的数据,并以,号分割打印员工的名字
        System.out.println(
                employees.stream().distinct()
                        .map(item -> item.getName()).collect(Collectors.joining(","))
        );
        System.out.println();

        System.out.println("count:获取Stream的长度");
        // 获取员工工资大于20000的员工数量
        System.out.println(employees.stream().filter(item -> item.getSalary() > 20000).count());
        System.out.println();

        System.out.println("sorted:用于对Stream进行排序,sorted接受一个Comparator接口,为true表示升序,反之为降序");
        // 根据员工工资升序
        System.out.println(
                employees.stream().sorted(Comparator.comparingDouble(Employee::getSalary))
                        .map(item -> item.getName()).collect(Collectors.joining(","))
        );
        System.out.println();

        System.out.println("max:根据表达式获取Stream值最大的元素,返回一个Optional对象");
        // 返回员工集合中工资最高的员工名字
        System.out.println(employees.stream().max(Comparator.comparingDouble(Employee::getSalary)).get().getName());
        System.out.println();

        System.out.println("min:根据表达式获取Stream值最小的元素,返回一个Optional对象");
        // 返回员工集合中工资最低的员工名字
        System.out.println(employees.stream().min(Comparator.comparingDouble(Employee::getSalary)).get().getName());
        System.out.println();

        System.out.println("findFirst:获取Stream第一个元素,返回一个Optional对象");
        System.out.println(employees.stream().findFirst().get());
        System.out.println();

        System.out.println("findAny:获取流中的任意一个元素,返回一个Optional对象");
        System.out.println(employees.stream().findAny().get());
        System.out.println();

        System.out.println("allMatch:接受一个断言函数匹配所有元素,如果所有元素都匹配,则返回true,反之返回false");
        // 判断员工集合中所有人的工资是否都大于7000
        System.out.println(employees.stream().allMatch(e -> e.getSalary() > 7000));
        System.out.println();

        System.out.println("anyMatch:接受一个断言函数匹配任意元素,如果匹配任意元素,则返回true,反之返回false");
        //判断员工集合中所有人的工资是否都小于7000000,与allMatch相反。
        System.out.println(employees.stream().noneMatch(e -> e.getSalary() > 7000000));
        System.out.println();

        System.out.println("noneMatch:接受一个断言函数匹配所有元素,如果所有元素不匹配,则返回true,反之返回false");
        // 判断员工集合中工资是否都小于7000
        System.out.println(employees.stream().noneMatch(e -> e.getSalary() < 7000));
        System.out.println();

        System.out.println("reduce:用于将 Stream 中的元素进行归约操作,得到一个最终的结果");
        // 计算员工工资之和
        System.out.println(employees.stream().map(Employee::getSalary).reduce(0.0, Double::sum));
        System.out.println();

        System.out.println("dropWhile:用于从 Stream 中丢弃满足指定条件的元素,直到遇到第一个不满足条件的元素为止");
        // 丢弃工资小于7000的数据,即获取工资大于7000的数据
        System.out.println(employees.stream().dropWhile(e -> e.getSalary() > 7000)
                .map(e -> e.getName()).collect(Collectors.joining(","))
        );
        System.out.println();

        System.out.println("takeWhile:用于从 Stream 中获取满足指定条件的连续元素,直到遇到第一个不满足条件的元素为止");
        // 获取工资小于7000的数据
        System.out.println(employees.stream().takeWhile(e -> e.getSalary() < 7000)
                .map(e -> e.getName()).collect(Collectors.joining(","))
        );

        System.out.println("flatMap:将多维 Stream 拍平为一维 Stream");
        List<List<Integer>> numbers = Arrays.asList(
                Arrays.asList(1, 2, 3),
                Arrays.asList(4, 5, 6),
                Arrays.asList(7, 8, 9)
        );
        System.out.println(numbers.stream().flatMap(list->list.stream())
                .collect(Collectors.toList())
        );
        System.out.println();

        System.out.println("collect:将流的元素收集到一个集合或其他数据结构中");
        // 将Stream中的所有员工名称收集到List结构中
        System.out.println(employees.stream()
                .map(e->e.getName()).collect(Collectors.toList())
        );
        System.out.println();

        System.out.println("parallel:将流转换为并行流,以便并行处理数据");
        List<Integer> lists = Arrays.asList(1, 2, 3, 4, 5);
        System.out.println(
                lists.stream()
                        .parallel()
                        .map(n -> n * 2)
                        .collect(Collectors.toList())
        );
        System.out.println();

        System.out.println("sequential:将并行流转为顺序流");
        System.out.println(
                lists.parallelStream()
                        .sequential()
                        .map(n -> n * 2)
                        .collect(Collectors.toList())
        );
    }
}
```

执行结果:

```text
forEach:接受一个消费者接口用于遍历元素
刘强东 马云 马化腾 马超 张一鸣 张一鸣 张三鸣 司马大圣 欧阳神奇

map:接受一个Function接口,用于对每个元素执行指定的映射操作
刘强东,马云,马化腾,马超,张一鸣,张一鸣,张三鸣,司马大圣,欧阳神奇

filter:接受一个断言接口参数,根据断言函数的boolean返回值过滤遍历元素
刘强东,马云,马化腾

limit:指定截取长度用于截取Stream元素
刘强东,马云,马化腾

skip:跳过元素,此方法会返回n条之后的数据,不含第n条
马超,张一鸣,张一鸣,张三鸣,司马大圣,欧阳神奇

用于对Stream中的每个元素执行指定的操作,常用于调试和观察Stream的中间结果
java.util.stream.ReferencePipeline$15@7a92922

distinct:去重Stream中重复的数据
刘强东,马云,马化腾,马超,张一鸣,张三鸣,司马大圣,欧阳神奇

count:获取Stream的长度
1

sorted:用于对Stream进行排序,sorted接受一个Comparator接口,为true表示升序,反之为降序
马云,马化腾,刘强东,马超,张一鸣,张一鸣,张三鸣,欧阳神奇,司马大圣

max:根据表达式获取Stream值最大的元素,返回一个Optional对象
司马大圣

min:根据表达式获取Stream值最小的元素,返回一个Optional对象
马云

findFirst:获取Stream第一个元素,返回一个Optional对象
Employee(id=1001, name=刘强东, age=230, salary=7000.0)

findAny:获取流中的任意一个元素,返回一个Optional对象
Employee(id=1001, name=刘强东, age=230, salary=7000.0)

allMatch:接受一个断言函数匹配所有元素,如果所有元素都匹配,则返回true,反之返回false
false

anyMatch:接受一个断言函数匹配任意元素,如果匹配任意元素,则返回true,反之返回false
true

noneMatch:接受一个断言函数匹配所有元素,如果所有元素不匹配,则返回true,反之返回false
false

reduce:用于将 Stream 中的元素进行归约操作,得到一个最终的结果
180500.0

dropWhile:用于从 Stream 中丢弃满足指定条件的元素,直到遇到第一个不满足条件的元素为止
刘强东,马云,马化腾,马超,张一鸣,张一鸣,张三鸣,司马大圣,欧阳神奇

takeWhile:用于从 Stream 中获取满足指定条件的连续元素,直到遇到第一个不满足条件的元素为止

flatMap:将多维 Stream 拍平为一维 Stream
[1, 2, 3, 4, 5, 6, 7, 8, 9]

collect:将流的元素收集到一个集合或其他数据结构中
[刘强东, 马云, 马化腾, 马超, 张一鸣, 张一鸣, 张三鸣, 司马大圣, 欧阳神奇]

parallel:将流转换为并行流,以便并行处理数据
[2, 4, 6, 8, 10]

sequential:将并行流转为顺序流
[2, 4, 6, 8, 10]
```

## 2.Stream 类型转换

Java Stream 中提供了诸多方法用于转换为其它类型
