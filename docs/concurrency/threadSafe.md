虽然多线程可以充分利用 CPU 多核特性提升程序执行效率,但是在多个线程并发的操作全局资源时可能会造成并发安全问题(也称为线程安全),在 Java 并发包中提供了大量工具用于解决并发安全问题。

## 1.线程安全

### 1.1 线程安全的概念

**线程安全是指多个线程并发的访问某个资源(Java 对象)时,无论系统如何调度这些线程,也无论这些线程如何交替操作,这个对象都能表现出一致的、正确的行为,那么表示对这个对象的操作是线程安全的**。如果对这个对象的表现不一致、错误的行为,那么说明对这个对象的操作不是线程安全的。简单来说线程安全是多个线程并发性的操作同一共享资源而产生的相同行为,例如相同的逻辑在单线程和多线程场景下执行结果都是一致,则说明多线程的操作是线程安全的,反之就是非线程安全。
**线程安全与线程的原子性、可见性、有序性三个特性相关,想要保证线程安全,必须要确保线程的原子性、可见性、有序性,只要有一个未得到保证,就可能会出现线程安全问题**。 出现线程安全的例子如下:

```java
package com.fly.threadSafe;

public class ThreadSafe01 {
    private static int count = 5;

    public static void decrement() {
        if (count > 0) {
            --count;
            System.out.println(Thread.currentThread().getName() + "正在出售第" + (count + 1) + "张票!");
        }
    }

    public static void main(String[] args) {
        Runnable runnable = () -> {
            while (count > 0) {
                try {
                    decrement();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        Thread thread01 = new Thread(runnable, "线程1");
        Thread thread02 = new Thread(runnable, "线程2");
        thread01.start();
        thread02.start();
    }
}
```

执行结果:

```latex
// 第一次:第四张票被重卖
线程1正在出售第4张票!
线程1正在出售第3张票!
线程1正在出售第2张票!
线程1正在出售第1张票!
线程2正在出售第4张票!

// 第二次:没有重卖
线程1正在出售第5张票!
线程1正在出售第3张票!
线程1正在出售第2张票!
线程1正在出售第1张票!
线程2正在出售第4张票!

// 第三次:第四张票重卖
线程1正在出售第4张票!
线程1正在出售第3张票!
线程1正在出售第2张票!
线程1正在出售第1张票!
线程2正在出售第4张票!
```

从执行结果来看与预期结果不符,上述代码存在重卖现象,表明多个线程操作 count 存在线程安全问题。产生线程安全如下:

- count 作为多个线程操作的共享资源,没有保证有序性和可见性,所以会产生线程安全问题,若要保证线程对共享资源的可见性和有序性,可以通过 volatile 关键字修饰。**volatile 可以保证线程对共享资源的写操作值会写入到主内存,并使其他操作线程的工作内存失效,因此其他线程总能读取到最新值,从而保证线程对共享资源的可见性。volatile 关键字不仅可以保证线程的可见性,也可以禁止 JVM 指令重排序,保证线程的有序性**。
- --count 写操作底层本质上是一个复合运算,底层至少包含三个 JVM 指令:内存取值、寄存器减 1、存值到内存。单个 JVM 指令可以保证原子性,对于多个 JVM 指令的复合操作无法保证原子性。**通过 CAS 可以保证单个变量操作的原子性。**

### 1.2 临界区资源

线程安全地的产生的原因是多线程对同一共享资源写操作从而产生的数据安全问题,解决线程安全的方法有很多,例如 synchronized、加锁、CAS、ThreadLocal 等等。

- **临界区资源**:临界区资源是表示一种可以被多个线程使用的公共资源或共享资源,但是每一次只能有一个线程使用它。一旦临界区资源被占用,使用该资源的其他线程必须等待。并发情况下,临界区资源是受保护的对象。
- **临界区代码段**:临界区代码段是每个线程中访问临街资源的代码段,多个线程必须互斥的对临界区资源进行访问。线程进入临界区代码段前,必须在进入区申请资源,申请成功之后执行临界区代码段,执行完成之后释放资源。
- **竞态条件**:由于在访问临界区代码段时没有互斥的访问而导致的特殊情况。如果多线程在临界区代码段的并发执行结果可能因代码的执行顺序不同而不同,此时说明临界区出现了竞态条件。

### 1.3 自增运算是非线程安全的

```java
package com.fly.threadSafe;

/**
 * 自增运算是非线程安全的
 */
public class ThreadSafe02 {

    /**
     * 开启5个线程,每个线程调用increment()使amount自增1,预期结果为500,如果运行结果
     * 与预期结果不一致则说明产生线程安全问题。
     * @param args
     * @throws InterruptedException
     */
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        Runnable r = () -> {
            for (int i = 0; i < 100; i++) {
                counter.increment();
            }
        };
        for (int i = 0; i < 5; i++) {
            new Thread(r).start();
        }
        // 主线程休眠1s,等待其他线程完成
        Thread.sleep(1000);
        System.out.println("amount:" + counter.getAmount());
    }

    public static class Counter {
        private Integer amount = 0;

        public void increment() {
            amount++;
        }

        public Integer getAmount() {
            return this.amount;
        }
    }
}
```

执行 5 次结果如下:

```latex
amount:478
amount:500
amount:500
amount:468
amount:469
```

预期结果为 500,从执行结果来看说明自增运算会产生线程安全问题。为了了解自增运算的底层细节,可以通过`javac`命令编译.java 文件生成.class 文件,再通过`javap`命令查看反编译查看.class 文件信息。

```java
package com.fly.threadSafe;

public class A {
    private Integer i = 0;

    public static void main(String[] args) {
        A a = new A();
        a.print();
    }

    void print() {
        i++;
    }
}
```

```shell
javac  A.java
javap -verbose A.class
```

```latex
// ...忽略其他指令
  void print();
    descriptor: ()V
    flags: (0x0000)
    Code:
      stack=3, locals=2, args_size=1
         0: aload_0
         1: getfield      #13                 // Field i:Ljava/lang/Integer;
         4: astore_1
         5: aload_0
         6: aload_0
         7: getfield      #13                 // Field i:Ljava/lang/Integer;
        10: invokevirtual #23                 // Method java/lang/Integer.intValue:()I
        13: iconst_1
        14: iadd
        15: invokestatic  #7                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        18: putfield      #13                 // Field i:Ljava/lang/Integer;
        21: aload_1
        22: pop
        23: return
      LineNumberTable:
        line 12: 0
        line 13: 23
```

JVM 指令说明如下:

- aload_0:将局部方法的第一个变量压入操作数栈(读取变量)。
- getfield:访问类实例字段。
- astore_1:将栈顶引用型数值存入第二个本地变量(存储变量)。
- aload_0:将局部方法的第一个变量压入操作数栈。
- aload_0:将局部方法的第一个变量压入操作数栈。
- getfield:访问类实例字段。 invokevirtual:指令用于调用对象的实例方法,根据对象的实际类型进行分派(虚方法分派),支持多态。这也是 Java 语言中最常见的方法分派方式。
- iconst_1:将第二个 int 类型的推到栈顶。
- iadd:将栈顶两 int 型数值相加并将结果压入栈顶。静态变量和局部变量的自增指令也所有不同。
- invokestatic:指令用于调用命名类中的类方法(static 方法)。这是静态绑定的。
- putfield:访问类实例字段(非 static 字段，或者称为实例变量)的指令。
- aload_1:将局部方法的第二个变量压入操作数栈。
- pop:将栈顶的 1 个 slot 数值出栈。
- return:方法返回指令方法调用结束前,需要进行返回。方法的返回值类型不同指令也有所不同,void 对应 return,int、boolean、byte、char、short 类型对应 ireturn 指令,long 类型对应 lreturn 指令,float 类型对应 freturn 指令,double 类型对应 dreturn 指令,引用类型(reference)对应 areturn 指令。

实际上,一个自增运算符是一个复合操作,底层至少包含三个 JVM 指令:内存取值、寄存器增加 1、存值到内存。在 JVM 中单个指令是具备原子性的,两个或两个以上的复合操作会丧失原子性。例如先读后写,有可能在读之后,其实该变量被修改了,导致读和写出现数据不一致的情况。

简单来说自增运算符底层至少包含三个 JVM 指令,虽然 JVM 单个指令能保证原子性,对于多个 JVM 指令的复合操作 JVM 无法保证其原子性,一旦可见性、原子性、有序性三者有其一无法得到保证,就会产生线程安全问题,所以自增运算是非线程安全的。

### 1.4 使用 synchronized 对临界区资源进行排他性保护

synchronized 是解决线程安全的最常用方式之一。**在 Java 中每个 Java 对象都隐含一个锁(Java 中万物皆对象),这把锁称为 Java 内置锁(或对象锁、隐式锁),使用 synchronized(syncObject)相当于获取 syncObject 的内置锁,所以可以使用内置锁对临界区代码段进行排他性保护。多线程并发执行下,这意味同一个时刻仅有一个线程获得锁资源,其他线程阻塞等待获取锁资源的线程释放锁,并行执行变为串行执行(同步执行)**。

**synchronized 是 Java 保留的关键字,有同步方法和同步代码段两种写法,synchronized 修饰的方法被称为同步代码(如果该方法被 static 锁修饰,则被称为静态同步方法),**`**synchronized(syncObject){}**`**修饰的代码片段被称为同步代码段,同步代码段需要显式的指定同步锁对象。syncObject 代表着进入临界区代码段需要获取同步锁对象,由于每个 Java 对象都有一把监视锁,因此任何 Java 对象都可以作为 synchronized 同步块的同步锁。**

```java
// 同步代码写法
public synchronized void syncMethod(){
    // ...code
}
// 同步代码写法,静态同步方法
public synchronized static void syncMethod(){
    // ...code
}
// 同步代码段写法,使用String.class作为锁对象
synchronized(String.class){
    // ...code
}
```

由于 synchronized 通过同步锁保证多个线程同一时刻下保证仅有一个线程执行,其余线程阻塞等待获取锁资源,synchronized 可以解决多线程情况下自增运算产生的线程安全问题。多线程读操作并不会产生线程安全问题,而多线程写操作会产生线程安全问题,所以临界区资源(amount)的写操作方法(increment 方法)添加 synchronized 修饰使其变为同步方法:

```java
package com.fly.threadSafe;

/**
 * synchronized解决多线程情况自增运算产生的线程安全问题
 */
public class ThreadSafe03 {
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        Runnable r = () -> {
            for (int i = 0; i < 100; i++) {
                counter.increment();
            }
        };
        for (int i = 0; i < 5; i++) {
            new Thread(r).start();
        }
        // 主线程休眠1s,等待其他线程完成
        Thread.sleep(2000);
        System.out.println("amount:" + counter.getAmount());
    }

    public static class Counter {
        private Integer amount = 0;

        /**
         * 同步方法。保证多线程情况下同一时刻仅有一个线程才能进行写操作(互斥性),
         * 其他未获取锁资源的线程阻塞等待执行。
         */
        public synchronized void increment() {
            amount++;
        }

        public Integer getAmount() {
            return this.amount;
        }
    }
}
```

执行 5 次结果:

```java
amount:500
amount:500
amount:500
amount:500
amount:500
```

### 1.5 同步方法同步块的区别

- **同步块的粒度更细**。同步方法是一种粗粒度的并发控制,控制粒度是方法级,而同步块是细粒度的并发控制,处于同步块之外的其他代码是可以被多个线程并发访问。
- **同步块需要显示指定锁对象,同步方法的锁是 this 锁**。**在 Java 内部实现上,同步方法实际上等同于用一个 synchronized 块,该同步块包含了同步方法中的所有代码,并使用 this 对象作为进入临界区的同步锁**。

```java
public synchronized void increment(){
    amount++;
}

// 等同于
public void increment(){
    // 使用this锁
    synchronized(this){
        amount++;
    }
}
```

- **静态同步方法使用的是当前类的 Class 对象监视锁。Java 对象分为 Object 实例和 Class 对象,每个类运行时的类型信息使用 Class 对象表示,Class 对象包含类名称、继承关系、字段、方法等信息。JVM 运行后所有类在第一次被使用时被类加载器根据类的全限定名查找.class 文件,验证后动态的加载到 JVM 的方法区(懒加载),并为其创建一个 Class 对象(唯一的)。Class 类没有公共的构造方法,Class 对象是在类加载时由虚拟机调用类加载器的 defineClass 方法自动构造的,因此无法显式地声明一个 Class 对象。由于静态方法无法访问 Object 实例的 this 引用,static 修饰的同步方法无法获得 Object 实例的 this 对象的监视锁。实际上使用 synchronized 修饰静态方法时,同步锁并不是普通 Object 对象的监视锁,而是当前类对应的 Class 对象的监视锁。**

### 1.6 死锁现象

#### 1.6.1 死锁案例

#### 1.6.2 诊断死锁

### 1.7 synchronized 使用注意事项

- synchronized 关键字不能修饰 int、double 等基本类型。
- synchronized 应避免修饰 String、Integer 等基础数据类型对象,如果基本数据类型对象的值发生改变,可能会造成已加的同步锁会丢失。
- synchronized 关键字修饰对象时,如果对象的属性值发生变化并不会影响锁的稳定。
- 避免多个线程同时竞争同一把锁。如果多个线程同时竞争同一把锁。

## 2.线程的三大特性

原子性、可见性、有序性是并发编程所面临的三大问题,Java 通过 CAS 操作可以解决原子性问题,通过 volatile 可以解决线程的可见性和有序性问题。

### 2.1 CPU 缓存结构

由于 CPU 的运算速度比主内存的存取速度快很多(CPU 运算速度 > 内存读写速度 > 磁盘 IO 读写速度,通常是几十倍,甚至几百几千倍的差距),为了提高处理速度,现代 CPU 不直接与主内存进行通信,而是在 CPU 和主内存之间设计多级 Cache(高速缓存),越靠近 CPU 的高速缓存越快,容量也越小。由于 CPU 内核和缓存的增加,不同的 CPU 内核都有独立的高速缓存,导致了线程的可见性和有序性。

按照数据的读取顺序和 CPU 内核的紧密程度,CPU 的高速缓存分为 L1(一级高速缓存)和 L2(二级高速缓存)
缓存,部分高端 CPU 还包含 L3 缓存。每一级高速缓存中所存储的数据都是下一级高速缓存的一部分,越靠近 CPU 的高速缓存读写越快,容量也越小。L1 和 L2 缓存相对来说虽然读写速度很快,容量很快,但仍然只能被一个单独的 CPU 内核使用,而 L3 在现代多核 CPU 中更普遍,容量更大、读写速度慢,但可以被同一 CPU 芯片板上的所有 CPU 内核共享,而且 L3 高速缓存读写数据的命中率可达 95%,也就是说只有不到 5%的数据需要从主内存读取。
高速缓存大大缩小了高速 CPU 内核与低速主内存之间的处理速度差距。以三层高速缓存架构为例:

- L1 高速缓存离 CPU 最近,容量小(如 32kb、64kb 等),存取速度快,每个 CPU 内核上都有一个 L1 高速缓存。
- L2 高速缓存存储容量更大(如 256kb),相对 L1 高速缓存慢一些,通常情况下,每个 CPU 内核都有一个独立的 L2 高速缓存。
- L3 高速缓存是离主内存最近,容量最大(如 12MB)、读写最慢,由在同一个 CPU 芯片板上的不同 CPU 内核共享。

CPU 采用高速缓存读写数据具有如下优点:

- 写缓存区可以保证指令流水线持续运行,可以避免由于 CPU 停顿下来等待向内存写入数据而产生的延迟。
- 通过以批处理的方式刷新写缓存区,以及合并写缓存区中对同一内存地址的多次写操作,减少对内存总线的占用。

### 2.1 原子性问题

所谓原子操作,就是"不可中断的一个或一系列操作"(例如关系型数据库的事务保证了原子性),是指不会被线程调度机制打断的操作。这个操作一旦开始,就一直运行到结束,中间不会有任何线程的切换。

### 2.2 可见性问题

一个线程对共享资源的修改,另一个线程能够立刻可见,说明该共享资源具备内存可见性。在 Java 中内存的可见性与 JMM(Java Memory Model,即 Java 内存模型)有关,JMM 规定所有的变量都存放在公告主内存中,当线程使用变量时会把主内存中的变量复制到线程的工作空间(或者叫做私有内存、线程本地内存),线程对共享变量的读写操作,仅仅是对线程本地内存中变量副本操作。

与全局变量不同的是,Java 局部变量和方法参数不存在内存可见性问题,在 Java 中,所有局部变量和方法参数都存储在 JVM(Java 虚拟机)栈中,不会在线程之间共享,所以不会产生内存可见性问题。而所有的 Object 实例、Class 实例和数组元素都存储在 JVM 的堆内存中,堆内存允许线程之间相互共享,所以存在线程可见性问题。

### 2.3 有序性问题

所谓程序的有序性是指程序安装代码的先后顺序执行。如果程序执行的顺序与代码的先后顺序不同,并导致了错误的结果,则发生了有序性问题。

## 3.解决可见性和有序性

### 3.1 MESI 协议解决可见性

### 3.2 内存屏障解决有序性问题
