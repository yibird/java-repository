在 Java 中基础容器分为 List、Set、Queue、Map 四大类,常见的容器如 ArrayList、LinkedList、HashMap、HashSet 等,但是都是非线程安全的,在多线程场景下会出现线程安全问题。为了解决线程安全问题,Java 基于内置锁(synchronized)提供了一系列线程安全的同步容器,例如 Vector、HashTable、Stack、SynchronizedList 等容器。虽然同步容器解决了线程安全问题,由于使用内置锁(synchronized),一旦多个线程竞争,性能相对来说较差。为了解决同步容器性能问题,JUC 提供了一系列高并发容器,不仅可以保证线程安全,而且性能相对同步容器更好。

### 1.同步容器类

Java 同步容器通过 Synchronized(内置锁)来实现同步容器,线程安全的同步容器主要有 Vector、HashTable、Stack 等。除此之外,Java Collections 类提供了一系列包装方法,用于将一个普通容器包装成一个线程安全的同步容器,Collections 类同步容器包装方法如下:

- `synchronizedCollection(Collection<T> c)`:将给定的集合包装成线程安全的集合。
- `synchronizedList(List<T> list)`:将给定的 List 包装成线程安全的 List。
- `synchronizedSet(Set<T> s)`:将给定的 Set 包装成线程安全的 Set。
- `synchronizedSortedSet(SortedSet<T> s)`:将给定的有序 Set(例如 TreeSet)包装成线程安全的有序 Set。
- `synchronizedNavigableSet(NavigableSet<T> s)`:将给定的 NavigableSet 包装成线程安全的 NavigableSet。
- `synchronizedMap(Map<K,V> m)`:将给定的 Map 包装成线程安全的 Map。
- `synchronizedSortedMap(SortedMap<K,V> m)`:将给定的有序 Map(例如 TreeMap)包装成线程安全的有序 Map。
- `synchronizedNavigableMap(NavigableMap<K,V> m)`:将给定的 NavigableMap 包装成线程安全的 NavigableMap。

```java
package com.fly;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsDemo {
    public static void main(String[] args) {
        unsafeListMethods();
        syncList();
    }

    /**
     * 使用线程不安全的ArrayList添加元素,多线程环境下添加元素会出现线程安全问题,
     * 其表现为list的size不是 10000
     */
    public static void unsafeListMethods() {
        List<Integer> unsafeList = new ArrayList<>();
        Runnable addTask = () -> {
            for (int i = 0; i < 1000; i++) {
                unsafeList.add(i);
            }
        };
        for (int i = 0; i < 10; i++) {
            new Thread(addTask).start();
        }
        try {
            Thread.sleep(3000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("Size of unsafeList: " + unsafeList.size());
    }

    /**
     * 使用Collections.synchronizedList()将List 包装成线程安全的 List,
     * 以保证多线程情况下添加元素时线程安全
     */
    public static void syncList() {
        List<Integer> unsafeList = new ArrayList<>();
        // 将给定的 List 包装成线程安全的 List
        List<Integer> syncList = Collections.synchronizedList(unsafeList);
        Runnable addTask = () -> {
            for (int i = 0; i < 1000; i++) {
                syncList.add(i);
            }
        };
        for (int i = 0; i < 10; i++) {
            new Thread(addTask).start();
        }
        try {
            Thread.sleep(3000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("Size of syncList: " + syncList.size());
    }
}
```

Vector、HashTable、java.util.Collections 同步包装类使用 synchronized 关键字保证线程安全,即需要同步访问的方法使用 synchronized 修饰。**synchronized 在线程没有发生竞争的情况下处于偏向锁的状态,其性能是非常高的。但是,一旦发生了线程竞争,synchronized 会由偏向锁膨胀升级成重量级锁,在抢占和释放时发生 CPU 内核态与用户态切换,会严重性能,吞吐量也会大幅度降低**。

### 2.JUC 高并发容器

JUC 基于非阻塞算法(Lock Free,无锁算法)提供了一系列高并发容器,包括高并发的 List、Set、Queue、Map 容器。JUC 高并发容器其底层基于 CAS(Compare And Swap)和 volatile 实现无锁编程算法,通过 CAS 保证线程操作的原子性,volatile 关键字保障变量内存的可见性和有序性。无锁编程算法的优点如下:

- **开销小:无需再内核态和用户态之间切换处理。**
- **读写不互斥:只有写操作需要使用基于 CAS 机制的乐观锁,读读操作之间不需要锁。**

#### 2.1 List

JUC 包中高并发 List 容器主要有 CopyOnWriteArrayList,对应非线程安全的 ArrayList。CopyOnWriteArrayList 相当于线程安全的 ArrayList,它实现了 List 接口。每次对 CopyOnWriteArrayList 进行修改操作时,都会复制整个底层数组,因此适用于读多写少的场景,其性能远高于 Vector。

#### 2.2 Set

JUC 包中高并发 Set 容器主要有 CopyOnWriteArraySet、ConcurrentSkipListSet。

- CopyOnWriteArraySet:继承自 AbstractSet 抽象类,对应 HashSet。其内部组合了一个 CopyOnWriteArrayList,其核心基于 CopyOnWriteArrayList 实现线程安全,因此适用于读多写少的场景。
- ConcurrentSkipListSet:线程安全的有序集合,对应 TreeSet。它继承自 AbstractSet 抽象类,并实现了 NavigableSet 接口。ConcurrentSkipListSet 是一个基于跳表(Skip List)数据结构的高并发有序 Set 实现,它提供了线程安全的操作,适用于需要保持元素有序且支持高并发的场景。

#### 2.3 Map

JUC 包中高并发 Map 容器主要有 ConcurrentHashMap 和 ConcurrentSkipListMap。

- ConcurrentHashMap:这是一个高并发的散列映射表,对应 HashMap,但它支持并发地读取和修改操作。在 JDK6 中 ConcurrentHashMap 一种更加细粒度的分段锁加锁机制,它通过将数据分割为多个段(Segment)来实现并发控制,每个段拥有自己的锁。在 JDK8 中 ConcurrentHashMap 采用 CAS 无锁算法保证线程安全。
- ConcurrentSkipListMap:对应 TreeMap,是一个基于跳表(Skip List)数据结构的高并发有序映射表。它是有序的,支持并发操作,适用于需要保持元素有序且支持高并发的场景。

#### 2.4 Queue

JUC 包中提供的 Queue 容器分为单向队列、双向队列、阻塞队列三种:

- ConcurrentLinkedQueue:一个非阻塞的无界队列,适用于高并发的生产者消费者模式。它底层基于链表实现,按照 FIFO(先进先出)对元素排序,支持高效的插入和删除操作,适用于线程数量较多的情况。
- ConcurrentLinkedDeque:一个双端队列(Deque)实现,适用于高并发的多线程环境。它基于链表结构,可以在队列的两端进行插入和删除操作,因此具备双向队列的特性。。

JUC 除了提供普通的单向队列和双向队列外,JUC 扩展了队列,增加了可阻塞的插入获取等操作,提供了一组阻塞队列,例如:

- LinkedBlockingQueue:基于链表的阻塞队列,可以用于实现生产者消费者模式。它支持阻塞操作,在队列为空或已满时,相关操作会阻塞等待。
- ArrayBlockingQueue:基于数组的阻塞队列,同样适用于实现生产者消费者模式。与 LinkedBlockingQueue 不同,它有一个固定的容量。
- PriorityBlockingQueue:支持优先级的无界阻塞队列,元素按照优先级进行排序。适用于需要按照优先级处理任务的场景。
- DelayQueue:延时队列,其中的元素只有在一定的延时时间过后才能被获取,常用于定时任务调度。
- SynchronousQueue:是一个没有存储空间的阻塞队列,用于实现线程间的直接传递。一个线程的插入操作必须等待另一个线程的移除操作。
- LinkedTransferQueue:TransferQueue: 是一个接口,继承自 BlockingQueue(阻塞队列),提供了更高级的操作,如支持直接传递元素等。LinkedTransferQueue 实现了 TransferQueue 接口,支持直接传递元素,同时也可以像普通队列一样操作。
