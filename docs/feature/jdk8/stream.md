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

```java
// 方式1:通过Stream.of()创建Stream
Stream<String> stream1 = Stream.of("apple", "orange", "banana");
/**
 * collect()用于将Stream中的元素收集到一个集合或其他数据结构中,
 * Collectors接口用于Stream的收集操作,提供了大量方法用于Stream类型转换、
 * 数据统计、字符串连接、数据分组、归约等操作。Collectors.joining()用于根据
 * 分隔符将Stream中的元素连接为一个字符串。
 */
System.out.println("stream1:" + stream1.collect(Collectors.joining(","))); // stream1:apple,orange,banana

// 方式2:通过Stream.empty()创建一个空的Stream
Stream<String> stream2 = Stream.empty();
System.out.println("stream2:" + stream3.collect(Collectors.joining(","))); // stream2:

// 方式3:通过Stream.iterate()迭代器创建Stream
Stream<Integer> stream3 = Stream.iterate(0, n -> n < 10, n -> n + 2);
System.out.println("stream3:" + stream3.map(item -> item.toString()).collect(Collectors.joining(","))); // stream3:0,2,4,6,8

/**
 * 方式4:通过Stream.generate(supplier)生成器的方式创建Stream,
 * 注意:Stream.generate()方法创建的无限流(infinite stream)无法直接使用collect()方法进行收集操作,
 * 因为无限流没有固定的大小,而collect()需要知道流的大小才能完成收集操作
 */
Stream<Double> stream4 = Stream.generate(() -> Math.floor(Math.random() * 10));
System.out.println("stream4:" + stream4.limit(5).map(item -> item + "").collect(Collectors.toList())); // stream4:[9.0, 1.0, 1.0, 7.0, 3.0]
```

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

```txt
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

## 2.Collectors 类

Collectors 是 Java 8 中提供的一个实用工具类,用于在流操作中进行元素的收集和汇总。它提供了许多静态方法,用于创建各种收集器(Collectors),以便在流的终端操作中使用。Collectors 类提供了各种收集器,可以对流中的元素进行各种汇总操作,例如将元素收集到列表、集合或映射中,计算元素的总数、求和、平均值,找到最小或最大值,根据条件进行分组、分区等等。Collectors 常用方法如下:

- toList()/toUnmodifiableList()/:将流中的元素收集到一个列表中。
- toSet()/toUnmodifiableSet():将流中的元素收集到一个集合(Set)中。
- toMap()/toUnmodifiableMap()/toConcurrentMap():将流中的元素根据键和值的提取函数收集到一个映射(Map)中。
- joining():将流中的元素连接成一个字符串。
- counting():计算流中元素的数量。
- summingInt()/summingLong()/summingDouble():对流中的元素进行求和。计算流中整数元素的统计信息,它返回一个包含最小值、最大值、总和、平均值和元素数量的 IntSummaryStatistics/LongSummaryStatistics/DoubleSummaryStatistics 对象。
- summarizingInt()/summarizingLong()/summarizingDouble():
- averagingInt()/averagingLong()/averagingDouble():对流中的元素进行平均值计算。
- minBy()/maxBy():根据指定比较器找到流中的最小或最大元素。
- groupingBy():根据指定条件对流中的元素进行分组。
- partitioningBy():根据指定条件对流中的元素进行分区。
- teeing():它可以将两个收集器的结果进行合并。它接受三个参数,两个收集器和一个合并函数,返回一个新的收集器。
- filtering():根据断言函数(Predicate)过滤流中的元素,与 Stream 的 filter 相同。
- reducing():根据指定的累加函数对流中的元素进行归约操作,与 Stream 的 reduce 相同。
- collectingAndThen():用于对流的元素进行收集操作,并在收集完成后应用一个转换函数。它接受两个参数:一个下游收集器(Collector)和一个转换函数(Function),返回一个新的收集器。

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8);
// 获取流中所有元素的平均值
list.stream().collect(Collectors.averagingInt(value -> value)); // 4.5
// 获取流中最大值,返回一个Optional
list.stream().collect(Collectors.minBy(Integer::compareTo)).get(); // 1
// 获取流中最大值,返回一个Optional
list.stream().collect(Collectors.maxBy(Integer::compareTo)).get(); // 8
// 统计流中所有元素之和
list.stream().collect(Collectors.summingInt(value -> value)); // 36
// 获取流中元素的数量
list.stream().collect(Collectors.counting()); // 8
// 根据取模分区数据,返回一个以Boolean为Key的Map
list.stream().collect(
        Collectors.partitioningBy(num -> num % 2 == 0)
); // {false=[1, 3, 5, 7], true=[2, 4, 6, 8]}

// 合并两个收集器的结果,返回一个新的收集器
String result = list.stream().collect(
        Collectors.teeing(
                Collectors.summingInt(num -> num),
                Collectors.counting(),
                (sum, count) -> "Sum:" + sum + ",Count:" + count
        )
); // Sum:36,Count:8

// 收集流元素并应用一个转换函数
list.stream().collect(Collectors.collectingAndThen(
        Collectors.toList(),
        item -> item.toString()
)); // [1, 2, 3, 4, 5, 6, 7, 8]
```

## 3.Stream 类型转换

### 3.1 数组和 List 转 Stream

- 通过 Arrays.stream()转 Stream。Arrays.stream()是 JDK8 提供的一个工具方法,用于将数组转为 Stream。

```java
String[] array = {"apple", "banana", "orange", "grape"};
Stream<String> stream = Arrays.stream(array);
```

- 通过 Stream.of()工厂方法转 Stream。Stream 类中提供了多个工厂函数用于创建 Stream,其中 Stream.of()提供了多个重载方法,支持以数组为参数创建 Stream。

```java
String[] array = {"apple", "banana", "orange", "grape"};
// 数组转Stream
Stream<String> stream = Stream.of(array);

List<String> list = new ArrayList<>();
// List转Stream
Stream<T> stream = Stream.of(list.toArray(new T[0]));
```

- 通过 Stream.Builder 转 Stream。Stream.Builder 是 Java 中的一个接口,用于构建流中的元素。它是 java.util.stream.Stream 接口的一个嵌套接口,用于创建可变大小的流。

```java
String[] arr = {"apple", "banana", "orange", "grape"};
Stream<String> stream = Stream.builder()
                .add("apple")
                .add("banana")
                .add("orange")
                .add("grape")
                // 构建Stream
                .build();
```

- 通过 Arrays.asList()和 stream()转 Stream。Arrays.asList()用于将数组转换为固定大小的列表,通过 List 的 stream()方法转换为 Stream 流。

```java
int[] array = {1, 2, 3, 4, 5};
// 数组转list
List<Integer> list = Arrays.asList(array);
Stream<Integer> stream = list.stream();
```

### 3.2 Stream 转其它结构

#### 3.3.1 Stream 转数组

- **通过 Stream.toArray()将 Stream 转换为数组**。toArray()方法返回一个包含流元素的数组。

```java
Stream<Integer> stream = Stream.of(1,2,3,4,5);
Integer[] array = stream.toArray(Integer[]::new);
```

#### 3.3.2 Stream 转 List

- **通过 collect(Collectors.toList())或 collect(Collectors.toUnmodifiableList())转为 List**。Collectors.toList()将流元素收集到一个列表中。Collectors.toUnmodifiableList()用于将流中的元素收集到一个不可修改的 List 中。

```java
Stream<Integer> stream = Stream.of(1,2,3,4,5);
List<Integer> list1 = stream.collect(Collectors.toList());

// 将流中的元素收集到一个不可修改的 List
List<Integer> list2 = stream.collect(Collectors.toUnmodifiableList())
```

#### 3.3.3 Stream 转 Set

- **通过 collect(Collectors.toSet())或 collect(Collectors.toUnmodifiableSet())转为 Set**。Collectors.toSet()用于将流元素收集到一个集合中。Collectors.toUnmodifiableSet()用于将流元素收集到一个不可修改的 Set 中。

```java
Stream<Integer> stream = Stream.of(1,2,3,4,5);
Set<Integer> set = stream.collect(Collectors.toSet());
```

#### 3.3.4 Stream 转 Map

- **通过 collect(Collectors.toMap())、collect(Collectors.toUnmodifiableMap())、collect(Collectors.toConcurrentMap())转为 Map 结构**。
  - collect(Collectors.toMap()):用于将流元素收集到一个 Map 结构中。
  - Collectors.toUnmodifiableMap():用于将流元素收集到一个不可修改的 Map 结构中。
  - Collectors.toConcurrentMap():用于将流元素手机一个 ConcurrentMap(线程安全的并发 Map)结构中。

Collectors 类为 toMap、toUnmodifiableMap、toConcurrentMap 提供了多个重载方法,三者接受的参数一致,参数最多的重载方法签名:`toMap(Function<? super T, ? extends K> keyMapper,Function<? super T, ? extends U> valueMapperBinaryOperator<U> mergeFunction,Supplier<M> mapFactory)`。

```java
Stream<String> stream1 = Stream.of("apple", "orange", "banana", "apple");
/**
 * Collectors类为toMap、toUnmodifiableMap、toConcurrentMap提供了多个重载方法,三者接受的参数一致,
 * 以参数最多的重载方法为例:toMap(Function<? super T, ? extends K> keyMapper,
 *                              Function<? super T, ? extends U> valueMapper,
 *                              BinaryOperator<U> mergeFunction,
 *                              Supplier<M> mapFactory)
 * - keyMapper:用于生成Map Key的函数,用于从流元素中提取键。它将流元素作为输入,并返回键的值。
 * - valueMapper:用于生成Map Value的函数,用于从流元素中提取值。它将流元素作为输入,并返回值的值。
 * - mergeFunction:一个函数,用于在遇到重复键时决定如何合并值。它接收两个值作为输入,即已存在的值和当前流元素的值,并返回合并后的值。
 * - mapFactory:一个供应商(Supplier),用于创建 Map 实例。它返回一个新的、空的 Map 实例用于收集流元素。
 * 注意:如果流中存在重复的键,并且没有提供 mergeFunction 来处理冲突,那么将会抛出 IllegalStateException 异常。
 */
HashMap<String, String> map = stream1.collect(
        Collectors.toMap(
                key -> key,
                value -> value + "_value",
                (item, currentItem) -> item.equals(currentItem) ? currentItem :item,
                () -> new HashMap<>()
        )
);
System.out.println("map:"+map); // map:{banana=banana_value, orange=orange_value, apple=apple_value}
```

- **通过 Collectors.groupingBy()转 Map**。Collectors.groupingBy() 方法可以根据给定的分类函数对流中的元素进行分组,并生成一个 Map,其中键是分组的结果,值是对应的元素列表。

```java
Stream<String> stream1 = Stream.of("apple", "orange", "banana", "apple");
/**
 * groupingBy(Function<? super T, ? extends K> classifier):根据Stream元素进行分组转为Map,
 * 相同的元素将被分到一组(即一个List中),classifier表示生成Map Key的函数。
 */
Map<String, List<String>> map = stream1.collect(Collectors.groupingBy(k -> k + "_key"));
System.out.println(map); // {banana_key=[banana], apple_key=[apple, apple], orange_key=[orange]}


Stream<String> stream2 = Stream.of("apple", "orange", "banana", "apple");
/**
 * groupingBy(Function<? super T, ? extends K> classifier,
 * Collector<? super T, A, D> downstream):根据Stream元素进行分组转为Map,
 * 相同的元素将被分到一组。
 * - classifier表示生成Map Key的函数。它接受流中的元素 T,返回一个键类型 K。根据该函数的结果,
 * 将元素分组到相应的组中。
 * - downstream：下游收集器,用于收集每个组中的元素。它是一个 Collector 类型的参数,
 * 其中 T 是流中元素的类型,A是中间结果容器的类型,D是最终结果的类型。
 */
Map<String, List<String>> map = stream3.collect(Collectors.groupingBy(k -> k + "_key", Collectors.toList()));
System.out.println(map); // {banana_key=[banana], apple_key=[apple, apple], orange_key=[orange]}


Stream<String> stream3 = Stream.of("apple", "orange", "banana", "apple");
/**
 * groupingBy(Function<? super T, ? extends K> classifier,Supplier<M> mapFactory,
 * Collector<? super T, A, D> downstream):根据Stream元素进行分组转为Map,相同的元素将被分到一组。
 * - classifier表示生成Map Key的函数。它接受流中的元素 T,返回一个键类型 K。根据该函数的结果,
 * 将元素分组到相应的组中。
 * - mapFactory:用于生成最终 Map 的工厂函数。它是一个 Supplier 类型的参数,用于提供新的 Map 实例。
 * - downstream:下游收集器,用于收集每个组中的元素。它是一个 Collector 类型的参数,
 * 其中 T 是流中元素的类型,A是中间结果容器的类型,D是最终结果的类型。
 */
Map<String, List<String>> map = stream3.collect(Collectors.groupingBy(k -> k + "_key",
        HashMap::new,
        Collectors.toList())
);
System.out.println(map); // {banana_key=[banana], apple_key=[apple, apple], orange_key=[orange]}
```

#### 3.3.4 Stream 转 字符串

- 通过 Collectors.joining()将流中的元素根据指定的分隔符连接为一个字符串。

```java
Stream<String> stream1 = Stream.of("apple", "orange", "banana");
String str = stream1.collect(Collectors.joining(","));
System.out.println(str); // apple,orange,banana
```

- 通过 String.join()将流中的元素收集到一个列表中,并使用指定的分隔符将列表中的元素连接为一个字符串。

```java
Stream<String> stream1 = Stream.of("apple", "orange", "banana");
String str = String.join(",", stream1.collect(Collectors.toList()));
System.out.println(str); // apple,orange,banana
```

- 通过 StringBuilder 逐个追加流元素。使用一个 StringBuilder 对象逐个追加流中的元素,并在每个元素之间插入分隔符。最后,通过删除最后一个字符来去除最后一个分隔符,并将 StringBuilder 转换为字符串。

```java
/**
 * 写法1
 */
StringBuilder sb = new StringBuilder();
stream1.forEach(element -> sb.append(element).append(","));
// 删除最后一个分隔符
String str = sb.deleteCharAt(sb.length() - 1).toString();
System.out.println(str); // apple,orange,banana


/**
 * 写法2
 */
String str = stream1.collect(StringBuilder::new,
                        (sb, element) -> sb.append(element).append(","),
                        StringBuilder::append)
                .toString()
                // 替换以,号结尾的内容为""
                .replaceAll(",$", "");
System.out.println(str); // apple,orange,banana
```
