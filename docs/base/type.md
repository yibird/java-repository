## 1.数据类型

### 1.1 基本类型与引用类型

在 Java 中类型可分为基本类型(也称原始类型)和引用类型:

- 基本类型:boolean、byte、char、short、int、float、long、double。

  | 类型    | 占用大小(字节) | 默认值 | 取值范围                                    | 描述                  | 对应的包装类型 |
  | ------- | -------------- | ------ | ------------------------------------------- | --------------------- | -------------- |
  | boolean | 1              | false  | true 或者 false                             | 用于表示布尔值        | Boolean        |
  | byte    | 1              | 0      | -128 到 127                                 | 用于表示字节流数据    | Byte           |
  | char    | 2              | 空     | 0 到 65535                                  | 用于表示 Unicode 字符 | Char           |
  | short   | 2              | 0      | -32768 到 32767                             | 用于表示较小的整数    | Short          |
  | int     | 4              | 0      | -2147483648 到 2147483647                   | 用于表示整数          | Integer        |
  | float   | 4              | 0.0    | ±1.4e-45 到 ±3.4e+38                        | 用于表示单精度浮点数  | Float          |
  | long    | 8              | 0      | -9223372036854775808 到 9223372036854775807 | 用于表示较大的整数    | Long           |
  | double  | 8              | 0.0    | ±4.9e-324 到 ±1.8e+308                      | 用于表示双精度浮点数  | Double         |

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
- 使用 String.format()拼接字符串。String.format()是一个用于格式化字符串的方法,String.format()方法以一个格式化字符串作为参数,然后根据格式化字符串中的占位符和参数类型,将传入的参数进行格式化,并返回一个格式化后的字符串。String.format() 方法的格式串中的占位符都以百分号(%)开始,后面紧跟一个转换字符,用于指定参数类型和格式化选项。String.format() 方法的占位符有以下几种:
  - %s 表示字符串类型。
  - %c 表示字符类型。
  - %b 表示布尔类型。
  - %d 表示整数类型(十进制)。
  - %o 表示整数类型(八进制)。
  - %x 表示整数类型(十六进制)。
  - %f 表示浮点数类型。
  - %e 表示科学计数法类型。
  - %t 表示日期时间类型。
  - %% 表示百分号(%)本身。
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

String.class 使用 final 关键字修饰,final 修饰类时表示该类无法被继承,其主要原因如下:

- **可以缓存 hash 值**。String 在 Java 中经常用作 Map 的 key,如果字符串是可变的,那么它的值被修改后,可能会导致 Map 中出现错误的 Key-Value 对。String 不可变的特性可以使得 hash 值也不可变,因此只需要进行一次计算。
- **String Pool 的需要**。如果一个 String 对象已经被创建过了,那么就会从 String Pool 中取得引用。只有 String 是不可变的,才可能使用 String Pool。不可变字符串可以被缓存,因为它们的值永远不会改变,所以可以在多个地方重复使用,提高性能。
- **提升安全性**。String 的不可变性还可以提高字符串的安全性,例如在网络传输中,不可变的字符串可以防止被篡改。
- **线程安全**。String 不可变性天生具备线程安全,因此可以在多个线程中安全地使用。

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

| 对比项   | String | StringBuilder | StringBuffer                          |
| -------- | ------ | ------------- | ------------------------------------- |
| 可变性   | 不可变 | 可变          | 可变                                  |
| 线程安全 | 是     | 否            | 是,内部采用 synchronized 保证线程安全 |
| 是否加锁 | 否     | 否            | 是                                    |

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

### 2.7 JDK8 中的 String 与 JDK9 有什么区别?

- 内部存储结构不同。在 JDK8 内部使用 char 数组存储数据,但在 JDK9 中内部使用 byte 数组存储数据。使用 char 数组存储数据每个字符占用 2 个字节的存储空间(UTF-16 编码);JDK9 使用 byte 数组存储数据,对于只包含 ASCII 字符的字符串,每个字符只需要一个字节的存储空间,相比于每个字符需要两个字节的存储空间,可以将内存使用减少一半。这种优化在处理大量字符串对象时尤为显著,特别是在应用程序需要存储大量文本数据时,可以降低内存占用并提升整体性能。
- COMPACT_STRINGS:JDK 9 引入了一个名为 COMPACT_STRINGS(压缩字符串)的新特性。它允许 String 类在某些情况下以较低的内存开销存储字符串。具体来说,当字符串仅包含拉丁字母(Latin-1 字符集)时,String 类使用单字节存储每个字符,从而节省了内存。
- 其他改进:JDK 9 还对字符串类进行了其他一些改进,包括更好的 Unicode 支持、更高效的 substring 操作、更好的正则表达式性能等。

## 3.类型转换

在 Java 中类型转换分为隐式转换和强制类型转换两种:

- 隐式转换:隐式转换又称自动转换,是指在不需要特别指定的情况下,由编译器自动进行的类型转换。以下情况会发生隐式转换:
  - 将一个小范围的数据类型赋值给一个大范围的数据类型。例如,将一个整数类型的值赋值给长整数类型。
  - 将字面值常量赋值给变量。例如,将整数常量赋值给 byte 或 short 类型的变量。
  - 表达式中的二元运算符操作数类型不匹配时,编译器会自动进行类型提升以进行计算。

```java
int x = 1;
long y = x; // 隐式转换,int转为long
```

- 强制转换:强制转换是指通过强制指定类型,将一个数据类型转换为另一个数据类型。这种转换需要在代码中显式地指定,并且可能导致数据丢失或溢出。强制转换的语法为将目标类型放在圆括号中,紧跟在要转换的表达式或变量之前。

```java
int num = 10;
// 将int类型强制转换为String类型
String str = (String)num;
```

## 4.运算

### 4.1 复合赋值运算

### 4.2 位运算

位运算(Bitwise Operations)是一组在二进制位级别上操作数据的运算操作。它们直接对整数的二进制表示中的每一位进行操作,而不考虑整数的符号或数值大小。在计算机中,所有的数据都以二进制形式表示。位运算提供了一种对二进制数据进行快速、高效操作的方式。它们通常用于对位级别的标志、掩码、位控制和位检查进行操作。
Java 源码中大量使用了位运算提升性能。

## 5.关键字

### 5.1 static

static 关键字是 Java 中的一个修饰符,用于标识类、方法和变量。static 可以应用于以下三个方面:

- 声明静态变量(类变量):
  - 当 static 关键字用于变量声明时,该变量成为静态变量(也称为类变量)。静态变量属于整个类,而不是类的实例。所有该类的实例共享相同的静态变量,它们在内存中只有一份副本。
  - 静态变量可以通过类名直接访问,无需创建类的实例。
  - 静态变量通常用于表示类级别的数据,如常量、配置信息或共享的计数器等。
  - 静态变量的声明语法为`static dataType variableName;`。
- 声明静态方法(类方法):
  - 当 static 关键字用于方法声明时,该方法成为静态方法。静态方法属于整个类,而不是类的实例。
  - 静态方法可以直接通过类名调用,无需创建类的实例。
  - 静态方法只能访问静态成员(静态变量和静态方法),而不能直接访问实例变量和实例方法,因为在静态方法中没有隐式的 this 引用。
  - 静态方法常用于工具方法、辅助方法或与类的实例无关的操作。
  - 静态方法的声明语法为:`static returnType methodName(parameters) { ... }`。
- 声明静态代码块:
  - 静态代码块是在类被加载时执行的一段代码块,它只会执行一次。
  - 静态代码块用于初始化静态变量或执行其他静态操作。
  - 静态代码块在类加载过程中自动执行,无需显式调用。
  - 静态代码块的语法为:`static { ... }`。

由于静态成员在内存中常驻,可能会占用较多的内存空间。因此,应谨慎使用静态成员,避免滥用和造成资源浪费

#### 5.1.1 static 与 JVM 的关系

被 static 关键字修饰的变量存储在 Java 虚拟机(JVM)的方法区(Method Area)中,也被称为静态存储区或永久代(在 Java 8 之前的版本中)。方法区是一块用于存储类的结构信息、常量、静态变量和编译器编译后的代码的内存区域。静态变量在类加载的过程中被初始化,并且在整个程序的执行过程中只有一份副本。它们与类的生命周期相同,与类的实例无关。当类被加载时,静态变量的内存空间就会被分配,并且在方法区中保留,直到程序结束或类被卸载。

在方法区中,静态变量被存储在类的结构信息中,包括类的名称、父类的名称、静态变量的名称、类型和初始值等。由于静态变量是在类加载过程中初始化的,它们的初始值在类加载完成后就可以直接使用。

需要注意的是,JVM 对方法区的具体实现可能会有所不同。在较新的 JVM 实现中(如 Java 8 及更高版本),方法区的实现已经发生了变化,取而代之的是元空间(Metaspace)。元空间是在本地内存中实现的,而不是在 Java 堆中。它的作用与方法区相似,用于存储类的结构信息、常量和静态变量。因此,被 static 关键字修饰的变量仍然存储在方法区的概念中,但实际的内存分配和管理由元空间负责。

总结来说,被 static 关键字修饰的变量存储在 Java 虚拟机的方法区(或元空间)中。它们在类加载过程中被初始化,并且在整个程序的执行过程中只有一份副本。静态变量的初始值在类加载完成后就可以直接使用。

#### 5.1.2 static 的优点

static 关键字具有以下几个优点:

- 共享数据:被 static 修饰的变量是类级别的变量,对于整个类的所有实例来说是共享的。这意味着无论创建了多少个类的实例,它们都共享相同的静态变量,节省了内存空间。
- 全局访问:静态成员(包括变量和方法)可以通过类名直接访问,无需创建类的实例。这使得它们可以在任何地方使用,并且对于整个程序都是可见的。这方便了对静态成员的调用和使用。
- 静态方法:静态方法属于整个类,而不是类的实例。它们在类加载时就存在,无需实例化对象即可调用。静态方法常用于工具方法、辅助方法或与类的实例无关的操作。使用静态方法可以避免创建不必要的对象,提高代码的执行效率。
- 常量和配置信息:将常量和配置信息声明为静态变量,可以避免多次创建对象来存储这些值。静态变量一经初始化后,其值不会改变,适合用于存储不可变的常量和配置数据。
- 性能优化:静态成员在内存中只有一份副本,可以减少重复的内存开销。静态成员在编译期间可以进行一些优化,如内联操作和常量折叠,从而提高程序的执行效率。

### 5.2 final

Java 中的 final 关键字用于声明不可变的实体(即常量,Constant),即一旦被赋值后,就不能再修改。final 可以用于类、方法和变量的声明。

- final 修饰类:**当一个类被 final 修饰时,它不能被继承,这意味着该类不能有子类**。

```java
// 该类不可被继承
final class FinalClass {
    // 类定义...
}
```

- final 修饰方法:**当一个方法被 final 修饰时,它不能被子类重写**。

```java
class ParentClass {
    final void finalMethod() {
        // 方法定义
    }
}
class ChildClass extends ParentClass {
    // 无法重写finalMethod()方法
}
```

- final 修饰变量:
  - final 修饰实例变量:**当一个实例变量被 final 修饰时,它必须在创建对象时进行初始化,并且一旦被赋值后就不能再修改**。
  - final 修饰静态变量(类变量):**当一个类变量被 final 修饰时,它必须在声明时或静态初始化块中进行初始化,并且一旦被赋值后就不能再修改**。
  - final 修饰局部变量:**当一个局部变量被 final 修饰时,它必须在声明时进行初始化,并且一旦被赋值后就不能再修改**。

```java
class MyClass {
    final int instanceVariable = 10; // 实例变量
    static final int classVariable; // 类变量
    static {
        classVariable = 20; // 静态初始化块中初始化类变量
    }

    void method() {
        final int localVariable = 30; // 局部变量
        // 局部变量定义和使用
    }
}
```

使用 final 关键字的优点如下:

- 安全性高。当一个类、方法或变量被标记为 final 时,它们的值或行为无法被修改,从而保证了安全性。
- 性能优化。编译器在编译阶段处理 final 修饰的变量时可以进行一些优化,以提高程序的执行效率,例如:
  - 内联优化:当一个方法被声明为 final 时,编译器可以将对该方法的调用替换为实际的方法体,即进行方法内联。这样可以减少方法调用的开销,提高程序的执行效率。
  - 常量折叠(Constant Folding):当一个 final 修饰的变量被初始化为常量表达式时,编译器可以在编译时计算该常量表达式的结果,并将结果直接替换到代码中。这样可以减少运行时的计算开销。
  - 缓存优化:final 修饰的变量可以被编译器认为是一个不会改变的值,因此可以进行一些缓存优化。例如,编译器可以将 final 修饰的实例变量缓存在寄存器中,避免了每次访问该变量时的额外内存访问开销。
  - 线程安全性优化:当一个对象被声明为 final 时,其状态在对象创建后就不可更改,因此不需要额外的同步操作来保证线程安全性。这样可以减少同步开销,提高多线程环境下的性能。
- 更具可读性和可维护性。final 关键字可以明确地表明某个实体的意图,使代码更易于理解和维护。

需要注意的是,final 关键字并不意味着实体的内容一定是不可变的,而是表示实体的绑定(继承、重写、赋值)是不可改变的。如果一个 final 修饰的变量是一个引用类型,其引用的对象本身仍然可以修改。要实现真正的不可变性,需要结合其他机制,如不可变类的设计模式或使用 immutable 库。

## 6.继承

在 Java 中,继承是一种面向对象编程的重要概念,它允许一个类（子类）继承另一个类（父类）的属性和方法。通过继承，子类可以重用父类的代码，并且可以添加、修改或扩展父类的功能。

### 6.1 访问权限(修饰符)

Java 中的访问权限修饰符用于控制类、接口、成员变量和方法的访问权限。Java 提供了四种访问权限修饰符:

- public(公共的):使用 public 修饰时,表示在任何地方都可以访问,没有访问限制。public 修饰符通常用于修饰公有属性和方法,以供其他类调用。

```java
public class MyClass {
    // 公共属性
    public int number;
    // 公共方法
    public void method() {
        // 方法体
    }
}
```

- default(默认的):当不使用权限修饰符时,表示在同一包内可以访问,其他包中的类无法访问。

```java
class MyClass {
    // 不使用权限修饰符,仅在该类同包下可以访问该属性
    int number;
    // 不使用权限修饰符,仅在该类同包下可以访问该方法
    void defaultMethod() {
        // 方法体
    }
}
```

- protected(受保护的):使用 protected 修饰时,表示在同一包内和子类中可以访问,其他包中的类无法访问。protected 修饰符通常用于会被子类继承的方法和属性。

```java
class MyClass {
    // 表示该属性仅在同一包内和子类中可以访问
    protected int protectedVariable;
    // 表示该方法仅在同一包内和子类中可以访问
    protected void protectedMethod() {
        // 方法体
    }
}
```

- private(私有的):使用 private 修饰时,表示仅在同一类中可以访问,其他类无法访问。private 修饰符通常用于类内部私有方法和属性,以确保外部不可访问。

```java
class MyClass {
    // 私有属性,仅允许在当前类范围内访问
    private int privateVariable;
     // 私有方法,仅允许在当前类范围内访问
    private void privateMethod() {
        // 方法体
    }
}
```

四种权限修饰符的作用范围如下:
|修饰符|同一个类|同一个包|不同包的子类|不同包的非子类|
|-|-|-|-|-|
|public|√|√|√|√|
|protected|√|√|√||
|default|√|√|||
|private|√||||

### 6.2 抽象类和接口

Java 中的抽象类(Abstract Class)和接口(Interface)都是用于实现面向对象编程的机制。抽象类适用于存在通用代码,但是需要子类实现的应用场景;接口适用于实现多态(一个抽象有多个实现)、解耦、多继承的应用场景。

#### 6.2.1 抽象类

- 在 Java 中,抽象类使用 abstract 关键字定义。
- 抽象类可以有构造函数,用于初始化抽象类的状态,子类在实例化时会调用抽象类的构造函数。
- 抽象类可以包含抽象方法和具体方法。抽象方法是没有实现的方法,子类必须实现它们。具体方法有默认的实现,子类可以选择性地覆盖。
- 抽象类可以有实例变量(字段)。
- 抽象类中的方法和字段支持 public、private、protected、default 四种访问修饰符。

```java
// 抽象类使用abstract修饰一个类,且遵循单继承原则。抽象类的成员(方法和字段)可以使用public、default、private、protected四种修饰符
public abstract class AbstractClassExample {

    // 抽象类支持定义构造方法,而接口不支持
    public AbstractClassExample() {
    }

    // 抽象类不仅可以定义实例变量,还可以定义常量
    private String name;
    private final static int NUMBER = 1000;


    // 定义普通方法
    public void hello() {
        System.out.println("hello!");
    }

    // 定义抽象方法,抽象方法没有具体的实现,当子类继承自抽象类时,子类必须要重写该抽象类的抽象方法
    public abstract void eat();
}
```

#### 6.2.2 接口

- 在 Java 中,接口使用 interface 关键字定义。
- 接口不能包含构造函数。
- 接口中只能包含抽象方法和默认方法(默认方法是 Java 8+引入新特性,它允许在接口中提供具有默认实现的方法,它可以不破坏现有代码的基础上向接口添加新的方法),所有方法默认是 public 和 abstract 的。
- 接口只能包含常量字段(public static final),不能包含实例变量。
- 接口中的方法和属性都是 public 的。
- 接口支持多继承。由于 Java 类遵循单继承原则,一个类无法继承自多个类,当一个类需要继承自多个类时,推荐使用接口。

```java
// 接口使用interface修饰,支持多继承,且不支持构造函数。接口中所有成员(方法、字段)必须是public的,接口中的方法都是抽象方法
public interface InterfaceExample extends RandomAccess, Serializable {

    // 接口中只能定义常量,无法定义实例变量
    public final static int NUMBER = 1000;


    // 定义普通方法,由于接口要求所有成员必须是public的,因此可以省略访问修饰符(默认是default)
    public void hello();

    void eat();


    // 定义默认方法,默认方法是Java8提供的新特性,默认方法允许本身提供默认实现,它可以不破坏现有代码的基础上向接口添加新的方法
    default void say() {
        System.out.println("Interface在说话");
    }
}
```

### 6.3 super

super 是 Java 提供的关键字,用于在子类中与父类进行交互,调用父类的构造方法或访问父类的成员。super 的主要作用如下:

- 调用父类的构造方法:在子类的构造方法中可以使用 super() 可以调用父类的构造方法,这是因为在默认情况下,子类的构造方法会隐式调用父类的无参构造方法,但如果父类没有无参构造方法,或者希望调用父类的特定构造方法时,就需要使用 super() 显式调用。

```java
public class SuperExample {
    public static class Parent {
        public Parent() {
            System.out.println("父类构造方法");
        }

        public Parent(String name) {
            System.out.println("父类构造方法,name:" + name);
        }
    }

    public static class Child extends Parent {
        public Child() {
            // 在子类中使用super()调用父类的无参构造方法,注意:super()调用必须是构造函数体中的第一条语句
            super();
        }

        public Child(String name) {
            // 在子类中使用super()调用父类的有参构造方法
            super(name);
        }
    }

    public static void main(String[] args) {
        Child child01 = new Child();
        Child child02 = new Child("child");
    }
}

```

- 调用父类的成员:在子类中,使用 super 关键字可以访问父类的成员(字段、方法)。这在子类中存在与父类同名的成员时特别有用,通过 super 可以明确指定要访问的是父类的成员。

```java
public class SuperExample {
    public static class Parent {
        public String name = "parent";

        public void load() {
            System.out.println("加载Parent...");
        }
    }

    public static class Child extends Parent {
        public Child() {
            // super()除了调用父类构造函数外,也支持调用父类的成员(字段和方法)
            System.out.println("name:" + super.name);
            super.load();
        }
    }

    public static void main(String[] args) {
        Child child = new Child();
    }
}
```

### 6.4 重写与重载

在各大编程语言中,重写和重载是两种常见的方法设计手段,用于提供代码灵活性和可扩展性。两者区别如下:

- 重写:方法重写指的是在子类中重新定义(实现)与父类中同名、参数列表相同的方法。子类的重写方法应该确保具有相同的方法签名,即方法名称、参数类型和返回类型都应该相同。在 Java 中需要使用@Override 注解标识被重写的方法,该注解可以帮助编译器检查是否正确重写了父类的方法。重写是实现多态的核心机制,子类重写父类的方法提供具体实现,当调用对象是父类类型但实际引用的是子类对象时,会根据对象的实际类型来调用相应的方法,从而实现面向对象的多态特性。

```java
public class OverrideExample {
    /**
     * 重写是指子类重新实现父类提供的同名、参数列表(参数个数和类型)、返回值类型相同的方法。
     * 重写Object的toString()方法,Object是Java类中所有类的基类。
     */
    @Override
    public String toString() {
        // 自定义重写逻辑...
        return "OverrideExample";
    }
}
```

- 重载:方法重载指的是在同一个类中,可以定义多个方法,它们具有相同的名称但参数列表不同(方法的参数列表可以包括参数的类型、个数或顺序),允许有不同的返回值。方法重载机制提供了方法的多种使用方式,可以根据不同的参数调用相应的方法。

```java
/**
 * 方法重载是指一个类可以包含多个方法同名,但方法参数列表(参数个数、参数类型、参数顺序)、返回值不同的方法,
 * 例如OverloadingExample类中提供了add()多个重载方法
 */
public class OverloadingExample {
    public double add(double a, double b) {
        return a + b;
    }

    public double add(double a, double b, double c) {
        return a + b + c;
    }

    public int add(int a, int b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

## 7.Object 类

Object 类是 Java 中所有类的根类。在 Java 中,每个类都直接或间接地继承自 Object 类。Object 类定义了一些通用的方法,它是所有对象的基础。Object 提供了 hashCode()、equals()、clone 等对象公共方法。

### 7.1 hashCode()

hashCode()用于返回对象的哈希码(hash code),哈希码是一个整数值,用于在哈希表等数据结构中进行快速查找和比较对象。在 Object 类中,默认的 hashCode()方法实现返回对象的内存地址作为哈希码。对于自定义类通常需要根据对象的属性来重写 hashCode()方法,以保证相等的对象具有相同的哈希码。

### 7.2 equals()

equals()用于比较两个对象的引用是否相等,即比较内存地址是否一致。

**注意:如果重写 equals()方法必须重写 hashCode(),在 Object 类中,hashCode() 的默认实现是基于对象的内存地址生成的,如果不重写 hashCode()方法,会导致两个相等的对象会产生不一致的哈希码,无法正确在哈希集合(HashMap 或 HashSet)中查找对象。当对象被添加到哈希集合中时,两个相等的对象因为 hashCode 不同,会被分配到不同的哈希桶,可能会导致不必要的哈希冲突,造成性能下降**。

### 7.3 toString()

toString()方法用于返回对象的字符串表示形式,默认情况下,它返回对象的类名和哈希码的十六进制表示形式(即`getClass().getName() + "@" + Integer.toHexString(hashCode())`)。通过重写 toString()方法,可以根据对象的属性和相关信息,提供更有意义和可读性的字符串表示形式,以方便调试和日志记录。

### 7.4 clone()

clone()用于创建并返回一个对象的浅拷贝(shallow copy),浅拷贝意味着拷贝的对象和原始对象共享相同的引用,即拷贝后的对象与原始对象共享相同的内部对象,修改拷贝对象会影响原始对象,修改原始对象也会影响拷贝对象,因为拷贝对象与原始对象指向同一个引用地址。

在默认情况下,clone()方法在 Object 类中是受保护的。要使用 clone()方法,需要确保对象的类实现了 Cloneable 接口,并且 clone()方法的访问级别为 public。否则,在调用 clone()方法时会抛出 CloneNotSupportedException 异常。若想原始对象与拷贝对象相互独立,则需要在 clone()方法中自定义深拷贝逻辑,深拷贝后无论修改原始对象还是拷贝对象,都不会影响彼此。

### 7.5 getClass()

getClass()返回对象的运行时类(Runtime Class)。这是一个 Class 类型的对象,它包含有关对象所属类的信息。

### 7.6 notify() 和 notifyAll()、wait()

这三个方法用于线程间通信,notify() 用于唤醒等待中的线程,notifyAll()用于唤醒所有处于等待的线程,wait()用于使当前线程等待，直到另一个线程通知它继续执行。

notify() 和 notifyAll() 方法用于线程间通信。这些方法是与多线程相关的,用于唤醒等待中的线程。

### 7.7 finalize()

finalize() 方法在垃圾收集器从对象中回收内存之前调用,该方法在对象被垃圾收集时会被自动调用,可以在子类中重写此方法来执行清理操作,例如关闭数据库连接、清理资源。由于 finalize()的执行时机取决与垃圾回收,如果垃圾收集器不执行那么 finalize()永远都不会调用,无法确保在对象不再可达时及时释放资源,可能会导致内存泄漏。其次, finalize() 方法的调用是由垃圾收集器调度,而且垃圾收集通常是一个与业务逻辑无关的耗时操作,如果程序中大量使用 finalize() 方法,可能会影响应用性能。因此,不推荐使用 finalize()进行资源释放,更好的做法是使用 try-with-resources 或 finally 块来确保资源的正确释放。

final、finalize、finally 三者的区别:

- final:Java 的关键字之一, 用于声明不可变的变量，也可以用于修饰类、方法或变量。
- finalize():finalize() 是 Object 类中的一个方法,用于在对象被垃圾收集器回收之前执行一些清理操作,该方法在对象被垃圾收集时会被自动调用,但不推荐依赖它进行资源释放。更好的做法是使用 try-with-resources 或 finally 块来确保资源的正确释放。
- finally:finally 是 Java 异常处理关键字,用于定义在 try 块或 try-catch 块执行之后总是执行的代码块,通常用于资源释放。
