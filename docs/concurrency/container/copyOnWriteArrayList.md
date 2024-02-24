在大多数并发场景中,读操作的次数可能远远大于写操作。由于读操作不会修改原数据,无需在读取操作时进行加锁,从而避免资源浪费,而写操作会修改原数据,因此需要加锁来保证数据一致性问题。为了保证 ArrayList 线程安全且提升读写操作性能,JUC 在 CopyOnWriteArrayList 中引入了写时复制(Copy On Write,简称 COW)机制。

写时复制(Copy On Write,简称 COW)思想是计算机程序设计领域的一种优化策略,其核心思想是:如果有多个访问器(Accessor)访问一个资源(如内存或磁盘),它们会共同获取相同的指针指向相同的资源,只有一个修改器(Mutator)需要修改该资源时,系统机会复制一份专用副本(Private Copy)给该修改器,而其他访问器所见到的最初资源仍保持不变,修改的过程对其他访问器都是透明的。虽然 COW 能极大地提升系统并发性能,但存在着以下问题:

- 内存占用:每次写操作都需要复制一份原始数据,会占用额外的内存空间,在数据量比较大的情况下,可能会导致内存资源不足。
- 写操作开销：每一次写操作都需要复制一份原始数据,然后再进行修改和替换,所以写操作的开销相对较大,在写入比较频繁的场景下,性能可能会受到影响。
- 数据一致性问题：修改操作不会立即反映到最终结果中,还需要等待复制完成,这可能会导致一定的数据一致性问题。

## CopyOnWriteArrayList 的实现原理

CopyOnWriteArrayList 是线程安全的 ArrayList 版本,适用于读多写少的并发场景。当修改 CopyOnWriteArrayList(add、remove、set)内容时,不会直接修改原数组,而是会先创建底层数组的副本,对副本数组进行修改,修改完之后再将修改后的数组赋值回去,这样可以避免写操作影响读操作,能够极大地提高系统的并发性能。

## CopyOnWriteArrayList 读取实现

## CopyOnWriteArrayList 写入实现

CopyOnWriteArrayList 的 add()在写入时使用独占锁以确保只有一个线程进行写入操作,从而避免多线程写入时会复制多个副本。

```java
public boolean add(E e) {
    synchronized (lock) {
        Object[] es = getArray();
        int len = es.length;
        es = Arrays.copyOf(es, len + 1);
        es[len] = e;
        setArray(es);
        return true;
    }
}
```

## CopyOnWriteArrayList 迭代器实现
