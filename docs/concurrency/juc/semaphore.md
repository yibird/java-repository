Semaphore(信号量)是 JUC 中提供的另一个同步工具类,用于控制同时访问某个资源的线程数量。它可以用于限制同时执行的线程数量,从而实现资源的有序访问。Semaphore 的基本思想是维护一定数量的许可证(permits),每当一个线程访问资源时,会消耗一个许可证,当许可证用尽时,其他线程需要等待。Semaphore 提供了一种灵活的机制,适用于各种并发控制场景。

## Semaphore 的使用

Semaphore 的构造器有两种形式:

- 使用初始许可证数量创建 Semaphore 实例:

```java
public Semaphore(int permits);
```

- 使用初始许可证数量和公平性标志创建 Semaphore 实例:

```java
public Semaphore(int permits, boolean fair);
```

Semaphore 的方法如下:

- acquire()：尝试获取一个许可证，如果许可证用尽，则阻塞等待。
- acquire(int permits)：尝试获取指定数量的许可证，如果许可证不足，则阻塞等待。
- release()：释放一个许可证,将可用许可证的数量增加一个。如果任何线程正在尝试获取许可证，则会选择一个线程并授予刚刚发布的许可证。为了线程调度的目的,该线程被(重新)启用。
- release(int permits)：释放指定数量的许可证。
- tryAcquire()：尝试获取一个许可证，如果许可证用尽，返回 false，不阻塞等待。
- tryAcquire(int permits)：尝试获取指定数量的许可证，如果许可证不足，返回 false，不阻塞等待。

### 使用 Semaphore 模拟停车场停车

```java
package com.fly;

import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    // 创建Semaphore实例,其许可证数量为5
    private static final Semaphore semaphore = new Semaphore(5);

    public static void main(String[] args) throws InterruptedException {
        // 创建20个线程
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    // 尝试获取一个许可证,如果许可证用尽,则阻塞等待
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + "停车成功!");
                    Thread.sleep(1000);
                    System.out.println(Thread.currentThread().getName() + "驶出停车场!");
                    // 释放一个许可(增加一个许可)
                    semaphore.release();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }).start();
        }
    }
}
```

在上面中使用 Semaphore 构造函数初始化了一个许可证为 5 的 Semaphore 实例,for 循环中创建了 10 个线程,线程中调用了 semaphore.acquire()会尝试获取一个许可证,因此会先打印 5 次停车。semaphore.acquire()执行 5 次后许可证为 0,此时会阻塞后续线程,等待车辆驶出停车场。由于打印车辆驶出后会调用 semaphore.release()释放一个许可证(增加一个许可证),因此其他线程会被唤醒,执行结果如下:

```txt
Thread-2停车成功!
Thread-1停车成功!
Thread-3停车成功!
Thread-4停车成功!
Thread-0停车成功!
Thread-0驶出停车场!
Thread-3驶出停车场!
Thread-2驶出停车场!
Thread-6停车成功!
Thread-7停车成功!
Thread-4驶出停车场!
Thread-1驶出停车场!
Thread-5停车成功!
Thread-8停车成功!
Thread-9停车成功!
Thread-6驶出停车场!
Thread-5驶出停车场!
Thread-7驶出停车场!
Thread-9驶出停车场!
Thread-8驶出停车场!
```

### Semaphore 模拟一个线程等待多线程执行完成

```java
package com.fly;

import java.util.concurrent.Semaphore;

public class SemaphoreExample {
   // 创建Semaphore实例,其许可证数量为3
   private static final Semaphore semaphore = new Semaphore(0);

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 5; i++) {
            new Thread(()->{
                try {
                    Thread.sleep(1000);
                    System.out.println(Thread.currentThread().getName()+"执行完毕!");
                    // 释放一个许可证,将可用许可证的数量增加一个,如何 许可证>0 则等待的线程将被唤醒执行
                    semaphore.release();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }).start();
        }
        // 尝试获取一个许可证,由于Semaphore的许可证为0,因此会阻塞等待
        semaphore.acquire();
        System.out.println("主线程执行完毕");
    }
}
```

```txt
Thread-0执行完毕!
Thread-4执行完毕!
Thread-1执行完毕!
Thread-2执行完毕!
Thread-3执行完毕!
主线程执行完毕
```

### Semaphore 模拟发令枪

Semaphore 实现发令枪,模拟多个线程在某一时刻同时开始执行:

```java
package com.fly;

import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    // 创建Semaphore实例,其许可证数量为0
    private static final Semaphore semaphore = new Semaphore(0);

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 5; i++) {
            new Thread(() -> {
                try {
                    // 尝试获取一个许可证,如果许可证用尽,则阻塞等待
                    semaphore.acquire();
                    Thread.sleep(1000);
                    System.out.println(Thread.currentThread().getName() + "执行完毕!");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }).start();
        }
        // 模拟主线程执行
        Thread.sleep(3000);
        System.out.println("主线程执行完毕");
        // 释放5个许可证,可用许可证为5
        semaphore.release(5);
    }
}
```

执行结果如下:

```txt
主线程执行完毕
Thread-4执行完毕!
Thread-1执行完毕!
Thread-2执行完毕!
Thread-3执行完毕!
Thread-0执行完毕!
```

## Semaphore 源码分析
