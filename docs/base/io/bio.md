## 1.Java 流的介绍

## 1.1 流的介绍

Java 的 IO 流是实现输入/输出的基础,通过 JavaIO 流可以实现数据的输入和输出操作,在 Java 中把不同的输入/输出源(键盘、文件、网络连接等)抽象表述为流(Stream),流是从发送端到接收端的有序数据。通过流的方式允许 Java 程序使用相同的方式来访问不同的输入/输出源。在 Java 中,提供了 `java.io`、`java.nio`、`java.nio.channels` 三个主要的 IO 相关的包:

- `java.io`:`java.io`提供了用于处理传统的输入输出操作的类。其中包括 InputStream 和 OutputStream 用于字节流 IO，以及 Reader 和 Writer 用于字符流 IO。File 类用于文件操作，RandomAccessFile 类提供对文件的随机访问。此外，还有一些用于缓冲、过滤、对象序列化等的辅助类。java.io 包中的类适合于处理简单的 IO 操作,但在高并发和高性能的情况下可能表现不佳。
- `java.nio`:`java.nio`提供了 Java NIO（New IO）库,用于高效的非阻塞 IO 操作。其中，java.nio 包提供了 Buffer、Charset、Selector 等核心类，java.nio.channels 包提供了 Channel、Selector 等类，用于基于事件驱动的 IO 操作。NIO 提供了更高级别的 IO 功能，如多路复用、内存映射文件、直接缓冲区等。Java NIO 提供了更高级别的 IO 功能和更好的性能，适用于高并发和高性能的 IO 操作。
- `java.nio.channels`:java.aio 包是异步 IO（Asynchronous IO）库的一部分，用于处理异步 IO 操作。相关的类位于 java.nio.channels 包下，如 AsynchronousChannel、AsynchronousFileChannel 和 AsynchronousSocketChannel 等。它们提供了非阻塞的异步 IO 操作，并使用 CompletionHandler 来处理 IO 事件。异步 IO 适用于需要高并发、高吞吐量的 IO 应用。

## 1.2 流的分类

Java 的 IO 流共涉及 40 多个类,根据不同的分类方式,可以将流分为不同的类型。

- 输入流和输出流:**按照流的流向可以将流分为输入流和输出流,其中输入流只能从流中读取数据,不能向流写入数据;输出流只能向流中写入数据,不能向流读取数据**。以 S/C 架构通讯为例,Server 端需要将内存的数据输出到网络连接中,因此 Server 端应使用的输出流,而 Client 端需要从网络连接读取数据,因此 Client 端需要使用输入流。Java 的输入流主要由 InputStream 和 Reader 作为基类,而输出流主要由 OutputStream 和 Writer 作为基类。它们都属于抽象基类,因此无法直接创建实例。

- 字节流和字符流:用于不同数据类型的流操作,字节流与字符流的用法基本一致,其区别在于:
  - 操作数据单元不同。**字节流操作的数据单元是 8 位的字节,而字符流操作的数据单元是 16 位的字符**。字节流处理的是二进制数据，适用于读取和写入二进制文件（如图像、视频）或者处理非文本数据。而字符流处理的是 Unicode 字符，适用于读取和写入文本数据（如文本文件）。
  - 处理方式不同。字节流以字节的形式直接处理数据，没有字符编码的转换。适合于处理原始的二进制数据，可以直接读取和写入字节数据。字符流会根据指定的字符编码（如 UTF-8、GBK 等）进行字符到字节的转换。它们会自动处理字符编码和解码，能够正确地读取和写入文本数据。
  - 使用场景不同。字节流适用于处理任何类型的数据，包括二进制数据和文本数据。它们常用于处理网络传输、文件操作和图像处理等场景。字节流适用于处理任何类型的数据，包括二进制数据和文本数据。它们常用于处理网络传输、文件操作和图像处理等场景。除非处理二进制数据或需要与底层字节流进行交互，一般推荐使用字符流来处理文本数据。

字节流主要由 InputStream 和 OutputStream 作为基类,而字符流则主要由 Reader 和 Writer 作为基类。

- 节点流和处理流。按照流的角色来分,可以将流分为节点流和处理流。可以从/向一个特定的 IO 设备(如磁盘、网络)读或写数据的流,称为节点流(也称为低级流)。当使用节点流进行输入或输出时,程序直接连接到实际的数据源。处理流则用于对一个已存在的流进行连接或封装,通过封装后的流来实现数据读/写功能。因此,处理流也被称为高级流。

除了上述分类外,从数据来源或者说是操作对象角度看,IO 类可以分为细分为:

- 文件操作流:包含 FileInputStream(文件输入流)、FileOutputStream(文件输出流)、FileReader(文件读取流)、FileWriter(文件写入流)。
- 数组操作流:ByteArrayInputStream(字节数组输入流)、ByteArrayOutputStream(字节数组输出流)、CharArrayReader(字符数组输入流)、CharArrayWriter(字符数组输出流)。
- 管道操作:PipedInputStream、PipedOutputStream、PipedReader、PipedWriter。
- 基本数据类型操作流:DataInputStream、DataOutputStream。
- 缓冲操作流:BufferedInputStream、BufferedOutputStream、BufferedReader、BufferedWriter。
- 打印操作流:PrintStream、PrintWriter。
- 对象序列化反序列化操作流:ObjectInputStream、ObjectOutputStream。
- 转换操作流:InputStreamReader、OutputStreamWriter。
- 推回输入流:PushbackInputStream、PushbackReader。
- 特殊流:DataInputStream、DataOutputStream。

## 2.Java IO 的流设计之装饰器模式

## 3.
