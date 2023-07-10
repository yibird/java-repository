Java NIO(New IO)是 JDK 1.4 提供的一种基于通道（Channel）和缓冲区（Buffer）的 IO 处理方式,对比传统 BIO 具有如下优点:

- 高性能。Java NIO 的非阻塞模型和基于缓冲区的操作能够提供更高的性能和更好的响应能力。
- 支持高并发。通过选择器和通道，Java NIO 可以在单线程中同时管理多个连接，适用于高并发的场景。
- 可扩展性。Java NIO 提供了基于事件驱动的 IO 模型,可以轻松地扩展到更复杂的应用程序中。

## 1.Java NIO 的核心概念

- 缓冲区(Buffer):缓冲区是 Java NIO 中的核心概念,用于存储数据,它提供了对数据的读取和写入操作。常用的缓冲区类包括 ByteBuffer、CharBuffer、ShortBuffer、IntBuffer、LongBuffer、FloatBuffer 和 DoubleBuffer。缓冲区可以分为直接缓冲区和非直接缓冲区两种类型。
- 通道(Channel):通道是 NIO 中的数据源和数据目标，代表了一个打开的连接，可以进行读取和写入操作。通道提供了不同类型的实现，如文件通道（FileChannel）、套接字通道（SocketChannel）、服务器套接字通道（ServerSocketChannel）和数据报通道（DatagramChannel）等。
- 选择器(Selector):选择器是 NIO 中的事件驱动机制，用于实现 IO 多路复用。选择器允许一个线程监听多个通道的事件，以确定哪些通道已经准备好进行 IO 操作。通过选择器，可以使用单个线程同时管理多个通道，提高系统的并发性能。
- 字符集(Charset):字符集用于字符编码和解码操作,将字符序列与字节序列之间进行转换。Java NIO 提供了 java.nio.charset.Charset 类来支持字符集的操作，包括获取系统支持的字符集、获取字符编码器和解码器等。

### 1.1 Buffer

**Buffer 可以简单将它理解为一个数据容器,其本质上是一个数组,可以保存多个类型相同的数据。向 Channel 写入数据前,所有数据都必须存储在 Buffer 中写入至 Channel;向 Channel 读取数据时,所有数据都必须存储在 Buffer 中。Buffer 如同一个"水桶",既允许向 Channel 读取数据,也允许使用 Channel 直接将文件的某块数据映射成 Buffer**。

在 Java 中 Buffer 被定义为一个抽象类,Buffer 类提供了相对应的基本类型 Buffer(除 boolean 类型外)类:ByteBuffer、CharBuffer、ShortBuffer、IntBuffer、LongBuffer、FloatBuffer 和 DoubleBuffer,其中 ByteBuffer 和 CharBuffer 最为常用,ByteBuffer 用于在底层字节数组上进行 get/set 操作,CharBuffer 用于存储字符数据,它是对字符数据的封装,提供了对字符序列的读取和写入操作。ByteBuffer 提供了一个重要的子类 MappedByteBuffer,用于表示 Channel 将磁盘文件的部分或全部内容映射到内存中后得到的结果,通常 MappedByteBuffer 对象由 Channel 的 map()方法返回。由于 Buffer 的子类并未提供构造器,但提供了`static XxxBuffer allocate(int capacity)`方法,用于创建一个容量为 capacity 大小的 XxxBuffer 对象。

Buffer 中包含了容量、界限、位置三种重要的概念:

- 容量(capacity):表示 Buffer 的最大数据容量,即最多可以存储多少数据。缓冲区的容量不能为负值,且创建后不能改变。
- 界限(limit):表示缓冲区中当前有效数据的末尾索引,它指示了缓冲区中可供读取或写入的数据的位置上限。简单来说,位于 limit 后的数据既不能被读,也不能被写。在使用 Buffer 时，不能读取或写入超过 limit 的位置，否则会抛出 BufferUnderflowException（读取操作）或 BufferOverflowException（写入操作）的异常
  - 在写入模式下，limit 表示当前可以写入数据的最大位置。初始时，limit 等于缓冲区的容量（capacity），即表示整个缓冲区都可写入。
  - 在读取模式下，limit 表示当前有效数据的末尾索引。读取操作只能读取到 limit 位置之前的数据，即限制了读取操作的范围。
- 位置(position):用于指明一下个可以被读取的或写入的缓冲区位置索引(类似于 IO 流的记录指针)。当使用 Buffer 从 Channel 读取时,position 表示当前读取 Channel 的位置。对于新创建的 Buffer position 的默认值为 0。

Buffer 常用方法如下:

```shell
- int capacity():返回Buffer的容量(即最大可存储的元素数量)。
- int remaining():返回Buffer剩余可写入或可读取的元素数量。
- boolean hasRemaining():检查Buffer中是否还有剩余的元素可写入或可读取。
- int position():返回Buffer当前读取的位置。
- Buffer position(int newPosition):设置当前的位置。
- int limit():返回Buffer当前的位置限制。
- Buffer limit(int newLimit):返回 Buffer,设置当前的限制。
- Buffer clear():返回 Buffer,将position(位置)设置为0，limit(位置限制)设置为capacity(容量),准备写入新的数据。
- Buffer flip():返回 Buffer将限制设置为当前位置，位置设置为0，准备读取缓冲区中的数据。
- Buffer rewind():将position(位置)设置为0，limit(位置限制)保持不变，准备重新读取缓冲区中的数据。
- element get():返回 element,读取当前position(位置)的元素,并将position(位置)向前移动。
- element get(int index):返回 element,读取指定position(位置)的元素。
- Buffer put(element):返回 Buffer,将给定元素写入当前position(位置),并将position(位置)向前移动。
- Buffer put(int index, element)：返回 Buffer，将给定元素写入指定position(位置)。
```

```java
package com.fly;

import java.nio.CharBuffer;

public class BufferExample {
    public static void main(String[] args) {
        // 创建一个容量为10的字符Buffer对象,CharBuffer对象最多可以存储10个字符
        CharBuffer buffer = CharBuffer.allocate(10);
        System.out.println("buffer capacity:"+buffer.capacity()); // buffer capacity:10
        System.out.println("buffer limit:"+buffer.limit()); // buffer limit:10
        System.out.println("buffer position:"+buffer.position()); // buffer position:0

        // 向Buffer添加元素,每次put Buffer的position都会向前移动
        buffer.put('a');
        buffer.put('b');
        buffer.put('c');
        System.out.println("buffer position:"+buffer.position()); // buffer position:3

        // 将Buffer limit设置为position,position设置为0,准备读取缓冲区中的数据
        buffer.flip();
        System.out.println("buffer.flip() limit:"+buffer.limit()); // buffer.flip() limit:3
        System.out.println("buffer position:"+buffer.position()); // buffer position:0

        // 读取Buffer第一个元素,每次get Buffer的position都会向前移动
        System.out.println("获取Buffer第一个元素:"+buffer.get()); // 获取Buffer第一个元素:a
        System.out.println("buffer position:"+buffer.position()); // buffer position:1

        // 将position设置为0，limit设置为capacity,准备写入新的数据。
        buffer.clear();
        System.out.println("buffer.clear() limit:"+buffer.limit()); // buffer.clear() limit:10
        System.out.println("buffer.clear() position:"+buffer.position()); // buffer.clear() position:0
        System.out.println("读取Buffer第三个元素:"+buffer.get(2)); // 读取Buffer第三个元素:c
        System.out.println("buffer position:"+buffer.position()); // buffer position:0
    }
}
```

通过 Buffer.allocate()方法创建的 Buffer 对象是普通 Buffer(也称为非直接 Buffer),Buffer 还提供了 allocateDirect()方法用于创建直接 Buffer(只有 ByteBuffer 提供了 allocateDirect 方法)。直接 Buffer 与普通 Buffer 的区别如下:

- 内存分配方式:直接缓冲区使用堆外内存（Off-Heap Memory），也就是在 Java 堆之外分配的内存。它的内存分配和释放不受 Java 堆的管理，通常使用 ByteBuffer.allocateDirect()方法来创建。非直接缓冲区使用堆内内存（Heap Memory），也就是在 Java 堆上分配的内存。它的内存分配和释放由 Java 虚拟机进行管理，通常使用 ByteBuffer.allocate()等方法来创建。
- 性能:由于直接缓冲区使用堆外内存，可以直接进行读写操作，避免了数据在 Java 堆和本地堆之间的复制。因此，在某些场景下，直接缓冲区的 IO 性能更好，特别是在处理大量数据或进行网络传输时。非直接缓冲区使用堆内内存，数据需要在 Java 堆和本地堆之间进行复制。这可能会导致一些性能损失，但对于小数据量或局部操作，性能差异可能较小。
- 内存分配和回收开销:由于直接缓冲区使用堆外内存，内存分配和回收的开销较大，涉及到与操作系统的交互和资源分配。非直接缓冲区使用 Java 堆内存，内存分配和回收相对较快，由 Java 虚拟机进行管理。
- 内存访问:直接缓冲区的内存访问可能较快，因为它在堆外内存中直接操作数据，对于一些需要直接操作内存的场景（如通过 JNI 与本地代码交互），直接缓冲区更为方便。直接缓冲区的内存访问可能较快，因为它在堆外内存中直接操作数据，对于一些需要直接操作内存的场景（如通过 JNI 与本地代码交互），直接缓冲区更为方便

虽然直接 Buffer 相较于非直接 Buffer 读取效率更高,但直接 Buffer 的创建成本高于非直接 Buffer,因此,直接 Buffer 只适用于使用周期长的 Buffer。

### 1.2 Channel

Channel 类似于 BIO 中流对象,但与传统的流对象具有如下区别:

- 数据的流向不同。Stream 是单向的,它代表了数据的输入或输出流。对于输入流（InputStream），数据从源（如文件、网络连接）流向程序；对于输出流（OutputStream），数据从程序流向目标（如文件、网络连接）。而 Channel 是双向的，它可以同时进行读取和写入操作。通过 Channel，可以将数据从源读取到程序，也可以将数据从程序写入到目标。
- 阻塞与非阻塞:Stream 是阻塞的，即在读取或写入数据时，如果没有数据可用或无法写入，则会阻塞程序，等待操作完成。Channel 可以是阻塞的或非阻塞的，可以通过设置 Channel 的阻塞模式来控制阻塞行为。在非阻塞模式下，Channel 会立即返回，无论是否有数据可用或可以写入。
- Channel 可以直接将指定文件的部分或全部映射为 Buffer。
- 程序无法直接读取或写入 Channel 中的数据,Channel 只能与 Buffer 发生读取或写入操作。从 Channel 读取或写入数据时,必须先使用 Buffer 从 Channel 读取或写入数据,然后才能使用程序向 Buffer 读取或写入数据。
