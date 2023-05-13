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

基本类型都有对应的包装类型,包装类型属于引用类型。**基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成,即基本类型赋值给包装类型称为装箱,包装类型赋值给基本类型称为拆箱**。

```java
// 装箱,
Integer x = 2;
// 拆箱
int y = x;
```

### 1.2 缓存池

Java 包装类型的提供了缓存池机制,通过缓存包装类型的实例来提高 Java 程序的性能。这个机制使用了自动装箱和拆箱的功能,可以减少创建和销毁包装类型实例的数量,从而提高程序的执行速度和内存使用效率。比如,Java 的整型包装类 Integer 内部提供了一个静态成员变量 CACHE,存储了-128 到 127 之间的整型对象,当需要这个范围内的整型对象时,就可以直接从缓存池中获取,避免了创建新的实例。其他包装类型的缓存池取值范围如下:

| 包装类型 | 存储值范围      |
| -------- | --------------- |
| Boolean  | true 或 false   |
| Byte     | -128 到 127     |
| Short    | -128 到 127     |
| Integer  | -128 到 127     |
| Char     | \u0000 到\u007F |

new Integer()每次都会创建一个对象,而 Integer.valueOf(value)如果指定值处于 Integer 缓存池取值范围内,会使用缓存池中的对象,多次调用会取得同一个对象的引用。

```java
Integer x = new Integer(123);
Integer y = new Integer(123);
// 每次使用new Integer()都会创建一个新的Integer对象,x和y不是同一个对象
System.out.println(x == y); // false

Integer w = Integer.valueOf(123);
Integer h = Integer.valueOf(123);
/**
 * 如果valueOf()的值处于Integer缓存池的取值范围内,就会使用缓存池中的对象,
 * 多次调用会取得同一个对象的引用,这样可以避免了创建新的实例,提高性能,是一种
 * 空间换时间的思想
 */
System.out.println(w == h); // true

Integer j = Integer.valueOf(129);
Integer k = Integer.valueOf(129);
/**
 * valueOf()的值超出了Integer缓存池的取值范围,最终调用 new Integer()
 * 初始化一个Integer,所以j和k是两个不同的对象
 */
System.out.println(j == k); // false
```

Integer.valueOf()方法的实现比较简单,就是先判断值是否在缓存池中,如果在的话就直接返回缓存池的内容,否则使用 new Integer()初识对象。

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

在 Java 8 中,Integer 缓存池的大小默认为 -128~127。Integer 内部通过 IntegerCache 定义 Integer 缓存池,IntegerCache 定义了 low、high、cache 三个变量,分别用于指定缓存池取值的最小范围、最大范围和缓存池容器,最后通过静态代码块根据 low 和 high 初始化缓存池。

```java
private static class IntegerCache {
    // 缓存池的取值最小范围
    static final int low = -128;
    static final int high;
    static final Integer cache[];

    static {
        // 缓存池的取值最大范围
        int h = 127;
        String integerCacheHighPropValue =
            sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            try {
                int i = parseInt(integerCacheHighPropValue);
                i = Math.max(i, 127);
                // Maximum array size is Integer.MAX_VALUE
                h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
            } catch( NumberFormatException nfe) {
                // If the property cannot be parsed into an int, ignore it.
            }
        }
        high = h;

        cache = new Integer[(high - low) + 1];
        int j = low;
        for(int k = 0; k < cache.length; k++)
            cache[k] = new Integer(j++);

        // range [-128, 127] must be interned (JLS7 5.1.7)
        assert IntegerCache.high >= 127;
    }

    private IntegerCache() {}
}
```

**编译器会在缓冲池范围内的基本类型自动装箱过程调用 valueOf() 方法,因此多个 Integer 实例使用自动装箱来创建并且值相同,那么就会引用相同的对象**。

```java
// 装箱
Integer x = 123,y = 123;
/**
 * 编译器会在缓冲池范围内的基本类型自动装箱过程调用 valueOf() 方法,
 * 因此 Integer 实例使用自动装箱来创建并且值相同,那么就会引用相同的对象
 */
System.out.println(x == y); // true

Integer w = 128,h = 128;
System.out.println(w == h); // false
```

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

| 方法                                                          | 描述                                                                                                                                                                                                      |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| int length()                                                  | 返回字符串的长度                                                                                                                                                                                          |
| char charAt(int index)                                        | 返回指定索引处的字符值                                                                                                                                                                                    |
| String substring(int beginIndex)                              | 截取字符串,截取范围为开始索引到字符串的长度-1                                                                                                                                                             |
| String substring(int beginIndex, int endIndex)                | 截取字符串,截取范围为 beginIndex 到 endIndex                                                                                                                                                              |
| String toLowerCase()                                          | 字符串转小写                                                                                                                                                                                              |
| String toUpperCase()                                          | 字符串转大写                                                                                                                                                                                              |
| int codePointAt(int index)                                    | 返回指定索引处的字符(Unicode 代码点)。索引指的是字符值(Unicode 代码单位),范围从 0 到 length()-1                                                                                                           |
| int codePointBefore(int index)                                | 返回指定索引之前的字符(Unicode 代码点)。索引指的是字符值(Unicode 代码单位),范围从 1 到字符串的长度                                                                                                        |
| int codePointCount(int beginIndex, int endIndex)              |                                                                                                                                                                                                           |
| int compareTo(String anotherString)                           | 按字典顺序比较两个字符串。比较基于字符串中每个字符的 Unicode 值。如果参数字符串等于此字符串,则值为 0;如果该字符串在字典上小于字符串参数,则该值小于 0;如果该字符串在字典上大于字符串参数,则为大于 0 的值。 |
| int compareToIgnoreCase(String str)                           | 作用与 compareTo(),但是会忽略大小写                                                                                                                                                                       |
| String concat(String str)                                     | 连接字符串,返回连接字符串的字符串                                                                                                                                                                         |
| boolean contains(CharSequence s)                              | 判断字符串是否包含指定的字符值序列,返回一个布尔值                                                                                                                                                         |
| boolean contentEquals(StringBuffer sb)                        | 判断字符串和 StringBuffer 是否有相同的字符序列,返回一个布尔值                                                                                                                                             |
| boolean contentEquals(CharSequence cs)                        | 判断字符串和 CharSequence 是否有相同的字符序列,返回一个布尔值                                                                                                                                             |
| boolean startsWith(String prefix)                             | 判断字符串是否以指定前缀开头,返回一个布尔值                                                                                                                                                               |
| boolean startsWith(String prefix, int toffset)                | 判断从指定索引开始的字符串是否以指定前缀开头,返回一个布尔值                                                                                                                                               |
| boolean endsWith(String suffix)                               | 判断字符串是否已指定后缀为结尾,返回一个布尔值                                                                                                                                                             |
| int indexOf(int ch)                                           | 根据字符的 ASCII 值获取在字符串第一次出现的下标位置,找不到返回-1                                                                                                                                          |
| int indexOf(String str)                                       | 根据目标字符串第一次出现的下标,找不到返回-1                                                                                                                                                               |
| int indexOf(int ch, int fromIndex)                            | 从字符串的指定位置(fromIndex)从左到右根据字符的 ASCII 值获取在字符串第一次出现的下标位置,找不到返回-1                                                                                                     |
| int lastIndexOf(int ch)                                       | 根据字符的 ASCII 值获取在字符串最后一次出现的下标位置,找不到返回-1                                                                                                                                        |
| int lastIndexOf(String str)                                   | 根据目标字符串最后一次出现的下标                                                                                                                                                                          |
| int indexOf(int ch, int fromIndex)                            | 从字符串的指定位置(fromIndex)从右到左根据字符的 ASCII 值获取在字符串最后一次出现的下标位置                                                                                                                |
| boolean isEmpty()                                             | 判断字符串的长度是否为 0                                                                                                                                                                                  |
| String replace(char oldChar, char newChar)                    | 根据新字符替换字符串中的旧字符                                                                                                                                                                            |
| String replace(CharSequence target, CharSequence replacement) | 替换字符串,将字符串中的目标字符串替换指定字符串(replacement)                                                                                                                                              |
| String replaceAll(String regex, String replacement)           | 根据给定的正则表达式进行匹配,使用字符串(replacement)替换所有匹配的字符                                                                                                                                    |
| String replaceFirst(String regex, String replacement)         | 根据给定的正则表达式进行匹配,使用字符串(replacement)替换第一次匹配的字符                                                                                                                                  |
| boolean matches(String regex)                                 | 用于检测字符串是否匹配给定的正则表达式,返回一个布尔值                                                                                                                                                     |
| String trim()                                                 | 去除字符串左右两边的空格                                                                                                                                                                                  |
| char[] toCharArray()                                          | String 转 char 数组                                                                                                                                                                                       |
| byte[] getBytes()                                             | String 转 byte 数组                                                                                                                                                                                       |

::: details String 示例

```java
String s1 = "hello";
// 获取字符串的长度
System.out.println(s1.length());
// 获取指定索引的字符
System.out.println(s1.charAt(0)); // 'h'
// 截取字符串,从开始下标截取到字符串的length() - 1
System.out.println(s1.substring(2)); // "llo"
// 截取字符串,从开始下标截取到结束下标
System.out.println(s1.substring(2,4)); // "ll"
// 字符串转小写
System.out.println("ABC".toLowerCase()); // "abc"
// 字符串转大写
System.out.println("abcD".toUpperCase()); // "ABCD"
// 返回指定索引处字符的ASCII值,s1.charAt(0)的值为'h','h'的ASCII值为104
System.out.println(s1.codePointAt(0)); // 104
// 返回指定索引前一位字符的ASCII值,下标为1的字符为'e','e'的ASCII值为101
System.out.println(s1.codePointBefore(2));
System.out.println(s1.codePointCount(1,3));

/**
 * 按字典顺序比较两个字符串,两个字符串中每个字符的 Unicode 值相等返回0,
 * 如果该字符串在字典上小于字符串参数,则该值小于 0;如果该字符串在字典
 * 上大于字符串参数,则为大于 0 的值。
 */
System.out.println("abcd".compareTo("abcd")); // 0
System.out.println("abcde".compareTo("abcd")); // 1
System.out.println("abcd".compareTo("abcde")); // -1
// 按字典顺序比较两个字符串,但是会忽略大小写
System.out.println("Abcd".compareToIgnoreCase("abcd")); // 0
System.out.println("Abcde".compareToIgnoreCase("abcd")); // 1

// 连接字符串,返回一个新的字符串
System.out.println("hello ".concat("world")); // "hello world"
// 判断字符串是否包含指定字符序列
System.out.println("hello world".contains("he")); // true
// 判断字符串的内容和StringBuffer的内容是否相同
System.out.println("hello".contentEquals(new StringBuffer().append("hello"))); // true
// 判断字符串的内容和CharSequence的内容是否相同
System.out.println("hello".contentEquals("hello")); // true
// 判断字符串是否以指定前缀开头
System.out.println("_hello".startsWith("_")); // true
System.out.println("_hello".startsWith("$")); // false
// 判断从指定索引开始的字符串是否以指定前缀开头
System.out.println("_hello".startsWith("_",2)); // false
System.out.println("he_llo".startsWith("_",2)); // true
// 判断字符串是否以指定后缀结尾
System.out.println("hello$".endsWith("$")); // true

// 根据字符的ASCII值获取在字符串第一次出现的下标位置(没找到返回-1),'e'的ASCII值为101
System.out.println("hello".indexOf(101)); // 1
// 根据目标字符串第一次出现的下标
System.out.println("hello".indexOf("l")); // 2
// 从字符串的指定位置(fromIndex)从左到右根据字符的ASCII值获取在字符串第一次出现的下标位置
System.out.println("hello".indexOf(101,0)); // 1
// 根据字符的ASCII值获取在字符串最后一次出现的下标位置(没找到返回-1),'l'的ASCII值为108
System.out.println("hello".lastIndexOf(108)); // 3
// 根据目标字符串最后一次出现的下标
System.out.println("hello".lastIndexOf("l")); // 3
// 从字符串的指定位置(fromIndex)从右到左根据字符的ASCII值获取在字符串最后一次出现的下标位置
System.out.println("hello".indexOf(108,0)); // 2

// 判断字符串是否为空
System.out.println("".isEmpty()); // true
// 根据新字符替换字符串中的旧字符,108是e的ASCII值
System.out.println("hello".replace((char) 108,(char)101)); // "heeeo"
// 替换字符串,将字符串中的目标字符串替换指定字符串(replacement)
System.out.println("hellllo".replace("l","h")); // "hehhhho"
// 根据给定的正则表达式进行匹配,使用字符串(replacement)替换所有匹配的字符
System.out.println("h_e_l_lo".replaceAll("_","")); // "hello"
// 根据给定的正则表达式进行匹配,使用字符串(replacement)替换第一次匹配的字符
System.out.println("h_e_l_lo".replaceFirst("_","")); // "he_l_lo"
// 根据指定字符串分割,返回一个String数组
System.out.println(Arrays.asList("1_2_3".split("_"))); // [1,2,3]
// 用于检测字符串是否匹配给定的正则表达式,返回一个布尔值
System.out.println("abcd".matches("\\w*")); // true
// 去除字符串左右两边的空格
System.out.println(" hel lo ".trim()); // hel lo
// String转char数组
char[] chars = "hello".toCharArray();
// String转byte数组
byte[] bytes = "hello".getBytes();
```

:::

### 2.2 拼接 String 的六种方法

- 通过+拼接字符串。
- 通过 String.concat()拼接字符串。
- 使用 StringBuffer 或者 StringBuilder 拼接字符串。
- 使用 String.format()拼接字符串。String.format()是一个用于格式化字符串的方法,String.format()方法以一个格式化字符串作为参数,然后根据格式化字符串中的占位符和参数类型,将传入的参数进行格式化，并返回一个格式化后的字符串。String.format() 方法的格式串中的占位符都以百分号(%)开始,后面紧跟一个转换字符,用于指定参数类型和格式化选项。String.format() 方法的占位符有以下几种:
  - %s 表示字符串类型。
  - %c 表示字符类型。
  - %b 表示布尔类型。
  - %d 表示整数类型（十进制）。
  - %o 表示整数类型（八进制）。
  - %x 表示整数类型（十六进制）。
  - %f 表示浮点数类型。
  - %e 表示科学计数法类型。
  - %t 表示日期时间类型。
  - %% 表示百分号（%）本身。
  - %n 表示换行符。
- 使用 String.join()连接字符串。
- 使用 StringJoiner 连接字符串。StringJoiner 是 Java 8 中的一个新特性,它是一个用于将多个字符串连接起来的工具类。它可以将多个字符串按照指定的分隔符连接起来,同时可以在连接的字符串前后添加指定的前缀和后缀。StringJoiner 类提供了方便的 API 来完成这些任务,使字符串的处理变得更加方便和高效。

```java
String s1 = "hello";
String s2 = "world";
// 方式1:通过+号拼接字符串
System.out.println(s1 + " " + s2);
// 方式2:通过String的concat()连接字符串
System.out.println("hello ".concat("world"));
// 方式3:通过StringBuffer或StringBuilder连接字符串
System.out.println(new StringBuffer().append("hello ").append("world"));
System.out.println(new StringBuilder().append("hello ").append("world"));
// 方式4:通过String.format()连接字符串
System.out.println(String.format("hello %s", "world"));
// 方式5:通过String.join()连接字符串
System.out.println(String.join("","hello ","world"));
// 方式6:通过StringJoiner连接字符串,StringJoiner支持分割符、前缀、后缀
StringJoiner joiner = new StringJoiner("");
joiner.add("hello ");
joiner.add("world");
System.out.println(joiner);
```

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

String.intern() 可以保证相同内容的字符串变量引用同一的内存对象。

```java
String s1 = new String("aaa");
String s2 = new String("aaa");
// s1和s2不是同一个对象
System.out.println(s1 == s2);           // false

/**
 * s1通过intern()方法获取一个对象引用,intern() 首先把 s1 引用的对象放到
 * String Pool(字符串常量池)中,然后返回这个对象引用。因此s1和s3是同一个对象
 */
String s3 = s1.intern();
System.out.println(s1.intern() == s3);  // true
```

上述代码中使用`new String("aaa")`分别创建了 a 和 b 两个不同的对象,而 s3 是通过 `s1.intern()` 方法取得一个对象引用。intern() 首先把 s1 引用的对象放到 String Pool(字符串常量池)中,然后返回这个对象引用,因此 s3 和 s1 引用的是同一个字符串常量池的对象。

采用使用双引号的形式创建字符串实例,会自动地将新建的对象放入 String Pool(字符串常量池) 中。

```java
String s1 = "aa";
String s2 = "aa";
System.out.println(s1 == s2); // true
```

HotSpot 中字符串常量池保存哪里?是永久代、方法区还是堆区?

- 运行时常量池(Runtime Constant Pool)是虚拟机规范中是方法区的一部分,在加载类和结构到虚拟机后,就会创建对应的运行时常量池;而字符串常量池是这个过程中常量字符串的存放位置。所以从这个角度,字符串常量池属于虚拟机规范中的方法区,它是一个逻辑上的概念;而堆区、永久代以及元空间是实际的存放位置。
- 不同的虚拟机对虚拟机的规范(比如方法区)是不一样的,只有 HotSpot 才有永久代的概念。
- HotSpot 也是发展的,由于一些问题在新窗口打开的存在,HotSpot 考虑逐渐去永久代,对于不同版本的 JDK,实际的存储位置是有差异的,具体看如下:

| JDK 版本      | 是否有永久代,字符串常量池放在哪里?                                                           | 方法区逻辑上规范,由哪些实际的部分实现的?                                                                      |
| ------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| jdk1.6 及之前 | 有永久代,运行时常量池(包括字符串常量池),静态变量存放在永久代上                               | 这个时期方法区在 HotSpot 中是由永久代来实现的,以至于这个时期说方法区就是指永久代                              |
| jdk1.7        | 有永久代,但已经逐步"去永久代",字符串常量池、静态变量移除,保存在堆中                          | 这个时期方法区在 HotSpot 中由永久代(类型信息、字段、方法、常量)和堆(字符串常量池、静态变量)共同实现           |
| jdk8 及其之后 | 取消永久代,类型信息、字段、方法、常量保存在本地内存的元空间,但字符串常量池、静态变量仍在堆中 | 这个时期方法区在 HotSpot 中由本地内存的元空间(类型信息、字段、方法、常量)和堆(字符串常量池、静态变量)共同实现 |

## 3.类型转换

在 Java 中类型转换分为隐式转换和强制类型转换,

## 4.运算

### 4.1 复合赋值运算

### 4.2 位运算

位运算(Bitwise Operations)是一组在二进制位级别上操作数据的运算操作。它们直接对整数的二进制表示中的每一位进行操作,而不考虑整数的符号或数值大小。在计算机中,所有的数据都以二进制形式表示。位运算提供了一种对二进制数据进行快速、高效操作的方式。它们通常用于对位级别的标志、掩码、位控制和位检查进行操作。
Java 源码中大量使用了位运算提升性能。

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
