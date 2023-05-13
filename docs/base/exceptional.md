Java 异常机制是一种用于处理程序运行过程中出现的错误或异常情况的机制。它提供了一种结构化的方式来处理和传递异常,使得程序能够优雅地处理异常并维护代码的可靠性。

## 异常架构图

### Throwable

Throwable 是 Java 语言中所有错误与异常的超类。Throwable 包含 Error(错误)和 Exception(异常)两个子类,它们通常用于指示发生了异常情况。Throwable 包含了其线程创建时线程执行堆栈的快照,它提供了 printStackTrace() 等接口用于获取堆栈跟踪数据等信息。

### Error

在 Java 中,Error 类是 Throwable 类的子类,用于表示严重错误,通常是由于系统或其他 JVM 问题引起的。与 Exception 不同,Error 通常是无法恢复的,因此在处理 Error 时,通常是将其抛出并让程序终止。常见的 Error 类型包括:

- OutOfMemoryError:内存不足错误,通常是由于程序耗尽了可用内存引起的。
- StackOverflowError:栈溢出错误,通常是由于递归调用过程中出现无限循环引起的。
- NoClassDefFoundError:类定义未找到错误,通常是由于类路径问题引起的。
- LinkageError:链接错误,通常是由于编译和链接问题引起的。
- AssertionError:断言错误,通常是由于使用断言机制检查程序错误性时出现的错误。

### Exception

在 Java 中,Exception 类是 Throwable 类的子类,用于表示程序运行时出现的异常情况。Exception 类通常是可以被捕获并处理的,因此程序通常会尝试在遇到异常时进行恢复,而不是直接终止。Exception 可以分为两大类型:

- 编译时异常(Checked Exception):这类异常通常发生在编译时,需要在代码中进行处理。例如,IOException、SQLException 等。这些异常通常是由外部因素引起的,比如磁盘读写错误或数据库连接失败等,需要程序进行适当的恢复或提示用户解决问题。

- 运行时异常(Runtime Exception):这类异常通常是由程序逻辑错误引起的,比如空指针引用、除以零等。与编译时异常不同,运行时异常不需要在代码中进行处理,通常是由程序员错误引起的,需要通过代码调试和修复来解决。

## 异常基础

### 异常类型

### 异常关键字

- try 用于监听。将要被监听的代码(可能抛出异常的代码)放在 try 语句块之内,当 try 语句块内发生异常时,异常就被抛出。
- catch 用于捕获异常。catch 用来捕获 try 语句块中发生的异常。
- finally 语句块总是会被执行。它主要用于回收在 try 块里打开的物力资源(如数据库连接、网络连接和磁盘文件)。只有 finally 块,执行完成之后,才会回来执行 try 或者 catch 块中的 return 或者 throw 语句.如果 finally 中使用了 return 或者 throw 等终止方法的语句,则就不会跳回执行,直接停止。
- throw:throw 关键字用于抛出异常。
- throws:throws 关键字只能用在方法签名中,用于声明该方法可能抛出的异常。

### 使用 throws 声明异常

### 使用 throw 抛出异常

### 自定义异常

### 异常的捕获

异常捕获处理的方法通常有:

- try-catch。
- try-catch-finally。
- try-finally。
- try-with-resource。

#### try-catch

在一个 try-catch 语句块中可以捕获多个异常类型,并对不同类型的异常做出不同的处理。

```java
private static void readFile(String filePath) {
    try {
        // code
    } catch (FileNotFoundException e) {
        // handle FileNotFoundException
    } catch (IOException e){
        // handle IOException
    }
}
```

::: details catch 捕获多个异常
catch 捕获多个异常时,可以使用|分割多个异常。

```java
private static void readFile(String filePath) {
    try {
        // code

    } catch (FileNotFoundException | UnknownHostException e) {
        // handle FileNotFoundException or UnknownHostException
    } catch (IOException e){
        // handle IOException
    }
}
```

:::

#### try-with-resource

## 异常实践

### 只针对不正常的情况才使用异常

### 在 finally 块中清理资源或者使用 try-with-resource 语句

### 尽量使用标准的异常

### 对异常进行文档说明

### 优先捕获最具体的异常

### 不要捕获 Throwable 类

### 不要忽略异常

### 不要记录并抛出异常

### 包装异常时不要抛弃原始的异常

### 不要使用异常控制程序的流程

### 不要在 finally 块中使用 return

try 块中的 return 语句执行成功后,并不会马上返回,而是继续执行 finally 块中的语句,如果此处存在 return 语句,则在此直接返回,会无情丢弃掉 try 块中的返回点。

```java
private int x = 0;
public int checkReturn() {
    try {
        // x等于1,此处不返回
        return ++x;
    } finally {
        // 返回的结果是2
        return ++x;
    }
}
```
