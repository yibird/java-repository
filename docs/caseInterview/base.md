## Java 中基础类型有哪些?

在 Java 中类型可分为基本类型(也称原始类型)和引用类型:

- 基本类型:int、boolean、byte、char、short、float、long、double。
- 引用类型:包括类、接口、数组等。注意:引用类型的变量存储的是对象的引用,而不是对象本身。

Java 为基本类型提供了对应的包装类型,包装类型属于引用类型,其默认值都为 null。基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成,即基本类型赋值给包装类型称为装箱,包装类型赋值给基本类型称为拆箱。

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

## 什么是拆箱和装箱?

## 类型转换

## == 与 equal()的区别

## int 与 Integer 的区别?

- int 属于基本类型,指向存储的数值,而 Integer 是 int 的包装类,属于引用类型,指向 Integer 实例化后的对象。
- Integer 声明的变量必须实例化后才能使用,int 声明的变量无需实例化也能使用。
- int 的默认值为 0,Integer 的默认值为 null。

```java
// (1).Integer变量实际上是对一个Integer对象的引用,所以两个通过new实例化的Integer永不相等
Integer n1 = new Integer(1);
Integer n2 = new Integer(1);
System.out.println(n1 == n2); // false


// (2).Integer变量与int变量比较时,只要数值相等,则比较结果为true。包装类型与基本类型比较时,Java会自动将包装类型拆箱为基本类型,然后进行比较
Integer n3 = 100;
int n4 = 100;
System.out.println(n3 == n4); // true

// (3).通过new实例化声明的Integer变量与Integer声明的变量比较时,结果为false。通过new实例化声明的Integer变量指向JVM内存区域堆中新创建的对象,
// 而Integer声明的变量指向Integer内部静态常量池中cache数组存储的指向堆的Integer对象,两者引用的内存地址不同
Integer x = 100;
Integer y = new Integer(100);
System.out.println(x == y); // false


// (4).两个Integer声明的变量比较时,如果两个变量的值在-128到127之间,则比较结果为true,超出该区间结果为false。为了提升初始化性能,Integer内部使用静态常量池
// 初始化了-128到127区间的数值,当Integer声明的变量数值相同时,本质上指向的是同一块内存地址

Integer int1 = 100;
Integer int2 = 100;
System.out.println(int1 == int2); // true,由于Integer数值范围处于-128到127之间,因此int1与int2复用静态常量池Integer对象,指向同一块内存地址

Integer int3 = 128;
Integer int4 = 128;
System.out.println(int3 == int4); // false
```

## String 为什么被设计成不可变的?

String.class 使用 final 关键字修饰,final 修饰类时表示该类无法被继承,其主要原因如下:

- **可以缓存 hash 值**。String 在 Java 中经常用作 Map 的 key,如果字符串是可变的,那么它的值被修改后,可能会导致 Map 中出现错误的 Key-Value 对。String 不可变的特性可以使得 hash 值也不可变,因此只需要进行一次计算。
- **String Pool 的需要**。如果一个 String 对象已经被创建过了,那么就会从 String Pool 中取得引用。只有 String 是不可变的,才可能使用 String Pool。不可变字符串可以被缓存,因为它们的值永远不会改变,所以可以在多个地方重复使用,提高性能。
- **提升安全性**。String 的不可变性还可以提高字符串的安全性,例如在网络传输中,不可变的字符串可以防止被篡改。
- **线程安全**。String 不可变性天生具备线程安全,因此可以在多个线程中安全地使用。

## StringBuilder 与 StringBuffer 的区别?

由于 String 对象是不可变对象,因此对字符串进行修改操作时(例如字符串拼接、替换)总是会生成新的 String 对象,所以其性能相对较差。为此,JDK 专门提供了 StringBuffer 和 StringBuilder 分别用于创建和修改字符串。两者区别如下:

- 可变性。从可变性方面来看,String 属于不可变,而 StringBuilder 和 StringBuffer 都属于可变的。
- 线程安全。从线程安全方面来看,由于 String 具有不可变性,因此是线程安全的;StringBuilder 内部没有使用锁机制来保证线程安全,因此是非线程安全的;而 StringBuffer 内部使用 synchronized(同步机制)进行同步访问,因此是线程安全的。在不需要保证线程安全的场景下,推荐使用 StringBuilder,因其内部没有加锁,所以性能相对更好。

| 对比项   | String | StringBuilder | StringBuffer                          |
| -------- | ------ | ------------- | ------------------------------------- |
| 可变性   | 不可变 | 可变          | 可变                                  |
| 线程安全 | 是     | 否            | 是,内部采用 synchronized 保证线程安全 |
| 是否加锁 | 否     | 否            | 是                                    |

## String 拼接字符串的方式有哪些?

在 Java 中大致有六种方式拼接字符串:

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

## new String("abc")创建了几个对象?

## JDK8 和 JDK9 的 String 有什么区别?

- 内部存储结构不同。在 JDK8 内部使用 char 数组存储数据,但在 JDK9 中内部使用 byte 数组存储数据。使用 char 数组存储数据每个字符占用 2 个字节的存储空间(UTF-16 编码);JDK9 使用 byte 数组存储数据,对于只包含 ASCII 字符的字符串,每个字符只需要一个字节的存储空间,相比于每个字符需要两个字节的存储空间,可以将内存使用减少一半。这种优化在处理大量字符串对象时尤为显著,特别是在应用程序需要存储大量文本数据时,可以降低内存占用并提升整体性能。
- COMPACT_STRINGS:JDK 9 引入了一个名为 COMPACT_STRINGS(压缩字符串)的新特性。它允许 String 类在某些情况下以较低的内存开销存储字符串。具体来说,当字符串仅包含拉丁字母(Latin-1 字符集)时,String 类使用单字节存储每个字符,从而节省了内存。
- 其他改进:JDK 9 还对字符串类进行了其他一些改进,包括更好的 Unicode 支持、更高效的 substring 操作、更好的正则表达式性能等。

## Java 的权限修饰符有哪些?

Java 中的访问权限修饰符用于控制类、接口、成员变量和方法的访问权限。Java 提供了四种访问权限修饰符:

- public(公共的):使用 public 修饰时,表示在任何地方都可以访问,没有访问限制。public 修饰符通常用于修饰公有属性和方法,以供其他类调用。
- default(默认的):当不使用权限修饰符时,表示在同一包内可以访问,其他包中的类无法访问。
- protected(受保护的):使用 protected 修饰时,表示在同一包内和子类中可以访问,其他包中的类无法访问。protected 修饰符通常用于会被子类继承的方法和属性。
- private(私有的):使用 private 修饰时,表示仅在同一类中可以访问,其他类无法访问。private 修饰符通常用于类内部私有方法和属性,以确保外部不可访问。

四种权限修饰符的作用范围如下:
|修饰符|同一个类|同一个包|不同包的子类|不同包的非子类|
|-|-|-|-|-|
|public|√|√|√|√|
|protected|√|√|√||
|default|√|√|||
|private|√||||

## final、finalize、finally 的区别?

- final:Java 的关键字之一, 用于声明不可变的变量,也可以用于修饰类、方法或变量。
  - final 修饰实例变量时,该变量必须在创建对象时进行初始化,并且一旦被赋值后就不能再修改;修饰静态变量时,该变量必须在声明时或静态初始化块中进行初始化,并且一旦被赋值后就不能再修改;修饰局部变量时,该变量必须在声明时进行初始化,并且一旦被赋值后就不能再修改。
  - final 修饰方法时,该方法无法被子类重写。
  - final 修饰类时,该类无法被继承。
- finalize():finalize() 是 Object 类中的一个方法,用于在对象被垃圾收集器回收之前执行一些清理操作,该方法在对象被垃圾收集时会被自动调用。由于 finalize()的执行取决垃圾收集器的调度,如果不触发垃圾回收(GC)finalize()将永远都不会执行。因此,不推荐使用 finalize()进行资源释放,更好的做法是使用 try-with-resources 或 finally 块来确保资源的正确释放。
- finally:finally 是 Java 异常处理关键字,用于定义在 try 块或 try-catch 块执行之后总是执行的代码块,通常用于资源释放,例如关闭数据库连接、关闭 IO 流等操作。

## 什么是反射机制?

Java 反射机制是指在 Java 应用运行中,对于任意一个类,都可以获取该类的所有属性和方法; 对于任意一个对象,都可以调用它的任意一个方法和属性。这种在运行时动态获取的信息以及动态调用对象的方法的功能称为 Java 语言的反射机制。

## 什么是类型擦除?

## Java BIO、NIO、AIO 是什么?

## 什么是 SPI 机制?
