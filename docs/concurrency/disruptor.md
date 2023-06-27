Disruptor 是一个提供并发环形缓冲区数据结构的库,它旨在为**异步事件**处理体系结构提供**低延迟**、**高吞吐量**的工作**队列**。Disruptor 对比 Java 中的 BlockingQueue(阻塞队列)具有如下优点:

- **支持向 Consumer(使用者)发送广播事件,并带有使用者依赖关系图**。广播事件是 Disruptor 和队列之间最大的区别。当有多个使用者侦听同一个 Disruptor 时,它会将所有事件发布给所有使用者(Consumer),相比之下,队列只会向单个使用者发送单个事件。
- 为事件预分配内存。Disruptor 的目标之一是在低延迟环境中使用,在低延迟系统至,减少或删除内存分配是降低延迟的有效手段之一。在基于 Java 的系统中,目的是减少由于垃圾收集而导致的停顿数量。Disruptor 为了降低延迟,支持预先分配 Disruptor 中事件所需的存储。
- 可选无锁。Disruptor 底层基于无锁算法来提升高吞吐量,对于保证所有内存可见性和正确性均使用内存屏障和 CAS(比较和交换)操作来实现。

Disruptor 适用于以下场景:

- 高性能消息队列:Disruptor 可以作为高性能消息队列的基础框架。它通过无锁的并发设计和环形缓冲区的方式,提供了非常低的延迟和高吞吐量,适用于需要处理大量消息的实时应用。
- 事件驱动架构:Disruptor 的设计理念与事件驱动架构非常契合。它可以用于构建事件驱动的系统,将事件生产者和消费者解耦，并通过并行处理来提高系统的响应能力和吞吐量。
- 金融交易系统:在金融领域,实时交易的性能和延迟非常关键。Disruptor 可以被应用于构建高性能的金融交易系统,用于快速处理交易请求和执行交易逻辑。
- 数据处理和分析:当需要高效地处理和分析大量数据时,Disruptor 可以作为数据处理引擎的一部分。它能够将数据流分发给多个处理器,并通过并行处理提高数据处理的速度和效率。
- 高并发服务器:在构建高并发服务器时,Disruptor 可以用于处理客户端请求和并发任务。通过利用多个消费者线程并行处理请求,可以提高服务器的处理能力和吞吐量。

## 1.Disruptor 介绍

### 1.1 Disruptor 核心概念

- **RingBuffer(环形缓冲区):RingBuffer**通常被认为是中断器的主要方面。 但是,从 Disruptor3.0 开始,环形缓冲区仅负责存储和更新通过 Disruptor 移动的数据。

- **Sequence(序列)**: 通过顺序递增的序号来编号管理通过其进行交换的数据（事件），对数据(事件)的处理过程总是沿着序号逐个递增处理。一个 Sequence 用于跟踪标识某个特定的事件处理者( RingBuffer/Consumer )的处理进度。虽然一个 AtomicLong 也可以用于标识进度,但定义 Sequence 来负责该问题还有另一个目的，那就是防止不同的 Sequence 之间的 CPU 缓存伪共享(Flase Sharing)问题。

- **Sequencer(序列器)**:序列器是颠覆者的真正核心。此接口的两个实现(单个生产者、多生产者)实现了所有并发算法,以便在生产者和消费者之间快速、正确地传递数据。

- **Sequence Barrier(序列屏障)**: 用于保持对 RingBuffer 的 main published Sequence 和 Consumer 依赖的其它 Consumer 的 Sequence 的引用。Sequence Barrier 还定义了决定 Consumer 是否还有可处理的事件的逻辑。
- **Wait Strategy(等待策略)**:等待策略确定使用者将如何等待生产者将事件放入 Disruptor。

- **Event(事件)**:从生产者传递到使用者的数据单位。 事件没有特定的代码表示形式,完全由用户定义。

- **Event Processor(事件处理器)**:用于处理来自中断器的事件的主事件循环,并拥有使用者序列的所有权。 有一个名为 BatchEventProcessor 的单一表示形式,它包含事件循环的有效实现,并将回调到已使用的 EventHandler 接口提供的实现。

- **Event Handler(事件处理程序,使用使用者)**:由用户实现并表示 Disruptor 事件的使用者。

- **Producer(生产者)**:调用 Disruptor 以排队的用户代码。

### 1.2 Disruptor 使用之基本的生产和消费

Disruptor 支持生产消费者模型,在 Disruptor 官方的产生模型基准测试中,单生产者模式相对多生产者性能更好,因为提高并发系统性能的最佳方法之一是遵守单写入器原则。

定义事件类。

```java
package com.fly;

/**
 * 事件类
 */
public class LongEvent {
    private long value;

    public void set(long value)
    {
        this.value = value;
    }

    @Override
    public String toString()
    {
        return "LongEvent{" + "value=" + value + '}';
    }
}
```

定义事件工厂类用于创建事件实例。事件工厂需要实现 EventFactory 接口并重写 newInstance()创建事件实例。

```java
package com.fly;

import com.lmax.disruptor.EventFactory;

/**
 * 事件工厂类。事件工厂需要实现EventFactory接口并重写newInstance(),
 * newInstance()用于创建事件实例,
 */
public class LongEventFactory implements EventFactory<LongEvent> {

    /**
     * 实例化事件
     * @return Long事件实例
     */
    @Override
    public LongEvent newInstance() {
        return new LongEvent();
    }
}
```

事件处理程序类。disruptor 设置事件处理程序类后,当 disruptor 使用 RingBuffer 发布事件时,会广播到所有对应的事件处理程序类。事件处理类需要实现 EventHandler 接口并重写 onEvent(),onEvent()方法在发布者将事件发布到 RingBuffer 时调用。

```java
package com.fly;

import com.lmax.disruptor.EventHandler;

/**
 * 事件处理程序类(使用者)。事件处理类需要实现EventHandler接口并重写onEvent(),
 * 当发布者将事件发布到RingBuffer时调用。
 */
public class LongEventHandler implements EventHandler<LongEvent> {

    /**
     * onEvent()方法在发布者将事件发布到RingBuffer时调用。BatchEventProcessor将成批地
     * 从RingBuffer中读取消息,其中一批是所有可用于处理的事件,无需等待任何新事件到达。
     * @param event      表示发布到RingBuffer的事件。
     * @param sequence   正在处理的事件序列
     * @param endOfBatch 标志,表示这是否是RingBuffer批处理中的最后一个事件
     * @throws Exception
     */
    @Override
    public void onEvent(LongEvent event, long sequence, boolean endOfBatch) throws Exception {
        System.out.println("onEvent Event: " + event);
    }
}
```

定义启动类发送事件。流程如下:

- Disruptor 通过 ringBuffer 事件工厂、RingBuffer 大小、handle 线程工厂构建一个 Disruptor 实例。
- 根据 Disruptor 实例的 handleEventsWith()方法设置对应的事件处理程序类,通过 Disruptor 的 getRingBuffer 方法从 Disruptor 获取要用于发布的 RingBuffer。
- 通过 RingBuffer 的 publishEvent()方法指定发布数据(ByteBuffer)并发布事件。发布事件会广播至所有对应的事件处理程序类。

```java
package com.fly;

import com.lmax.disruptor.RingBuffer;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.util.DaemonThreadFactory;

import java.nio.ByteBuffer;

public class LongEventMain {
    public static void main(String[] args) throws Exception {
        int bufferSize = 1024;
        /**
         * Disruptor(final EventFactory<T> eventFactory, final int ringBufferSize,
         * final ThreadFactory threadFactory):创建一个新的Disruptor实例,参数如下:
         * - eventFactory:在ringBuffer中创建的事件工厂。
         * - ringBufferSize:环形缓冲区的大小。必须为 2 的幂。
         * - threadFactory:为处理器创建线程的threadFactory。
         */
        Disruptor<LongEvent> disruptor =
                new Disruptor<>(LongEvent::new, bufferSize, DaemonThreadFactory.INSTANCE);

        /**
         * 设置事件处理程序(handleEvent),用于处理来自ringBuffer的事件。这些handle将在
         * 事件可用时立即并行处理。
         */
        disruptor.handleEventsWith(new LongEventHandler());
        // 启动事件处理器并返回配置号的环形缓冲区
        disruptor.start();
        // 从disruptor获取要用于发布的ringBuffer
        RingBuffer<LongEvent> ringBuffer = disruptor.getRingBuffer();
        /**
         * 分配新的字节缓冲区。allocate用于为字节缓冲区分配指定容量
         */
        ByteBuffer bb = ByteBuffer.allocate(8);
        for (long l = 0; true; l++)
        {
            // 向ByteBuffer中的指定索引添加对应数据
            bb.putLong(0, l);
            /**
             * 发布事件
             */
            ringBuffer.publishEvent((event, sequence, buffer) -> {
                // 向事件设置数据
                event.set(buffer.getLong(0));
            }, bb);
            Thread.sleep(1000);
        }
    }
}
```

执行结果:

```java
onEvent Event: LongEvent{value=0}
onEvent Event: LongEvent{value=1}
onEvent Event: LongEvent{value=2}
onEvent Event: LongEvent{value=3}
onEvent Event: LongEvent{value=4}
```

### 1.3 Disruptor 阻塞等待策略

Disruptor 阻塞等待策略如下:

- **SleepingWaitStrategy(睡眠等待策略)**:SleepingWaitStrategy 通过循环来保证 CPU 的使用率,不同之处在于,在循环中间使用了对 `LockSupport.parkNanos(1)`的调用,在典型的 Linux 系统上,这会暂停线程大约 60μs。然而,它具有以下好处:生产线程不需要采取任何其他增加适当计数器的动作,并且不需要发信号通知条件变量的成本。
- **YieldingWaitStrategy(放弃等待策略)**:可以用于低延迟系统阻塞策略之一,该策略设计用于可以选择让 CPU 满载运行以改善延迟的情况(此策略将使用 100%的 CPU,但如果其他线程需要 CPU 资源,则会比繁忙旋转策略更容易放弃 CPU)。该策略使用 Thread.yield(),用于在初始旋转后等待屏障的 EventProcessors。当有性能要求并且线程数低于逻辑内核总数(例如启用了超线程)时,Disruptor 推荐使用该策略。
- **BusySpinWaitStrategy(自选等待策略)**:BusySpinWaitStrategy 是 Disruptor 阻塞等待策略中性能最高的一种,它可以在低延迟系统中使用,但对部署环境施加了最高的约束。这个性能最好用在事件处理线程比物理内核数目还要小的时候。例如:在禁用超线程技术的时候。

在 Disruptor 中默认使用**BlockingWaitStrategy**作为等待策略,该策略内部使用典型的锁(Lock)和条件变量(Condition)来处理线程唤醒,这是可用等待策略中最慢的,但在 CPU 使用率方面是最保守的。然而将增大生产者和消费者之前数据传递的延迟。在低延迟没有被要求的场景中,这是一个非常好的策略。一个典型的应用场景是异步日志。

### 1.4 RingBuffer 清除对象

通过 Disruptor 传递数据时,对象的生存期可能比预期更长。为避免这种情况发生,可能需要在处理事件后清除事件。 如果只有一个事件处理程序,则只清除同一处理程序即可,如果一个事件处理程序链,则需要在链的末尾放置一个特定的处理程序来处理清除对象。

定义事件类提供清理对象方法。

```java
package com.fly;

/**
 * Object事件类,提供clear()方法用于清除对象
 * @param <T>
 */
public class ObjectEvent<T> {
    T val;

    /**
     * 用于清除对象
     */
    void clear()
    {
        val = null;
    }

    public void set(T val) {
        this.val = val;
    }
    @Override
    public String toString()
    {
        return "LongEvent{" + "value=" + val + '}';
    }
}
```

定义事件处理程序类。

```java
package com.fly;

import com.lmax.disruptor.EventHandler;

public class ProcessingEventHandler implements EventHandler<ObjectEvent> {
    @Override
    public void onEvent(ObjectEvent event, long sequence, boolean endOfBatch) throws Exception {
        System.out.println("event:"+event);
    }
}
```

定义清理对象处理程序类。

```java
package com.fly;

import com.lmax.disruptor.EventHandler;
public class ClearingEventHandler<T> implements EventHandler<ObjectEvent<T>> {
    @Override
    public void onEvent(ObjectEvent<T> event, long sequence, boolean endOfBatch) throws Exception {
        // 对象使用完毕后清理对象
        event.clear();
    }
}
```

定义启动类。

```java
package com.fly;

import com.lmax.disruptor.RingBuffer;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.util.DaemonThreadFactory;

import java.nio.ByteBuffer;

public class ObjectEventMain {

    private final static int BUFFER_SIZE = 1024;
    public static void main(String[] args) throws InterruptedException {
        Disruptor<ObjectEvent<Long>> disruptor = new Disruptor<>(
                () -> new ObjectEvent<>(), BUFFER_SIZE, DaemonThreadFactory.INSTANCE);

        /**
         * 设置处理程序,如果有多个处理程序需要清理可以链式调用
         * then()设置ClearingEventHandler
         */
        disruptor.handleEventsWith(new ProcessingEventHandler())
                .then(new ClearingEventHandler());
        // 启动事件处理器并返回配置号的环形缓冲区
        disruptor.start();
        // 从disruptor获取要用于发布的ringBuffer
        RingBuffer<ObjectEvent<Long>> ringBuffer = disruptor.getRingBuffer();
        /**
         * 分配新的字节缓冲区。allocate用于为字节缓冲区分配指定容量
         */
        ByteBuffer bb = ByteBuffer.allocate(8);

        for (long l = 0; true; l++)
        {
            // 向ByteBuffer中的指定索引添加对应数据
            bb.putLong(0, l);
            /**
             * 发布事件
             */
            ringBuffer.publishEvent((event, sequence, buffer) -> {
                // 向事件设置数据
                event.set(buffer.getLong(0));
            }, bb);
            Thread.sleep(1000);
        }
    }
}
```

### 1.5 批处理

```java
public class EarlyReleaseHandler implements EventHandler<LongEvent>
{
    // 序列器
    private Sequence sequenceCallback;
    // 剩余批次
    private int batchRemaining = 20;

    @Override
    public void setSequenceCallback(final Sequence sequenceCallback)
    {
        this.sequenceCallback = sequenceCallback;
    }

    @Override
    public void onEvent(final LongEvent event, final long sequence, final boolean endOfBatch)
    {
        processEvent(event);
    	// 逻辑块是否工作完成
        boolean logicalChunkOfWorkComplete = isLogicalChunkOfWorkComplete();
        if (logicalChunkOfWorkComplete)
        {
            sequenceCallback.set(sequence);
        }
    	/**
         * 如果逻辑块工作完成(1批)并且当前事件是RingBuffer的批处理中的最后一个事件中
         * ,则重置batchRemaining为20
         */
        batchRemaining = logicalChunkOfWorkComplete || endOfBatch ? 20 : batchRemaining;
    }

    private boolean isLogicalChunkOfWorkComplete()
    {
        /**
         * 根据较小块所需的任何条件,返回true或false。如果这是在执行I/O,
         * 则可能是在刷新/同步到磁盘之后,或者在DB批处理+提交结束时。
         * 或者它可以简单地处理较小的批量。
         */
        return --batchRemaining == -1;
    }

    private void processEvent(final LongEvent event)
    {
        // Do processing
    }
}
```
