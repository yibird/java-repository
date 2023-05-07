## 1.多线程简介

### 1.1 进程、线程、协程的概念

- 进程:进程是指在系统中正在运行的一个应用程序,程序一旦运行就是进程。**进程是系统进行资源分配的独立实体, 且每个进程拥有独立的地址空间**。例如运行在电脑上的钉钉、QQ 就是一个进程,一个进程可以包含数百个线程。
- 线程:**线程是操作系统进行运算的最小调度单位,一个进程中可以包含多个线程**。与进程不同的是同类的多个线程共享进程的堆和方法区资源,但每个线程有自己的程序计数器、虚拟机栈和本地方法栈,所以系统在产生一个线程,或是在各个线程之间作切换工作时,负担要比进程小得多,也正因为如此,线程也被称为轻量级进程。线程拥有独立的内存空间,当线程需要获取其他线程的数据就需要线程通讯,线程下面还有更轻量的协程,一个线程可以包含数百个协程,go 语言中 Goroutine 就是协程的实现。
- 协程:是一种基于线程之上,但又比线程更加轻量级的线程(协程又被称为 Fiber,即纤程),这种由开发者写程序来管理的轻量级线程叫做用户空间线程,具有对内核来说不可见的特性。协程拥有自己的寄存器上下文和栈。协程调度切换时,将寄存器上下文和栈保存到其他地方,在切换回来的时候,恢复先前保存的寄存器上下文和栈。由于协程的暂停完全由程序控制,发生在用户态上;而线程的阻塞状态是由操作系统内核来进行切换,发生在内核态上。因此,协程的开销远远小于线程的开销,也就没有了 ContextSwitch 上的开销。例如 Golang 的 goroutine 和 JDK19 的虚拟线程都属于协程的经典例子。

线程与协程的对比如下:

| 比较项   | 线程                                                                       | 协程                                                                                                                              |
| -------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 占用资源 | 初始单位为 1MB,固定不可变                                                  | 初始一般为 2KB，可随需要而增大                                                                                                    |
| 调度所属 | 由 OS 的内核完成                                                           | 由用户完成                                                                                                                        |
| 切换开销 | 涉及模式切换(从用户态切换到内核态)、16 个寄存器、PC、SP...等寄存器的刷新等 | 只有三个寄存器的值修改 - PC / SP / DX                                                                                             |
| 性能问题 | 资源占用太高，频繁创建销毁会带来严重的性能问题                             | 资源占用小,不会带来严重的性能问题                                                                                                 |
| 数据同步 | 需要用锁等机制确保数据的一直性和可见性                                     | 不需要多线程的锁机制,因为只有一个线程,也不存在同时写变量冲突,在协程中控制共享资源不加锁,只需判断状态,所以执行效率比多线程高很多。 |

### 1.2 多线程的优缺点

多线程的优点:

- **发挥 CPU 多核的优势,CPU 资源率利用更好**。得益于现代计算机的蓬勃发展,现代计算机大多数采用多核架构(例如 4 核、8 核、16 核处理器),由于线程是基本的调度单位,如果在程序中只有一个线程,那么最多同时只能在一个核心处理器上运行,其他核心处理器处于空闲状态,无法发挥 CPU 多核优势。例如在 4 核的处理器上运行单线程任务,CPU 空闲率为 75%,其余三个核心处理器都处于空闲状态,所以单线程无法发挥 CPU 多核优势。
- **易于建模**。使用多线程可以将一个复杂且异步的工作流进一步分解为一组简单且同步的工作流,每个工作流在一个单独的线程运行,并在特定的同步位置进行交互。
- **防止阻塞(异步或并行执行),提高性能**。程序执行效率来看,单核 CPU 并不能发挥多线程的优势,反而在单核 CPU 运行的多线程导致线程上下文的切换,从而影响执行效率。假设单核 CPU 使用单线程执行某个任务,如果一旦该线程发生阻塞就会影响后续任务的执行效率,而使用多线程并行执行任务能解决线程的阻塞。

多线程的缺点:

- **增加资源消耗**。线程在运行的时,需要从计算机里获取一些资源,除了 CPU,线程还需要一些内存来维持它本地的堆栈,还需要占用操作系统中的一些资源来管理线程。多线程也会增加上下文切换的开销,当 CPU 从执行一个线程切换到另外一个线程的时候,它需要存储当前线程的本地数据,程序指针等,然后载入另一个线程的本地数据,程序指针等,最后才开始执行,这种切换称为"上下文切换"CPU 会在一个上下文中执行一个线程,然后切换到另外一个上下文中执行另一个线程。上下文的切换非常耗费系统资源,如果没有必要,应该减少上下文切换的发生。频繁地线程上下文切换,有时候多线程的执行效率远不如单线程。
- **多线程可能会造成线程安全问题**。多个线程共享同一全局资源时,可能会发生数据安全问题,操作后的数据与预期数据不符,这就是线程安全问题。线程安全问题的解决办法有同步机制(synchronized)、线程本地存储(ThreadLocal)、加锁等方案。

### 1.3 同步与异步、并发与并行、阻塞与非阻塞的概念

- **同步**:**同步是指执行多个任务时,任务按照串行顺序执行,当前任务执行完毕后才会执行下一个任务,如果当前任务未执行完毕,其余任务都会阻塞等待,直到该任务执行完成**。所以同步执行中间会产生阻塞,从而影响程序执行效率。同步执行最直观的例子就是接力棒比赛,第一个选手拿到接力棒奔跑,奔跑至目标终点后将接力棒传递给一下选手,循环此过程直到到达最终终点,如果选手未获得接力棒,则需要原地等待,直到获取到接力棒才会运行。

- **异步**:**异步是指执行多个任务时,任务不一定按照顺序串行执行,执行任务不需要等待其他任务执行完成,执行过程中不会阻塞其他任务**。由于异步执行过程中无需等待其他任务执行完毕,执行过程中是非阻塞的,通常异步的执行效率优于同步,而多线程是实现异步的手段之一。

- **并发**:并发是指在同一时间间隔内有多个任务在执行,这些任务可以是由一个程序管理的一组并行任务,也可以是由不同程序并行运行的多个任务。在单处理器系统中,通过时间片轮转等方式实现多个任务在同一处理器上交替执行。简单来说,如果是多个任务在同一处理器上交替执行,就是并发。

- **并行**:并行是指多个计算机、处理器或者线程同时执行不同的任务或者同一个任务的不同部分,它是利用多个处理器同步工作的能力,同时完成多个任务或者同一个任务的不同部分。在多处理器系统中,通过进程间通信和同步机制实现多个任务的并行执行。简单来说,如果是多个任务在不同处理器上同时执行,就是并行。

- **阻塞**:阻塞是指调用一个任务时,如果该任务无法立即返回,那么调用者就会一直等待任务返回结果,期间无法做其他事情。在阻塞状态下,程序会一直等待,直到所需的资源或者操作可用为止,因此阻塞会应用程序的响应速度,在开发中应尽量避免阻塞应用程序。简单来说,在阻塞模式下,程序会一直等待结果的返回。

- **非阻塞**:非阻塞是指调用一个任务时,如果该任务无法立即返回,调用者会立即获得一个错误码或者空数据(NULL)，同时程序不会阻塞,可以继续执行其他任务。在非阻塞状态下,程序可以继续执行其他任务,而不必等待所需的资源或者操作可用。简单来说,非阻塞是轮询,而在非阻塞模式下,程序会不停地查询任务的结果是否返回。

### 1.4 多线程调度原理

## 2.线程基础

### 2.1 创建线程的四种方式

Java 进程中每一个线程都对应着一个 Thread 实例,线程的描述信息保存在 Thread 的实例属性上,用于 JVM 进行线程管理和调度。Java 提供了四种方式用于创建线程:

- **继承 Thread 类重写 run()创建线程**。
- **实现 Runnable 接口重写 run()创建线程**。
- **实现 Callable 接口重写 call()或 FutureTask 创建线程**。
- **基于线程池创建线程**。

#### 2.1.1 继承 Thread 类

一个线程在 Java 中使用一个 Thread 实例来描述。Thread 类是 Java 语言的一个重要的基础类,位于 java.lang 包中。Thread 类提供了线程相关的属性或方法,用于存储或操作线程的描述信息。
通过继承 Thread 重写 run()可以创建一个线程,Thread()的 run()仅描述创建线程的执行任务内容,Thread 的 start()用于启动线程。

```java
package com.fly.base;

public class Thread01 extends Thread {

    /**
     * 继承Thread类重写Thread类的run(),run()用于描述线程的执行任务内容,
     * Thread的start()用于启动线程。
     */
    @Override
    public void run() {
        // 获取当前执行线程实例
        Thread thread = Thread.currentThread();
        System.out.println("当前执行线程id(tid):"+thread.getId());
        // 若不显示指定线程名称,默认以 "Thread-" + 线程下标(从0为开启下标)命名
        System.out.println("当前执行线程名称:"+thread.getName());
        System.out.println("当前执行线程状态:"+thread.getState());
        // Java线程的优先级分为1到10,默认优先级为5,优先级高不能线程的执行优先级
        System.out.println("当前执行线程优先级:"+thread.getPriority());
    }

    public static void main(String[] args) {
        Thread01 t01 = new Thread01();
        // 启动线程
        t01.start();
    }
}
```

执行结果:

```latex
当前执行线程id(tid):11
当前执行线程名称:Thread-0
当前执行线程状态:RUNNABLE
当前执行线程优先级:5
```

注意:由于 Java 不支持多继承(Java 类仅能继承一个类),继承 Thread 类创建线程的方式会限制类的继承,在开发环境中和生产环境都不推荐使用。

#### 2.1.2 实现 Runnable 接口

由于继承 Thread 类创建线程会限制类的继承,但 Thread 类提供了`public Thread(Runnable target)`
和 `public Thread(Runnable target,String name)`两个构造函数,支持传入 Runnable 实例创建线程。
Runnable 接口是一个极为简单的空接口(只有一个抽象方法的接口),位于 java.lang 包中。Runnable 中仅有一个抽象方法——void run(),用于描述创建线程的执行任务内容。当 Runnable 实例传入 Thread 构造函数后,Runnable 接口的 run()将被异步调用。

```java
// Runnable接口源码
package java.lang;
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

基于 Runnable 接口创建线程,下面介绍了 Runnable 普通、匿名内部类、lambda 三种写法。

```java
package com.fly.base;

/**
 * 实现Runnable接口重写run()创建线程
 */
public class Thread02 implements Runnable {

    @Override
    public void run() {
        System.out.println("===== 普通写法 =====");
        Thread thread = Thread.currentThread();
        System.out.println("当前执行线程id(tid):" + thread.getId());
        System.out.println("当前执行线程名称:" + thread.getName());
        System.out.println("当前执行线程状态:" + thread.getState());
        System.out.println("当前执行线程优先级:" + thread.getPriority());
    }

    public static void main(String[] args) {
        Thread02 t = new Thread02();
        // 普通写法:传入Runnable实例通过Thread构造方法创建方法
        Thread thread01 = new Thread(t);
        // 调用start()启动线程后会执行Runnable接口的run()
        thread01.start();

        // 匿名内部类写法
        Thread thread02 = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println();
                System.out.println("===== 匿名内部类写法 =====");
                Thread thread = Thread.currentThread();
                System.out.println("当前执行线程id(tid):" + thread.getId());
                System.out.println("当前执行线程名称:" + thread.getName());
                System.out.println("当前执行线程状态:" + thread.getState());
                System.out.println("当前执行线程优先级:" + thread.getPriority());
            }
        });
        thread02.start();

        // lambda写法。由于Runnable接口是一个函数式接口(有且只有一个抽象方法的接口),支持使用lambda表达式写法
        new Thread(() -> {
            System.out.println();
            System.out.println("===== lambda写法 =====");
            Thread currentThread = Thread.currentThread();
            System.out.println("当前执行线程id(tid):" + currentThread.getId());
            System.out.println("当前执行线程名称:" + currentThread.getName());
            System.out.println("当前执行线程状态:" + currentThread.getState());
            System.out.println("当前执行线程优先级:" + currentThread.getPriority());
        }).start();
    }
}
```

执行结果:

```latex
===== 普通写法 =====
当前执行线程id(tid):11
当前执行线程名称:Thread-0
当前执行线程状态:RUNNABLE
当前执行线程优先级:5

===== 匿名内部类写法 =====
当前执行线程id(tid):12
当前执行线程名称:Thread-1
当前执行线程状态:RUNNABLE
当前执行线程优先级:5

===== lambda写法 =====
当前执行线程id(tid):13
当前执行线程名称:Thread-2
当前执行线程状态:RUNNABLE
当前执行线程优先级:5
```

使用 Runnable 创建线程的缺点:

- **所创建的类并不是线程类,而是线程的 target 目标执行类**。使用 Runnable 创建线程时需要将 Runnable 实例作为参数传入 Thread 类的构造器,才能真正执行线程。
- **无法直接访问 Thread 的实例方法**。如果想要访问或控制当前线程的属性,不能直接访问 Thread 的实例方法,必须通过`Thread.currentThread()`获取当前执行线程实例,才能访问或控制当前线程。

使用 Runnable 创建线程的优点:

- **可以避免由于 Java 单继承带来的局限性**。
- **逻辑和数据更好的分离**。通过实现 Runnable 接口的方法创建多线程更加适合同一个被多个业务逻辑并行处理的场景。
  在同一个资源被多个线程逻辑异步、并行处理的场景中,通过实现 Runnable 接口的方式设置多个 target 目标执行类可以更加方便、清晰地将执行逻辑和数据存储返利,更好地体现了面向对象的设计思想。

#### 2.1.3 实现 Callable 或 FutureTask

虽然 Runnable 接口能够避免 Java 单继承创建线程,但是 Runnable 接口 run()没有返回值,Runnable 并不适合需要返回值的场景。Java 在 JDK1.5 版本后提供了一种新的创建线程的方式,即通过 Callable 接口或 FutureTask 类相结合创建线程。

##### 2.1.3.1 Callable 接口

Callable 接口位于 java.util.current 包下,Callable 既是一个泛型接口又是一个函数式接口。Callable 接口中仅包含 call()一个抽象方法,与 Runnable 接口的 run()不同的是,call()具有返回值,返回值类型为 Callable 接口的泛型形参。除此之外 call()还具有 Exception 异常声明,允许方法内部直接抛出异常,并且可以无需捕获异常。

```java
package java.util.concurrent;
// Callable源码
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}
```

Callable 接口与 Runnable 接口创建线程的区别在于:

- **重写方法不同。Runnable 接口创建线程需要重写 run(),Callable 接口创建线程需要重写 call()。**
- **方法返回值不同。Runnable 接口的 run()无返回值,Callable 接口的 call()有返回值,返回值类型取决于 Callable 接口的泛型参数。**
- **call()内部支持抛出异常,run()内部不支持抛出异常。**

##### 2.1.3.2 RunnableFuture 接口

Thread 构造器仅支持 Runnable 实例执行目标线程,并不支持 Callable 接口。为了使 Thread 构造器支持 Callable 接口执行目标线程,Java 提供了 RunnableFuture 接口,RunnableFuture 是一个桥接接口,它位于 java.util.concurrent 包下,该接口与 Runnable 接口和 Thread 密切相关,它实现继承了 Runnable 和 Future 两个接口。RunnableFuture 接口实现两个目标:**一可以作为 Thread 线程实例的 target 实例,二是可以获取异步执行结果**。

```java
package java.util.concurrent;
// RunnableFuture源码
public interface RunnableFuture<V> extends Runnable, Future<V> {
    void run();
}
```

**RunnableFuture 继承了 Runnable 接口,从而保证了其实例可以作为 Thread 线程实例的 target 目标;同时 RunnableFuture 又继承了 Future 接口,保证了可以获取未来的异步执行结果。**

##### 2.1.3.3 Future 接口

Future 是异步计算结果的容器接口,它提供了如下功能:

- 能够取消异步执行的任务。
- 判断异步任务是否执行完成。
- 获取异步任务完成后的执行结果。

```java
package java.util.concurrent;
// Future源码
public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);
    boolean isCancelled();
    boolean isDone();
    V get() throws InterruptedException, ExecutionException;
    V get(long timeout, TimeUnit unit)
            throws InterruptedException, ExecutionException, TimeoutException;
}
```

Future 接口方法说明:

- cancel():取消异步任务执行。
- isCancelled:获取异步任务的取消状态。如果任务完成前被取消,就返回 true。
- isDone():获取异步任务的执行状态。如果任务执行结束,就返回 true。
- get():获取异步任务的执行结果。注意:该方法具有阻塞性。如果异步任务没有执行完成,获取异步结果则线程会被一直阻塞,一直阻塞到异步任务执行完成,其异步结果返回给调用线程。
- get(long timeout, TimeUnit unit):支持设置阻塞时间阻塞性的获取异步任务的执行结果。该方法也是阻塞性的,但在获取异步结果时会有一个阻塞时长限制,不会无限制的阻塞等待,如果其阻塞时间超过设置的 timeout 时间,该方法将抛出异常。

Future 是一个对异步任务进行交互、操作的接口,通过它无法直接完成对异步任务的操作,好在 JDK 提供了 FutureTask 类,FutureTask 是 Future 接口的默认实现类。

##### 2.1.3.4 FutureTask 类

FutureTask 类是 Future 接口的实现类,提供了对异步任务的操作和具体实现。FutureTask 不仅实现了 Future 接口,也实现了 RunnableFuture 接口,FutureTask 类才是 Thread 类和 Callable 接口之间桥接类。
FutureTask 类中有两个比较重要的属性:

- `private Callable<V> callable`:callable 属性用于保存并发执行的 Callable 类型的任务,并且 callable 实例属性需要在 FutureTask 实例构造时进行初始化。FutureTask 类实现了 Runnable 接口,在该类的 run()中会执行 callable 成员的 call()。
- `private Object outcome`:outcome 属性用于保存 callable 成员 call()方法执行的异步执行结果。在 FutureTask 类的 run()完成 callable 成员的 call()执行后,其结果将被保存在 outcome 属性中,供 FutureTask 类的 get()获取。

##### 2.1.3.5 使用 Callable 结合 FutureTask 创建线程

```java
package com.fly.base;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

/**
 * 基于Callable接口重写call()创建线程
 */
public class Thread03 {

    /**
     * 创建静态内部类,基于Callable接口重写call()创建线程
     */
    static class ReturnableTask implements Callable<Long> {
        private static final long NUMBER = 100000000;
        @Override
        public Long call() throws Exception {
            long startTime = System.currentTimeMillis();
            System.out.println("当前执行线程:" + Thread.currentThread().getName());
            // 当前线程休眠1000ms
            Thread.sleep(1000);
            for (int i = 0; i < NUMBER ;i++){
                int j = i *1000;
            }
            long used = System.currentTimeMillis() - startTime;
            return used;
        }
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // (1).构造一个Callable接口实例
        ReturnableTask task = new ReturnableTask();
        // (2).将Callable实例作为FutureTask的构造函数创建一个FutureTask实例
        FutureTask<Long> futureTask = new FutureTask<>(task);
        // (3).将FutureTask实例作为Thread构造器的target
        Thread thread = new Thread(futureTask);
        // (4).启动线程
        thread.start();
        // (5).通过FutureTask实例获取Callable接口call()执行结果
        System.out.println("线程执行结果:"+futureTask.get());
    }
}
```

执行结果:

```latex
当前执行线程:Thread-0
线程执行结果:1040
```

- futureTask 的 outcome 属性不为空,callable 的 call()执行完成。在这种情况下 futureTask.get()会直接返回 outcome 的结果,并返回给 main 线程(获取异步结果线程)。
- futureTask 的 outcome 属性为空,callable 的 call()未执行完。在这种情况下,main 作为获取异步结果线程会被阻塞住,一直阻塞到 callable.call()执行完成。当异步任务执行完成后,最终结果会被保存到 outcome 中,futureTask 会唤醒 main 线程,去获取 callable.call()的执行结果。

#### 2.1.4 基于线程池创建线程

基于 Thread 类、Runnable 接口、Callable 接口创建的线程是不可复用的。实际上创建一个线程实例在时间成本、资源消耗都很高,为了在高并发场景下,避免因创建和销毁线程导致的资源消耗,Java 基于池化技术提供了线程池。**线程池可以复用线程,减少因创建或销毁线程带来的开销,且可以更好管理线程**。Java 内部提供了一个静态工厂类创建不同的线程池,该静态工厂为 Executors 工厂。

```java
package com.fly.base;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * 基于线程池创建线程。
 */
public class Thread04 {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 创建一个具有缓存功能的线程池
        ExecutorService pool = Executors.newFixedThreadPool(3);

        // 执行一个线程。execute仅支持Runnable接口,不支持Callable接口,且execute()无返回值
        pool.execute(() -> {
            System.out.println("execute:基于线程池创建线程");
        });

        // 提交并执行一个线程。submit即支持Runnable接口,又支持Callable接口,submit()返回值
        Future<String> future = pool.submit(() -> "submit:基于线程池创建线程");
        System.out.println("异步执行结果:"+future.get());

        // 关闭线程池
        pool.shutdown();
    }
}
```

:::danger
注意:虽然 Executors 框架内置了四种线程池,但实际禁止使用 Executors 创建线程池,这是因为 Executors 创建的线程池可能会导致 OOM(内存溢出)。
:::

#### 2.1.5 总结

Java 提供四种方式用于创建线程:

- **通过继承 Thread 重写 run()创建线程**。由于 Java 仅支持单继承,会导致类继承的局限性。无论是开发还是生产都不推荐继承 Thread 创建线程。
- **通过实现 Runnable 接口重写 run()方法创建线程**。实现 Runnable 接口创建线程可以避免 Java 单继承限制,逻辑跟数据更好的分离;但 Runnable 接口的 run()无返回值,仅适用于执行任务无需返回值的场景。
- **通过实现 Callable 接口重写 call()方法创建线程**。由于 Thread 构造器只支持 Runnable 接口实例作为执行目标线程,通过搭配 FutureTask 类创建线程,FutureTask 类实现了 Runnable 和 Future 接口,Future 是一个对异步任务进行交互、操作的接口,
  支持取消异步任务、判断异步任务状态、获取异步任务执行结果。Runnable 接口与 Callable 接口的区别如下:
  - **重写方法不同**。Runnable 接口创建线程需要重写 run(),Callable 接口创建线程需要重写 call()。
  - **方法返回值不同**。Runnable 接口的 run()无返回值,Callable 接口的 call()有返回值,返回值类型取决于 Callable 接口的泛型参数。
  - **异常处理机制不同**。call()内部支持抛出异常,run()内部不支持抛出异常。call()提供了 Exception 异常声明,方法内部可捕获该异常。
- **基于线程池创建线程**。由于前三种方式无法复用线程,且在高并发情况下,频繁创建或销毁线程资源开销比较大,Java 基于池化技术提供了线程池。**线程池可以复用线程,避免因创建或销毁线程所带来的额外开销,也易于线程的管理**。**Java 中内置 Executors 工厂类创建线程池,但在生成环境中推荐使用**`**ThreadPoolExecutor**`**创建线程池,因为 Executors 创建线程池可能会导致 OOM(内存溢出),从而产生资源耗尽的风险。**

### 2.2 线程的优先级

Thread 类中使用 priority 属性描述线程的优先级,通过 Thread 的`getPriority()`获取线程的优先级,通过 Thread 类的`setPriority(int priority)`设置线程的优先级。Thread 类中线程默认优先级为 5,对应类常量是 NORM_PRIORITY。线程优先级最高为 10,最小值为 1,分别对应类常量 MIN_PRIORITY 和 MAX_PRIORITY,Thread 类优先级常量定义如下:

```java
public final static int MIN_PRIORITY = 1;
public final static int NORM_PRIORITY = 5;
public final static int MAX_PRIORITY = 10;
```

Java 使用抢占式调度模型进行线程调度,priority 实例属性优先级越高,线程获得 CPU 的时间片机会也就越多,但并非绝对。

```java
package com.fly.base;

/**
 * 线程优先级,Thread通过priority属性描述线程的优先级,通过Thread实例的getPriority()可以获取
 * 线程的优先级,通过Thread实例的setPriority()可以设置线程的优先级。
 * Thread线程默认优先级为5,最大优先级为10,最小优先级为1,在Thread分别用MIN_PRIORIT、
 * NORM_PRIORITY、MAX_PRIORITY常量分别表示。Java采用抢占式调度模型,虽然线程优先级越高,
 * 线程获得CPU的时间片机会也就越多,并实际运行中并非绝对。
 */
public class Thread05 {
    // 线程睡眠间隔时间
    public static final int SLEEP_GAP = 1000;

    static class PriorityThread extends Thread {
        // 线程编号
        static int threadNo = 1;
        // 机会值变量,机会值越大获得CPU时间片的机会就越大
        public long num;

        public PriorityThread() {
            // 调用父类Thread的构造方法设置线程名称
            super("thead-" + threadNo);
            threadNo++;
        }

        @Override
        public void run() {
            for (int i = 0; ; i++) {
                num++;
            }
        }
    }
    public static void main(String[] args) throws InterruptedException {
        PriorityThread[] threads = new PriorityThread[10];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new PriorityThread();
            // 设置线程优先级
            threads[i].setPriority(i + 1);
        }
        for (int i = 0; i < threads.length; i++) {
            threads[i].start();
        }
        // 线程睡眠
        Thread.sleep(SLEEP_GAP);
        for (int i = 0; i < threads.length; i++) {
            // 停止线程(stop方法已过期且不安全,不推荐使用该种方式关闭线程)
            threads[i].stop();
        }
        for (int i = 0; i < threads.length; i++) {
            System.out.println(threads[i].getName() + "-优先级:" + threads[i].getPriority() + "-机会值:" + threads[i].num);
        }
    }
}
```

执行结果:

```latex
thead-1-优先级:1-机会值:274596601
thead-2-优先级:2-机会值:270267110
thead-3-优先级:3-机会值:281260228
thead-4-优先级:4-机会值:281473258
thead-5-优先级:5-机会值:278484203
thead-6-优先级:6-机会值:273353098
thead-7-优先级:7-机会值:271050722
thead-8-优先级:8-机会值:268031410
thead-9-优先级:9-机会值:259258634
thead-10-优先级:10-机会值:257751205
```

线程的执行时机具有随机性,并不是优先级越高就一定优先级执行或执行机会越多。

### 2.3 线程状态

Java 线程的生命周期分为 6 种状态。Thread 类有一个实例属性和一个实例方法专门用于保存和获取线程状态。

```java
// 以整数的形式存储线程的状态
private int threadStatus;
// 返回当前线程的状态,一个枚举类型值
public Thread.State getState();
```

Thread.State 是 Thread 类内部的一个枚举类,它定义了 6 个枚举常量,分别代表了 Java 线程的 6 种状态:

```java
public enum State {
  // 新建
  NEW,
  // 运行
  RUNNABLE,
  // 阻塞
  BLOCKED,
  // 等待
  WAITING,
  // 限时等待
  TIMED_WAITING,
  // 终止
  TERMINATED;
}
```

Thread.State 虽然定义了 6 种状态,但只有 NEW(新建)、RUNNABLE(运行)、TIMED_WAITING(限时等待)、TERMINATED(终止)四种是最为常见的状态。

#### 2.3.1 NEW 状态

Thread 源码对 NEW 状态的解释:创建线程成功但是未调用 start()启动线程的 Thread 实例都处于 NEW 状态。注意:并不是 Thread 实例调用 start(),其状态就从 NEW 变为 RUNNABLE 状态,此时并不意味着线程立即获取 CPU 时间片并立即执行,中间需要一系列操作系统的内部操作。

#### 2.3.2 RUNNABLE 状态

当调用 Thread 实例的 start()线程状态就会从 NEW 变为 RUNNABLE,而 Java 线程的启动与操作系统的线程调度有关。Java 中的线程管理是通过 JNI 本地调用的方式委托操作系统的线程管理 API 完成,当 Java 线程的 Thread 实例的 start()方法被调用后,操作系统中的对应线程进入的并非运行状态,
而是就绪状态,而 Java 线程并没有就绪状态。如果一个操作系统线程处于就绪状态,则说明该线程满足执行条件,但还不能执行。处于就绪状态的线程需要等待操作系统的调度,一旦就绪状态被系统选中,获取 CPU 时间片,线程就开始占用 CPU,执行线程的代码,此时操作系统线程从就绪状态变为运行状态。
操作系统线程处于运行状态且 CPU 时间片使用完之后,状态又会变为就绪状态,操作系统线程在就绪和运行状态反复切换,直到线程代码执行完毕或异常终止进入 TERMINATED 状态。
操作系统包含就绪状态和运行状态,但在 Java 线程中,并没有细分就绪和运行状态,而是将两种状态合并为 RUNNABLE 状态。

#### 2.3.3 BLOCKED 状态

处于 BLOCKED(阻塞)状态的线程并不会占用 CPU 资源,一下情况会让线程进入阻塞状态:

- 线程等待获取。等待获取一个锁资源,而该锁资源被其他线程锁持有,从而使当前线程进入阻塞状态等待获取锁。当其他线程释放该锁后,并且线程调度器允许该线程持有锁时,该线程退出阻塞状态。
- IO 阻塞。线程发起一个阻塞式 IO 操作后,如果不具备 IO 操作的条件,线程就会进入阻塞状态。

#### 2.3.4 TERMINATED 状态

处于 RUNNABLE 状态的线程在执行 run()完成后,线程状态就会从 RUNNABLE 变为 TERMINATED(终止)状态。当 run()发生了运行时异常却未被捕获导致 run()异常终止,也会使线程状态变为 TERMINATED。

#### 2.3.5 TIMED_WAITING 状态

能使线程处于限时等待的操作有如下几种:

- Thread.sleep(int n):使当前线程进入限时等待状态,等待时间 n 毫秒。
- Object.wai():带限时的抢占对象的 monitor 锁。
- Thread.join():带实现的线程合并。
- LockSupport.parkNanos():让线程等待,时间以纳秒为单位。
- LockSupport.parkUtil():让线程等待,时间可以灵活设置。

#### 2.3.6 通过 Jstack 查看线程状态

有时候在生产环境中 Java 应用 CPU 飙升,CPU 使用率居高不下或 CPU 处于 100%,从而影响应用程序运行,此时可以通过 Jstack 定位事发线程。Jstack 是 JDK 自带的一种堆栈跟踪工具,Jstack 可以生成或导出(DUMP)JVM 虚拟机运行实例当前时刻的线程快照信息。线程快照是当前 JVM 实例内每一个线程正在执行的方法堆栈的集合,生成或导出线程快照的主要的目的是定位线程出现长时间运行、停顿、请求外部资源导致的长时间等待等等。
Jstack 命令语法如下:

```shell
# pid表示JVM实例进程id,在linux环境下可通过jps命令查看JVM实例进程id
jstack <pid>
```

jstask 输出的线程信息主要包括:JVM 线程、用户线程等。JVM 线程在 JVM 启动就存在,主要用于执行垃圾回收(GC)、低内存的检测等后台任务;用户线程则是在程序创建新线程才会生成。使用 Jstack 需要注意如下事项:

- 在实际运行中,往往一次 DUMP 的信息不足以确认问题。建议产生三次 DUMP 信息,如果每次 DUMP 都指向同一个问题,大概率说明程序故障由该问题引发。
- 不同的 Java 虚拟机的线程导出来的 DUMP 信息格式是不一样的,并且同一个 JVM 的不同版本,DUMP 信息也有所差异。

Jstack 指令输出信息说明:

- tid:线程实例在操作系统中对应的底层线程的线程 id。
- prio:线程实例在 JVM 进程中的优先级。
- os_prio:线程实例在操作系统中对应的底层线程的优先级。
- 线程状态:如 runnable、waiting、oncondition 等。

### 2.4 守护线程

Java 中线程分为守护线程和用户线程。守护线程也被称为后台线程,专门指在程序运行过程中,在后台提供某种通用服务的线程(例如 GC 线程,用于内垃圾回收)。用户线程是指通过程序创建的线程,例如 main 线程。守护线程如同一个保姆角色,在 JVM 实例中只有所有用户线程执行结束后,守护线程才会结束工作,否则可以一直工作。
在 Thread 类定义了 daemon 实例属性用于描述线程是否是守护线程,通过 Thread.setDaemon()可以设置当前线程为守护线程或用户线程,setDaemon(true)表示设置线程为守护线程,反之设置线程为用户线程。JVM 启动后至少包含两个线程,一个是应用程序的主线程,一个用于垃圾回收的 GC 线程(内存是有限,所以需要定期进行垃圾回收)。

```java
// 默认线程是用户线程
private boolean daemon = false;
// 设置线程为守护线程或用户线程
public final void setDaemon(boolean on);
// 判断当前线程是否是守护线程
public final boolean isDaemon();
```

```java
package com.fly.base;

/**
 * 线程分为守护线程和用户线程
 */
public class Thread06 {

    public static void main(String[] args) {
        Thread thread = new Thread(()-> {
            System.out.println("start thread...");
        });
        // 设置线程为守护线程,注意:需要在调用Thread.start()前设置,否则JVM会抛出一个InterruptedException异常
        thread.setDaemon(true);
        // 启动线程
        thread.start();
    }
}
```

设置线程为守护线程的注意事项如下:

- 守护线程必须在启动线程前将其守护状态设置为 true,启动之后不能再将用户线程设置为守护线程,否则 JVM 会抛出一个 InterruptedException 异常。
- 守护线程存在在被 JVM 强制终止的风险,所以在守护线程尽量不去访问系统资源,如文件句柄、数据库连接等等。守护线程被强行终止时,可能会引发系统资源操作不负责任的中断,从而导致资源不可逆的损坏。
- 守护线程创建的线程也是守护线程。

## 3.线程操作

## 4.停止线程的三种方式

### 4.1 通过 interrupt()关闭线程

interrupt()用于中断线程,Thread 类提供了 isInterrupted()方法判断线程是否处于中断状态。如果该线程在调用 Object 类的 wait()方法时被阻塞,或者在调用该类的 join()、sleep()方法中被阻塞,则其中断状态将被清除,并将抛出 InterruptedException 异常。

### 4.2 通过 stop()、suspend()、resume()停止线程

JDK 提供了一系列管理线程,如 start()、stop()、resume()、suspend()、destroy(),除了 start()方法外,其他方法都被标记为已废弃,使用这些已废弃的方法可能导致操作不安全问题,JDK 推荐使用 interrupt()终止线程。

stop()用于立即停止线程,JDK 弃用原因如下:

- 调用 stop()方法会立刻停止 run()方法中执行的任务(包括在 catch 或 finally 语句中的逻辑),并抛出 ThreadDeath 异常(通常情况下此异常不需要显式的捕获),因此可能会导致一些清理性的工作被中断,例如关闭文件或断开数据库连接等操作。
- 调用 stop()方法会立即释放该线程所持有的所有的锁,导致数据得不到同步,从而出现数据不一致的问题。

suspend()用于挂起线程,如果线程处于存活状态,则该该线程被挂起,并且在调用 resumed()前被阻塞。使用 suspend 容易导致死锁。如果目标线程在监视器上持有一个锁,以保护挂起的关键系统资源,则在目标线程恢复之前,任何线程都不能访问该资源。如果将恢复目标线程的线程在调用 resume 之前试图锁定此监视器,则会导致死锁。

resume()用于恢复被挂起的线程,由于此方法仅用于恢复被挂起的线程,所以很容易死锁。

### 4.3 通过 volatile+标志位停止线程

使用 volatile+标志位停止线程在某些特殊的情况下(例如线程被长时间阻塞),无法及时感知线程被中断,因此 volatile+标志位停止线程并不能关闭线程的实时性。
