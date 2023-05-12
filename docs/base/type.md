## 1.数据类型

### 1.1 基本类型与引用类型

在 Java 中类型可分为基本类型(也称原始类型)和引用类型:

- 基本类型:boolean、byte、char、short、int、float、long、double。

  | 类型    | 占用大小(字节) | 默认值 | 取值范围                                    | 描述                  | 包装类型 |
  | ------- | -------------- | ------ | ------------------------------------------- | --------------------- | -------- |
  | boolean | 1              | false  | true 或者 false                             | 用于表示布尔值        | Boolean  |
  | byte    | 1              | 0      | -128 到 127                                 | 用于表示字节流数据    | Byte     |
  | char    | 2              | 空     | 0 到 65535                                  | 用于表示 Unicode 字符 | Char     |
  | short   | 2              | 0      | -32768 到 32767                             | 用于表示较小的整数    | Short    |
  | int     | 4              | 0      | -2147483648 到 2147483647                   | 用于表示整数          | Integer  |
  | float   | 4              | 0.0    |                                             | 用于表示单精度浮点数  | Float    |
  | long    | 8              | 0      | -9223372036854775808 到 9223372036854775807 | 用于表示较大的整数    | Long     |
  | double  | 8              | 0.0    |                                             | 用于表示双精度浮点数  | Double   |

- 引用类型:包括类、接口、数组等。注意:引用类型的变量存储的是对象的引用,而不是对象本身。

基本类型都有对应的包装类型,包装类型属于引用类型。基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成,即基本类型赋值给包装类型称为装箱,包装类型赋值给基本类型称为拆箱。

```java
// 装箱,
Integer x = 2;
// 拆箱
int y = x;
```

### 1.2 缓存池

## 2.String 类

String 是 Java 中最为常用的类型,其源码定义如下:

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
}
```

String 被声明为 final 关键字修饰,因此 String 类不可被继承。String 类内部定义了一个 char 类型的数组用于存储数据,该数组使用 final 关键字修饰,表示 value 数组初始化之后就不能再引用其它数组。并且 String 内部没有改变 value 数组的方法,因此可以保证 String 类是不可变。

### 2.1 String 方法介绍

### 2.2 拼接 String 的六种方法

### 2.3 为什么 String 要被设计成不可变的?

- 可以缓存 hash 值。String 在 Java 中经常用作 Map 的 key,如果字符串是可变的，那么它的值被修改后,可能会导致 Map 中出现错误的 Key-Value 对。String 不可变的特性可以使得 hash 值也不可变,因此只需要进行一次计算。
- String Pool 的需要。如果一个 String 对象已经被创建过了,那么就会从 String Pool 中取得引用。只有 String 是不可变的,才可能使用 String Pool。不可变字符串可以被缓存,因为它们的值永远不会改变,所以可以在多个地方重复使用,提高性能。
- 安全性。String 的不可变性还可以提高字符串的安全性,例如在网络传输中,不可变的字符串可以防止被篡改。
- 线程安全。String 不可变性天生具备线程安全,因此可以在多个线程中安全地使用。

### 2.4 StringBuilder 与 StringBuffer

由于 String 对象是不可变对象,因此对字符串进行修改操作时(例如字符串拼接、替换)总是会生成新的 String 对象,所以其性能相对较差。为此,JDK 专门提供了 StringBuffer 和 StringBuilder 分别用于创建和修改字符串。
:::details StringBuffer 案例

```java
package string;

/**
 * StringBuffer是JDK提供用于创建字符串的工具类,StringBuffer内部提供了append()和insert()
 * 用于追加字符串,它们提供了多个重载方法,支持追加int、boolean、long、double、char、char数组
 * 、String、Object、StringBuffer等数据类型。其中append()用于向StringBuffer末尾追加字符串
 * ,而insert()用于向指定偏移量(offset)后追加数据。由于append()和insert()方法被synchronized
 * 关键字修饰,追加字符串时使用同步机制,因此追加字符串是线程安全的,简单来说是StringBuffer安全的。
 */
public class StringBufferExample {
    public static void main(String[] args) {
        /**
         * 实例化StringBuffer可以指定初始化容量,如果不指定容量,则默认为16。
         * 实例化时StringBuffer会调用使用super(capacity)调用父类
         * AbstractStringBuilder的构造方法,根据capacity初始化一个char数组用于存储数据。
         */
        StringBuffer sb = new StringBuffer();
        sb.append("hello ");
        sb.append("world ");
        sb.append(" ");
        sb.append(1);
        sb.append(" ");
        sb.append('c');
        sb.append(" ");
        sb.append(true);
        // 获取StringBuffer容量
        System.out.println(sb.capacity()); // 34
        // 向偏移量为0的末尾追加内容
        sb.insert(0,"my ");
        // StringBuffer转为String
        String str1 = sb.toString();
        System.out.println(str1); // my hello world  1 c true
    }
}
```

:::

### 2.5 String、StringBuilder 和 StringBuffer 的区别

- 可变性。从可变性方面来看,String 属于不可变,而 StringBuilder 和 StringBuffer 都属于可变的。
- 线程安全。从线程安全方面来看,由于 String 具有不可变性,因此是线程安全的;StringBuilder 内部没有使用锁机制来保证线程安全,因此是非线程安全的;而 StringBuffer 内部使用 synchronized(同步机制)进行同步访问,因此是线程安全的。在不需要保证线程安全的场景下,推荐使用 StringBuilder,因其内部没有加锁,所以性能相对更好。

### 2.6 String.intern()

## 运算

### 隐式类型转换

### 强制类型转换

## 继承

### 访问权限(修饰符)

### 抽象类和接口

### super

### 重写与重载

## Object 方法介绍

在 Java 中所有类都直接或间接性的继承自 Object 类,

### equals()

### hashCode()

### toString()

### clone()

## 关键字
