## 1.Lambda

### 1.1 Lambda 表达式介绍

Java Lambda 表达式是 Java 8 引入的一种函数式编程特性。它允许我们将函数作为一种方法参数传递,并以简洁的方式编写匿名函数。Lambda 表达式可以用来替代繁琐的匿名内部类,可以使代码更加简洁、易读和易于维护。Lambda 表达式的本质是函数式接口的实例,函数式接口是指在一个接口中只包含一个抽象方法的接口,例如 Runnbale、Consumer 等接口。函数式接口使用@FunctionalInterface 注解标识是否是函数式接口,如果一个函数式接口拥有超过一个的抽象方法,使用@FunctionalInterface 注解则会在提示错误。以 Runnable 接口的源码为例:

```java
@FunctionalInterface
public interface Runnable {
    /**
     * When an object implementing interface <code>Runnable</code> is used
     * to create a thread, starting the thread causes the object's
     * <code>run</code> method to be called in that separately executing
     * thread.
     * <p>
     * The general contract of the method <code>run</code> is that it may
     * take any action whatsoever.
     *
     * @see     java.lang.Thread#run()
     */
    public abstract void run();
}
```

### 1.2 Lambda 表达式的构成

lambda 表达式由抽象方法的形参列表、箭头符、方法主体 3 个部分组成,使用 lambda 表示式实际上是对函数式接口抽象方法的重写,其格式如下:

```java
 // args表示形参列表(即方法参数列表),->表示箭头
 (args) -> {
    // 方法体
 }
```

Lambda 虽然可以简化代码,但它提供了更加简洁的写法:

- 当方法体中只有一条语句时(非 return 语句)可省略一对{}号。

```java
public class Test {
    public static void main(String[] args) {
        // 普通写法
        Runnable r1=new Runnable() {
            @Override
            public void run() {
                System.out.println("我叫zxp");
            }
        };
        r1.run();

        // lambda表达式写法:当方法体中只有一条语句时(非 return 语句,可省略方法体的{}
        Runnable r2 = () -> System.out.println("我叫zxp");
        r2.run();
    }
}
```

- 当方法体中只有语句且是 return 语句时可省略 return 关键字和一对{}号。

```java
public class Test {
    public static void main(String[] args) {
       // 普通写法
       Predicate<String> p=new Predicate<String>() {
        // test 方法用于条件判断
        @Override
        public boolean test(String s) {
            return s.length() > 5;
        }
    };
    System.out.println(p.test("zxpHello")); // true

        /**
         * lambda表达式写法:当方法体中只有语句且是 return 语句时可省略 return 关键字
         * 和一对{}号,可省略方法体的return语句和{}
         */
        Predicate<String> p = s -> s.length() > 5;
        System.out.println(p.test("zxpHello")); // true
    }
}
```

- 当形参参数只有一个时可省略()号。

- 当有多个形参参数且方法体有多条语句时,不能省略()和{}。

```java
public class Test {
    public static void main(String[] args) {
        // 普通写法
        BinaryOperator<String> b1=new BinaryOperator<String>() {
            // 字符串拼接
            @Override
            public String apply(String s, String s2) {
                return s + s2;
            }
        };
        System.out.println(b1.apply("hello", " world!")); // hello world!


        // 使用lambda表达式:当有多个形参参数且方法体有多条语句时,不能省略()和{}
        BinaryOperator<String> b2 = (s,s2)-> {
            System.out.println("那是真的强");
            return s + s2;
        };
        System.out.println(b2.apply("hello", " world!")); // hello world!
    }
}
```

## 2.方法引用与构造器引用

JDK 中的方法引用和构造器引用是 Lambda 表达式的一种扩展,用于更简洁地表示已经存在的方法或构造器。

### 2.1 方法引用(Method Reference)

方法引用允许直接引用已经存在的方法,可以看作是 Lambda 表达式的一种简化形式。通过方法引用,可以将一个方法作为值传递，而不需要显式地编写 Lambda 表达式。方法引用的语法如下:

```
类名::方法名
对象::方法名
类名::静态方法名
```

### 2.2 构造器引用(Constructor Reference)

## 3.函数式接口

函数式接口是指在一个接口中只包含一个抽象方法的接口,Java 提供了@FunctionalInterface 注解用于标识接口是否是函数式接口。函数式接口支持定义默认方法、静态方法及 Object 类 public 修饰的方法。JDK8 新增的函数式接口位于 java.util.function 包下,常用的函数式接口:

- `Runnable`:`Runnable` 内部提供了`void run()`方法,表示无任何输入且无任何输出的操作。
- `Callable<V>`:`Callable<V>`提供了`V call() throws Exception`方法,表示一个不接受输入参数并且具有返回结果的操作。与`Supplier<T>`接口类似。
- `Consumer<T>`: `Consumer<T>`提供了`void accept(T t)`方法,表示一个消费形的操作,它接受一个输入参数并且不返回结果的操作。
- `Supplier<T>`:`Supplier<T>`提供了`T get()`方法,表示一个供给型的操作,它不接受输入参数,但返回一个结果。
- `Function<T, R>`:`Function<T, R>`提供了`Function<T, R>`方法,表示一个接受一个输入参数并产生一个结果的操作。
- `Predicate<T>`:`Predicate<T>`提供了`boolean test(T t)`方法,表示一个断言型的操作,它接受一个输入参数并返回一个布尔值结果。

- `BiConsumer<T, U>`:`BiConsumer<T, U>`提供了`void accept(T t, U u)`方法,接受两个输入参数并且不返回结果的操作。
- `BiPredicate<T, U>`:`BiPredicate<T, U>`提供了`boolean test(T t, U u)`方法,它接受两个输入参数并返回布尔值结果的操作。
- `BiFunction<T, U, R>`:`BiFunction<T, U, R>`提供了`R apply(T t, U u)`,它接受两个输入参数并返回结果的操作。
- `BinaryOperator<T>`:`BinaryOperator<T>`提供了继承自`BiFunction<T, U, R>`的`T apply(T t1, T t2)`方法,它接受两个输入参数并返回与参数类型相同的结果的操作。
- `UnaryOperator<T>`:`UnaryOperator<T>`提供了继承自`Function<T, R>`接口的`T apply(T t)`方法,表示一个接受一个输入参数并产生一个相同类型结果的操作。
