由于 JVM 的 Synchronized 重量级锁涉及操作系统内核态下互斥锁的使用,因此其线程阻塞和唤醒都涉及进程在用户态到内核态的频繁切换,导致重量级锁开销大、性能低。而 JVM 的 Synchronized 轻量级锁使用 CAS(Compare And Swap,即比较与交换)进行自旋抢锁,CAS 是 CPU 指令级的原子操作,处于用户态下,所以 JVM 轻量级锁的开销较小,性能相对较好。

## 1.CAS 介绍

JDK5 新增的 JUC(java.util.concurrent)并发包对操作系统的底层 CAS 原子操作进行了封装,为上层 Java 应用提供了 CAS 操作。

### 1.1 Unsafe 类

Unsafe 是位于 sun.misc 包下的一个类,该类主要提供一些执行低级别、不安全的底层操作,例如直接访问系统内存资源、自主管理内存资源等等。Unsafe 类中大多数方法都是本地方法(native method),底层基于 C++实现,这些方法可以提高 Java 的运行效率,增强 Java 语言底层资源操作能力,Unsafe 类也提供了 CAS 操作相关方法。

> 注意:Unsafe 类可以像 C 语言一样使用指针操作内存空间,这无疑增加了指针相关的问题、内存泄漏问题出现的概率,使用 Unsafe 类需要格外慎重。

在操作系统层面 CAS 是一条 CPU 的原子指令(cmpxchg 指令),正是由于该指令具备原子性,因此使用 CAS 操作操作数据是不会造成数据不一致的问题。Unsafe 提供的 CAS 方法直接通过 native 方式调用了底层的 CPU 指令 cmpxchg。Java 使用 Unsafe 进行 CAS 操作步骤如下:

- 获取 Unsafe 实例。由于 Unsafe 类的构造是私有的(Unsafe 构造使用 private 修饰),无法通过构造函数初始化 Unsafe 实例,只能通过反射获取 Unsafe 实例。
- 调用 Unsafe 提供的 CAS 方法。Unsafe 提供的 CAS 方法封装了底层 CPU 和 CAS 原子操作。
- 调用 Unsafe 提供的字段偏移量方法。这些方法用户获取对象的字段(属性)偏移量,此偏移量值需要作为参数提供的给 CAS 操作。

Unsafe 提供的 CAS 方法如下:

```java
public final native boolean compareAndSwapObject(Object var1, long var2, Object var4, Object var5);

public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);

public final native boolean compareAndSwapLong(Object var1, long var2, long var4, long var6);
```

Unsafe 类提供了 compareAndSwapObject、compareAndSwapInt、compareAndSwapLong 三个方法用于 Object、Int、Long 类型值的 CAS 操作,这些方法具有相同的参数,分别表示字段所在的对象、字段内存位置、预期原值和新值。在执行 Unsafe 的 CAS 方法时,这些方法首先将内存位置的值与预期值(旧的值)比较,如果相匹配,那么 CPU 会自动将该内存位置的值更新为新值,并返回 true,如果不匹配,CPU 则不作任何操作,并返回 false。Unsafe 的 CAS 操作会将第一个参数(对象的指针、地址)与第二个参数(字段偏移量)组合在一起,计算出最终的内存操作地址。

Unsafe 偏移量相关方法:

```java
public native long staticFieldOffset(Field var1);

public native long objectFieldOffset(Field var1);
```

- staticFieldOffset()方法用于获取静态属性 Field 在 Class 对象的偏移量,在 CAS 中操作静态属性时会使用该偏移量。
- objectFieldOffset()方法用于获取非静态 Field(非静态属性)在 Object 实例中的偏移量,在 CAS 中操作对象的非静态属性时会使用该偏移量。

### 1.2 使用 CAS 进行无锁编程

**CAS 是一个无锁算法,该算法依赖期望值(旧值)和新值,底层 CPU 利用原子操作判断内存原值与期望值是否相等,如果相等就给内存地址赋值新值,否则不做任何操作**。CAS 无锁编程的步骤如下:

- 获取字段的期望值(oldValue)。
- 计算出需要替换的新值(newValue)。
- 通过 CAS 将新值放在字段的内存地址上,如果 CAS 失败就重复步骤 1 和步骤 2,直到 CAS 成功,重复步骤被称为 CAS 自旋。

CAS 无锁编码伪代码:

```java
do{
	获取字段的期望值(oldValue);
    计算出需要替换的新值(newValue);
} while(!CAS(内存地址,oldValue,newValue))
```

假设某个内存地址(某个对象的属性)的值为 100,现在有两个线程(线程 A 和线程 B)使用 CAS 无锁编程对该内存地址进行更新,线程 A 需要将该值修改为 200,线程 B 需要将该值修改为 300。由于线程是并发执行的,最先执行的几率是相等的,但是由于使用 CAS 操作进行修改值,而 CAS 是具备原子性操作,对同一内存地址的 CAS 操作在同一时刻只能执行一个。因此,要么是线程 A 先执行,要么是线程 B 先执行,假设线程 A 的 CAS(100,200)先执行,由于内存地址的旧值与该期望值 100 相等,因此线程 A 会操作成功,内存地址的值被修改为 200。线程 A 执行完成线程 B 进行 CAS(100,300)操作,此时内存地址的值为 200,不等于 CAS 的期望值 100,线程 B 操作失败。线程 B 只能自旋,开始新的循环,本轮循环首先获取到内存的地址的值为 200,然后进行 CAS(200,,300)操作,本轮内存地址的值与 CAS 的预期值相等,则线程 B 操作成功。
当 CAS 将内存地址的值与预期值进行比较时,如果相等,就证明内存地址的值没有被修改,则可以替换成新值,然后继续运行,如果不相等,则说明内存地址的值已经被修改,方法替换操作,然后重新自旋,直到内存地址的值与预期值相等时才会替换该值。**当并发修改的线程较少,出现冲突的机会较少时,自旋的次数也会很少,CAS 的性能会非常好;当并发修改的线程多,出现冲突的概率变多时,导致自旋的次数也会很多,CAS 的性能也会大大降低。因此,提升 CAS 无锁编程效率的关键自安于减少冲突的机会。**

### 1.3 通过 volatile+CAS 原子线程安全

**虽然 CAS 操作具备原子性,但无法保证线程的可见性和有序性,使用 volatile 和 CAS 操作可以实现无锁并发,适用于线程数少,多核 CPU 场景下**。CAS 在 java.util.concurrent.atomic 包中的原子类、Java AQS 以及显式锁、CurrentHashMap 等重要并发容器类的实现都有非常广泛的应用。在原子类通过 CAS 来保障对变量成员进行原子性操作。java.util.concurrent 的大多数(包括显式锁、并发容器)都是基于 AQS 和原子类来实现的,其中 AQS 通过 CAS 保障它内部双向队列头部、尾部操作的原子性。

```java
package com.fly.cas;

import sun.misc.Unsafe;

import java.lang.reflect.Field;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

public class CASExample01 {

    // 并发数量
    private static final int THREAD_COUNT = 10;
    // 每次累加值
    private static final int INCREMENT_COUNT = 1000;

    public static void main(String[] args) throws InterruptedException {
        final OptimisticLockPlus cas = new OptimisticLockPlus();
        // 倒数闩,需要倒数 THREAD_COUNT 次,await()才会停止阻塞
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);
        // 通过Executors线程池工厂快捷创建一个具有缓存功能的线程池(不推荐)
        ExecutorService pool = Executors.newCachedThreadPool();
        for (int i = 0; i < THREAD_COUNT; i++) {
            // 提交10个任务
            pool.submit(() -> {
                for (int j = 0; j < INCREMENT_COUNT; j++) {
                    cas.increment();
                }
                // 每执行完一个任务,计数闩就倒数减一
                latch.countDown();
            });
        }
        // 主线程阻塞等待计数闩倒数完毕
        latch.await();
        // 关闭线程池
        pool.shutdown();
        System.out.println("累加和:" + cas.value);
        System.out.println("cas自旋次数:" + cas.failure.get());

    }

    static class OptimisticLockPlus {
        // 内部值,使用volatile关键字来保证线程的可见性
        private volatile int value;
        // value字段的偏移量
        private static long valueOffset = 0;
        // long类型的原子类,用于统计失败次数
        private final AtomicLong failure = new AtomicLong(0);
        // unsafe实例,通过unsafe提供的CAS方法来进行CAS操作
        private static final Unsafe unsafe = OptimisticLockPlus.getUnsafe();

        /**
         * 通过静态代码块初始化value字段的内存偏移量
         */
        static {
            try {
                // 获取value Field对象
                Field field = OptimisticLockPlus.class.getDeclaredField("value");
                field.setAccessible(true);
                // 获取value字段偏移量
                valueOffset = unsafe.objectFieldOffset(field);
            } catch (Exception e) {
                throw new Error(e);
            }
        }


        /**
         * 通过反射获取Unsafe实例
         *
         * @return Unsafe实例
         */
        public static Unsafe getUnsafe() {
            try {
                /**
                 * Unsafe类中提供了一个theUnsafe静态属性,通过
                 * Unsafe.class.getDeclaredField("theUnsafe")以反射机制获取Field对象,
                 * Field调用setAccessible()设置字段是可访问的,否则抛出NoSuchFieldException异常,
                 * 最后将Field强转为Unsafe对象
                 */
                Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
                theUnsafe.setAccessible(true);
                return (Unsafe) theUnsafe.get(null);
            } catch (Exception e) {
                throw new AssertionError(e);
            }
        }

        /**
         * 比较value字段的旧值与新值是否相等,若相等则将新值替换旧值
         *
         * @param oldValue 旧值
         * @param newValue 新值
         * @return
         */
        public final boolean unSafeCompareAndSet(int oldValue, int newValue) {
            return unsafe.compareAndSwapInt(this, valueOffset, oldValue, newValue);
        }

        // 自增方法
        public void increment() {
            // 获取旧值
            int oldValue = value;
            // 通过CAS自旋,如果操作失败就自旋,直到操作成功
            do {
                // 获取旧值
                oldValue = value;
                // 统计自旋次数
                failure.incrementAndGet();
            } while (!unSafeCompareAndSet(oldValue, oldValue + 1));
        }
    }
}
```

```java
// 执行结果:
累加和:10000
cas自旋次数:20399
```

执行步骤:

- OptimisticLockPlus 类中定义了 value(内部值)、valueOffset(value 字段的内存偏移量)、failure(long 类型的原子,用于统计自旋次数)
