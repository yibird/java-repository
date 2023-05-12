Java 反射机制是指在 Java 应用运行中,对于任意一个类,都可以获取该类的所有属性和方法; 对于任意一个对象,都可以调用它的任意一个方法和属性。这种在运行时动态获取的信息以及动态调用对象的方法的功能称为 Java 语言的反射机制。

## 1.反射基础

### 1.1 Class 类

Class 位于 java.lang 包下,Class 类的实例表示 java 应用运行时的类(class ans enum)或接口(interface and annotation),在 Java 中每个 java 类运行时都在 JVM 里表现为一个 Class 对象,可通过类名.class、类型.getClass()、Class.forName("类名")等方法获取 Class 对象。数组同样也被映射为 Class 对象的一个类，所有具有相同元素类型和维数的数组都共享该 Class 对象。基本类型 boolean、byte、char、short、int、long、float、double 和关键字 void 同样表现为 Class 对象。

### 1.2 类加载过程

## 2.使用反射

在 Java 中,Class 类与`java.lang.reflect`包对反射提供了大力支持,除了 Class 类外 Java 还提供了`Constructor`、`Method`、 `Field`用于分别操作类的构造方法、方法、字段。

- Constructor 类表示 Class 对象类的构造方法,利用它可以在运行时动态创建对象。
- Method 类表示 Class 对象所表示的类的成员方法,通过它可以动态调用对象的方法(包含 private)。
- Field 类表示 Class 对象类的成员字段属性,通过它可以在运行时动态修改成员变量的属性值(包含 private)。

### 2.1 Class

在类加载的时候,JVM 会创建一个 Class 对象,Class 类提供非常丰富的 API 用于操作 Class 对象,例如创建 Class 实例、获取 Class 全限定名、 获取 Class 构造方法、获取 Class 方法、获取 Class 字段等等。Java 中提供了三种方式用于获取 Class 对象:

- 通过类名获取 Class 实例。
- 通过对象的 getClass()获取 Class 实例。
- 通过 `Class.forName()`根据全限定类名获取 Class 实例。

```java
/** 获取Class实例的三种方式 **/
public static void getClassInstance()throws Exception{
        // 方式1:直接通过类名获取Class实例
        System.out.println("根据类名获取Class实例:"+Test.class);
        // 方式2:通过类对象的getClass()获取Class实例
        System.out.println("类对象的getClass()获取Class实例:"+new Test().getClass());
        // 方式3:通过Class.forName()根据全限定类名反射方式获取Class实例
        System.out.println("Class.forName()根据全限定类名获取Class实例:"
            +Class.forName("reflect.Test"));
}
```

Class API 如下:
| api 名称 | 描述 |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Class.forName(String className) | 根据全限定类名返回一个 Class 对象。 |
| getName() | 以字符串的形式返回 class 全限定类名(包含包名和类名)。 |
| getSimpleName() | 以字符串的形式返回 class 的类名(不包含包名)。 |
| getTypeName() | 以字符串的形式返回类的类型名称(包含包名和类名)。 |
| getPackage() | 获取类所处包的 package 实例。通过 package 实例的 getName()可以获取类所在包名。 |
| newInstance() | 创建类的新实例。该类被实例化,就像是由一个带有空参数列表的新表达式实例化一样。如果尚未初始化该类,则初始化该类。 |
| getModifiers() | 获取 class 的修饰符,返回一个 int 值 |
| **getInterfaces()** | 获取 class 实现的接口列表,返回一个 Class 数组。 |
| **getConstructors()** | 获取 class 中所有非 private 修饰的构造函数,返回一个 Constructor 数组。 |
| **getDeclaredConstructors()** | 获取 class 中所有构造函数,返回一个 Constructor 数组。 |
| **getConstructor(Class<?>... parameterTypes)** | 根据参数类型返回一个非 private 修饰构造函数(Constructor),如果不传递参数类型,则获取无参构造函数。 |
| **getDeclaredConstructor(Class<?>... parameterTypes)** | 根据参数类型返回一个构造函数(Constructor),如果不传递参数类型,则获取无参构造函数。 |
| **getMethods()** | 获取 class 中所有非 private 修饰的方法,返回一个 Method 数组。 |
| **getDeclaredMethods()** | 获取 class 中的所有方法,返回一个 Method 数组。 |
| **getMethod(String name, Class<?>... parameterTypes)** | 根据方法名称和方法参数获取一个非 private 修饰的方法,返回一个 Method 对象。 |
| **getDeclaredMethod(String name, Class<?>... parameterTypes)** | 根据方法名称和方法参数获取一个方法,返回一个 Method 对象。 |
| **getFields()** | 获取 class 中所有非 private 修饰的字段,返回一个 Field 数组。 |
| **getDeclaredFields()** | 获取 class 中所有的字段,返回一个 Field 数组。 |
| **getField(String name)** | 根据字段名获取 class 中非 private 修饰的字段,返回一个 Field。 |
| **getDeclaredField(String name)** | 根据字段名获取 class 中的字段,返回一个 Field。 |
| getClassLoader() | 返回类的类加载器。一些实现可能使用 null 来表示 Bootstrap Class Loader(引导类加载器)。如果该类由引导类加载器加载,则该方法在此类实现中将返回 null。 |
| getSuperclass() | 获取当前类的父类(最近的父类,Java 中最顶层的类为`java.lang.Object`),返回一个 Class。如果该类表示对象类、接口、基元类型或 void,则返回 null;如果此对象表示数组类,则返回表示对象类的类对象。例如:`class Test extends Null`,Test 类的父类是 Null(Test 显式继承 Null),如果 Test 未显式继承任意类,则 Test 类的父类是 Object。 |
| getSigners() | 返回当前 class 的签名者(Object[]),如果没有签名者,则为 null。如果此对象表示基元类型或 void,则此方法返回 null。 |
| getResource() | 查找具有给定名称的资源(返回一个 java.net.URL 对象)。用于搜索与给定类关联的资源的规则由该类的定义类加载器实现。此方法委托给此对象的类加载器,如果此对象由引导类加载器加载,则该方法将委托给 ClassLoader.getSystemResource。 |
| getResourceAsStream() | 查找具有给定名称的资源(返回一个 InputStream)。用于搜索与给定类关联的资源的规则由该类的定义类加载器实现。此方法委托给此对象的类加载器,如果此对象由引导类加载器加载,则该方法将委托给 ClassLoader.getSystemResourceAsStream。 |
| isAssignableFrom() | |
| isAnnotation() | 判断当前 class 是否是注解类,返回一个 boolean 值。 |
| isInterface() | 判断当前 class 是否是接口,返回一个 boolean 值。 |
| isAnonymousClass() | 判断当前 class 是否是匿名类,返回一个 boolean 值。 |
| isEnum() | 判断当前 class 是否是枚举类,返回一个 boolean 值。 |
| isArray() | 判断当前 class 是否是数组类,返回一个 boolean 值。 |
| isLocalClass() | 判断当前 class 是否是本地类,返回一个 boolean 值。 |
| isMemberClass() | 判断当前 class 是否是成员类,返回一个 boolean 值。 |
| isPrimitive() | 判断当前 class 是否是基元类型,返回一个 boolean 值。 |
| isSynthetic() | 判断当前 class 是否是合成类,返回一个 boolean 值。 |

```java
package reflect;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Arrays;

public class ReflectExample {
    public static void main(String[] args) throws InstantiationException, IllegalAccessException, NoSuchMethodException {
        // 获取Class实例
        Class<Dog> cls = Dog.class;
        // 返回Class的全限定类名
        System.out.println(cls.getName()); // reflect.Dog
        // 返回Class的类名(不包含包名)
        System.out.println(cls.getSimpleName()); // Dog
        // 返回Class的类型名称(包含包名和类名)
        System.out.println(cls.getTypeName()); // reflect.Dog
        // 返回Class所在包的名称
        System.out.println(cls.getPackage().getName()); // reflect

        // 创建类的新实例
        Dog dog = cls.newInstance();
        dog.setName("大黄");
        System.out.println(dog.getName()); // "大黄"
        // 获取Class实现的接口列表,返回一个Class数组
        Class<?>[] interfaces = cls.getInterfaces();
        Arrays.stream(interfaces).forEach(i->System.out.print(i.getName()+" ")); // java.io.Serializable
        System.out.println();

        // 获取Class中非private修饰的构造函数,返回一个Constructor数组
        Constructor<?>[] constructors01 = cls.getConstructors();
        Arrays.stream(constructors01).forEach(i->System.out.print(i.getName()+" ")); // reflect.Dog reflect.Dog
        System.out.println();

        // 获取Class中所有构造函数,返回一个Constructor数组
        Constructor<?>[] constructors02 = cls.getDeclaredConstructors();
        Arrays.stream(constructors02).forEach(i->System.out.print(i.getName()+" ")); // reflect.Dog reflect.Dog reflect.Dog
        System.out.println();

        // 获取Class中非private修饰的方法,返回一个Method数组(包括从父类继承的方法)
        Method[] methods01 = cls.getMethods();
        Arrays.stream(methods01).forEach(i->System.out.print(i.getName()+" ")); // getAge setAge getName setName eat wait wait wait equals toString hashCode getClass notify notifyAll
        System.out.println();

        // 获取Class中所有的方法,返回一个Method数组
        Method[] methods02 = cls.getDeclaredMethods();
        Arrays.stream(methods02).forEach(i->System.out.print(i.getName()+" ")); // getAge setAge getName setName getName
        System.out.println();
        // 根据方法名和方法参数的类型获取Method
        Method method = cls.getDeclaredMethod("setName",String.class);
        System.out.println(method.getName()); // setName

        // 获取当前Class的类加载器
        System.out.println(cls.getClassLoader()); // sun.misc.Launcher$AppClassLoader@18b4aac2
        // 获取当前Class的父类
        Class<? super Dog> superclass = cls.getSuperclass();
        System.out.println(superclass.getName()); // reflect.Animal

        // 判断当前Class是否是一个Annotation
        System.out.println(cls.isAnnotation()); // false
        // 判断当前Class是否是interface
        System.out.println(cls.isInterface()); // false
        // 判断当前Class是否是枚举类
        System.out.println(cls.isEnum()); // false
        // 判断当前Class是否是数组类
        System.out.println(cls.isArray()); // false
    }
}
```

### 2.2 Constructor

Constructor 表示 Class 对象的构造方法,Constructor 对象可以通过 Class 对象的`getConstructors()`方法类中所有的构造方法实例。Constructor 的方法如下:
| api 名称 | 描述 |
| ---- | ---- |
|newInstance(Object ... initargs) | 调用 Class 对象所代表的构造函数创建的新对象。|
|getName()|以字符串形式返回此构造函数的名称(包名+类名)。|
|getModifiers()|获取构造函数的修饰符,返回一个 int 值。|
|getParameterCount()|获取构造函数参数数量,返回一个 int 值。|
|getParameterTypes()|获取构造函数参数类型,返回一个 Class 数组|
|getParameters()|获取构造函数的参数,返回一个 Parameter 数组。|
|getDeclaringClass()|返回表示类或接口的类对象。|
|getClass()|返回运行时的非 private 修饰的类对象(即 java.lang.reflect.Constructor)。|
|getDeclaringClass()|返回运行时的类对象。|
|getAnnotations()|获取构造函数上所有非 private 修饰的注解,返回一个 Annotation 数组。|
|`getAnnotation(Class<T> annotationClass`)|根据指定类获取构造函数上非 private 修饰的注解,若构造函数存在对应的注解,则返回该注解,否则返回 null。|
|getDeclaredAnnotations()|返回构造函数上所有注解(包含 private 修饰的注解),返回一个 Annotation 数组。|
|`getDeclaredAnnotation(Class<T> annotationClass)`|根据指定类获取构造函数上修饰的注解,若构造函数存在对应的注解,则返回该注解,否则返回 null。|
|getExceptionTypes()|获取构造函数抛出的异常信息,返回一个类对象数组,如果构造函数未抛出错误,则返回一个空类对象数组。|
|getGenericExceptionTypes()|返回一个类型对象数组(Type[]),该数组表示声明由此可执行对象引发的异常。如果基础可执行文件在其 throws 子句中未声明任何异常,则返回长度为 0 的数组。/
|getGenericParameterTypes()|返回一个类型对象数组(Type[]),该数组表示构造函数的参数类型列表。|
|isSynthetic()|判断构造函数是否是合成构造函数,返回一个 boolean 值。|
|isVarArgs()|判断构造函数是否具有可变参数,返回一个布尔值。`public void test(String ...args){}`,args 就是一个可变参数。|
|isAccessible()| 判断构造函数是否可访问,返回一个布尔值。可通过 Constructor 的 setAccessible()设置访问性。|
|`isAnnotationPresent(Class<? extends Annotation> annotationClass)`|判断构造函数是否存在指定注解,返回一个 boolean 值。|

```java
package reflect;

import java.lang.reflect.Constructor;
import java.lang.reflect.Parameter;
import java.util.Arrays;

public class ReflectExample {
    public static void main(String[] args) throws InstantiationException, IllegalAccessException, NoSuchMethodException {
        Class<Dog> cls = Dog.class;
        // 获取Class中所有构造方法,返回一个Constructor数组
        Constructor<?>[] cts = cls.getDeclaredConstructors();
        // 根据构造方法参数的类型从Class获取Constructor,注意构造方法参数的类型需要是包装类型
        Constructor<Dog> ct = cls.getDeclaredConstructor(String.class,Integer.class);
        // 获取构造方法名称
        System.out.println(ct.getName()); // reflect.Dog
        // 获取构造方法修饰符
        System.out.println(ct.getModifiers()); // 1
        // 获取构造方法的参数数量
        System.out.println(ct.getParameterCount()); // 2
        // 获取构造方法的参数类型,返回一个Class数组
        Class<?>[] parameterTypes = ct.getParameterTypes();
        Arrays.stream(parameterTypes).forEach(i->System.out.print(i.getName()+" ")); // java.lang.String java.lang.Integer
        System.out.println();
        // 获取构造方法的参数,返回一个Parameter数组
        Parameter[] parameters = ct.getParameters();
        Arrays.stream(parameters).forEach(i->System.out.print(i.getName()+" ")); // arg0 arg1
        System.out.println();
        // 判断构造方法是否存在指定注解
        System.out.println(ct.isAnnotationPresent(Deprecated.class)); // true
    }
}
```

### 2.3 Method

Method 提供关于类或接口上单独某个方法(以及如何访问该方法)的信息,所反映的方法可能是类方法或实例方法(包括抽象方法)。通过 Class 的`getDeclaredMethods()`或`getMethods()`获取类中的一组 Method。Method 方法如下:

| api 名称                                                           | 描述                                                                                                                                                               |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| getName()                                                          | 以字符串的形式返回方法的名称。                                                                                                                                     |
| getReturnType()                                                    | 获取方法的返回值,返回一个 Class 对象。                                                                                                                             |
| getModifiers()                                                     | 获取方法的修饰符,返回一个 int 值。                                                                                                                                 |
| getParameters()                                                    | 获取方法参数列表,返回一个 Parameter 数组。                                                                                                                         |
| getParameterCount()                                                | 返回方法参数列表数量。                                                                                                                                             |
| getParameterTypes()                                                | 获取方法所有参数类型,返回一个 Class 数组。                                                                                                                         |
| getAnnotations()                                                   | 获取方法上的注解,返回一个 Annotation 数组。                                                                                                                        |
| `getAnnotation(Class<T> annotationClass)`                          | 根据 class 获取方法上指定注解,返回一个 Annotation 对象,若方法不存在指定注解则返回 null。                                                                           |
| getExceptionTypes()                                                | 获取方法抛出的异常,返回一个 Class 数组。如果方法未抛出异常则返回一个空数组。                                                                                       |
| getDefaultValue()                                                  | 此方法用于获取方法上注解的默认值。如果注解是基元类型,则返回相应包装器类型的实例。如果没有与注解关联的默认值,或者如果方法实例不表示注释类型的声明成员,则返回 null。 |
| getGenericExceptionTypes()                                         | 返回一个类型对象数组(Type[]),该数组表示声方法抛出的异常。如果基础可执行文件在其 throws 子句中未声明任何异常,则返回长度为 0 的数组。/                               |
| getGenericParameterTypes()                                         | 返回一个类型对象数组(Type[]),该数组表示方法的参数类型列表。                                                                                                        |
| getGenericReturnType()                                             | 获取方法的返回值(通用的),返回一个 Type 对象                                                                                                                        |
| isBridge()                                                         | 判断方法是否是桥接方法,返回一个 boolean 值。                                                                                                                       |
| isSynthetic()                                                      | 判断方法是否是合成方法,返回一个 boolean 值。                                                                                                                       |
| isDefault()                                                        | 判断方法是否是默认方法,返回一个 boolean 值。                                                                                                                       |
| isVarArgs()                                                        | 判断方法是否具有可变参数,返回一个 boolean 值。                                                                                                                     |
| isAccessible()                                                     | 判断方法是否可访问,返回一个布尔值。可通过 Method 的 setAccessible()设置访问性。                                                                                    |
| `isAnnotationPresent(Class<? extends Annotation> annotationClass)` | 判断方法上是否存在指定注解,返回一个 boolean 值。                                                                                                                   |
| **invoke(Object obj, Object... args)**                             | 此方法用于调用方法,obj 指向方法中的 this,args 为方法的参数。                                                                                                       |

```java
package reflect;

import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Arrays;

public class ReflectExample {
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException, InstantiationException {
        Class<Dog> cls = Dog.class;
        // 获取Class中所有的Method
        Method[] methods = cls.getDeclaredMethods();
        Arrays.stream(methods).forEach(i-> System.out.print(i.getName()+" ")); // getAge setAge getName setName
        System.out.println();

        // 根据方法名和方法参数的类型从Class中获取Method
        Method method = cls.getDeclaredMethod("setName", String.class);
        // 获取Method的修饰符
        System.out.println(method.getModifiers()); // 1
        // 获取Method的返回值类型
        System.out.println(method.getReturnType().getName()); // void
        // 获取Method的参数数量
        System.out.println(method.getParameterCount()); // 1
        // 获取Method的参数列表,返回一个Parameter数组
        Parameter[] parameters = method.getParameters();
        Arrays.stream(parameters).forEach(i-> System.out.print(i.getName()+" ")); // arg0
        System.out.println();
        // 获取Method的参数类型,返回一个Class数组
        Class<?>[] parameterTypes = method.getParameterTypes();
        Arrays.stream(parameterTypes).forEach(i-> System.out.print(i.getName()+" ")); // java.lang.String
        System.out.println();
        // 获取Method上的注解,返回一个Annotation数组
        Annotation[] annotations = method.getAnnotations();
        Arrays.stream(annotations).forEach(i-> System.out.print(i.toString()+" ")); // @java.lang.Deprecated()
        System.out.println();

        // 判断当前Method是否是默认方法
        System.out.println(method.isDefault()); // false
        // 判断方法是否可访问,返回一个布尔值。可通过Method的setAccessible()设置访问性
        System.out.println(method.isAccessible()); // false
        // 判断当前方法是否包含指定注解
        System.out.println(method.isAnnotationPresent(Deprecated.class)); // true

        Dog dog = cls.newInstance();
        // 调用方法,第一个参数为方法中的 this(一般是Method所在类的实例),第二个参数为方法的参数
        method.invoke(dog,"大黄");
        System.out.println(dog.getName()); // 大黄
    }
}
```

### 2.4 Field

Field 提供有关类或接口的单个字段的信息,以及对它的动态访问权限。反射的字段可能是一个类(静态)字段或实例字段。通过 Class 类的`getDeclaredFields`或`getFields()`获取类中的一组 Field。Field 方法如下:

| api 名称                                                           | 描述                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getName()                                                          | 以字符串的形式返回字段的名称。                                                                                                                                                                                                                                                                    |
| getType()                                                          | 获取字段的类型,返回一个 Class 对象。                                                                                                                                                                                                                                                              |
| getModifiers()                                                     | 获取字段修饰符,返回一个 int 值。                                                                                                                                                                                                                                                                  |
| getAnnotations()                                                   | 获取字段上所有非 private 修饰的注解,返回一个 Annotation 数组。                                                                                                                                                                                                                                    |
| `getAnnotation(Class<T> annotationClass)`                          | 根据指定类获取字段上非 private 修饰的注解,若字段存在对应的注解,则返回该注解,否则返回 null。                                                                                                                                                                                                       |
| `getAnnotationsByType(Class<T> annotationClass)`                   | 根据指定类获取字段上非 private 修饰的所有注解,返回一个注解数组。                                                                                                                                                                                                                                  |
| getDeclaringClass()                                                | 获取字段所属类的对象,返回一个 Class 对象。                                                                                                                                                                                                                                                        |
| get(Object obj)                                                    | 根据对象获取对应字段(Field)的值,返回一个 Object。                                                                                                                                                                                                                                                 |
| getInt(Object obj)                                                 | 从 obj 根据字段获取对应字段值并转为 int,注意:字段类型只能为 int,否则抛出 java.lang.IllegalArgumentException(非法数据异常)。除了 getInt(),Field 类还提供了 getByte()、getLong()、getDouble()、getFloat()、getChar()、getShort()、getBoolean(),它们的作用与 getInt()类似,只不过转换的类型不同而已。 |
| isSynthetic()                                                      | 判断字段是否是合成字段,返回一个 boolean 值。                                                                                                                                                                                                                                                      |
| `isAnnotationPresent(Class<? extends Annotation> annotationClass`) | 判断字段上是否存在指定注解,返回一个 boolean 值。                                                                                                                                                                                                                                                  |
| isAccessible()                                                     | 判断字段是否可访问,返回一个布尔值。可通过 Field 类的 setAccessible()设置访问性。                                                                                                                                                                                                                  |
| isEnumConstant()                                                   | 判断字段是否是一个枚举常量,返回一个布尔值。例如:`enum ColorEnum{ RED }`,RED 字段就是一个枚举常量字段。                                                                                                                                                                                            |

```java
package reflect;

import java.lang.reflect.Field;
import java.util.Arrays;

public class ReflectExample {
    public static void main(String[] args) throws NoSuchFieldException, InstantiationException, IllegalAccessException {
        Class<Dog> cls = Dog.class;
        // 获取Class中所有的Field
        Field[] fields = cls.getDeclaredFields();
        Arrays.stream(fields).forEach(i-> System.out.print(i.getName()+" ")); // name age address
        System.out.println();
        // 根据字段名称从Class中获取Field
        Field field = cls.getDeclaredField("name");
        // 获取字段名称
        System.out.println(field.getName()); // name
        // 获取字段修饰符
        System.out.println(field.getModifiers()); // 2
        // 获取字段类型,返回一个Class对象
        System.out.println(field.getType().getName()); // java.lang.String
        // 获取字段所属类字段,返回一个Class对象
        System.out.println(field.getDeclaringClass().getName()); // reflect.Dog

        Dog dog = cls.newInstance();
        dog.setName("大黄");
        // 设置字段访问性
        field.setAccessible(true);
        // 根据对象获取对应字段(Field)的值,返回一个 Object,访问前需要设置字段的访问性
        System.out.println(field.get(dog)); // 大黄
        // 判断字段是否可访问,返回一个布尔值。可通过Field类的setAccessible()设置访问性。
        System.out.println(field.isAccessible()); // true
        // 判断字段是否是一个枚举常量,返回一个布尔值
        System.out.println(field.isEnumConstant()); // false
        // 判断字段是否包含指定注解
        System.out.println(field.isAnnotationPresent(Deprecated.class)); // false
    }
}
```

#### 2.5 Modifiers

Modifiers 用于表示 Java 中的修饰符,Modifiers 类中提供了大量修饰符常量,以 16 进制的数字表示,如果 class、method、field 没有修饰符通过 getModifiers()的值为 0。
Modifiers 类内部还提供了诸多 isXXX 形式的方法,用于根据 int 判断是否某个修饰符,返回一个布尔值,例如:`boolean isPublic(int mod)`。

```java
// 0x00000001 表示public修饰符
public static final int PUBLIC           = 0x00000001;
// 0x00000002 表示private修饰符
public static final int PRIVATE          = 0x00000002;
// 0x00000004 表示protected修饰符
public static final int PROTECTED        = 0x00000004;
// 0x00000008 表示static修饰符
public static final int STATIC           = 0x00000008;
// 0x00000010 表示final修饰符
public static final int FINAL            = 0x00000010;
// 0x00000020 表示synchronized修饰符
public static final int SYNCHRONIZED     = 0x00000020;
// 0x00000040 表示volatile修饰符
public static final int VOLATILE         = 0x00000040;
// 0x00000080 表示transient修饰符
public static final int TRANSIENT        = 0x00000080;
// 0x00000100 表示native修饰符
public static final int NATIVE           = 0x00000100;
// 0x00000200 表示interface修饰符
public static final int INTERFACE        = 0x00000200;
// 0x00000400 表示abstract修饰符
public static final int ABSTRACT         = 0x00000400;
// 0x00000800 表示strict修饰符
public static final int STRICT           = 0x00000800;
// 0x00000040 表示bridge(桥接)修饰符
static final int BRIDGE    = 0x00000040;
// 0x00000080 表示varargs(可变变量)修饰符
static final int VARARGS   = 0x00000080;
// 0x00001000 表示synthetic(合成)修饰符
static final int SYNTHETIC = 0x00001000;
// 0x00002000 表示annotation(注解)修饰符
static final int ANNOTATION  = 0x00002000;
// 0x00004000 表示enum(枚举)修饰符
static final int ENUM      = 0x00004000;
// 0x00008000 表示mandated(委托)修饰符
static final int MANDATED  = 0x00008000;
```

## 3.反射机制的执行流程

## 4.反射的替代方案

Java 反射机制在某些情况下确实会影响性能,因为反射操作需要进行较多的检查和处理,会导致程序运行速度变慢。常见的替代方案包括:

- 使用字节码操作库,如 ASM、Javassist 等。这些库可以直接操作 Java 字节码,避免了反射的开销,同时也能够实现类似的功能。
- 使用代码生成工具,如 JavaPoet、CGlib 等。这些工具可以根据给定的模板生成 Java 代码,从而在运行时避免反射操作。
- 使用注解处理器,如 Google 的 AutoValue、AutoFactory 等。这些注解处理器可以在编译时生成代码,从而避免了运行时的反射操作。

- 使用反射缓存,将反射操作的结果缓存起来,避免重复的反射操作。这种方式可以在一定程度上提高性能,但需要注意缓存的合理性和更新机制。
