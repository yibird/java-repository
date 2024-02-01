泛型是现代大多数静态类型语言支持的特性之一,旨在保证类型安全性的前提下实现代码的复用。在 JDK5 之前使用对象的引用来实现集合类,但这样会导致在使用集合时需要进行类型转换,并且在编译时无法进行类型检查。为此,JDK5 引入了泛型(Generics)。所谓泛型即泛型化类型参数,就是允许在定义类、接口、方法时使用类型形参,该类型形参(或叫泛型)将在声明变量、创建对象、调用方法时动态地指定(即传入实际的类型参数,也可称为类型实参)。使用泛型可以提高代码的重用性、类型安全性和程序的可读性,例如编写一个支持两个变量相加的方法,正常情况下,定义方法时明确变量类型即可,当需要满足多种类型时则需要定义多种变量类型的方法,这样代码不仅冗余,而且也不利于复用。使用泛型后只需要定义一次方法,参数类型为泛型,使用时传递实际的参数类型。

未使用泛型且需要支持多种类型时,需要定义多个参数类型不同的方法:

```java
public int add(int x,int y){
    return x + y;
}

public String add(String x,String y){
    return x + y;
}
// 省略其他类型...
```

定义方法时使用泛型参数类型化,调用方法时传入实际的类型:

```java
// T为泛型参数
public T add(T x,T y){
    return x + y;
}

add(1,2); // 3,调用方法时传递的参数类型为int,因此add方法声明中泛型T为Integer,注意泛型的参数不能是基本类型
add("1","2"); // 12,调用方法时传递的参数类型为String,因此add方法声明中泛型T为String
// 省略其他类型调用...
```

## 1.泛型声明

Java 泛型支持多种使用方式,允许使用在类、接口、方法以及集合框架中。

### 1.1 泛型类

当一个类使用泛型时该类被称为泛型类,泛型参数被一对尖括号包裹,并且允许定义多个泛型参数。

```java
public class Animal<T> {
    // 使用泛型,约束属性value的类型为类定义的泛型
    private T value;

    public void say(){
        System.out.println("hi " + value);
    }
}
```

### 1.2 泛型接口

当一个接口使用泛型时该接口被称为泛型接口,其使用方式与泛型类类似。

```java
public interface Action<T>{
    String eat(T name);
    T getName(T name);
}
```

### 1.3 泛型方法

当一个方法使用泛型时该方法被称泛型方法,在 Java 中,泛型可以用于静态方法和非静态方法,两者在使用方式有所差异。

- 静态方法泛型:在静态方法中使用泛型时,需要在方法声明之前指定泛型参数。静态方法无法直接访问类的泛型参数,因为泛型参数是与实例相关联的,而静态方法是与类本身相关联的。因此,静态方法的泛型参数必须在方法签名中声明。

```java
public class Example {
    // 静态方法中的泛型参数在方法签名中声明
    public static <T> void staticMethod(T param) {
        // 静态方法的主体
    }
}
```

- 非静态方法泛型:在非静态方法中,泛型参数可以直接使用类中定义的泛型参数。在这种情况下,非静态方法可以直接访问类的泛型参数。

```java
public class Example<T> {
    // 非静态方法中可以直接使用类的泛型参数
    public void nonStaticMethod(T param) {
        // 非静态方法的主体
    }
}
```

### 1.4 集合框架

```java
/**
 * 定义String类型的List,通过构造器实例化时允许忽略泛型类型,
 * new ArrayList<String>() 可以简写为 new ArrayList<>()
 */
List<String> list = new ArrayList<String>();
// 声明一个map结构,key类型为String,value类型为String
Map<String,String> map = new HashMap<>();
// 声明一个set结构,元素类型为String
Set<String> set = new HashSet<>();
```

## 2.泛型通配符

Java 泛型通配符提供了一种灵活的机制,可以减少对类型转换的需求,使得代码可以更通用、更具有扩展性。例如:

- T:泛型 T 表示一个具体的类型。
- K:泛型 K 表示键值中的 key 类型。
- V:泛型 V 表示键值结构中的 value 类型。
- E:泛型 E 表示元素(Element)类型。
- ?:?通配符表示未知的类型。

### 2.1 未知类型通配符

在 Java 泛型中,通配符 ? 表示未知类型,被称为未限定通配符或者未知类型通配符。这个通配符可以用于表示各种不同的泛型类型,但在使用时有一些限制。

```java
// (1).在方法参数中使用。processList允许接受任意类型的List,但在方法内部无法对列表中的元素进行具体类型的操作
public void processList(List<?> list) {
    // 处理未知类型的列表
}

// (2).在集合中使用。创建一个接受任意类型元素的集合,由于不知道具体类型,无法添加除null之外的任何元素
List<?> myList = new ArrayList<>();
```

?通配符的限制:

- 无法添加除 null 之外的任何元素。对于 `List<?>` 或类似的通配符类型,无法添加除 null 之外的任何元素。由于不明确具体类型,因此,无法保证类型安全。

```java
List<?> list = new ArrayList<>();
// list.add("example"); // 编译错误,无法添加元素
```

- 只能读取元素。从未知类型通配符的集合中读取元素时,由于不知道具体类型,因此只能使用 Object 类型接收。

```java
List<?> myList = new ArrayList<>();
Object element = myList.get(0);
```

### 2.2 泛型上界通配符 ? extends T

泛型上界通配符 `? extends T` 在 Java 泛型中用于表示某种类型的子类型。它限制了通配符表示的类型必须是指定类型 T 或其子类型,这允许安全地读取从泛型类型中获取的数据,但不能向其添加数据,因为无法确定具体的子类型。

```java
package com.fly;

import java.util.List;

public class NumberExample<T> {

    // 约束泛型类型需要继承自Number类型,即传入的泛型类型必须是Number的子类型
    public static void print(List<? extends Number> list) {
        list.forEach(System.out::println);
    }

    public static void main(String[] args) {
        // Integer、Double、Float、Long等等都继承自Number
        List<Integer> integerList  = List.of(1, 2, 3, 4);
        List<Double> doubleList = List.of(1.0, 2.0, 3.0, 4.0);
        List<Float> floatList = List.of(1.0f, 2.0f, 3.0f, 4F);
        List<Long> longList = List.of(1L, 2L, 3L, 4L);
        print(integerList);
        print(doubleList);
        print(floatList);
        print(longList);
    }
}
```

### 2.3 泛型下界通配符 ? super T

泛型下界通配符 `? super T` 在 Java 泛型中用于表示某种类型的父类型。它限制了通配符表示的类型必须是指定类型 T 或其父类型。这使得可以向集合中添加类型为 T 或其父类型的元素,但在读取时只能以 Object 类型接收,因为无法确定具体的父类型。

```java
package com.fly;

import java.util.List;

public class NumberExample<T> {

    // 约束传递的泛型类型需要是Integer的父类型
    public static void print(List<? super Integer> list) {
        // 由于泛型下界通配符限制类型为指定类型 T 或其父类型,在获取元素无法精确得知具体类型,因此只能使用Object类型接收
        Object firstItem = list.get(0);
        list.forEach(System.out::println);
    }

    public static void main(String[] args) {
        // Integer继承自Number类,因此除了Integer本身外,也支持Number类
        List<Integer> integerList  = List.of(1, 2, 3, 4);
        List<Number> numberList  = List.of(1, 2, 3, 4);
        print(integerList);
        print(numberList);
    }
}
```

## 3.泛型原理

Java 泛型通过类型擦除(Type Erasure)来实现的。这意味着在编译时,泛型的类型信息会被擦除,而在运行时,Java 虚拟机操作的是擦除后的原始类型。这样做的目的是为了与之前的非泛型代码兼容,同时保持对已有 Java 虚拟机的支持。

### 3.1 类型擦除

**Java 的类型擦除是指在编译时所有泛型类型参数都会被擦除,泛型的类型参数会被替换为它们的上界(对于没有指定上界的类型参数,默认是 Object)。类型擦除降低了在运行时保留泛型类型信息的开销,有助于减少程序在内存使用和性能方面的负担,而且类型擦除还支持向后兼容,可以提高代码的灵活性**。例如:

```java
public class Book<T> {
    private T value;

    public void setValue(T value) {
        this.value = value;
    }

    public T getValue() {
        return this.value;
    }
}
```

```shell
# 编译.java文件,生成一个.class字节码文件
javac .\Book.java
# 反编译字节码文件,-verbose表示输出详细信息
javap -verbose .\Book.class
```

上述例子中,通过 javac 命令编译 Book.java 文件产生一个 Book.class 字节码文件,并使用 javap 命令反编译该字节码文件

```java
public class com.fly.Book<T extends java.lang.Object> extends java.lang.Object
  minor version: 0
  major version: 65
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #8                          // com/fly/Book
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 1, methods: 3, attributes: 2
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Fieldref           #8.#9          // com/fly/Book.value:Ljava/lang/Object;
   #8 = Class              #10            // com/fly/Book
   #9 = NameAndType        #11:#12        // value:Ljava/lang/Object;
  #10 = Utf8               com/fly/Book
  #11 = Utf8               value
  #12 = Utf8               Ljava/lang/Object;
  #13 = Utf8               Signature
  #14 = Utf8               TT;
  #15 = Utf8               Code
  #16 = Utf8               LineNumberTable
  #17 = Utf8               setValue
  #18 = Utf8               (Ljava/lang/Object;)V
  #19 = Utf8               (TT;)V
  #20 = Utf8               getValue
  #21 = Utf8               ()Ljava/lang/Object;
  #22 = Utf8               ()TT;
  #23 = Utf8               <T:Ljava/lang/Object;>Ljava/lang/Object;
  #24 = Utf8               SourceFile
  #25 = Utf8               Book.java
{
  public com.fly.Book();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 8: 0

  public void setValue(T);
    descriptor: (Ljava/lang/Object;)V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0
         1: aload_1
         2: putfield      #7                  // Field value:Ljava/lang/Object;
         5: return
      LineNumberTable:
        line 12: 0
        line 13: 5
    Signature: #19                          // (TT;)V

  public T getValue();
    descriptor: ()Ljava/lang/Object;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #7                  // Field value:Ljava/lang/Object;
         4: areturn
      LineNumberTable:
        line 16: 0
    Signature: #22                          // ()TT;
}
Signature: #23                          // <T:Ljava/lang/Object;>Ljava/lang/Object;
SourceFile: "Book.java"
```

从反编译结果来看,经过编译后的泛型参数会进行类型擦除,泛型参数类型会使用 Object 类型进行替换。Ljava/lang/Object 是在 Java 字节码中表示 java.lang.Object 类的描述符。在 Java 字节码中,类和接口的描述符用字符串表示,以 L 开头,以 ; 结尾，中间是完整的类或接口的二进制名称(包括包路径,用 / 分隔)。

### 3.2 类型擦除的局限性

#### 3.2.1 可能会出现运行时异常

由于类型擦除会在编译时将泛型参数替换为 Object,因此,Java 泛型无法在运行时获取具体的泛型类型,在类型转换下可能会出现 ClassCastException(类转换)异常。例如:

```java
List<String> list = new ArrayList<String>();
list.add("zchengfeng");
List<Integer> intList = (List<Integer>)list; // 类型转换错误,抛出ClassCastException异常
```

#### 3.2.2 泛型类型参数不能是基本类型

由于 Java 泛型是通过类型擦除实现的,而基本类型在 Java 中属于非引用类型,因此,基本类型无法作为泛型类型的参数。在使用泛型时必须使用对应的包装类(Wrapper Classes)作为泛型类型参数。

#### 3.2.3 无法创建泛型类型的实例

由于类型擦除的存在,Java 泛型无法在运行时创建泛型类型的实例。例如,无法使用 new T()创建一个泛型类型 T 的实例,经过类型擦除后,T 被转为 Object 类型,因此也无法创建泛型数组。

#### 3.2.4 泛型类型参数不能使用 instantof

泛型参数类型经过类型擦除后,无法在运行时无法直接获取泛型类型参数的具体类型信息。因此,无法在运行时使用 instanceof 操作符来检查一个对象是否是某个泛型类型的实例。

#### 3.2.5 无法重载泛型方法

在类型擦除的过程中,方法的参数和返回类型的泛型信息被擦除,编译器无法在运行时识别它们的具体类型。这种擦除可能导致编译器无法区分两个在类型参数上有不同约束的泛型方法,从而无法重载泛型方法。

在下述例子中,由于类型擦除,两个 process 方法的实际签名在运行时变得相同,都变成了 Object process(Object value)。因此,编译器会报告方法重载冲突。

```java
public class Example {
    public <T> T process(T value) {
        // 处理逻辑
        return value;
    }

    public <U> U process(U value) {
        // 处理逻辑
        return value;
    }
}
```

要解决这个问题,可以通过方法的参数列表来进行重载,而不是仅依赖于返回类型。例如:

```java
public class Example {
    public <T> T process(T value, Class<T> clazz) {
        // 处理逻辑
        return value;
    }

    public <U> U process(U value, Class<U> clazz) {
        // 处理逻辑
        return value;
    }
}
```

在这种情况下,通过为方法添加额外的参数`(Class<T> 或 Class<U>)`,可以区分两个方法.因为它们的参数列表不同.而类型擦除不会影响这些参数的具体类型。

### 3.3 运行时获取泛型类型

由于类型擦除的存在,直接在运行时获取泛型的具体类型是比较困难的。在运行时,泛型的类型信息会被擦除,导致无法直接获取泛型参数的具体类型,不过,可以通过一些方法来近似获取或传递类型信息:

- 通过传递 Class 对象。
- 通过反射获取泛型类型。

这两种方法都是近似的方式,无法完全获取泛型参数的具体类型,而只能获取泛型参数的上界。

#### 3.3.1 通过传递 Class 对象获取泛型类型

通过在构造函数中传递 `Class<T>`对象,并通过该对象的 newInstance()创建一个泛型参数类型的实例,可以在运行时获取泛型参数的类型信息。注意,这种方式要求泛型参数类型具有无参构造函数。

```java
public class Example<T> {
    private Class<T> type;
    public Example(Class<T> type) {
        this.type = type;
    }
    public T createInstance() throws IllegalAccessException, InstantiationException {
        return type.newInstance();
    }

    public static void main(String[] args) throws IllegalAccessException, InstantiationException {
        // 向构造器传递一个Class对象
        Example<Number> example = new Example<>(Number.class);
        // 通过Class对象的newInstance()创建一个泛型参数类型的实例,从而获取泛型类型
        Number instance = example.createInstance();
    }
}
```

#### 3.3.2 通过反射获取泛型类型

通过反射获取泛型超类的 ParameterizedType,然后使用 getActualTypeArguments() 获取泛型参数的类型信息。这种方法适用于获取泛型父类的类型信息。

```java
public class Example<T> {
    public Class<T> getType() {
        /**
         * ParameterizedType 是 Java 反射库中的一个接口,用于表示参数化类型。它是 Type 接口的子接口,
         * 用于表示具有实际类型参数的泛型类型。在使用泛型时,如果类或接口是参数化的,
         * 可以使用 ParameterizedType 获取其参数化类型信息
         */
        ParameterizedType superClass = (ParameterizedType) getClass().getGenericSuperclass();
        // 获取表示此类型实际类型参数的 Type 对象数组
        Type[] types = superClass.getActualTypeArguments();
        return (Class<T>) types[0];
    }

    public static void main(String[] args) {
        Example<Number> instance = new Example<>();
        Class<Number> type = instance.getType();
    }
}
```
