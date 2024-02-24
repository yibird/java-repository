与 Java 内置锁不同,JUC 包提供了一系列基于纯 Java 语言实现的锁,这种锁使用非常灵活,可以进行无条件的、可轮训的、定时的、可中断的锁获取和释放操作。由于 JUC 提供的锁在加锁和释放锁的方法都是通过 Java API 显式进行的,因此也叫显式锁。

## 1.显示锁的介绍

使用 JVM 内置锁时,无需通过 Java 代码显式地对同步对象的监视器进行抢占和释放,这些工作都交由 JVM 底层完成,而且任何一个 Java 对象都能作为内置锁使用,因此使用比较简单,但是 JVM 内置锁功能单一,不支持锁的一些高级功能,例如:

- 限时抢锁:在抢锁时设置超时时间,如果超时后还未获得锁则应放弃锁的获取,以避免无限期的等待获取锁资源。
- 可中断抢锁:在抢锁时,外部线程给抢锁线程发送一个中断信号,就能唤醒等待锁的线程,并终止抢占锁的过程。
- 多个等待队列:为锁维持多个等待队列,以便提交抢占锁的效率。例如在生产者-消费者模式中,生产者和消费者共用同一把锁,该锁应维持两个等待队列,一个生产者队列和一个消费者队列。

除了以上问题外,JVM 内置锁还存在性能问题,在竞争激烈的情况下,Java 对象锁会膨胀升级为重量级锁(重量级锁基于操作系统的 Mutex Lock 实现),而重量级锁的线程阻塞和唤醒操作都需要进程在内核态和用户态之间来回切换,因此性能比较差。为了解决 JVM 锁高级特性和锁竞争激烈情况下的性能问题,Java 提供了显式锁。

### 1.1 Lock 接口

Lock 接口是 java.util.concurrent.locks 包下的一个显式锁抽象接口,Lock 接口提供如下方法:

```java
// 抢锁。若成功则向下执行,若失败则阻塞抢锁线程
void lock();
// 可中断抢锁,当前线程在抢锁的过程中可以响应中断信号
void lockInterruptibly() throws InterruptedException;
// 尝试抢锁,线程为非阻塞模式.在调用tryLock()方法后立即返回。抢锁成功返回true,否则返回false
boolean tryLock();
// 限时抢锁,当到达超时时间(time)后返回false,并且此限时抢锁方法也可以响应中断信号
boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
// 释放锁,为了正常释放锁资源(避免死锁),通常在try代码块中使用lock()或tryLock()抢占锁,在finally代码中使用unlock()释放锁
void unlock();
// 获取与显式锁绑定的Condition对象,用于"等待-通知"方式的线程间通信
Condition newCondition();
```

相较于 JVM 内置锁,显式锁具有如下优势:

- 可中断获取锁:使用 synchronized 关键字获取锁时,如果线程没有获取到锁则一直被阻塞,阻塞期间该线程无法响应中断信号,而调用 Lock.lockInterruptibly()方法获取锁时,如果线程被中断,线程将抛出 InterruptedException(中断异常)。
- 可非阻塞获取锁:使用 synchronzied 关键字获取锁时,如果获取锁失败,那么线程会被一直阻塞;而调用 Lock.tryLock()获取锁时,如果获取锁失败,线程不会被阻塞,而是直接返回 false。
- 可限时抢锁:tryLock(long time, TimeUnit unit)可以设置限定抢占锁的超时时间,而 synchronized 关键字获取锁时,如果抢不到锁,线程只能无限期阻塞等待。

在使用 Lock 接口抢占或释放锁时需要注意如下事项:

- 释放锁操作 Lock.unlock()必须在异常处理的 finally 代码块中执行,否则,如果临界区代码抛出异常,锁可能永远得不到释放,导致其他线程获取不到锁资源一直等待或死锁。
- 抢占锁操作 Lock.lock()必须在 try 代码块之外,第一 lock()方法没有申明抛出异常,第二 lock()方法并不一定能够抢占锁成功,在抢占锁失败的情况下去释放锁,可能会导致运行时异常。

```java
/**
 * lock()抢占锁和unlock()释放锁模板
 */
Lock lock = new ReentrantLock();
lock.lock(); // 加锁
try {
  // 加锁成功,执行临界区代码
}finally {
    lock.unlock(); // 释放锁
}


/**
 * tryLock()抢占锁和unlock()释放锁模板
 */
Lock lock = new ReentrantLock();
// 尝试加锁
if (lock.tryLock()) {
    try {
        // 加锁成功,执行临界区代码

    } finally {
        lock.unlock(); // 释放锁
    }
} else {
    // 加锁失败
}

// 尝试限时加锁,抢占锁时阻塞1s
if (lock.tryLock(1,TimeUnit.SECONDS)) {
    try {
        // 加锁成功,执行临界区代码

    } finally {
        lock.unlock(); // 释放锁
    }
} else {
    // 加锁失败
}
```

### 1.2 可重入锁 ReentrantLock

ReentrantLock 是 JUC 包提供的显式锁的一个基础实现,ReentrantLock 实现了 Lock 接口,它拥有与 synchronized 相同的并发性和内存语义,具备限时抢占、可中断抢占等一些锁的高级特性。此外 ReentrantLock 基于抽象队列同步器(Abstract Queued Synchroinzed,简称 AQS)实现,在锁竞争激烈的情况下,性能比 JVM 内置锁更好。ReentrantLock 是一个可重入的独占锁(互斥锁),其特点如下:

- 可重入:表示该锁能够支持一个线程对资源的重复加锁,简单来说,一个线程可以多次进入同一个锁所同步的临界区代码块。例如,同一线程在外层方法获取锁后,在内层方法能再次获取该锁,甚至多次抢占同一把锁。
- 独占:在同一时刻只能有一个线程获取锁,其他线程阻塞等待获取锁,只有当持有锁的线程释放锁后,其他线程才能获取该锁。

ReentrantLocka 使用示例:

```java
public class ReentrantLockExample {
    // 创建一把ReentrantLock锁
    private static final ReentrantLock LOCK = new ReentrantLock();

    public static void main(String[] args) {

        // 创建线程1
        new Thread(() -> {
            // 加锁,其他线程进入阻塞状态排队等待获取锁
            LOCK.lock();
            try {
                System.out.println("线程1获取锁");
                // 调用内层方法,验证ReentrantLock锁的可重入性
                lockReentrantMethod();
                System.out.println("线程1释放锁");
            } finally {
                // 释放锁,其他线程竞争锁
                LOCK.unlock();
            }
        }).start();

        // 创建线程2
        new Thread(() -> {
            // 加锁
            LOCK.lock();
            try {
                System.out.println("线程2获取锁");
                // 使当前线程休眠2s
                Thread.sleep(2000);
                System.out.println("线程2释放锁");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // 释放锁
                LOCK.unlock();
            }
        }).start();

    }

    /**
     * 锁重入方法
     */
    public static void lockReentrantMethod() {
        // 加锁
        LOCK.lock();
        try {
            System.out.println("内部方法lockReentrantMethod获取锁");
        } finally {
            // 释放锁
            LOCK.unlock();
        }
    }
}
```

```java
// 执行结果如下:
线程1获取锁
内部方法lockReentrantMethod获取锁
线程1释放锁
线程2获取锁
线程2释放锁
```

在上述例子中,启动了线程 1 和线程 2 两个线程,线程 1 使用 lock()对当前线程进行加锁操作,其内部调用了 lockReentrantMethod()方法。从执行结果来看,lockReentrantMethod()方法也获取了锁资源,这表明 ReentrantLock 支持锁的可重入(一个线程允许持有一把锁多次进入同一临界区代码),只要线程释放锁的次数与获取锁的次数相同,都支持锁的可重入。

### 1.3 基于显式锁实现"等待-通知"方式进行线程通信

### 1.4 LockSupport

LockSupport 是 JUC 提供的一个线程阻塞与唤醒工具类,该类可以让线程在任意位置阻塞和唤醒。LockSupport 提供了一系列静态方法用于阻塞和唤醒线程:

```java
// 用于无限期的阻塞当前线程。park意为停车,如果将Thread当做一辆车,park()方法用于停止车辆
public static void park() {}
// 唤醒某个被阻塞的线程
public static void unpark(Thread thread) {}
/**
 * 使当前线程进入休眠状态,阻塞一段指定的纳秒时间。
 * - blocker:表示关联休眠线程和一个特定的阻塞对象。阻塞对象是一个任意的对象,用于标识线程为何被阻塞,有利于调试和监控。
 * - nanos:线程休眠的纳秒数。如果 nanos 为零或负数,则调用没有效果。
 */
public static void parkNanos(Object blocker, long nanos) {}
// 禁用当前线程,直到指定的截止日期
public static void parkUntil(Object blocker, long deadline) {}
// 无限期的阻塞当前线程,直到它被另一个线程取消停放或中断,blocker关联等待线程和一个特定的阻塞对象
public static void park(Object blocker) {}
// 获取与给定线程的当前阻塞操作关联的Blocker对象
public static Object getBlocker(Thread t) {}
```

LockSupport 阻塞唤醒示例:

```java
public class LockSupportExample {
    public static void main(String[] args) {
        // 创建线程1
        Thread thread01 = new Thread(() -> {
            System.out.println("线程1开始执行");
            // 阻塞当前线程
            LockSupport.park();
            System.out.println("线程1执行完成");
        });
        thread01.start();

        // 创建线程2
        new Thread(() -> {
            System.out.println("线程2开始执行");
            // 当前线程休眠2s
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("线程2执行完成");
            // 唤醒线程1
            LockSupport.unpark(thread01);
        }).start();
    }
}
```

```java
// 执行结果如下:
线程1开始执行
线程2开始执行 // 延迟2s输出线程2执行完成
线程2执行完成
线程1执行完成
```

虽然 Thread.sleep()与 LockSupport.park()都可以使线程处于阻塞状态(两者都不会释放锁),但两者区别如下:

- Thread.sleep()无法从外部唤醒,只能达到睡眠时间自动唤醒,而 LockSupport.park()方法阻塞的线程可以使用 LockSupport.unpark()手动唤醒。
- Thread.sleep()声明了 InterruptedException 中断异常,调用者需要捕获该异常,而 LockSupport.park()方法没有声明异常,调用时无需捕获异常。
- 当使用 LockSupport.park()或 Thread.sleep()方法阻塞的线程时,被阻塞的线程调用 Thread.interrupt()中断线程(设置中断标志),Thread.sleep()会抛出 InterruptedException 异常,而 LockSupport.park()不会抛出异常。
- Thread.sleep()是一个 native 方法,而 LockSupport.park()是一个普通方法,其底层依赖于 Unsafe 类的 park()Native 方法。
- LockSupport.park()相较于 Thread.sleep()能更精准、灵活地阻塞和唤醒线程,而且 LockSupport.park()允许设置一个 Blocker 对象,用于供监视工具或诊断工具确定线程被阻塞的原因。

Object.wait()与 LockSupport.park()功能类似,都可以使线程处于阻塞状态(LockSupport.park()不会释放锁),但两者区别如下:

- Object.wait()方法必须在 synchronzied 块中调用,而 LockSupport.park()允许在任意位置调用。
- 调用 Object.wait()会释放锁,而 LockSupport.park()不会释放锁。
- Object.wait()方法声明了 InterruptedException 异常,调用者需要捕获该异常,而 LockSupport.park()方法没有声明异常,调用时无需捕获异常。
- 当线程在没有调用 Object.wait()阻塞前调用 Object.notify()唤醒(即在调用 wait 方法前调用 notify 方法),则会抛出 IllegalMonitorStateException 异常,而 LockSupport.park()不会抛出任何异常。

### 1.5 显式锁的分类

JUC 提供的显式锁中类繁多,大概分为以下几种:可重入锁和不可重入锁、悲观锁和乐观锁、公平锁和非公平锁、共享锁和独占锁、可中断锁和不中断锁。

#### 1.5.1 可重入锁和不可重入锁

可重入锁(Reentrant Lock)和不可重入锁是两种不同的锁的概念,它们主要涉及到同一个线程对同一个锁的多次获取。

- 可重入锁:可重入锁允许同一个线程多次获得同一把锁。也就是说,当一个线程获得了锁之后,可以再次获得而不会被阻塞。这种锁的机制可以防止自己阻塞,允许线程在已经拥有锁的情况下继续获取该锁。例如 ReentrantLock 就是一个典型的可重入锁,在同一个线程内,可以多次调用 lock() 方法,而不会出现死锁。
- 不可重入锁:不可重入锁是指一个线程在持有锁的情况下,再次去获取该锁会造成死锁或阻塞。如果一个线程已经获得了锁,再次请求该锁时就会被阻塞,即使是同一个线程。例如 synchronized 关键字就是一个不可重入锁,如果一个线程已经获得了某个对象的锁,再次请求时会被阻塞,直到其他线程释放了这个锁。

#### 1.5.2 悲观锁和乐观锁

从线程进入临界区前是否锁住同步资源的角色来分,显式锁可分为悲观锁和乐观锁。

- 悲观锁:悲观锁认为在并发环境中,总是会有其他线程来竞争同一个资源,因此在访问共享资源之前,悲观锁会先获取锁,阻塞其他线程的访问,确保当前线程独占资源。因此悲观锁适用于并发更新的概率较高,而且对数据完整性要求很高的场景。例如 synchronized 和 ReentrantLock 都是悲观锁的典型实现,当一个线程获取了锁,其他线程就需要等待锁的释放。
- 乐观锁:乐观锁假设在并发环境中,不会有太多线程竞争同一个资源,因此在访问共享资源之前,并不获取锁。相反,它先进行操作,然后在更新时检查是否有其他线程对资源进行了修改。如果没有,操作成功;如果有,需要进行相应的冲突解决(通常是回滚操作)。因此乐观锁适用于并发更新的概率较低,而且对性能要求较高的场景。

Java 中的乐观锁基本基于 CAS 自旋操作实现的,CAS 是一种更新操作,比较当前值跟传入值是否相同,若是则更新,否则失败。因此在争用激烈的情况下,CAS 自旋会出现大量空自旋,会导致乐观锁的性能下降。JUC 提供的显式锁为了减少 CAS 空自旋,提升锁的性能,其底层基于 AQS 实现,AQS 通过队列的方式很多程度上减少了锁的争用,极大的减少了 CAS 空自旋。即使在锁竞争激烈的场景下,基于 AQS 的乐观锁比悲观锁性能更好。

#### 1.5.3 公平锁和非公平锁

从多个线程竞争锁时的获取顺序的角度来看,显式锁被分为公平锁和非公平锁:

- 公平锁:公平锁是一种获取锁的方式,它遵循先来先服务的原则。在多个线程竞争同一个锁的情况下,公平锁会按照线程的请求顺序依次获取锁。即等待时间最长的线程会优先获得锁。公平锁保证了线程获取锁的公平性,避免了某些线程长时间无法获得锁的情况。公平锁适用于对锁的获取顺序要求较高的场景,由于需要根据顺序依次获取锁,性能相较于非公平锁要差。在 Java 中,ReentrantLock 可以实现公平锁,通过在创建锁时传入 true 来表示创建公平锁,例如`ReentrantLock lock = new ReentrantLock(true)`来创建一把具有可重入性的公平锁。
- 非公平锁:非公平锁是一种获取锁的方式,它并不考虑等待队列中的线程的顺序,而是允许"插队"。即新来的线程有可能在等待队列中的某个位置直接获取锁,而不考虑其他等待时间更长的线程,可能导致某些线程长时间无法获得锁。非公平锁适用于对性能要求且吞吐量高的场景。在 Java 中,ReentrantLock 默认是一把非公平锁。

#### 1.5.4 可中断锁和不可中断锁

当线程持有锁时,是否允许其他线程对其进行中断的角度来分区,可分为可中断锁和不可中断锁:

- 可中断锁:可中断锁是一种允许线程在等待获取锁的过程中被中断的锁。如果一个线程在等待锁时被中断,它会收到一个 InterruptedException,从而有机会处理中断请求。 JUC 的显式锁属于可中断锁(如 ReentrantLock)。
- 不可中断锁:不可中断锁是一种在等待获取锁的过程中不响应中断的锁。即使线程被中断,它仍然会继续等待锁,不会抛出 InterruptedException。例如 synchronized 就是一把不可中断锁。

#### 1.5.5 共享锁和独占锁

从控制对共享资源的访问的角度来看,JUC 显式锁可分为共享锁和独占锁:

- 共享锁:共享锁是一种允许多个线程同时持有的锁。当一个线程持有共享锁时,其他线程也可以持有相同的共享锁,这样多个线程可以同时读取共享资源而不会相互影响。在 Java 中，ReentrantReadWriteLock 是一个典型的实现共享锁和独占锁的锁,通过 readLock()方法获取共享锁,通过 writeLock()方法获取独占锁。共享锁适用于对共享资源的读操作远远多于写操作的场景,这种场景下共享锁可以大幅度提高并发性能。
- 独占锁:独占锁是一种在任意时刻只允许一个线程持有的锁。当一个线程持有独占锁时,其他线程无法获得相同的锁,直到持有锁的线程释放它。在 Java 中,synchronized 和 ReentrantLock 都属于独占锁。独占锁适用于对共享资源的写操作较为频繁,且需要保证写操作的原子性的场景。

## 2.悲观锁和乐观锁

### 2.1 悲观锁的缺点

### 2.2 基于 CAS 实现乐观锁

### 2.3 实现不可重入的自旋锁

### 2.4 实现可重入的自旋锁

## 3.公平锁和非公平锁

## 4.共享锁和独占锁

## 5.可中断锁和不中断锁

## 6.读写锁
