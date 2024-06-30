ArrayList 是 Java 提供的一个可修改的动态数组。相较于数组的定长特性,ArrayList 是非定长的,初始化时无需指定容量,并且其内部提供了动态扩容机制,当添加元素时首先会检查 ArrayList 容量,如果容量已满则根据容量进行动态扩容。在 OpenJDK20 中 ArrayList 实现了 AbstractList 类,实现了 List、RandomAccess、Cloneable、java.io.Serializable 四个接口:

- **AbstractList**:该类提供了 List 接口的骨架实现,以最大限度地减少实现由"随机访问"数据存储(如数组)支持的接口所需的工作量。对于顺序访问数据(如链表),应优先使用 AbstractSequentialList 而不是此类
- **List**:List 是一个有序集合(也称为序列)接口,提供了 add()、get()、remove()、clear()等抽象方法,且 List 允许添加重复元素。
- **RandomAccess**:RandomAccess 是 Java 提供的一个标记接口(空接口),用于支持快速(通常是恒定时间)随机访问。此接口的主要目的是允许通用算法更改其行为,以便在应用于随机或顺序访问列表时提供良好的性能。ArrayList 支持通过索引访问元素被称为随机访问,随机访问相较于迭代器访问具有更好的性能。Collections 是 Java 提供的用于对集合进行操作的工具类,提供了对集合排序和查找等方法。在 Collections 的 binarySearch 方法中会根据 List 是否实现 RandomAccess 接口选择不同的二分搜索,如果 List 实现了 RandomAccess 接口则使用 Collections.indexedBinarySearch()基于索引二分法搜索,否则使用 Collections.iteratorBinarySearch()基于迭代器的二分法搜索,两者的时间复杂度分别为 log(n)和 n,因此索引二分法搜索性能会更好。
- **Cloneable**:Cloneable 是 Java 提供的一个标记接口(空接口),其作用是使一个类的实例能够将自身拷贝到另一个新的实例中。在 ArrayList 内部定义了 clone()用于实现数据的克隆。
- **Serializable**:Serializable 是 java.io 包中定义的、用于实现 Java 类的序列化操作而提供的一个语义级别的接口。ArrayList 实现了 Serializable 接口表示支持序列化,允许通过序列化进行数据传输。

与 Vector 和 CopyOnWriteArrayList 不同,ArrayList 是非线程安全的,因此在多线程环境下会产生数据竞态问题,导致线程不安全,其表现为添加数据时可能发生越界等情况。因此,在多线程环境推荐使用 Vector 和 CopyOnWriteArrayList。Vector 内部使用 synchronized 保证线程安全,高并发情况下可能会存在性能问题。
而 CopyOnWriteArrayList 底层使用 COW 策略(Copy-on-write,即写时复制),当进行写操作时,会生成一个新数组,保证读写操作互不干扰,从而实现了线程安全问题。由于 CopyOnWriteArrayList 仅在写操作时加锁,而读操作无需加锁,因此适用于多线程环境中读多写少的场景。

## 1.ArrayList 源码解析

### 1.1 ArrayList 构造函数与成员属性

```java
public class ArrayList<E> extends AbstractList<E>
implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    @java.io.Serial
    private static final long serialVersionUID = 8683452581122892189L;
	// 默认初始容量
    private static final int DEFAULT_CAPACITY = 10;
	// 用于空实例的共享空数组实例
    private static final Object[] EMPTY_ELEMENTDATA = {};

    /**
     * 用于默认大小的空实例的共享空数组实例。用于区分EMPTY_ELEMENTDATA,
     * 以了解添加第一个元素时要膨胀多少
     */
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

    /**
     * 存储ArrayList元素的数组缓冲区,ArrayList的容量就是这个数组缓冲区的长度
     */
    transient Object[] elementData; // non-private to simplify nested class access

    /**
     * ArrayList的大小
     */
    private int size;

    /**
     * 构造一个具有指定初始容量的空列表
     *
     * @param  initialCapacity  the initial capacity of the list
     * @throws IllegalArgumentException if the specified initial capacity
     *         is negative
     */
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                                               initialCapacity);
        }
    }

    /**
     * 构造一个初始容量为10的空列表
     */
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }

    /**
     * 按照集合迭代器返回的顺序，构造一个包含指定集合的元素的列表。
     *
     * @param c the collection whose elements are to be placed into this list
     * @throws NullPointerException if the specified collection is null
     */
    public ArrayList(Collection<? extends E> c) {
        Object[] a = c.toArray();
        if ((size = a.length) != 0) {
            if (c.getClass() == ArrayList.class) {
                elementData = a;
            } else {
                elementData = Arrays.copyOf(a, size, Object[].class);
            }
        } else {
            // replace with empty array.
            elementData = EMPTY_ELEMENTDATA;
        }
    }
    // 省略其他方法...
}
```

### 1.2 add()

### 1.3 get()

### 1.4 set()

### 1.5 contains()

### 1.6 remove()

### 1.7 clear()

clear()用于清除 ArrayList 中所有元素,其源码实现很简单,即遍历数组缓冲区长度,将数组缓冲区的每个元素都设置为 null,并重置数组缓冲区长度为 0。

```java
public void clear() {
    modCount++;
    // 获取数组缓冲区
    final Object[] es = elementData;
    /*
     * 遍历数组缓冲区长度,将数组缓冲区的每个元素都设置为null。int to = size表示将size的值
     * 赋值给to变量,用于确定循环的结束条件。i = size = 0表示将变量size的值赋为0(重置size为0),
     * 并将其赋给变量i作为循环的起始值。
     */
    for (int to = size, i = size = 0; i < to; i++)
        es[i] = null;
}
```

### 1.8 sublist()

## 2.ArrayList 最佳实践

- 初始化 ArrayList 时,应尽量指定初始化容量,这样做可以避免在插入元素时因重新分配内存而导致的性能下降。如果初始化 ArrayList 时不指定初始化容量(默认容量为 10),当频繁添加元素时,会导致容量不足触发扩容机制,由于 ArrayList 进行扩容时会拷贝原数组,这个过程不仅耗时久,而且会消耗大量内存。
- 在需要添加大量元素时,可以使用 list.ensureCapacity(int minCapacity)方法来提前分配足够的内存空间，以避免多次重新分配内存。
- 当不再需要使用 ArrayList 中的元素时，及时进行清理。可以使用 list.clear() 方法将 ArrayList 的元素全部移除，并释放占用的内存空间。
- 避免频繁地在 ArrayList 中进行元素的插入或删除操作。ArrayList 在进行插入或删除操作时，可能需要执行大量的元素移动操作，这种操作会消耗较多的时间。如果对 ArrayList 的操作主要涉及到元素的插入或删除，考虑使用 LinkedList 等更适合这类操作的数据结构。
- 使用迭代器(Iterator)遍历 ArrayList，而不是使用普通的 for 循环或者 foreach 循环。迭代器提供了一种安全、高效的方式来遍历 ArrayList，并且可以在遍历过程中进行元素的删除操作
- 在需要频繁判断元素是否存在于 ArrayList 中时,可以考虑使用 HashSet 或 TreeSet 等更适合快速查找元素的数据结构。
- 考虑使用泛型来限制 ArrayList 中存储的元素类型。这样可以在编译时捕获一些类型错误,并提高代码的可读性和维护性,例如:`ArrayList<String> list = new ArrayList<>()`;
- 由于 ArrayList 是非线程安全的,因此在多线程环境下使用 ArrayList 时,要确保对 ArrayList 的并发访问进行正确的同步处理:
  - 使用 Collections 类提供的 `synchronizedList(List<T> list)` 方法,将 ArrayList 包装成一个同步的列表,从而达到线程安全的目的。
  - add 元素时加锁。例如在调用 add()时使用 synchronized 保证线程安全。
  - 使用线程安全 CopyOnWriteArrayList 代替 ArrayList。
  - 使用 ThreadLocal 包装 ArrayList 保证线程安全。
