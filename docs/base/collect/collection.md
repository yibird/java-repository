Java 中的集合（Collection）是一组对象的容器，用于存储、检索和操作数据。Java 在`java.util`包下提供了一系列的集合类和接口,用于处理不同类型的数据结构。常见的 Java 集合接口如下:

- Collection 接口:表示一组对象,是其他集合接口的基础接口。List、Set 和 Queue 接口都继承自 Collection 接口。
- List 接口:有序的集合,允许重复元素。常见的实现类有 ArrayList、LinkedList 和 Vector。
- Set 接口:不允许重复元素的集合。常见的实现类有 HashSet、LinkedHashSet 和 TreeSet。
- Queue 接口:代表一组等待处理的元素，通常按照先进先出（FIFO）的顺序进行操作。常见的实现类有 LinkedList 和 PriorityQueue。
- Map 接口:存储键值对的集合,每个键关联一个值。常见的实现类有 HashMap、LinkedHashMap、TreeMap 和 HashTable。

Java 基于集合接口提供了对应的集合实现,常见的容器包括:

- ArrayList:List 接口的实现之一,支持可变大小数组(相较于数组无需在初始化时指定容量,数组是定长的,一旦指定容量初始化后就无法改变,但 ArrayList)、动态扩容和泛型,允许快速随机访问。ArrayList 通过下标访问元素时间复杂度为 O(1),删除和添加元素时由于需要移动元素,时间复杂度为 O(n)。
- LinkedList:List 接口的实现之一,实现了链表数据结构,适用于频繁插入和删除操作。LinkedList 内部通过指针指向下一个元素,因此,在访问元素时需要遍历整个链表,其时间复杂度为 O(n)。在添加或删除元素只需要改变对应指针的指向,因此时间复杂度为 O(1)。
- HashSet: Set 接口的实现之一,基于哈希表实现,不允许重复元素。
- LinkedHashSet:在 HashSet 的基础上添加了按照插入顺序排序的特性。
- TreeSet:基于红黑树实现的有序集合,按照元素的自然顺序或自定义顺序排序。
- HashMap:Map 接口的实现之一,基于哈希表实现的键值对集合,允许 null 键和值。
- LinkedHashMap:在 HashMap 的基础上添加了按照插入顺序排序的特性。
- TreeMap:基于红黑树实现的有序键值对集合,按照键的自然顺序或自定义顺序排序。
