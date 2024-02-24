## 1.线程安全的单例模式

单例模式是 23 种设计模式中最为常见的一种设计模式,是指一个类中只有一个实例,单例模式一般用于全局对象管理,例如全局日志对象、XML 读写实例、系统配置实例、任务调度实例、数据库连接池实例等等。

### 1.1 饿汉式单例模式

按照单例对象被初始化时机,单例可以被分为懒汉式和饿汉式两种。饿汉式单例在类被加载时就会被初始化,而懒汉式单例在使用单例对象时被初始化。
饿汉单例模式:

```java
package com.fly.singleton;

/**
 * 单例模式写法1:饿汉式单例模式
 */
public class SingletonPattern01 {
    /**
     * static修饰SingletonPattern01单例类,该实例在类加载时就被初始化
     */
    private static final SingletonPattern01 instance = new SingletonPattern01();

    /**
     * 获取单例实例
     * @return 返回单例实例
     */
    private static SingletonPattern01 getInstance(){
        return instance;
    }
}
```

饿汉单例模式的优点在于简单且安全,其缺点在于单例对象在类加载时就被初始化了,就算不使用单例实例该实例也会被初始化,无法做到延迟初始化(懒加载)。

### 1.2 懒汉单例模式

懒汉单例模式:

```java
package com.fly.singleton;

/**
 * 单例模式写法2:懒汉单例模式,可以实现延迟初始化实例,但存在线程安全问题
 */
public class SingletonPattern02 {
    private static SingletonPattern02 instance;

    // 私有构造器
    private SingletonPattern02() {
    }

    /**
     * 获取单例实例。在懒汉单例模式下获取实例首先会判断单例实例是否为null,
     * 如果为null则进行初始化,否则直接返回单例实例。
     * @return 单例实例
     */
    static SingletonPattern02 getInstance() {
        if (instance == null) { // 注意点1
            instance = new SingletonPattern02(); // 注意点2
        }
        return instance;
    }
}
```

懒汉单例模式虽然能实现单例实例的延迟初始化,但有可能会造成线程安全问题。在多线程并发访问 getInstance()时,不同的线程可能同时进入`instance == null`条件判断,从而多次执行`instance = new SingletonPattern02();`,导致创建多个单例实例。例如线程 A 和线程 B 并发访问 getInstance()获取单例实例,可能出现的情况如下:

- 线程 A 检查到 instance 为 null,进入 if 代码块。
- 线程 B 检查到 instance 为 null,进入 if 代码块。
- 线程 B 执行创建单例对象,初始化 instance 实例。
- 线程 B 初始化单例实例后返回该实例。
- 线程 A 执行创建单例对象,初始化 instance 实例。
- 线程 A 初始化单例实例后返回该实例。

以上这种情况表示在并发环境下 instance 实例可能会被初始化多次,违背了单例模式的初衷。并发环境下 instance 变量无法保证线程的可见性,new 操作符底层由多个复合指令组成,无法保证线程操作的原子性,因此懒汉单例模式是非线程安全的。

### 1.3 同步懒汉单例模式

同步懒汉单例模式即通过 synchronized 解决懒汉单例模式线程安全问题。synchronized 是 Java 提供的同步机制,能保证并发环境多线程能同步访问资源,因此不会产生线程安全问题。由于获取实例每次都会使用同步锁,在线程竞争激烈的情况下,内置锁会被升级为重量锁,进而使用开销大、性能低,因此不推荐在高并发场景使用同步懒汉单例模式。

```java
package com.fly.singleton;

/**
 * 单例模式写法3:同步懒汉单例模式,通过synchronized同步机制解决
 * 饿汉单例模式产生的线程安全问题。在线程竞争激烈的情况下,内置锁(synchronized)会
 * 被升级为重量锁,重量级锁开销大、性能低,在高并发场景不推荐使用。
 */
public class SingletonPattern03 {
    private static SingletonPattern03 instance;

    // 私有构造器
    private SingletonPattern03() {}

    /**
     * 获取单例实例。通过synchronized同步机制使线程同步访问
     * @return 单例实例
     */
    static synchronized SingletonPattern03 getInstance() {
        if (instance == null) {
            instance = new SingletonPattern03();
        }
        return instance;
    }
}

```

### 1.4 双重检查锁单例模式

事实上,单例模式加锁操作应该在单例实例第一次创建时使用,后续的单例获取操作无需加锁。在双重检查锁单例模式下首先判断单例对象是否被初始化,如果未被初始化则加锁后再次检查进行初始化,这种双重检查被称为双重检查锁单例模式。

```java
package com.fly.singleton;

/**
 * 单例模式写法4:双重检查锁。
 */
public class SingletonPattern04 {
    private static SingletonPattern04 instance;

    private SingletonPattern04() {
    }

    public static SingletonPattern04 getInstance() {
        if (instance == null) { // 检查1
            /**
             * 使用SingletonPattern04类做为锁资源,
             * 同步代码块粒度比同步方法更细,性能相对更好
             */
            synchronized (SingletonPattern04.class) {
                if (instance == null) { // 检查2
                    instance = new SingletonPattern04();
                }
            }
        }
        return instance;
    }
}
```

双重检查锁单例模式流程如下:

- 第一次检查单例对象是否被初始化,如果单例已初始化则直接返回该单例实例。**第一次无需使用锁进行线程同步,用于提高获取单例对象的性能**。
- 如果单例实例未被初始化,就进入临界区进行初始化操作,此时才会去获取锁。
- 进入临界区后,再次检查单例对象是否被初始化,如果还未被初始化则通过 new 初始化一个实例。之所以在临界区进行二次检查是因为在多线程竞争情况下,可能有多个线程通过了第一次检查,第一个通过检查的线程首先会进入临界区,而其他线程将被阻塞,在第一个线程实例化单例对象释放锁资源后,其他线程获取锁进入临界区进行单例对象实例化,由于单例实例已经被初始化了,即使其他线程进入了临界区,也无法通过第二次检查,从而避免了重复实例化单例对象。

双重检查不仅避免单例对象在多线程场景中重复初始化,而且除了初始化时需要加锁外,后续所有调用都无需加锁而直接返回单例对象实例,从而提升了获取单例对象的性能。

### 1.5 双重检查锁+volatile

虽然双重检查锁机制的单例模式已经很完美了,但是在获取实例时出现异常,这是因为初始化代码 instance = new SingletonPattern04()底层由三个指令组成(具有原子性的指令):

- 分配一个内存 M。
- 在内存 M 上初始化单例对象。
- 将 M 的地址赋值给 instance 变量。

编译器、CPU 都可能没有对没有内存屏障、数据依赖关系的操作进行指令重排序,初始化指令可能会被优化成:

- 分配一个内存 M。
- 将 M 的地址赋值给 instance 变量。
- 在内存 M 上初始化单例对象。

经过指令重排序优化后,获取单例时可能会产生如下问题:

- 线程 A 先执行 getInstance(),当执行到分配一块内存并将地址复制给 M 后,恰好发生了线程切换。此时,线程 A 还未将 M 指向内存初始化。
- 线程 B 进入 getInstance(),判断 if 语句 instance 是否为空,此时的 instance 不为空,线程 B 直接获取到了未初始化的 instance 变量。由于线程 B 得到的是一个未初始化完全的对象,因为访问 instance 变量时可能会发生异常。为此可以使用 volatile 修饰单例对象保证线程可见性的同时,禁止指令重排序。

```java
package com.fly.singleton;

/**
 * 单例模式写法5:双重检查锁 + volatile。
 */
public class SingletonPattern05 {
    /**
     * 使用volatile修饰单例对象,volatile可以保证线程之间的可见性,
     * 在线程操作时禁止指令重排序
     */
    private static volatile SingletonPattern05 instance;

    private SingletonPattern05() {}

    public static SingletonPattern05 getInstance() {
        if (instance == null) { // 检查1
            synchronized (SingletonPattern04.class) {
                if (instance == null) { // 检查2
                    instance = new SingletonPattern05();
                }
            }
        }
        return instance;
    }
}

```

### 1.6 静态内部类模式

静态内部类模式,其核心是通过静态内部类获取实例,对比饿汉单例模式,都是采用了类装载的机制来保证初始化实例时只有一个线程,与饿汉模式不同是:在饿汉模式中是类加载后就会初始化单例对象,无法延迟初始化对象,而静态内部类模式在类加载后并不会立即初始化,而是使用 getInstance()时才会装载该类,从而实现单例对象的初始化。

```java
package com.fly.singleton;

/**
 * 单例模式写法6:静态内部类模式,其核心是通过静态内部类获取实例,
 * 对比饿汉单例模式,都是采用了类装载的机制来保证初始化实例时只有一个线程,
 * 与饿汉模式不同是:在饿汉模式中是类加载后就会初始化单例对象,无法延迟初始化对象,
 * 而静态内部类模式在类加载后并不会立即初始化,而是使用getInstance()时才会装载
 * 该类,从而实现单例对象的初始化。
 */
public class SingletonPattern06 {

    static class SingletonPatternHolder {
        private static final SingletonPattern06 instance = new SingletonPattern06();

        private SingletonPatternHolder() {
        }
    }

    private SingletonPattern06() {}

    public static SingletonPattern06 getInstance() {
        return SingletonPatternHolder.instance;
    }
}

```

### 1.7 枚举模式

JDK1.5 中添加的枚举也能实现单例模式。不仅能避免多线程同步问题,还是懒加载,还能防止反序列化重新创建新的对象。

- 线程安全:定义枚举首次使用时才会被虚拟机加载并初始化,而这个初始化过程是线程安全的。
- 防止反序列化重新创建新对象:普通的 Java 类的反序列化过程中,会通过反射调用类的默认构造函数来初始化对象。即使是单例构造函数是私有的,仍有可能通过反射进行修改。而枚举的反序列化并不是通过反射实现的,所以,也就不会发生由于反序列化导致的单例破坏问题。

```java
package com.fly.singleton;

/**
* 单例模式写法7:基于枚举实现单例模式,具有线程安全、延迟加载、防止反序列化重新创建新的对象等优点。
*/
public enum SingletonPattern07 {
    INSTANCE;
}
```

### 1.8 总结

7 种单例模式的区别如下:

| 模式名称              | 实现方式                                       | 延迟加载 | 线程安全 | 描述                                                                                                                    |
| --------------------- | ---------------------------------------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| 饿汉单例模式          | 基于静态变量在类加载时初始化单例对象           | 否       | 是       | 在类加载时初始化单例对象,无法延迟初始化                                                                                 |
| 懒汉单例模式          | 基于静态变量通过检查初始化单例对象             | 是       | 否       | 支持延迟初始化单例对象,但线程不安全                                                                                     |
| 同步懒汉单例模式      | 基于静态变量 + synchronized 机制初始化单例对象 | 是       | 是       | 支持延迟初始化单例对象且线程安全,每次访问实例时都需要加锁,线程竞争激烈时,内置锁被升级为重量级锁,造成开销大、性能低      |
| 双重检查锁单例模式    | 基于 synchronized + 双重检查锁                 | 是       | 是       | 支持延迟初始化且线程安全,仅在首次初始化单例对象加锁,后续操作无需加锁。由于指令重排序问题可能导致其他线程获取实例为 null |
| 双重检查锁 + volatile | 基于 synchronized + volatile + 双重检查锁      | 是       | 是       | 支持延迟初始化且线程安全,通过 volatile 禁止重排序解决其他线程获取单例对象为 null                                        |
| 静态内部类模式        | 静态内部类                                     | 是       | 是       |
|  |
| 枚举模式              | 枚举                                           | 是       | 是       | 枚举模式具有实现简单、线程安全、可以防止反序列化重新创建新对象等优点                                                    |

## 2.Master-Worker 模式

Master-Worker 模式是一种常见的高并发模式,它的核心思想是任务的调度和执行分离,调度任务的角色被称为 Master,执行任务的角色被成为 Worker,Master 负责接收、分配任务和合并结果,Worker 负责执行任务。Master-Worker 模式是一种归并类型的模式,被分解的子任务在系统中可以被并行处理,Master 无需等待所有子任务都完成计算,就可以根据已有的部分结果集计算最终结果集。

例如在 TCP 服务端的请求过程中,大量的客户端连接相当于执行任务,Master 需要将这样任务存储在一个工作队列,然后分发给各个 Worker,每个 Worker 是一个工作线程,负责完成连接的传输处理。Master-Worker 模式的结构图如下:
![42fa46f6d12d96f5f5318c6fec7167c.jpg](https://cdn.nlark.com/yuque/0/2022/jpeg/1196263/1672102368069-3bf59adb-2aaf-4919-83eb-f2f60e935c9d.jpeg#averageHue=%23f4f4f4&clientId=ud964166e-4829-4&from=drop&id=u285e5c7f&originHeight=695&originWidth=1236&originalType=binary&ratio=1&rotation=0&showTitle=false&size=75174&status=done&style=none&taskId=u66d619d4-f00b-45ff-b495-092c0ac06f9&title=)

### 2.1 Master-Worker 模式实现

假设要执行 N 个任务,并将这些任务结果进行累加求和,如果任务太多,可以使用 Master-Worker 模式来实现,Master 持有 workerCount 个 Worker,并且负责接收任务,然后分发给 Worker,最后在回调函数中对 Worker 的结果进行归并求和。
Master 负责接收客户端提交的任务,然后通过阻塞队列进行存储。Master 所拥有的线程作为阻塞队列的消费者,不断从阻塞队列中获取任务并轮流分给 Worker 执行:

```java
package com.fly.masterworker;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Master负责接收客户端提交的任务,然后通过阻塞队列进行存储。Master所拥有的线程
 * 作为阻塞队列的消费者,不断从阻塞队列中获取任务并轮流分给Worker执行
 * @param <T> 任务泛型
 * @param <R> 任务执行结果泛型
 */
public class Master<T extends Task, R> {
    // 所有Worker集合
    private HashMap<String, Worker<T, R>> workers = new HashMap<>();
    // 任务阻塞队列,用于存储任务
    private LinkedBlockingQueue<T> taskQueue = new LinkedBlockingQueue<>();
    // 任务处理结果集合
    protected Map<String, R> resultMap = new ConcurrentHashMap<>();
    // Master的任务调度线程
    private Thread thread = null;
    // 保存最终的求和
    private AtomicLong sum = new AtomicLong(0);
    public Long getSum(){
        return sum.get();
    }

    public Master(int workerCount) {

        // 每个Worker对象都需要持有queue的引用,用于处理任务和提交结果
        for (int i = 0; i < workerCount; i++) {
            // 初始化workerCount个Worker实例
            Worker<T, R> worker = new Worker<>();
            workers.put("worker-" + i, worker);
        }
        thread = new Thread(() -> this.execute());
        thread.start();
    }

    // 提交任务,向任务队列添加任务
    public void submit(T task) {
        taskQueue.add(task);
    }

    // 获取Worker结果处理的回调函数
    private void resultCallBack(Object o) {
        Task<R> task = (Task<R>) o;
        String taskName = "Worker-" + task.getId();
        // 获取执行结果
        R result = task.getResult();
        // 将执行结果存储在Map中
        resultMap.put(taskName, result);
        // 获取累加和
        sum.getAndAdd((Long) result);
    }

    // 执行所有子任务
    public void execute() {
        for (; ; ) {
            for (Map.Entry<String, Worker<T, R>> entry : workers.entrySet()) {
                T task = null;
                try {
                    // 从任务队列中获取任务,take()会阻塞后续代码执行
                    task = this.taskQueue.take();
                    // 获取Worker节点
                    Worker worker = entry.getValue();
                    // 分配任务
                    worker.submit(task, this::resultCallBack);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 打印最终结果
     */
    public void printResult() {
        for (Map.Entry<String, R> entry : resultMap.entrySet()) {
            String taskName = entry.getKey();
            System.out.println(taskName + ":" + entry.getValue());
        }
        System.out.println("sum is:" + sum.get());
    }
}

```

Worker 类用于接收 Master 分配的任务,同样也通过阻塞队列对局部任务进行存储。Worker 所拥有的线程作为局部任务的阻塞队列的消费者,不断的从阻塞队列中获取任务并执行,执行完成后执行 Master 传递过来的回调函数。

```java
package com.fly.masterworker;

import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;

/**
 * Worker类用于接收Master分配的任务,同样也通过阻塞队列对局部任务进行缓存。Worker
 * 所拥有的线程作为局部任务的阻塞队列的消费者,不断的从阻塞队列中获取任务并执行,
 * 执行完成后执行Master传递过来的回调函数。
 * @param <T> 任务泛型
 * @param <R> 任务执行结果泛型
 */
public class Worker<T extends Task, R> {
    // 接收任务的阻塞队列
    private LinkedBlockingDeque<T> taskQueue = new LinkedBlockingDeque();
    // 通过AtomicInteger作为Worker编号计数器
    private AtomicInteger index = new AtomicInteger(1);
    // worker id
    private int workerId;
    // 执行任务的线程
    private Thread thread = null;

    public Worker() {
        this.workerId = index.getAndIncrement();
        thread = new Thread(() -> this.run());
        thread.start();
    }

    public void run() {
        // 不停向任务队列中获取任务并执行
        for (; ; ) {
            try {
                // 从阻塞队列中提取任务
                T task = this.taskQueue.take();
                // 设置worker id
                task.setWorkerId(workerId);
                // 执行任务
                task.execute();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void submit(T task, Consumer<R> action) {
        // 设置任务的回调函数
        task.resultAction = action;
        try {
            // 将任务数添加到任务队列中
            taskQueue.put(task);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

```

Task 类在子类任务的 doExecute()方法之后,回调执行 Master 传递过来的回调函数。

```java
package com.fly.masterworker;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;

/**
 * 异步任务类在子类任务的doExecute()方法之后,回调执行Master传递过来的回调函数。
 * @param <R> 任务执行结果泛型
 */
public class Task<R> {
    static AtomicInteger index = new AtomicInteger(1);
    // 任务的回调函数
    public Consumer<Task<R>> resultAction;
    // 任务id
    private int id;
    // Worker id,用于表示当前异步子任务属于那个Worker
    private int workerId;
    // 执行结果
    R result = null;

    public Task() {
        this.id = index.getAndIncrement();
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getWorkerId() {
        return workerId;
    }

    public void setWorkerId(int workerId) {
        this.workerId = workerId;
    }


    public R getResult() {
        return result;
    }

    public void setResult(R result) {
        this.result = result;
    }

    // 执行任务
    public void execute() {
        this.result = this.doExecute();
        // 执行回调函数
        resultAction.accept(this);
    }

    // 由子类实现
    protected R doExecute() {
        return null;
    }
}

```

MasterWorker 模式测试类:

```java
package com.fly.masterworker;

import java.util.Random;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Master-Worker模式测试类
 */
public class MasterWorkerTest {
    private static Random random = new Random();

    static class SimpleTask extends Task<Long> {
        @Override
        protected Long doExecute() {
            // 生成两个0到10范围的整数
            Long i1 = (long) random.nextInt(10);
            Long i2 = (long) random.nextInt(10);
            System.out.println("求和表达式:i1+i2="+i1+"+"+i2);
            return i1 + i2;
        }
    }

    public static void main(String[] args) {
        // 创建Master实例并指定4个Worker处理任务
        Master<SimpleTask, Integer> master = new Master<>(4);
        // 创建可调度线程池
        ScheduledThreadPoolExecutor pool = new ScheduledThreadPoolExecutor(4);
        // 定期向master提交任务,每隔2s延迟0s向master提交任务
        pool.scheduleAtFixedRate(() -> master.submit(new SimpleTask()),
                0, 2000, TimeUnit.MILLISECONDS);

        // 定期从master获取结果,初始化延迟0s每隔5s从master获取执行结果
        pool.scheduleAtFixedRate(() -> {
            master.printResult();
        }, 0, 5000, TimeUnit.MILLISECONDS);
    }
}
```

执行结果:

```
sum is:0
求和表达式:i1+i2=0+3
求和表达式:i1+i2=3+7
求和表达式:i1+i2=4+9
Worker-3:13
Worker-2:10
Worker-1:3
sum is:26
求和表达式:i1+i2=8+6
求和表达式:i1+i2=7+6
Worker-4:14
求和表达式:i1+i2=9+2
Worker-3:13
Worker-5:13
Worker-2:10
Worker-1:3
sum is:64
```

### 2.2 Netty 中 Master-Worker 实现

### 2.3 Nginx 中 Master-Worker 的实现

## 3.ForkJoin 模式

"分而治之"是一种算法思想,简单来说就是将复杂的任务按照一定程度上的分解,将一个大任务拆分若干个小任务,然后逐个计算子任务并最终将所有执行结果进行归纳聚合。Master-Worker 和 ForkJoin 都是分治思想的应用,与 Master-Worker 不同,ForkJoin 模式没有 Master 角色,在该模式中所有角色都是 Worker。

在 ForkJoin 模式中首先将一个任务分解成多个独立的子任务,然后开启多个线程并行处理这些子任务,如果子任务仍很复杂还可以进一步分解。
![0f6133dd9c11daa5cc5dbf9bc063a1d.jpg](https://cdn.nlark.com/yuque/0/2022/jpeg/1196263/1672112054828-3814b1b1-2e21-4aa9-8b0d-26c6e5dd4f64.jpeg#averageHue=%23f4f4f4&clientId=ud964166e-4829-4&from=paste&height=568&id=u3fc4e4b5&originHeight=568&originWidth=1047&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56499&status=done&style=none&taskId=u8a8b9e17-b38b-44f7-b254-ba80d7db488&title=&width=1047)
ForkJoin 模式借助了现代计算机多核的优势并行处理数据。通常情况下,ForkJoin 模式将分解出来的子任务添加到双端队列,然后启动数个线程从双端队列中获取任务并执行。子任务执行的结果会存储到一个队列中.各个线程从队列获取数据,然后进行子任务结果的合并,合并后得到最终结果。

### 3.1 ForkJoin 框架

JUC 包提供了一套 ForkJoin 模式的实现,以 ForkJoinPool 线程池提供,并且该线程池在 Java8 的 Lambda 并行流框架中充当底层实现。JUC 包的 ForkJoin 包含如下组件:

- ForkJoinPool:执行任务的线程池,继承了 AbstractExecutorService 类。
- ForkJoinWorkerThread:执行任务的工作线程(ForkJoinPool 线程池中的线程)。每个线程内部都维护着一个内部队列用于存放内部任务,该类继承自 Thread 类。
- ForkJoinTask:用于 ForkJoinPool 的任务抽象类,实现了 Future 接口。
- RecursiveTask:带返回结果的递归执行任务,是 ForkJoinTask 的子类,在子任务带返回结果时调用。
- RecursiveAction:不返回结果的递归执行结果,是 ForkJoinTask 的子类,在子任务无需返回结果时使用。

由于 ForkJoinTask 比较复杂且抽象方法颇多,通常情况下并不推荐集成 ForkJoinTask 来实现自定义任务类,而是
推荐继承 RecursiveTask 或 RecursiveAction 实现自定义任务类,自定义任务类需要重写父类的 compute()方法,该方法的执行流程如下:

```
if 任务足够小
   直接返回结果
else
	 分割成N个子任务
	 依次调用每个子任务的fork()执行子任务
	 依次调用每个子任务的join()等待任务执行完成

最后合并所有子任务的执行结果
```

### 3.2 自定义任务类实现数值累加求和

```java
package com.fly.forkjoin;

import java.util.concurrent.RecursiveTask;

/**
 * 自定义累加计算任务类
 */
public class AccumulateTask extends RecursiveTask<Integer> {
    // 任务拆分阈值
    private static final int THRESHOLD = 2;
    // 累加的起始编号
    private int start;
    // 累加的结束编号
    private int end;

    public AccumulateTask(int start, int end) {
        this.start = start;
        this.end = end;
    }

    @Override
    protected Integer compute() {
        int sum = 0;
        // 判断任务的规模,对于小任务则直接计算返回
        boolean canCompute = (end - start) <= THRESHOLD;
        // 如果任务足够小则直接累加返回结果
        if (canCompute) {
            for (int i = start; i <= end; i++) {
                sum += i;
            }
        } else {
            // 如果任务足够大,则将任务一分为2
            int middle = (start + end) / 2;
            AccumulateTask lTask = new AccumulateTask(start,middle);
            AccumulateTask rTask = new AccumulateTask(middle+1,end);
            // 调用fork()执行子任务
            lTask.fork();
            rTask.fork();
            // 等待子任务执行完成,依次调用子任务的join()合并执行结果
            int leftResult = lTask.join();
            int rightResult = rTask.join();
            sum = leftResult + rightResult;
        }
        return sum;
    }
}
```

带返回结果的自定义任务类 AccumulateTask 继承自 RecursiveTask 类,每次执行可以携带返回值。AccumulateTask 类通过 THRESHOLD 常量设置子任务分解的阈值,并在 compute()方法中使用阈值进行判断是否需要进行任务分解:

- 若当前任务的计算规模大于 THRESHOLD(阈值),则表示当前任务需要进行再一步分解,若任务计算规模小于 THRESHOLD 则直接计算返回结果。
- 如果任务进行了分解,则需要等待所有子任务执行完成,然后执行各个分解的子任务获取结果。如果一个任务分解为多个子任务,则依次调用每个子任务的 fork()执行子任务,然后依次调用每个子任务的 join()方法合并执行结果。

```java
package com.fly.forkjoin;

import java.util.concurrent.*;

public class AccumulateTaskTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException, TimeoutException {
        // 创建ForkJoinPool线程池
        ForkJoinPool pool = new ForkJoinPool();
        AccumulateTask task =new AccumulateTask(1,100);
        // 向ForkJoin线程池提交任务
        Future<Integer> future = pool.submit(task);
        // 获取Future结果,如果1s内未获取结果则抛出TimeoutException
        Integer sum = future.get(2, TimeUnit.SECONDS);
        System.out.println("sum:"+sum); // sum:5050
    }
}
```

### 3.3 ForkJoin 核心方法介绍

ForkJoin 框架的核心 ForkJoinPool 线程池。该线程池使用一个无锁的栈来管理空闲线程,如果一个工作线程暂时获取不到可用任务,则可能被挂起,而挂起的线程将被压入 ForkJoinPool 维护的栈中,当有新任务到来时,再从栈中唤醒被挂起的线程。

#### 3.3.1 ForkJoinPool 构造器

```java
public ForkJoinPool(int parallelism,
                    ForkJoinWorkerThreadFactory factory,
                    UncaughtExceptionHandler handler,
                    boolean asyncMode) {
    this(checkParallelism(parallelism),
         checkFactory(factory),
         handler,
         asyncMode ? FIFO_QUEUE : LIFO_QUEUE,
         "ForkJoinPool-" + nextPoolId() + "-worker-");
    checkPermission();
}
```

ForkJoinPool 提供了一个全参构造器,四个参数介绍如下:

- **parallelism:可并行级别**。ForkJoin 框架将依据 parallelism 设置的级别决定框架内并行执行的线程数据。并行的每个任务都会有一个线程管理,但 parallelism 属性并不是 ForkJoinPool 中最大的线程数,该属性和 ThreadPoolExecutor 线程池中的 corePoolSize、maximumPoolSize 存在区别,因为 ForkJoinPool 的结构与工作方式与 ThreadPoolExecutor 完全不同。ForkJoinPool 中可存在的线程数据与 parallelism 并非决定关联。
- **factory:线程创建工厂**。当 ForkJoinPool 创建一个新的线程时,同样会使用线程创建工厂。该线程工厂无需实现 ThreadFactory 接口,而是需要实现了 ForkJoinWorkerThreadFactory 接口。ForkJoinWorkerThreadFactory 是一个函数式接口,自定义 ForkJoin 线程工厂需要实现 ForkJoinWorkerThreadFactory 接口重写 newThread()。ForkJoinPool 默认使用 DefaultForkJoinWorkerThreadFactory 作为线程工厂,该线程工厂实现了 ForkJoinWorkerThreadFactory 接口。
- **handle:异常捕获处理程序。**当执行的任务出现异常,并从任务中抛出时,就会被 handler 捕获。
- **asyncMode:asyncMode 表示是否为异步模式,默认为 false。**如果不是异步模式,则表示子任务的执行遵循 FIFO(先进先出)顺序,并且子任务不能被合并;如果是异步模式,则表示子任务的执行遵循 LIFO(后进先出)顺序,并且子任务可以合并。注意:asyncMode 并不是指 ForkJoin 框架的调度模式采用同步模式还是异步模式工作,仅仅指任务的调度方式。ForkJoin 框架为每一个独立工作的线程准备了对应的待执行任务队列,该任务队列使用数组进行组合的双向队列。asyncMode 支持 FIFO 和 LIFO 两种工作模式,FIFO 的任务适用于工作线程只负责运行异步事件,不需要合并结果的异步任务。

ForkJoinPool 无参构造器:

```java
static final int MAX_CAP      = 0x7fff;        // 并行度常量 32767
public ForkJoinPool() {
    this(Math.min(MAX_CAP, Runtime.getRuntime().availableProcessors()),
         defaultForkJoinWorkerThreadFactory, null, false);
}
```

该构造器的 parallelism 值为 CPU 核数;factory 为 DefaultForkJoinWorkerThreadFactory 默认的线程工厂;异常捕获处理 handler 为 null,异步模式 asyncMode 为 false,使用 LIFO(后进先出)的、可合并子任务的模式。

#### 3.3.2 ForkJoinPool 的 commonPool()

ForkJoinPool 提供了 commonPool()来创建通用线程池,该线程池通过 makeCommonPool 构造,其代码如下:

```java
private static ForkJoinPool makeCommonPool() {

    final ForkJoinWorkerThreadFactory commonPoolForkJoinWorkerThreadFactory =
            new CommonPoolForkJoinWorkerThreadFactory();
    int parallelism = -1;
    ForkJoinWorkerThreadFactory factory = null;
    UncaughtExceptionHandler handler = null;
    try {
        // 从系统变量中获取并行度
        String pp = System.getProperty
            ("java.util.concurrent.ForkJoinPool.common.parallelism");
        // 从系统变量中获取线程工厂
        String fp = System.getProperty
            ("java.util.concurrent.ForkJoinPool.common.threadFactory");
        // 从系统变量中获取异常处理程序
        String hp = System.getProperty
            ("java.util.concurrent.ForkJoinPool.common.exceptionHandler");
        if (pp != null)
            parallelism = Integer.parseInt(pp);
        if (fp != null)
            factory = ((ForkJoinWorkerThreadFactory)ClassLoader.
                       getSystemClassLoader().loadClass(fp).newInstance());
        if (hp != null)
            handler = ((UncaughtExceptionHandler)ClassLoader.
                       getSystemClassLoader().loadClass(hp).newInstance());
    } catch (Exception ignore) {
    }
    if (factory == null) {
        if (System.getSecurityManager() == null)
            factory = commonPoolForkJoinWorkerThreadFactory;
        else // use security-managed default
            factory = new InnocuousForkJoinWorkerThreadFactory();
    }
    // parallelism默认为 cores - 1
    if (parallelism < 0 && // default 1 less than #cores
        (parallelism = Runtime.getRuntime().availableProcessors() - 1) <= 0)
        parallelism = 1;
    if (parallelism > MAX_CAP)
        parallelism = MAX_CAP;
    return new ForkJoinPool(parallelism, factory, handler, LIFO_QUEUE,
                            "ForkJoinPool.commonPool-worker-");
}
```

使用 commonPool()创建 ForkJoin 的优点是可以通过指定系统变量属性的方式定义并行度、线程工厂、异常处理程序,并且 commonPool 使用 LIFO(后进先出)模式可以支持任务合并。
系统变量设置并行度:

```java
System.setProperty("java.util.concurrent.ForkJoinPool.common.parallelism","8")
```

Java 指定选项方式指定并行度:

```java
-Djava.util.concurrent.ForkJoinPool.common.parallelism=8
```

#### 3.3.3 ForkJoinPool 提交任务

ForkJoinPool 支持以下两类任务的提交:

- 外部任务向 ForkJoinPool 提交外部任务的方式有三种:
  - 使用 invoke()方法,该方法提交任务后线程会任务计算完成返回结果。
  - 使用 execute()方法提交异步任务,该方法无返回值。
  - 使用 submit()方法提交异步任务,并且会返回一个 ForkJoinTask 实例。
- 通过任务实例的 fork()方法可以向 ForkJoinPool 提交子任务,当任务被分割后,内部会调用 ForkJoinPool.WorkQueue.push()将任务添加至队列中等待被执行。

#### 3.3.4 工作窃取算法

ForkJoinPool 线程池的任务分为"外部任务"和"子任务",两种任务的存放位置不同:

- 外部任务存储在 ForkJoinPool 的全局队列中。
- 子任务会作为"内部任务"存储到内部任务队列中,ForkJoinPool 池中的每个线程都维护着一个内部队列,用于存储这些内部任务。

由于 ForkJoinPool 线程池通常有多个工作线程,与线程对应的队列也会有多个,这样会产生任务分配不均的问题:有的队列任务多,线程需要不停执行,有的队列任务少,对应线程一直空闲。ForkJoinPool 内部通过工作窃取算法解决任务分配不均问题。工作窃取算法的核心思想:如果线程对应的任务队列为空,则查看其他线程是否有未处理的任务,如果存在未处理的任务则获取执行。工作窃取算法的主要逻辑:每个队列拥有一个双端队列,用于存储需要执行的任务,当本线程没有任务时,可以从其他线程的任务队列中获取一个任务继续执行,例如下图:
![09c3ad2a5f23a899ff00c6286103cf5.jpg](https://cdn.nlark.com/yuque/0/2022/jpeg/1196263/1672126614316-23b9d5ba-e93b-47fe-b506-b28674aacb08.jpeg#averageHue=%23f2f2f2&clientId=uf0104dab-d4e2-4&from=paste&height=382&id=u8b1d5bf8&originHeight=382&originWidth=878&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28522&status=done&style=none&taskId=ud0faa7f1-06d3-48db-8c1d-2d37caa1b98&title=&width=878)
在实际进行任务窃取操作时,操作线程会进行其他线程的任务队列的扫描和任务的出队尝试。由于并行执行任务涉及线程安全问题,假如在窃取过程中该任务已经执行,此时任务的窃取操作就会失败。此时,ForkJoinPool 使用了一种简单的优化方案:在线程对应的本地队列使用 LIFO(后进先出)策略,窃取其他线程的任务队列时使用 FIFO(先进先出)策略。简单来说,获取线程队列任务是从头开始执行,窃取其他工作队列的任务则从队列尾部获取任务。由于窃取的动作十分迅速,会大量降低窃取任务失败的概率。窃取策略如下:
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1196263/1672127540300-a04fbdca-3498-4a9b-b4d6-310fc41b6c1c.png#averageHue=%23f8f8f8&clientId=uf0104dab-d4e2-4&from=paste&height=510&id=uf659ec87&originHeight=510&originWidth=788&originalType=binary&ratio=1&rotation=0&showTitle=false&size=62216&status=done&style=none&taskId=u0b0191c6-3cf4-4101-99d0-d8906cec6bb&title=&width=788)

### 3.4 ForkJoin 框架的原理

ForkJoin 框架的大致原理如下:

- ForkJoin 框架中 ForkJoinPool 线程池中的任务分为"外部任务"和"内部任务"。
- "外部任务"存储在 ForkJoinPool 的全局队列中。
- ForkJoinPool 中的每个工作线程都维护着一个任务队列,该任务队列用于存储"内部任务",线程切割任务得到的子任务也会作为内部任务添加到内部队列中。
- 当工作线程获取任务计算结果时,首先判断子任务是否执行完成,如果没有完成,再判断子任务是否被其他线程所窃取,如果子任务没有被窃取,则由本线程完成;如果子任务被其他线程所窃取,则本线程会执行内部任务队列中的其他任务,或者扫描其他线程的任务队列并窃取任务。
- 当工作线程完成内部任务后,工作线程处于空间状态时,就会扫描其他线程的任务队列窃取任务,尽可能不会阻塞等待。

工作窃取算法的优点如下：

- 线程是不会因为等待某个子任务的执行或者没有内部任务要执行而被阻塞等待、挂起的,而是会扫描所有的队列窃取任务,直到所有队列都为空时才会被挂起。
- ForkJoin 框架为每个线程维护着一个内部任务队列以及一个全局的任务队列,而且任务队列都是双向队列,可从首尾两端来获取任务,极大地减少了竞争的可能性,提高并行的性能。

ForkJoinPool 适合需要分而治之的场景,特别是分治之后递归调用的函数,例如快速排序、二分搜索、大整数乘法、矩阵乘法、棋盘覆盖、归并排序、线性时间选择、汉诺塔问题等。ForkJoinPool 适合调度的任务为 CPU 密集型任务，如果任务存在 I/O 操作、线程同步操作、sleep()睡眠等较长时间阻塞的情况,最好配合使用 ManagedBlocker 进行阻塞管理。总体来说,ForkJoinPool 不适合进行 IO 密集型、混合型的任务调度。

### 3.5 ForkJoin 实践之批量导入数据

## 4.生产者消费者模式

## 5.Future 模式
