CountDownLatch 是 JUC 提供的一个同步工具类,用于控制线程的并发执行,实现线程的同步通信,常用于需要等待一组线程都执行完毕后再进行下一步操作的场景。CountDownLatch 可以用于线程之间的协调和等待，它的核心思想是:一个或多个线程等待其他线程执行完毕,直到满足特定的条件。

## CountDownLatch 的使用

在 CountDownLatch 中支持通过构造函数创建其实例,并且支持传入计数值的初始值(也就是需要等待的任务数量)。CountDownLatch 中提供了 countDown()和 await()两个核心方法:

- countDown():每调用一次 countDown() 方法,计数器减一。当计数器减为 0 时,所有在调用 await() 方法等待的线程都会被唤醒。
- await():当调用 await() 方法的线程会被阻塞,直到计数器变为 0。一旦计数器变为 0,所有等待的线程将被唤醒，继续执行。

CountDownLatch 常用于以下场景:

- 某个线程等待其他线程执行完成。
- 实现发令枪机制,即多个线程等待一个线程执行完成。

### 某个线程等待其他线程执行完成

例如,如果创建一个初始计数值为 5 的 CountDownLatch 实例,那么需要有 5 个线程来调用 countDown() 方法来减小计数值,当计数值减为 0 时,等待的线程会被唤醒。

```java
package com.fly;

import java.util.concurrent.CountDownLatch;

/**
 * main方法()使用for循环中创建了五个线程并执行,正常情况下(不使用CountDownLatch),
 * 会先执行主线程,然后会执行for循环中创建的5个线程。使用CountDownLatch后,由于
 * 在主线程使用了await()阻塞线程,因此主线程会等待CountDownLatch的计数器为0时执行。
 * 由于for循环中创建的线程内部调用了countDown(),CountDownLatch的计数器会减一,
 * 当五个线程创建并执行完毕后,CountDownLatch中的计数器为0,此时会唤醒主线程执行。
 */
public class CountDownLatchExample {
    // 创建一个CountDownLatch实例,初识计数器为5,表示需要等待的任务数量
    private static final CountDownLatch downLatch = new CountDownLatch(5);

    public static void main(String[] args) throws InterruptedException {
        // 创建五个线程
        for (int i = 0; i < 5; i++) {
            new Thread(()->{
                try {
                    // 当前线程休眠1s,模拟业务执行
                    Thread.sleep(1000);
                    System.out.println(Thread.currentThread().getName()+"执行完毕!");
                    // 计数器减一
                    downLatch.countDown();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }).start();
        }
        // 阻塞线程,当CountDownLatch的计数器为0时,会唤醒所有处于等待的线程
        downLatch.await();
        System.out.println("主线程执行完毕");
    }
}
```

main 方法()使用 for 循环中创建了五个线程并执行,正常情况下(不使用 CountDownLatch),会先执行主线程,然后会执行 for 循环中创建的 5 个线程。使用 CountDownLatch 后,由于在主线程使用了 await()阻塞线程,因此主线程会等待 CountDownLatch 的计数器为 0 时执行。for 循环中创建的线程内部调用了 countDown(),CountDownLatch 的计数器会减一,当五个线程创建并执行完毕后,CountDownLatch 中的计数器为 0,此时会唤醒主线程执行。执行结果如下:

```txt
Thread-3执行完毕!
Thread-2执行完毕!
Thread-0执行完毕!
Thread-4执行完毕!
Thread-1执行完毕!
主线程执行完毕
```

### 实现发令枪机制

CountDownLatch 也可以实现发令枪机制,即多个线程等待一个线程执行完成。例如 CountDownLatch 的初始计数器为 1,创建五个线程并调用 await()阻塞线程,主线程调用 countDown()将计数器减一。由于 CountDownLatch 的初始计数器为 1,主线程调用 countDown()后就会唤醒被阻塞的五个线程执行,从而实现了一个线程等待一个线程执行完成。

```java
package com.fly;

import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
    // 创建一个CountDownLatch实例,初识计数器为1,表示需要等待的任务数量
    private static final CountDownLatch downLatch = new CountDownLatch(1);

    public static void main(String[] args) throws InterruptedException {
        // 创建五个线程
        for (int i = 0; i < 5; i++) {
            new Thread(()->{
                try {
                    // 当前线程休眠1s,模拟业务执行
                    Thread.sleep(1000);
                    System.out.println(Thread.currentThread().getName()+"执行完毕!");
                    // 阻塞线程,当CountDownLatch的计数器为0时,会唤醒所有处于等待的线程
                    downLatch.await();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }).start();
        }
        // 计数器减一
        downLatch.countDown();
        System.out.println("主线程执行完毕");
    }
}
```

## CountDownLatch 的源码分析

CountDownLatch 的核心实现是利用 Sync 内部类,它继承自 AbstractQueuedSynchronizer,这是一个用于构建各种同步器的基类。Sync 类中实现了基于 AQS 的同步机制,tryAcquireShared() 方法用于判断是否可以获取共享资源,tryReleaseShared() 方法用于释放共享资源。await() 方法和 countDown() 方法分别调用了 sync 实例的对应方法。

### CountDownLatch 构造函数

### await()

### countDown()
