## 1.CompletableFuture 介绍

CompletableFuture 是 JDK8 提供了一个用于处理异步回调的工具类,通常用于任务的编排。CompletableFuture 实现了 Future 和 CompletionStage 两个接口,具备函数式编程能力。该类的实例作为一个异步任务,支持在异步任务执行完成后执行其他异步任务,从而达到异步回调效果。

### 1.1 CompletionStage 接口

CompletionStage 代表异步计算过程中的某一个阶段,一个阶段完成后可能会进入另一个阶段。一个阶段可以理解为一个子任务,每个子任务会包装一个 Java 函数式接口实例,表示该子任务所要执行的操作。
每个 CompletionStage 子任务所包装的可以是一个 Function、Consumer 或 Runnable 函数式接口实例,这三个函数式接口特点如下:

- **Function<T,R>**:Function 接口的特点是有输入且有输出。包装了 Function 接口实例的 CompletionStage 子任务需要一个输入参数,并会产生一个输出结果到一下步。
- **Runnable**:Runnable 接口的特点是无输入且无输出。包装了 Runnable 接口实例的 CompletionStage 子任务既不需要任何输入参数,也不会产生任何输出。
- **Consumer<? super T>**:Consumer 接口的特点是有输入无输出。包装了 Consumer 接口实例的 CompletionStage 子任务需要一个输入参数,但不会产生任何输出。

CompletionStage 的子任务虽然可以触发其他子任务,但并不能保证后续子任务的执行顺序。

### 1.2 使用 runAsync()和 supplyAsync()创建子任务

- `static <U> CompletableFuture<U> runAsync(Runnable runnable)`:创建一个无输入、无输出的异步任务,返回一个 CompletableFuture 实例, 该异步任务由 ForkJoinPool.commonPool()执行完成。
- `static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)`:创建一个无输入、有输出的异步任务,并返回一个 CompletableFuture 实例,该异步任务由 ForkJoinPool.commonPool()执行完成。
- `static <U> CompletableFuture<U> completedFuture(U value)`:用于创建一个 completed(完成)状态的 CompletableFuture 实例,通过 CompletableFuture 实例的 isDone()可以判断任务是否完成。

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * 通过runAsync()和supplyAsync()创建异步任务
 */
public class CompletableFutureExample01 {
    public static void main(String[] args) throws InterruptedException, ExecutionException, TimeoutException {

        /**
         * runAsync()创建一个无输入、无输出的异步任务,返回一个CompletableFuture实例,
         * 该异步任务由ForkJoinPool.commonPool()执行完成。
         */
        CompletableFuture future1 = CompletableFuture.runAsync(() -> {
            System.out.println("future1 run async task...");
        });
        // 等待2s执行异步任务获取结果
        future1.get(2, TimeUnit.SECONDS);

        /**
         * supplyAsync():创建一个无输入、有输出的异步任务,并返回一个CompletableFuture实例,
         * 该异步任务由ForkJoinPool.commonPool()执行完成。
         */
        CompletableFuture<Long> future2 = CompletableFuture.supplyAsync(() -> {
            long start = System.currentTimeMillis();
            try {
                // 休眠2000,模拟任务耗时
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // 统计任务执行耗时
            return System.currentTimeMillis() - start;
        });
        Long time = future2.get();
        System.out.println("future2 run async task time:" + time + "ms");

        // 创建一个completed(完成)状态的CompletableFuture实例
        CompletableFuture<String> completed = CompletableFuture.completedFuture("completed");
        System.out.println("completed状态:"+completed.isDone());
    }
}
```

执行结果:

```latex
future1 run async task...
future2 run async task time:2003ms
completed状态:true
```

### 1.3 设置子任务的回调钩子方法

CompletableFuture 支持设置特定的回调钩子方法,当计算结果完成会抛出异常时,就会执行这些钩子方法。CompletableFuture 提供 whenComplete()和 exceptionally()两个钩子方法分别用于在子任务完成时和出现异常时执行。其中 whenComplete 提供了三个重载方法:

- **CompletableFuture whenComplete(BiConsumer<? super T, ? super Throwable> action)**:设置子任务执行完成的钩子方法,并返回一个 CompletableFuture 实例。
- **CompletableFuture whenCompleteAsync(BiConsumer<? super T, ? super Throwable> action)**:设置子任务执行完成后执行的钩子方法,并返回一个 CompletableFuture 实例。注意:异步任务可能与钩子方法不在同一线程执行。
- **CompletableFuture whenCompleteAsync(BiConsumer<? super T, ? super Throwable> action, Executor executor)**:设置子任务执行完成的后钩子方法,异步任务会提交给 executor 执行,并返回一个 CompletableFuture 实例。
- **CompletableFuture exceptionally(Function<Throwable,? extends T> fn)**:设置子任务执行异常时的钩子方法,返回一个 CompletableFuture 实例。

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.BiConsumer;
import java.util.function.Function;

/**
 * 异步任务钩子:
 * - CompletableFuture<T> whenComplete(BiConsumer<? super T, ? super Throwable> action):设置子任务执行
 * 完成的钩子方法,并返回一个CompletableFuture实例。
 * - CompletableFuture<T> whenCompleteAsync(BiConsumer<? super T, ? super Throwable> action):设置子任务
 * 执行完成后执行的钩子方法,并返回一个CompletableFuture实例。注意:异步任务可能与钩子方法不在同一线程执行。
 * - CompletableFuture<T> whenCompleteAsync(BiConsumer<? super T, ? super Throwable> action, Executor executor):
 * 设置子任务执行完成的后钩子方法,异步任务会提交给executor执行,并返回一个CompletableFuture实例。
 *
 * - exceptionally(Function<Throwable,? extends T> fn):设置子任务执行异常时的钩子方法,返回
 * 一个CompletableFuture实例。
 */
public class CompletableFutureExample02 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture future1 =CompletableFuture.runAsync(()->{
            System.out.println("future1 run async task...");
        });
        // 设置异步任务执行完成的钩子方法
        future1.whenComplete(new BiConsumer<Void,Throwable>() {
            @Override
            public void accept(Void t, Throwable action) {
                System.out.println("after future1 task run complete");
            }
        });
        System.out.println("====================================");
        CompletableFuture future2 = CompletableFuture.runAsync(()->{
            try {
                Thread.sleep(1000);
                throw new RuntimeException("future2 exception");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        // 异步任务执行异常执行的回调钩子
        CompletableFuture<String> exceptionFuture = future2.exceptionally(new Function<Throwable, String>() {
            @Override
            public String apply(Throwable t) {
                System.out.println("future2 task run exception:" + t.getMessage());
                return t.getMessage();
            }
        });
        // 获取CompletableFuture异步任务执行结果
        String result = exceptionFuture.get();
        System.out.println("result:"+result);
    }
}
```

执行结果:

```latex
future1 run async task...
after future1 task run complete
====================================
future2 task run exception:java.lang.RuntimeException: future2 exception
result:java.lang.RuntimeException: future2 exception
```

### 1.4 使用 handle()方法统一处理异常和结果

CompletableFuture 除了可以 exceptionally()钩子方法进行异常处理外,还提供了 handle()进行统一异常处理,handle()有三个重载方法:

```java
// 返回一个新的CompletionStage,当此阶段正常或异常完成时,将使用此阶段的结果和异常作为所提供函数的参数来执行该阶段
public <U> CompletionStage<U> handle
        (BiFunction<? super T, Throwable, ? extends U> fn);
// 返回一个新的CompletionStage,当此阶段正常或异常完成时,将使用此阶段的默认异步执行工具执行该阶段,并将此阶段的结果和异常作为所提供函数的参数
public <U> CompletionStage<U> handleAsync
        (BiFunction<? super T, Throwable, ? extends U> fn);
// 返回一个新的CompletionStage,当此阶段正常或异常完成时,将使用提供的执行器执行该阶段,并将此阶段的结果和异常作为提供函数的参数
public <U> CompletionStage<U> handleAsync
        (BiFunction<? super T, Throwable, ? extends U> fn,
        Executor executor);
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.BiFunction;

/**
 * handle()进行异常处理
 */
public class CompletableFutureExample03 {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture future1 = CompletableFuture.runAsync(() -> {
            System.out.println("future1 run async task...");
        });

        /**
         *  CompletionStage实例调用handle()时,无论该实例是否出现异常
         *  都会执行handle()。
         *  handle用于对CompletableFuture进行异常处理,
         *  BiFunction<Void, Throwable, Void>是一个函数式接口,
         *  接收三个泛型,第一个泛型和第二泛型分别表示重写方法apply()的参数类型,
         *  当CompletionStage实例执行正常时,第二个参数的值为null,
         *  第三个泛型为apply的返回值类型。
         */
        CompletableFuture future1Exception = future1.handle(new BiFunction<Void, Throwable, String>() {
            @Override
            public String apply(Void unused, Throwable t) {
                if (t == null) {
                    System.out.println("future1未发生异常!");
                    return null;
                }
                System.out.println("future1发生了异常!");
                return t.getMessage();
            }
        });
        System.out.println("future1Exception get():" + future1Exception.get());

        System.out.println("===========================");

        CompletableFuture future2 = CompletableFuture.runAsync(() -> {
            System.out.println("future2 run async task...");
            try {
                // 睡眠1s
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // 主动抛出异常
            throw new RuntimeException("future2 exception!");
        });
        CompletableFuture future2Exception = future2.handle(new BiFunction<Void, Throwable, String>() {
            @Override
            public String apply(Void unused, Throwable t) {
                if (t == null) {
                    System.out.println("future2未发生异常!");
                } else {
                    System.out.println("future2发生了异常!");
                }
                return t.getMessage();
            }
        });
        System.out.println("future2Exception:"+future2Exception.get());
    }
}
```

执行结果:

```latex
future1 run async task...
future1未发生异常!
future1Exception get():null
===========================
future2 run async task...
future2发生了异常!
future2Exception:java.lang.RuntimeException: future2 exception!
```

### 1.5 创建子任务指定线程池处理

默认情况下,通过静态方法 runAsync()、supplyAsync()创建的 CompletableFuture 任务会使用公共的 ForkJoinPool 线程池处理,默认的线程核心数是 CPU 的核心数。也可以通过 JVM 参数设置:

```java
option:-Djava.util.concurrent.ForkJoinPool.common.Parallelism
```

如果所有 CompletableFuture 任务共享一个线程池,那么一旦有任务执行一些很慢的 IO 操作,就会导致线程池中的所有线程都阻塞在 IO 操作上,造成线程饥饿,进而影响整个系统的性能。所以,建议根据不同类型的任务创建不同的线程池,避免相互干扰。

```java
package com.fly.completableFuture;

import com.fly.pool.ThreadPool03;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 使用runAsync()或supplyAsync()创建子任务时指定线程池处理
 */
public class CompletableFutureExample04 {


    /**
     * 创建线程池
     */
    public static ThreadPoolExecutor getThreadPoolExecutor() {
        // 核心线程数,获取当前CPU核心数作为线程核心数
        final int corePoolSize = Runtime.getRuntime().availableProcessors();
        // 最大线程数,最大线程数必须大于0并且大于线程核心数,否则将抛出java.lang.IllegalArgumentException(参数错误)
        final int maximumPoolSize = corePoolSize * 2;
        // 线程组,用于区分线程所属组
        final ThreadGroup group = new ThreadGroup("group1");
        // 计数器,作为线程的编号
        final AtomicInteger threadNumber = new AtomicInteger(1);

        return new ThreadPoolExecutor(
                // 核心线程数
                corePoolSize,
                // 最大线程数
                maximumPoolSize,
                // 线程存活时间
                10000,
                // 线程存活时间单位
                TimeUnit.MILLISECONDS,
                // 阻塞队列,用于存放处理任务
                new LinkedBlockingQueue<>(),
                // 线程工厂,用于创建线程
                (r) -> new Thread(group, r, "-thread-" + threadNumber.getAndIncrement()),
                // 线程池拒绝策略
                (Runnable r, ThreadPoolExecutor executor) -> {
                });
    }


    public static String getThreadName() {
        Thread thread = Thread.currentThread();
        String groupName = thread.getThreadGroup().getName();
        return groupName + thread.getName();
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ThreadPoolExecutor pool = CompletableFutureExample04.getThreadPoolExecutor();

        // 创建子任务时指定线程池处理
        CompletableFuture<Void> future1 = CompletableFuture.runAsync(() -> {
            System.out.println("future1 run async task...");
            String threadName = CompletableFutureExample04.getThreadName();
            System.out.println("threadName:" + threadName);
        }, pool);
        future1.get();


        CompletableFuture<Long> future2 = CompletableFuture.supplyAsync(() -> {
            long start = System.currentTimeMillis();
            System.out.println("future2 run async task...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            String threadName = CompletableFutureExample04.getThreadName();
            System.out.println("threadName:" + threadName);
            return System.currentTimeMillis() - start;
        }, pool);
        System.out.println("future2 time:" + future2.get() + "ms");
        // 关闭线程池
        pool.shutdown();
    }
}
```

执行结果:

```latex
future1 run async task...
threadName:group1-thread-1
future2 run async task...
threadName:group1-thread-2
future2 time:2005ms
```

## 2.异步任务串行执行

CompletableFuture 内部提供了 thenApply()、thenAccept()、thenRun()和 thenCompose()四个方法支持任务串行执行(一个任务依赖于另一个任务)。

### 2.1 thenApply()

thenApply()有三个重载版本:

```java
// 后一个任务和前一个任务在同一个线程执行
public <U> CompletableFuture<U> thenApply(Function<? super T,? extends U> fn);
// 后一个任务和前一个任务在不同线程中执行
public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn)
// 后一个任务在指定executor线程池中执行
public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn, Executor executor)
```

thenApply()的三个重载版本都有一个共同的参数 fn,该参数表示要串行执行的第二个异步任务,它的类型为 Function。Function<T,U>函数式接口可以接收两个泛型,泛型 T 表示上一个任务所返回结果的类型,泛型 U 表示当前任务的返回值类型。

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * thenApply()
 */
public class CompletableFutureExample05 {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<String> future = CompletableFuture.supplyAsync(new Supplier<Long>() {
            @Override
            public Long get() {
                return 10L + 10L;
            }
        }).thenApply(new Function<Long, String>() {
            // firstStepOutCome 为了上一次的执行结果
            @Override
            public String apply(Long firstStepOutCome) {
                return "result:"+(firstStepOutCome * 2);
            }
        });
        System.out.println(future.get());
    }
}
```

执行结果:

```latex
result:40
```

### 2.2 thenRun()

thenRun()与 thenApply()不同,thenRun()不关注任务的执行结果,只要前一个任务执行完成,就开始串行执行后一个任务。thenRun 提供了三个重载版本:

```java
// 后一个任务与前一个任务在同一个线程中执行
public CompletableFuture<Void> thenRun(Runnable action);
// 后一个任务与前一个任务在不同线程中执行
public CompletableFuture<Void> thenRunAsync(Runnable action);
// 任务在指定线程池executor中执行
public CompletableFuture<Void> thenRunAsync(Runnable action,Executor executor);
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * thenRun():thenRun()与thenApply()不同,thenRun()不关注任务的执行结果,只要前一个任务执行完成,
 * 就开始串行执行后一个任务。
 */
public class CompletableFutureExample06 {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<Void> future = CompletableFuture.supplyAsync(new Supplier<Long>() {
            @Override
            public Long get() {
                System.out.println("supplyAsync run async task...");
                return 10L + 10L;
            }
        }).thenRun(new Runnable() {
            @Override
            public void run() {
                System.out.println("thenRun run async task...");
            }
        });
        future.get();
    }
}
```

```latex
supplyAsync run async task...
thenRun run async task...
```

### 2.3 thenAccept()

thenAccept():thenAccept()对 thenRun()和 thenApply()的特点进行了折中,调用此方法时后一个任务可以接收(或消费)前一个任务的处理结果,但是后一个任务没有结果输出。thenAccept()提供了三个重载版本:

```java
// 后一个任务与前一个任务在同一个线程中执行
public CompletableFuture<Void> thenAccept(Consumer<? super T> action);
// 后一个任务与前一个任务在不同线程中执行
public CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action);
// 任务在指定线程池executor中执行
public CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action,Executor executor);
```

Consumer 函数式接口接收一个泛型参数作为 accept()的入参,accept()的返回执行为 void。

```java
@FunctionalInteface
public interface Consumer<T>{
    void accept(T t);
}
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import java.util.function.Supplier;

/**
 * thenAccept():thenAccept()对thenRun()和thenApply()的特点进行了折中
 * ,调用此方法时后一个任务可以接收(或消费)前一个任务的处理结果,但是后一个任务
 * 没有结果输出。
 */
public class CompletableFutureExample07 {
    public static void main(String[] args) {
        CompletableFuture<Void> future = CompletableFuture.supplyAsync(new Supplier<Long>() {
            @Override
            public Long get() {
                System.out.println("supplyAsync run async task...");
                return 10L + 10L;
            }
        }).thenAccept(new Consumer<Long>() {
            @Override
            public void accept(Long firstStepOutCome) {
                System.out.println("firstStepOutCome:"+firstStepOutCome);
            }
        });
    }
}
```

执行结果:

```latex
supplyAsync run async task...
firstStepOutCome:20
```

### 2.4 thenCompose()

thenCompose()在功能上与 thenApply()、thenRun()、thenAccept()一样,不同的是 thenCompose 可以对两个任务进行串行的调度操作,第一个任务操作完成时,将它的结果作为参数传递给第二个任务。thenCompose 提供了三个重载方法:

```java
public <U> CompletableFuture<U> thenCompose(Function<? super T, ? extends CompletionStage<U>> fn);
public <U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn);
public <U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn,Executor executor);
```

thenCompose 要求第二个参数的返回值是一个 CompletionStage 异步实例。因此,可以调用 CompletableFuture.supplyAsync()将第二个任务所要调用的普通异步方法包装成一个 CompletionStage 异步实例。

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * thenCompose
 */
public class CompletableFutureExample08 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<Long> future = CompletableFuture.supplyAsync(new Supplier<Long>() {
            @Override
            public Long get() {
                System.out.println("supplyAsync run async task...");
                return 10L + 10L;
            }
        }).thenCompose(new Function<Long, CompletableFuture<Long>>() {
            @Override
            public CompletableFuture<Long> apply(Long aLong) {
                // 将第二个任务所有调用的普通异步方法包装成一个CompletionStage异步实例
                return CompletableFuture.supplyAsync(new Supplier<Long>() {
                    @Override
                    public Long get() {
                        return aLong * 2;
                    }
                });
            }
        });
        System.out.println("result:"+future.get());
    }
}
```

执行结果:

```latex
supplyAsync run async task...
result:40
```

### 1.5 4 个串行执行方法的区别

thenApply()、thenRun()、thenAccept()三者的区别在于其核心参数 fn、action、consumer 的类型不同,thenApply()的参数为 Function<T,R>,thenRun 的参数为 Runnable,thenAccept 的参数类型 Consumer<? super T>。thenCompose 与 thenApply()有本质的不同:

- thenCompose()的返回值是一个新的 CompletionStage 实例,可以持续用来进行下一轮 CompletionStage 任务的调度。
- thenApply()的返回值第二个任务的普通异步方法的执行结果。

## 3.异步任务并行执行

如果某个任务同时依赖另外两个异步任务的执行结果,就需要对另外两个异步任务进行合并。
CompletionStage 接口提供了 thenCombine()、runAfterBoth()、thenAcceptBoth()用于实现任务的合并操作。这三个方法作用类似,其核心参数 fn、action、consumer 的类型不同,分别为 Function<T,R>、Runnable、Consumer<? super T>类型。

### 3.1 thenCombine()

thenCombine()会在两个 CompletionStage 任务都执行完成后,把两个任务的结果一起交给 thenCombine()来处理。thenCombine()提供了三个重载方法:

```java
// 返回一个新的CompletionStage,当此阶段和另一个给定阶段都正常完成时,将使用两个结果作为所提供函数的参数来执行该阶段。
public <U,V> CompletionStage<V> thenCombine(CompletionStage<? extends U> other,
         BiFunction<? super T,? super U,? extends V> fn);
// 返回一个新的CompletionStage，当此阶段和其他给定阶段正常完成时,将使用此阶段的默认异步执行工具执行该阶段,并将两个结果作为所提供函数的参数。
public <U,V> CompletionStage<V> thenCombineAsync
        (CompletionStage<? extends U> other,
        BiFunction<? super T,? super U,? extends V> fn);
// 返回一个新的CompletionStage，当此阶段和其他给定阶段正常完成时,将使用提供的执行器执行该阶段,并将两个结果作为提供函数的参数。
public <U,V> CompletionStage<V> thenCombineAsync
        (CompletionStage<? extends U> other,
        BiFunction<? super T,? super U,? extends V> fn,
        Executor executor);
```

thenCombine 重载的核心参数如下:

- other:表示待合并任务的 CompletionStage 实例。
- fn 参数:表示第一个任务和第二个任务执行完成后,第三步需要执行的逻辑。fn 的参数类型为 BiFunction<? super T,? super U,? extends V>,泛型参数说明如下:
  - T:表示第一个任务的返回结果类型。
  - U:表示第二个任务的返回结果类型。
  - V:表示第三个任务所返回结果的类型。

BiFunction 函数式接口的源码如下:

```java
@FunctionalInterface
public interface BiFunction<T,U,R>{
    R apply(T t,U u);
}
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.BiFunction;
import java.util.function.Supplier;

/**
 * thenCombine
 */
public class CompletableFutureExample09 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 任务1
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                System.out.println("future1 run async task...");
                return 10 + 10;
            }
        });

        // 任务2
        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                System.out.println("future2 run async task...");
                return 10 * 10;
            }
        });

        // 使用thenCombine()合并任务1和任务2
        CompletableFuture<Object> future3 = future1.thenCombine(future2, new BiFunction<Integer, Integer, Object>
                () {
            // step1OutCome为任务1的返回值,step2OutCome为任务2的返回值
            @Override
            public Object apply(Integer step1OutCome, Integer step2OutCome) {
                System.out.println("future3 run async task...");
                return step1OutCome + step2OutCome;
            }
        });
        // outcome:120
        System.out.println("outcome:"+ future3.get());
    }
}
```

执行结果:

```latex
future1 run async task...
future2 run async task...
future3 run async task...
outcome:120
```

### 3.2 runAfterBoth()

runAfterBoth()与 thenCombine()的区别在于,runAfterBoth()不关心合并任务的输入参数和输出结果。runAfterBoth()提供了三个重载方法:

```java
// 返回一个新的CompletionStage,当此阶段和其他给定阶段都正常完成时,该阶段将执行给定的操作
public CompletionStage<Void> runAfterBoth(CompletionStage<?> other,
        Runnable action);
// 返回一个新的CompletionStage,当此阶段和其他给定阶段正常完成时,该阶段将使用此阶段的默认异步执行工具执行给定操作
public CompletionStage<Void> runAfterBothAsync(CompletionStage<?> other,
        Runnable action);
// 返回一个新的CompletionStage,当此阶段和其他给定阶段正常完成时,该阶段将使用提供的执行器执行给定的操作
public CompletionStage<Void> runAfterBothAsync(CompletionStage<?> other,
        Runnable action,
        Executor executor);
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Supplier;

/**
 * runAfterBoth()
 */
public class CompletableFutureExample10 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 任务1
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                System.out.println("future1 run async task...");
                return 10 + 10;
            }
        });

        // 任务2
        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                System.out.println("future2 run async task...");
                return 10 * 10;
            }
        });
        // 合并任务得到一个新的CompletionStage实例
        CompletableFuture<Void> future3 = future1.runAfterBoth(future2, new Runnable() {
            @Override
            public void run() {
                System.out.println("future3 run async task...");
            }
        });
        future3.get();
    }
}
```

执行结果:

```latex
future1 run async task...
future2 run async task...
future3 run async task...
```

### 3.3 thenAcceptBoth()

thenAcceptBoth()对 runAfterBoth()和 thenCombine()的特点进行了折中,调用该方法,合并后第三个任务可以接收其合并过来的第一个任务、第二个任务的处理结果,但是第三个任务(合并任务)没有返回结果。

```java
// 返回一个新的CompletionStage,当此阶段和另一个给定阶段都正常完成时,将使用两个结果作为所提供操作的参数来执行该阶段
public <U> CompletionStage<Void> thenAcceptBoth
        (CompletionStage<? extends U> other,
         BiConsumer<? super T, ? super U> action);
// 返回一个新的CompletionStage,当此阶段和其他给定阶段正常完成时,将使用此阶段的默认异步执行工具执行该阶段,并将两个结果作为所提供操作的参数。
public <U> CompletionStage<Void> thenAcceptBothAsync
        (CompletionStage<? extends U> other,
        BiConsumer<? super T, ? super U> action);
// 返回一个新的CompletionStage,当此阶段和其他给定阶段正常完成时,将使用提供的执行器执行该阶段,并将两个结果作为提供函数的参数
public <U> CompletionStage<Void> thenAcceptBothAsync
        (CompletionStage<? extends U> other,
        BiConsumer<? super T, ? super U> action,
        Executor executor);
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.BiConsumer;
import java.util.function.Supplier;

/**
 * thenAcceptBoth合并任务
 */
public class CompletableFutureExample11 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 任务1
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                System.out.println("future1 run async task...");
                return 10 + 10;
            }
        });

        // 任务2
        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                System.out.println("future2 run async task...");
                return 10 * 10;
            }
        });

        // 合并任务
        CompletableFuture<Void> future3 = future1.thenAcceptBoth(future2, new BiConsumer<Integer, Integer>() {
            @Override
            public void accept(Integer step1OutCome, Integer step2OutCome) {
                System.out.println("future3 run async task...");
                System.out.println("result:" + (step1OutCome + step2OutCome));
            }
        });
        future3.get();
    }
}
```

执行结果:

```latex
future1 run async task...
future2 run async task...
future3 run async task...
result:120
```

### 3.4 allOf()等待所有任务完成

CompletionStage 接口的 allOf()可以合并任务,并且会等待所有的任务结束。CompletionStage 接口提供了 allOf()方法相反功能的 anyOf()。anyOf()接收多个 CompletionStage 实例,anyOf()并不会等待所有任务执行结束,执行过程中只要有任意一个任务执行结束,就会返回一个完成状态的新 CompletableFuture 实例。如果任务正常执行,则将任务的执行结果作为新 CompletableFuture 实例的执行结果。如果任务执行异常,则 CompletionException 将此异常作为其原因。

```java
package com.fly.completableFuture;

import com.sun.scenario.effect.impl.sw.sse.SSEBlend_SRC_OUTPeer;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.BiConsumer;
import java.util.function.Supplier;

/**
 * allOf()合并多个任务
 */
public class CompletableFutureExample12 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 任务1
        CompletableFuture<Void> future1 = CompletableFuture.runAsync(()->{
            System.out.println("future1 run  async task...");
        });
        // 任务2
        CompletableFuture<Void> future2 = CompletableFuture.runAsync(()->{
            System.out.println("future2 run  async task...");
        });
        // 任务3
        CompletableFuture<Void> future3 = CompletableFuture.runAsync(()->{
            System.out.println("future3 run  async task...");
        });
        // 任务4
        CompletableFuture<Integer> future4 = CompletableFuture.supplyAsync(() -> {
            System.out.println("future4 run  async task...");
            return 10 + 10;
        });

        CompletableFuture<Void> allFuture = CompletableFuture.allOf(future1, future2, future3, future4);
        /**
         * 等待所有任务完成,并返回所有任务的结果值,当执行过程中出现异常,
         * 则此方法将引发一个CompletionException异常
         */
        Void result = allFuture.join();
        System.out.println("result:"+result);
    }
}
```

执行结果:

```latex
future1 run  async task...
future2 run  async task...
future3 run  async task...
future4 run  async task...
result:null
```

## 4.异步任务的选择执行

CompletableFuture 对异步任务的选择执行不是按照某种条件进行选择执行的,而是按照执行速度进行选择的:对于两个并行任务,谁的执行速度快,谁的结果值作为第三步任务的输入。CompletionStage 接口提供了 applyToEither()、runAfterEither()、acceptEither()用于异步方法的选择。这三个方法作用类似,唯一的区别在于核心参数 fn、action、consumer 的类型不同,分别为`Function<T,R>`、`Runnable`、`Consumer<? super T>`类型。

### 4.1 applyToEither()

两个 CompletionStage 实例并行执行任务,applyToEither()会使用执行速度最快的 CompletionStage 结果进行下一步的回调操作。applyToEither()提供了三个重载方法:

```java
// 返回一个新的CompletionStage,当此阶段或其他给定阶段正常完成时,该阶段将以相应的结果作为所提供函数的参数执行
public <U> CompletionStage<U> applyToEither(CompletionStage<? extends T> other,
        Function<? super T, U> fn);
// 返回一个新的CompletionStage,当此阶段或其他给定阶段正常完成时,将使用此阶段的默认异步执行工具执行该阶段,并将相应的结果作为所提供函数的参数。
public <U> CompletionStage<U> applyToEitherAsync
        (CompletionStage<? extends T> other,
        Function<? super T, U> fn);
// 返回一个新的CompletionStage,当此阶段或其他给定阶段正常完成时,将使用提供的执行器执行该阶段,并将相应的结果作为提供函数的参数
public <U> CompletionStage<U> applyToEitherAsync
        (CompletionStage<? extends T> other,
        Function<? super T, U> fn,
        Executor executor);
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;

/**
 * applyToEither 异步任务竞速
 */
public class CompletableFutureExample13 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 任务1
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println("future1 run async task...");
            try {
                // 休眠2s
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return 1+1;
        });

        // 任务2,任务2的执行速度优于任务1
        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println("future2 run async task...");
            try {
                // 休眠1s
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return 10 + 10;
        });

        // 任务1与任务2竞速,谁执行快,谁的执行结果就作为applyToEither的第二个参数的输入
        CompletableFuture<Integer> future3 = future1.applyToEither(future2, new Function<Integer, Integer>() {
            @Override
            public Integer apply(Integer result) {                System.out.println("future3 run async task...");
                return result;
            }
        });
        Integer result = future3.get();
        // result:20
        System.out.println("result:"+result);
    }
}
```

执行结果:

```latex
future1 run async task...
future2 run async task...
future3 run async task...
result:20
```

### 4.2 runAfterEither()

调用 runAfterEither(),前面两个 CompletionStage 实例,任何一个完成都会执行第三步回调操作,第三个任务的回调函数都是 Runnable 类型。runAfterEither()提供了三个重载:

```java
public CompletionStage<Void> runAfterEither(CompletionStage<?> other,
                                                Runnable action);
public CompletionStage<Void> runAfterEitherAsync
        (CompletionStage<?> other,
        Runnable action);
public CompletionStage<Void> runAfterEitherAsync
        (CompletionStage<?> other,
        Runnable action,
        Executor executor);
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;

/**
 * runAfterEither 异步任务竞速
 */
public class CompletableFutureExample14 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 任务1
        CompletableFuture<Void> future1 = CompletableFuture.runAsync(() -> {
            System.out.println("future1 run async task...");
            try {
                // 休眠2s
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        // 任务2,任务2的执行速度优于任务1
        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println("future2 run async task...");
            try {
                // 休眠1s
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return 10 + 10;
        });

        // 任务1与任务2竞速,谁执行快,谁的执行结果就作为applyToEither的第二个参数的输入
        CompletableFuture<Void> future3 = future1.runAfterEither(future2, () -> {
            System.out.println("future3 run async task...");
        });
        future3.get();
    }
}
```

执行结果:

```latex
future1 run async task...
future2 run async task...
future3 run async task...
```

### 4.3 acceptEither()

acceptEither()对 applyToEither()和 runAfterEither()进行了折中,两个 CompletionStage 实例并行执行任务,acceptEither()会使用执行速度最快的 CompletionStage 结果进行下一步回调操作的输入,但是该回调操作没有输出。acceptEither()提供了三个重载:

```java
public CompletionStage<Void> acceptEither
        (CompletionStage<? extends T> other,
         Consumer<? super T> action);
public CompletionStage<Void> acceptEitherAsync
        (CompletionStage<? extends T> other,
        Consumer<? super T> action);
public CompletionStage<Void> acceptEitherAsync
        (CompletionStage<? extends T> other,
        Consumer<? super T> action,
        Executor executor);
```

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Consumer;

/**
 * acceptEither 异步任务竞速
 */
public class CompletableFutureExample15 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 任务1
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            System.out.println("future1 run async task...");
            try {
                // 休眠2s
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return 1 + 1;
        });

        // 任务2,任务2的执行速度优于任务1
        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println("future2 run async task...");
            try {
                // 休眠1s
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return 10 + 10;
        });

        // 任务1与任务2竞速,谁执行快,谁的执行结果就作为applyToEither的第二个参数的输入
        CompletableFuture<Void> future3 = future1.acceptEither(future2, new Consumer<Integer>() {
            @Override
            public void accept(Integer result) {
                System.out.println("future3 run async task...");
                System.out.println("result:" + result);
            }
        });
        future3.get();
    }
}
```

执行结果:

```latex
future1 run async task...
future2 run async task...
future3 run async task...
result:20
```

## 5.CompletableFuture 的实践

### 5.1 CompletableFuture 实现煮饭案例

煮饭大致可以分为四个任务:任务 1 负责洗锅、淘米、加水,任务 2 负责插电源、开始煮饭,任务 3 负责等待煮饭完成,等待煮饭的过程中还可以炒菜,任务 4 负责开饭,等待煮饭完成和炒菜完成。

```java
package com.fly.completableFuture;

import java.util.concurrent.CompletableFuture;

public class CompletableFutureExample16 {
    public static void main(String[] args) {
        // 任务1:负责洗锅、淘米、加水
        CompletableFuture<Boolean> job1 = CompletableFuture.supplyAsync(() -> {
            System.out.println("任务1:洗锅");
            System.out.println("任务1:淘米");
            System.out.println("任务1:加水");
            return true;
        });

        // 任务2:负责插电源、开始煮饭,任务1和任务2都是串行的
        CompletableFuture<Boolean> job2 = job1.thenApply((Boolean task1Result) -> {
            if (!task1Result) {
                return false;
            }
            System.out.println("任务2:插电源");
            System.out.println("任务2:开始煮饭");
            return true;
        });

        // 任务3:等待煮饭完成,合并任务1和任务2
        CompletableFuture<Boolean> task3 = job2.thenCombine(job1, (Boolean result1, Boolean result2) -> {
            if (result1 && result2) {
                System.out.println("任务3-1:开始煮饭中...!");
                return true;
            }
            System.out.println("煮饭准备工作未完成!");
            return false;
        });

        // 任务3:等待煮饭的过程中炒菜
        CompletableFuture<Boolean> job3 = CompletableFuture.supplyAsync(() -> {
            System.out.println("任务3-2:开始炒菜");
            System.out.println("任务3-2:炒菜完成");
            return true;
        });

        // 任务4:等待煮饭和炒菜完成,合并煮饭任务和炒菜任务
        CompletableFuture<String> job4 = task3.thenCombine(job3, (result1, result2) -> {
            if (result1 && result2) {
                System.out.println("任务4:煮饭炒菜已完成,开始开饭!");
                return "煮饭炒菜已完成,开始开饭!";
            }
            System.out.println("任务4:煮饭炒菜未完成,等待开饭!");
            return "煮饭炒菜未完成,等待开饭!";
        });
        // 等待所有任务完成
        String result = job4.join();
        System.out.println("result:" + result);
    }
}
```

执行结果:

```latex
任务1:洗锅
任务1:淘米
任务1:加水
任务2:插电源
任务2:开始煮饭
任务3-1:开始煮饭中...!
任务3-2:开始炒菜
任务3-2:炒菜完成
任务4:煮饭炒菜已完成,开始开饭!
result:煮饭炒菜已完成,开始开饭!
```
