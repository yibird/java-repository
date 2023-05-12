注解(Annotation)是 JDK1.5 版本开始引入的一个特性,用于对代码进行说明,可以对包、类、接口、字段、方法参数、局部变量等进行注解(使用注解时以`@+注解名`,例如:`@Override`)。
它主要的作用有以下四方面:

- 生成文档。通过代码里标识的元数据生成 javadoc 文档。
- 编译检查。通过代码里标识的元数据让编译器在编译期间进行检查验证。
- 编译时动态处理。编译时通过代码里标识的元数据动态处理,例如动态生成代码。
- 运行时动态处理。运行时通过代码里标识的元数据动态处理,例如使用反射注入实例。

## 1.注解基础

在 Java 中注解可分为内置注解、元注解、自定义注解三种:

- 内置注解:内置注解表示 Java 自带的标准注解,包括`@Override`、`@Deprecated`和`@SuppressWarnings`,分别用于标明重写某个方法、标明某个类或方法过时、标明要忽略的警告,用这些注解标明后编译器就会进行检查。
- 元注解:元注解是用于定义注解的注解,包括`@Retention`、`@Target`、`@Inherited`、`@Documented`，`@Retention`用于标明注解被保留的阶段，@Target 用于标明注解使用的范围，@Inherited 用于标明注解可继承，@Documented 用于标明是否生成 javadoc 文档。
- 自定义注解:可以根据自己的需求定义注解,并可用元注解对自定义注解进行注解。

### 1.1 内置注解

- @Override:表示当前的方法定义将覆盖父类中的方法。
- @Deprecated:表示代码被弃用,不再建议用户使用,如果使用了被`@Deprecated`注解的代码则编译器将发出警告。
- @SuppressWarnings:表示关闭编译器警告信息。

```java
/**
 * Override注解源码。
 * @Target(ElementType.METHOD):表示该注解只能作用于方法上。
 * @Retention(RetentionPolicy.SOURCE):表示该注解只在编译时有效,
 * 编译后的class文件中不会存在该注解。
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {

}

/**
 * Deprecated注解源码。
 * @Documented:标明会生成javadoc文档。
 * @Retention(RetentionPolicy.RUNTIME):表示注解能够保留到运行时。
 * @Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE}):
 * 表示该注解作用于构造方法、属性、局部变量、方法、包、参数、类型上。
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})
public @interface Deprecated {

}

/**
 * SuppressWarnings注解源码。
 * @Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE}):表示该注解作用于
 * 类型、字段、方法、参数、构造函数、本地变量。
 * @Retention(RetentionPolicy.SOURCE)表示该注解只在编译时有效,编译后不会保留该注解。
 * String[] value()表示注解的参数,可选值为:
 * - all:抑制所有警告(to suppress all warnings)。
 * - boxing:抑制装箱、拆箱操作时候的警告(to suppress warnings relative to boxing/unboxing operations)。
 * - cast:抑制映射相关的警告(to suppress warnings relative to cast operations)。
 * - dep-ann:抑制启用注释的警告(to suppress warnings relative to deprecated annotation)。
 * - deprecation:抑制过期方法警告(to suppress warnings relative to deprecation)。
 * - fallthrough:抑制确在switch中缺失breaks的警告(to suppress warnings relative to missing breaks in switch statements)。
 * - finally:抑制finally模块没有返回的警告(to suppress warnings relative to finally block that don’t return)。
 * - hiding:抑制与隐藏变数的区域变数相关的警告(to suppress warnings relative to locals that hide variable)。
 * - incomplete-switch:忽略没有完整的switch语句(to suppress warnings relative to missing entries in a switch statement (enum case))。
 * - nls:忽略非nls格式的字符(to suppress warnings relative to non-nls string literals)。
 * - null:忽略对null的操作(to suppress warnings relative to null analysis)。
 * - rawtype:使用generics时忽略没有指定相应的类型(to suppress warnings relative to un-specific types when using)。
 * - restriction:抑制与使用不建议或禁止参照相关的警告(to suppress warnings relative to usage of discouraged or)。
 * - serial:忽略在serializable类中没有声明serialVersionUID变量(to suppress warnings relative to missing serialVersionUID field for a serializable class)。
 * - static-access:抑制不正确的静态访问方式警告(to suppress warnings relative to incorrect static access)。
 * - synthetic-access:抑制子类没有按最优方法访问内部类的警告(to suppress warnings relative to unoptimized access from inner classes)。
 * - unchecked:抑制没有进行类型检查操作的警告(to suppress warnings relative to unchecked operations)。
 * - unqualified-field-access:抑制没有权限访问的域的警告(to suppress warnings relative to field access unqualified)。
 * - unused:抑制没被使用过的代码的警告(to suppress warnings relative to unused code)。
 */
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    String[] value();
}
```

@Override、@Deprecated、@SuppressWarnings 使用例子:

```java

class A {
    public void hello(){}
}

class B extends A{
    /**
     * 重载父类方法
     */
    @Override
    public void hello(){}

    /**
     * 被废弃的方法
     */
    @Deprecated
    public void oldMethod(){ }

    /**
     * 忽略警告
     */
    @SuppressWarnings("rawtypes")
    public List processList() {
        List list = new ArrayList();
        return list;
    }
}
```

### 1.2 元注解

在 JDK 1.5 中提供了 4 个标准的元注解:`@Target`、`@Retention`、`@Documented`、`@Inherited`,在 JDK 1.8 中提供了两个元注解 `@Repeatable`和`@Native`。

- `@Documented`:该注解用于标明当前注解是否生成 javadoc 文档。
- `@Inherited`:该注解表示当前注解是否可继承,如果某个类使用了被`@Inherited`修饰的 Annotation,则其子类将自动具有该注解。
- `@Repeatable`:用于声明重复注解。允许在同一申明类型(类,属性,或方法)的多次使用同一个注解,提高可读性。
- `@Native`:使用 @Native 注解修饰成员变量,则表示这个变量可以被本地代码引用,常常被代码生成工具使用。@Native 注解不常使用。

#### 1.2.1 @Target

`@Target`元注解表示描述注解的使用范围(即注解的可以在哪些地方使用)。该注解接收一个 ElementType 数组,ElementType 是一个枚举类,提供了注解使用范围枚举变量。

```java
/**
 * @Target注解源码。
 * @Documented:标明会生成javadoc文档。
 * @Retention(RetentionPolicy.RUNTIME):表示注解能够保留到运行时。
 * @Target(ElementType.ANNOTATION_TYPE):表示注解只能作用于注解上。
 * ElementType[] value():Target注解接收一组ElementType值,ElementType是一个枚举类,
 * 内部提供了大量枚举常量:
 * - ElementType.TYPE:表示作用于类、接口、枚举类。
 * - ElementType.FIELD:表示作用于字段(包含枚举常量)。
 * - ElementType.METHOD:表示作用于方法。
 * - ElementType.PARAMETER:表示作用于参数。
 * - ElementType.CONSTRUCTOR:表示作用于构造方法。
 * - ElementType.LOCAL_VARIABLE:表示作用于本地变量。
 * - ElementType.ANNOTATION_TYPE:表示作用于注解。
 * - ElementType.PACKAGE:表示作用于包。
 * - ElementType.TYPE_PARAMETER:表示作用于类型参数,JDK1.8新增。
 * - ElementType.TYPE_USE:表示作用于所有类型,JDK1.8新增。
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Target {
    ElementType[] value();
}

```

#### 1.2.2 @Retention

`@Retention`元注解表示注解保留的时间范围(即被描述的注解在它所修饰的类中可以被保留到何时)。

```java
/**
 * Retention注解源码。
 * @Documented:标明生成javadoc文档。
 * @Target(ElementType.ANNOTATION_TYPE):表示该注解只能作用于注解上。
 * @Retention(RetentionPolicy.RUNTIME):表示注解能够保留到运行时。
 * RetentionPolicy value():Retention注解接收一个RetentionPolicy(注解保留策略类)类型作为参数,
 * RetentionPolicy是一个枚举类,提供了如下常量:
 * - RetentionPolicy.SOURCE:仅在源文件保留,编译后的字节码文件不会保留该注解。
 * - RetentionPolicy.CLASS:编译期保留。编译器会将注解记录在类文件中,但不需要在运行时由VM保留。默认策略。
 * - RetentionPolicy.RUNTIME:运行期保留。编译器会将注解将记录在类文件中,并在运行时由VM保留,因此可以进行反射读取。
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Retention {
    RetentionPolicy value();
}
```

验证 RetentionPolicy 中 SOURCE、CLASS、RUNTIME 区别:

```java
package annotation;


import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.SOURCE)
@interface SourcePolicy{ }

@Retention(RetentionPolicy.CLASS)
@interface ClassPolicy{ }

@Retention(RetentionPolicy.RUNTIME)
@interface RuntimePolicy{ }

public class Example {
    @SourcePolicy
    public void sourcePolicy() { }

    @ClassPolicy
    public void classPolicy() { }

    @RuntimePolicy
    public void runtimePolicy() { }
}
```

执行如下命令将源文件编译为字节码文件,并反编译字节码文件输出详细信息:

```shell
# 通过Java编译器编译Example.java文件为.class字节码文件
javac Example.java
# javap是JDK提供的一个命令行工具,javap能对给定的.class文件提供的字节代码进行反编译,-verbose表示输出详细信息
javap -verbose Example
```

反编译.class 的结果如下:

```java
Classfile /Users/study/java/example/java-base/src/annotation/Example.class
  Last modified 2022年8月11日; size 499 bytes
  SHA-256 checksum 9721fac68c48ca841ec3add6d5997a4e1b2424e352007c43397fc79590549b3b
  Compiled from "Example.java"
public class annotation.Example
  minor version: 0
  major version: 61
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #7                          // annotation/Example
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 0, methods: 4, attributes: 1
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Class              #8             // annotation/Example
   #8 = Utf8               annotation/Example
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               sourcePolicy
  #12 = Utf8               classPolicy
  #13 = Utf8               RuntimeInvisibleAnnotations
  #14 = Utf8               Lannotation/ClassPolicy;
  #15 = Utf8               runtimePolicy
  #16 = Utf8               RuntimeVisibleAnnotations
  #17 = Utf8               Lannotation/RuntimePolicy;
  #18 = Utf8               SourceFile
  #19 = Utf8               Example.java
{
  public annotation.Example();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 22: 0

  public void sourcePolicy();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 25: 0

  public void classPolicy();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 29: 0
    RuntimeInvisibleAnnotations:
      0: #14()
        annotation.ClassPolicy

  public void runtimePolicy();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 33: 0
    RuntimeVisibleAnnotations:
      0: #17()
        annotation.RuntimePolicy
}
SourceFile: "Example.java"

```

从反编译后的结果得出结论:

- 编译器并没有记录下 sourcePolicy() 方法的注解信息,RetentionPolicy.SOURCE 策略仅在源文件阶段保留,编译后的字节码文件不会保留该注解。
- 编译器分别使用了 RuntimeInvisibleAnnotations 和 RuntimeVisibleAnnotations 属性去记录了 classPolicy()方法 和 runtimePolicy()方法 的注解信息。

### 1.3 自定义注解

自定义注解依赖于元注解,其中`@Target`和`@Retention`是在自定义注解中最为常用的元注解。

```java
package annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 自定义日志注解
 * @Target(ElementType.METHOD):只允许作用于方法上。
 * @Retention(RetentionPolicy.RUNTIME):保留策略为运行时保留。
 * @author apple
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Logger {
    // 声明value()属性可以在使用注解时忽略参数名
    String title();
    String description();
}
```

```java
package annotation;

/**
 * 使用自定义注解
 */
public class LoggerAnnotationTest {
    @Logger(title = "获取用户记录",description = "根据账号密码获取用户记录")
    public void getUserRecord(){}
}

```

## 2.注解原理

## 3.注解的应用

- 配置化到注解化。Spring 从最早的配置化到现在的注解化,极大地简化了繁琐的配置。
- 继承实现到注解实现。一个模块的封装大多数人都是通过继承和组合等模式来实现的,但是如果结合注解将可以极大程度提高实现的优雅度(降低耦合度)。Junit3 到 Junit4 演化就是一个代表性例子,Junit3 以继承的方式测试代码,在 Junit4 中以注解的形式测试代码。

### 3.1 实现@Range 注解

@Range 注解用于检查数值类型的范围。@Range 注解提供 min 和 max 两个属性用于确定数值范围,当注解检查值非数值类型时抛出类型错误,当数值超出 min 和 max 范围值时抛出取值范围错误。

```java
package annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Range {
    // 属性默认值为0
    int min() default 0;
    int max();
}
```

```java
package annotation;

class User {
    private String username;

    @Range(min = 18, max = 65)
    public Integer age;

    public User() { }

    public User(String username, Integer age) {
        this.username = username;
        this.age = age;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
```

测试:

```java
package annotation;

import java.lang.reflect.Field;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamTest;

public class RangeAnnotationTest {

    public static void main(String[] args) throws Exception {
        User u1 = new User("zchengfeng",22);
        User u2 = new User("大黄",100);
        RangeAnnotationTest.validate(u1);
        // 抛出异常
        RangeAnnotationTest.validate(u2);
        // 如果username字段加上@Range注解则会抛出IllegalArgumentException异常。
    }
    public static void validate(User u) throws Exception {
        Class cls = u.getClass();
        // 获取class中所有字段
        Field[] fields = cls.getDeclaredFields();
        for (Field field : fields) {
            // 判断字段上存在Range注解
            if(field.isAnnotationPresent(Range.class)){
                List list = Stream.of("int", "java.lang.Integer")
                        .collect(Collectors.toList());
                // 如果不是int或Integer类型则抛出类型错误
                if(!list.contains(field.getType().getName())){
                    throw new IllegalArgumentException(field.getName()+" is not a int type");
                }
                Range range = field.getAnnotation(Range.class);
                Integer value = (Integer) field.get(u);
                // 超出范围抛出错误
                if(value < range.min() || value > range.max()){
                    throw new IndexOutOfBoundsException(field.getName()+" out of min max range");
                }
            }
        }
    }
}
```
