## 1.TCP 粘包和拆包

### 1.1 TCP 粘包/拆包的定义

在《Netty 权威指南》中描述:TCP 是一个“流”协议,是没有界限的一串数据,TCP 底层并不了解上层业务数据的具体含义,它会根据 TCP 缓冲区的实际情况进行包的划分,所以在业务上认为,一个完整的包可能会被 TCP 拆成多个包进行发送,也有可能把多个小的包封装成一个大的数据包发送,这就是所谓的 TCP 粘包和拆包问题。

TCP 粘包和拆包问题是在 TCP 协议下进行数据传输时可能遇到的两种常见问题:

- TCP 粘包（TCP Packet Sticking）:由于 TCP 是一种面向流的协议,它以字节流的形式传输数据。当发送方连续发送多个小数据包时,TCP 协议会将这些数据包组合成更大的数据块进行传输,以提高传输效率。但在接收方,由于 TCP 的接收缓冲区是以字节流方式接收数据,因此接收方无法知道每个数据包的边界。这导致接收方可能会一次性读取到多个数据包,即发生 TCP 粘包现象。

- TCP 拆包（TCP Packet Splitting）:与 TCP 粘包相反,TCP 拆包问题是指当发送方发送的数据包比接收方的接收缓冲区小或者发送方发送的数据包被分割成多个数据包发送时,接收方可能无法正确拆分这些数据包,导致接收方接收到不完整的数据包或者多个不完整的数据包。

以客户端发送两个数据包(P1 和 P2)给服务端,由于服务端读取一次的字节数目是不确定的,所以可能会产生五种情况:

- 服务端分两次读取到两个独立的数据包。
- 服务端一次接收到两个数据包,但 P1 和 P2 粘合在一起,被称为 TCP 粘包。
- 服务端分两次读取到两个数据包,第一次读取到完整的 P1 包和 P2 包的部分内容,第二次读取到 P2 包的剩余内容,被称之为 TCP 拆包。如果服务端 TCP 接收的滑动窗非常小,而数据包 P1/P2 非常大,很有可能服务端需要分多次才能将 P1/P2 包接收完全,期间发生多次拆包。
- 服务端分两次读取到两个数据包,第一次读取到了 P1 包的部分内容 P1_1,第二次读取到了 P1 包的剩余内容 P1_2 和 P2 包的整包

### 1.2 TCP 粘包/拆包问题发生的原因

TCP 是以流动的方式传输数据,传输的最小单位为一个报文段（segment）。主要有如下几个指标影响或造成 TCP 粘包/拆包问题,分别为 MSS、MTU、缓冲区,以及 Nagle 算法(TCP 引入 Nagle 算法旨在减少小包的发送频率,将多个小的数据包合并成一个较大的数据包,从而优化网络传输性能和减少网络拥塞)的影响:

- MSS:MSS(Maximum Segment Size,即最大段大小)指的是连接层每次传输的数据有个最大限制 MTU(Maximum Transmission Unit),超过这个量要分成多个报文段。
- MTU:MTU 限制了一次最多可以发送 1500 个字节,而 TCP 协议在发送 DATA 时,还会加上额外的 TCP Header 和 IP Header,因此刨去这两个部分,就是 TCP 协议一次可以发送的实际应用数据的最大大小,即 MSS 长度=MTU 长度-IP Header-TCP Header。
- TCP 为提高性能,发送端会将需要发送的数据发送到缓冲区(Buffer),等待缓冲区满了之后(缓冲区未满会等待发送),再将缓冲中的数据发送到接收方,同理,接收方也有缓冲区这样的机制,来接收数据。

由于上述因素,造成拆包/粘包的具体原因如下:

- 要发送的数据大于 TCP 发送缓冲区剩余空间大小,将会发生拆包。
- 待发送数据大于 MSS（最大报文长度）,TCP 在传输前将进行拆包。
- 要发送的数据小于 TCP 发送缓冲区的大小,TCP 将多次写入缓冲区的数据一次发送出去,将会发生粘包。
- 接收数据端的应用层没有及时读取接收缓冲区中的数据,将发生粘包。

### 1.3 解决 TCP 粘包/拆包问题的策略

由于 TCP 协议是一种面向流的协议,它不保留原始数据包的边界信息,数据传输过程了可能会出现 TCP 粘包/拆包问题,导致传输数据的不正确和不完整。解决 TCP 粘包和拆包问题的方案如下:

- 消息定长:通过固定长度的消息进行通信,无论消息实际长度如何,都按照固定长度进行拆包和粘包处理。这种方式要求发送和接收双方都遵循相同的消息长度规定。
- 消息分隔符:通过在消息中使用特定的分隔符来标识消息的边界。发送方在消息末尾添加分隔符,接收方通过分隔符将接收到的数据进行拆分。Netty 提供了 DelimiterBasedFrameDecoder 和 StringDecoder、LineBasedFrameDecoder 等解码器来支持这种方式。
- 消息长度字段:在消息中添加一个字段来表示消息的长度。接收方首先读取消息长度字段,然后根据长度字段的值读取相应长度的数据。Netty 提供了 LengthFieldBasedFrameDecoder 解码器来支持这种方式。
- 自定义协议:设计自定义的协议,在消息中添加一些特定的标识符或长度字段来标识消息的边界和长度。通过解析协议,可以正确处理粘包和拆包问题。

### 1.1 TCP 粘包示例

StickyPackServer:

```java
package com.fly.tcp.stickypack;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.FixedLengthFrameDecoder;
import io.netty.util.CharsetUtil;

/**
 * TCP粘包服务端,模拟TCP粘包问题
 */
public class StickyPackServer {
    private final static int PORT = 8080;

    public static void main(String[] args) throws InterruptedException {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ChannelPipeline pipeline = ch.pipeline();
                        /**
                         * 添加固定长度的帧解码器,它将接收到的数据按照固定的长度进行切割,
                         * 保证每个数据帧的长度都是固定的。当接收到的数据达到指定长度时,
                         * FixedLengthFrameDecoder 将会将数据帧传递给后续的处理器。
                         * FixedLengthFrameDecoder(10)表示每个接收到的数据帧的长度
                         * 为10个字节(每次接受的消息最多为10字节,如果消息长度大于10字节则会分为多次发送),
                         * 如果接收到的数据长度不足 10 字节,FixedLengthFrameDecoder
                         * 将缓存数据并等待更多数据,直到数据长度达到指定的固定长度。
                         */
                        pipeline.addLast(new FixedLengthFrameDecoder(10));
                        // 添加自定义Handler
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                String receivedMessage = msg.toString(CharsetUtil.UTF_8);
                                System.out.println("Received message: " + receivedMessage);
                            }
                        });
                    }
                });
        System.out.println("Server started on port " + PORT);
        bootstrap.bind(PORT).sync()
                .channel()
                .closeFuture()
                .sync();
    }
}

```

```java
package com.fly.tcp.stickypack;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.CharsetUtil;

/**
 * TCP粘包客户端,用于向TCP粘包服务端发送消息,模拟TCP粘包问题
 */
public class StickyPackClient {
    private static final String HOST = "localhost";
    private static final int PORT = 8080;

    public static void main(String[] args) throws InterruptedException {
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ChannelPipeline pipeline = ch.pipeline();
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            /**
                             * channelActive是ChannelHandler的一个方法,用于在与远程对等方建立连接并准备传输数据
                             * 时被调用(仅调用一次),当一个Channel变为活动状态时,即完成连接建立,可以开始进行数据传输。
                             */
                            @Override
                            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                String message1 = "Hello";
                                String message2 = "World!";
                                // 将两个消息拼接在一起发送,模拟TCP粘包现象
                                String combinedMessage = message1 + message2;
                                /**
                                 * Unpooled.copiedBuffer是Netty提供一个工具方法,用于创建一个
                                 * 新的ByteBuf,并将指定的字节数据复制到该ByteBuf中。
                                 * Unpooled.copiedBuffer()方法有多个重载形式,可以接受不同类型的输入参数,
                                 * 例如字符串、字节数组、字节序列等。
                                 *
                                 * ByteBuf是Netty内部实现的字节缓冲区类,用于在网络通信和数据处理中高效地操作字节数据。
                                 * 与Java的ByteBuffer相比,ByteBuf支持引用计数、多类型读写操作、扩容、视图和派生、分配器
                                 * 读写模式等特性。使用ByteBuf可以方便地进行字节级别的数据操作,如读取和写入字节数据、
                                 * 处理粘包和拆包问题、进行数据转换和编解码等
                                 */
                                ByteBuf buf = Unpooled.copiedBuffer(combinedMessage, CharsetUtil.UTF_8);
                                ctx.writeAndFlush(buf);
                            }

                            /**
                             * 接受消息时触发的方法
                             */
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                String receivedMessage = msg.toString(CharsetUtil.UTF_8);
                                System.out.println("Received response: " + receivedMessage);
                            }
                        });
                    }
                });
        ChannelFuture channelFuture = bootstrap.connect(HOST, PORT).sync();
        System.out.println("Connected to server " + HOST + ":" + PORT);
        channelFuture.channel().closeFuture().sync();
    }
}
```

先启动 StickyPackServer 提供服务,后启动 StickyPackClient 发送消息,测试结果如下:

```txt
Server started on port 8080
Connected to server localhost:8080
Received message: HelloWorld
```

在上述示例中,服务端使用了 FixedLengthFrameDecoder 解码器,它会按照固定长度来解码接收到的数据。服务器端和客户端通过固定长度的帧来处理数据,以模拟 TCP 粘包现象。当客户端发送的两个消息 Hello 和 World!被拼接在一起发送时,服务器端会一次性接收到 HelloWorld!这个拼接后的消息(由于使用了 FixedLengthFrameDecoder 解码器,最多只能解码 10 个字节,不满固定字节则会等待数据,客户端虽然发送 HelloWorld! ,但服务端只能接收到 HelloWorld),即发生了 TCP 粘包现象。

### 1.2 TCP 拆包示例

```java
package com.fly.tcp.pack.unpack;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.CharsetUtil;

/**
 * TCP拆包服务类,用于模拟TCP拆包问题
 */
public class UnpackServer {
    private final static int PORT = 8080;

    public static void main(String[] args) throws InterruptedException {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        // 使用分隔符解码器
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                String receivedMessage = msg.toString(CharsetUtil.UTF_8);
                                System.out.println("Received message: " + receivedMessage);
                            }
                        });
                    }
                });
        System.out.println("Server started on port " + PORT);

        bootstrap.bind(PORT).sync()
                .channel()
                .closeFuture()
                .sync();
    }
}
```

```java
package com.fly.tcp.pack.unpack;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.CharsetUtil;

/**
 * TCP拆包客户端类,用于向TCP拆包服务发送消息,模拟TCP拆包问题
 */
public class UnpackClient {
    private static final String HOST = "localhost";
    private static final int PORT = 8080;

    public static void main(String[] args) throws InterruptedException {
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            @Override
                            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                /**
                                 * 发送多个小于TCP缓冲区大小的数据包,模拟TCP拆包现象,
                                 * 接收端可能会将多个小数据包合并成一个较大的数据包进行处理,
                                 * 从而引发了TCP拆包的现象
                                 */
                                for (int i = 0; i < 10; i++) {
                                    String message = "Message " + i;
                                    ByteBuf buffer = ch.alloc().buffer();
                                    buffer.writeBytes(message.getBytes(CharsetUtil.UTF_8));
                                    ch.writeAndFlush(buffer);
                                }
                            }

                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                String receivedMessage = msg.toString(CharsetUtil.UTF_8);
                                System.out.println("Received response: " + receivedMessage);
                            }
                        });
                    }
                });
        // 连接服务端
        ChannelFuture channelFuture = bootstrap.connect(HOST, PORT).sync();
        System.out.println("Connected to server " + HOST + ":" + PORT);
        channelFuture.channel().closeFuture().sync();
    }
}
```

测试结果如下:

```txt
Server started on port 8080
Connected to server localhost:8080
Received message: Message 0Message 1Message 2Message 3Message 4Message 5Message 6Message 7Message 8Message 9
```

上述例子中客户端在 channelActive 方法中模拟了发送多个小于 TCP 缓冲区大小的数据包,接收端可能会将多个小数据包合并成一个较大的数据包进行处理,从而产生 TCP 拆包问题,从执行结果来看,客户端发送的数据包被合并为一个大的数据包处理,产生了拆包问题。

## 2.基于消息定长解决粘包/拆包问题

消息定长是一种解决 TCP 粘包和拆包问题的方法,通过指定固定长度来划分消息的边界,确保接收到的数据流能够正确拆分为单个的消息。在 Netty 中提供了 FixedLengthFrameDecoder(固定长度帧编码器)通过指定固定长度来划分消息的边界,用于解决 TCP 粘包和拆包问题。FixedLengthFrameDecoder 的构造函数接受一个参数,即消息的固定长度,它会根据指定的长度从接收到的数据流中提取固定长度的字节,并将其作为一个完整的消息发送给后续的处理器进行处理。FixedLengthFrameDecoder 用于将接收到的数据按照固定的长度进行切割,保证每个数据帧的长度都是固定的。当接收到的数据达到指定长度时,FixedLengthFrameDecoder 将会将数据帧传递给后续的处理器。FixedLengthFrameDecoder(10)表示每个接收到的数据帧的长度为 10 个字节(每次接受的消息最多为 10 字节,如果消息长度大于 10 字节则会分为多次发送),如果接收到的数据长度不足 10 字节,FixedLengthFrameDecoder 将缓存数据并等待更多数据,直到数据长度达到指定的固定长度。使用 FixedLengthFrameDecoder 解决 TCP 粘包/拆包示例如下:

```java
package com.fly.tcp.pack.frame;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.FixedLengthFrameDecoder;
import io.netty.util.CharsetUtil;

/**
 * Frame服务端,使用FixedLengthFrameDecoder解决TCP粘包/拆包问题
 */
public class FrameServer {

    private final static int PORT = 8080;

    public static void main(String[] args) throws InterruptedException {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        /**
                         * 添加固定长度的帧解码器,它将接收到的数据按照固定的长度进行切割,
                         * 保证每个数据帧的长度都是固定的。FixedLengthFrameDecoder(10)表示
                         * 每个接收到的数据帧的长度为10个字节,如果消息长度大于10字节则会分为多次发送
                         * 如果接收到的数据长度不足 10 字节,FixedLengthFrameDecoder将缓存数据
                         * 并等待更多数据,直到数据长度达到指定的固定长度
                         */
                        pipeline.addLast(new FixedLengthFrameDecoder(12));
                        // 添加自定义Handler
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                String receivedMessage = msg.toString(CharsetUtil.UTF_8);
                                System.out.println("Received message: " + receivedMessage);
                            }
                        });
                    }
                });
        System.out.println("Server started on port " + PORT);
        // 绑定指定端口
        bootstrap.bind(PORT)
                // 阻塞当前线程,等待绑定操作完成,返回一个ChannelFuture对象
                .sync()
                // 获取当前 ServerChannel 对象
                .channel()
                // 获取关联的 CloseFuture 对象,用于异步关闭通知
                .closeFuture()
                // 阻塞等待Channel关闭完成
                .sync();
    }
}
```

```java
package com.fly.tcp.pack.frame;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.FixedLengthFrameDecoder;
import io.netty.util.CharsetUtil;

/**
 * Frame客户端,使用FixedLengthFrameDecoder解决TCP粘包/拆包问题
 */
public class FrameClient {
    private static final String HOST = "localhost";
    private static final int PORT = 8080;

    public static void main(String[] args) throws InterruptedException {
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        /**
                         * 客户端FixedLengthFrameDecoder的固定长度与服务端一致
                         */
                        pipeline.addLast(new FixedLengthFrameDecoder(12));
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            /**
                             * 在与远程对等方建立连接并准备传输数据时被调用(仅调用一次)
                             */
                            @Override
                            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                String message1 = "Hello world!";
                                String message2 = "Hello world?";
                                ctx.writeAndFlush(Unpooled.copiedBuffer(message1, CharsetUtil.UTF_8));
                                ctx.writeAndFlush(Unpooled.copiedBuffer(message2, CharsetUtil.UTF_8));
                            }

                            /**
                             * 用于接受服务端发送消息时触发
                             */
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                String message1 = "Hello world1!\0";
                                String message2 = "Hello world2!\0";
                                ctx.writeAndFlush(Unpooled.copiedBuffer(message1, CharsetUtil.UTF_8));
                                ctx.writeAndFlush(Unpooled.copiedBuffer(message2, CharsetUtil.UTF_8));
                            }
                        });
                    }
                });
        System.out.println("Connected to server " + HOST + ":" + PORT);
        // 连接服务端,指定HOST和端口
        bootstrap.connect(HOST, PORT)
                // 阻塞当前线程,等待绑定操作完成,返回一个ChannelFuture对象
                .sync()
                // 获取当前 ServerChannel 对象
                .channel()
                // 获取关联的 CloseFuture 对象,用于异步关闭通知
                .closeFuture()
                // 阻塞等待Channel关闭完成
                .sync();
    }
}
```

基于消息定长虽然可以实现 TCP 粘包/拆包问题,但存在着如下问题:

- 额外的空间开销:在使用消息定长方式时,需要为每条消息分配固定长度的空间。如果消息长度不一致,可能会导致一些空间浪费。
- 限制消息长度:消息定长方式要求消息长度固定,这可能会限制消息的长度,如果消息过长超过了指定的长度,将无法传输。

## 3.基于消息分割符解决粘包/拆包问题

基于消息分割符方式是通过在消息中使用特定的分隔符来标识消息的边界,例如根据换行符(\n)或回车符(\r\n)分割消息。发送方在消息末尾添加分隔符,接收方解析消息通过分隔符将接收到的数据进行拆分,从而解决 TCP 粘包/拆包问题。在 Netty 中提供了 LineBasedFrameDecoder 和 DelimiterBasedFrameDecoder 解码器通过分隔符来划分消息的边界:

- LineBasedFrameDecoder:通过指定换行符(\n 或\r\n)作为分隔符来划分消息的边界。LineBasedFrameDecoder 的构造函数接受一个参数,即最大允许的消息长度。它会读取接收到的数据流,并根据换行符划分出完整的消息,然后将这些完整的消息发送给后续的处理器进行处理。
- DelimiterBasedFrameDecoder:通过指定自定义的分隔符来划分消息的边界,相较于 LineBasedFrameDecoder 更加灵活,可以自定义分隔符。DelimiterBasedFrameDecoder 的构造函数接受两个参数,分别是最大允许的消息长度和一个或多个分隔符（ByteBuf 类型）。它会读取接收到的数据流,并根据指定的分隔符划分出完整的消息,然后将这些完整的消息发送给后续的处理器进行处理。DelimiterBasedFrameDecoder 默认支持 Delimiters.nulDelimiter(按照 NUL 分割)和 Delimiters.lineDelimiter(按照换行符或回车符分割)两种策略,也可以自定义分割策略,需要返回 ByteBuf[]对象。
- StringDecoder:字符串解码器,用于将接收到的 ByteBuf 数据解码成字符串形式,方便消息的处理。

LineBasedFrameDecoder 工作原理:LineBasedFrameDecoder 依次遍历上一个 Handler 处理的 ByteBuf 中的可读字节,判断 ByteBuf 中是否包含`\n`或`\r\n`,如果存在则以该位置作为结束位置,从可读索引到结束位置区间的字节就是一个数据包。LineBasedFrameDecoder 是以换行符为结束标志的解码器,支持携带结束符或不携带结束符两种编码方式,同时支持配置单行的最大长度。如果连续读取 ByteBuf 到最大长度扔没有发现换行符,就会抛出异常,同时忽略之前读到的字节。

```java
package com.fly.tcp.pack.separator;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.Delimiters;
import io.netty.handler.codec.FixedLengthFrameDecoder;
import io.netty.util.CharsetUtil;

/**
 * Separator服务类,基于消息分隔符的方式解决TCP粘包/拆包问题,
 * Netty提供了LineBasedFrameDecoder和DelimiterBasedFrameDecoder 解码器通过分隔符来划分消息的边界
 */
public class SeparatorServer {

    private static final int PORT = 8080;

    public static void main(String[] args) throws InterruptedException {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        /**
                         * 添加基于分隔符的帧解码器,用于指定自定义的分隔符来划分消息的边界。
                         * DelimiterBasedFrameDecoder的构造函数接受两个参数,分别是最大
                         * 允许的消息长度和一个或多个分隔符（ByteBuf类型）。它会读取接收到的数据流,
                         * 并根据指定的分隔符划分出完整的消息,然后将这些完整的消息发送给后续的处理器进行处理。
                         * DelimiterBasedFrameDecoder 默认支持 Delimiters.nulDelimiter(按照 NUL 分割)
                         * 和 Delimiters.lineDelimiter(按照换行符或回车符分割)两种策略,也可以自定义分割策略,
                         * 需要返回 ByteBuf[]对象。Delimiters.lineDelimiter()等同于LineBasedFrameDecoder
                         */
                        pipeline.addLast(new DelimiterBasedFrameDecoder(1024, Delimiters.lineDelimiter()));
                        // 添加自定义Handler
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                String receivedMessage = msg.toString(CharsetUtil.UTF_8);
                                System.out.println("Received message: " + receivedMessage);
                            }
                        });
                    }
                });
        System.out.println("Server started on port " + PORT);
        // 绑定指定端口
        bootstrap.bind(PORT)
                // 阻塞当前线程,等待绑定操作完成,返回一个ChannelFuture对象
                .sync()
                // 获取当前 ServerChannel 对象
                .channel()
                // 获取关联的 CloseFuture 对象,用于异步关闭通知
                .closeFuture()
                // 阻塞等待Channel关闭完成
                .sync();
    }
}
```

```java
package com.fly.tcp.pack.separator;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.Delimiters;
import io.netty.util.CharsetUtil;

public class SeparatorClient {

    private static final String HOST = "localhost";
    private static final int PORT = 8080;

    public static void main(String[] args) throws InterruptedException {
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        // 添加基于分隔符的帧解码器,用于指定自定义的分隔符来划分消息的边界
                        pipeline.addLast(new DelimiterBasedFrameDecoder(1024, Delimiters.lineDelimiter()));
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            /**
                             * 在与远程对等方建立连接并准备传输数据时被调用(仅调用一次)
                             */
                            @Override
                            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                // 使用换行符分割消息
                                String message1 = "Hello world!\n";
                                String message2 = "Hello world?\n";
                                ctx.writeAndFlush(Unpooled.copiedBuffer(message1, CharsetUtil.UTF_8));
                                ctx.writeAndFlush(Unpooled.copiedBuffer(message2, CharsetUtil.UTF_8));
                            }

                            /**
                             * 用于接受服务端发送消息时触发
                             */
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                String message1 = "Hello world1!\0";
                                String message2 = "Hello world2!\0";
                                ctx.writeAndFlush(Unpooled.copiedBuffer(message1, CharsetUtil.UTF_8));
                                ctx.writeAndFlush(Unpooled.copiedBuffer(message2, CharsetUtil.UTF_8));
                            }
                        });
                    }
                });
        System.out.println("Connected to server " + HOST + ":" + PORT);
        // 连接服务端,指定HOST和端口
        bootstrap.connect(HOST, PORT)
                // 阻塞当前线程,等待绑定操作完成,返回一个ChannelFuture对象
                .sync()
                // 获取当前 ServerChannel 对象
                .channel()
                // 获取关联的 CloseFuture 对象,用于异步关闭通知
                .closeFuture()
                // 阻塞等待Channel关闭完成
                .sync();
    }
}
```

测试结果如下:

```txt
Server started on port 8080
Connected to server localhost:8080
Received message: Hello world!
Received message: Hello world?
```

基于消息分隔符的方法是一种常见且实用的解决 TCP 粘包和拆包问题的方式。它提供了灵活性和边界清晰性,适用于各种消息格式和长度的情况。

## 4.基于消息长度字段解决粘包/拆包问题

在消息中添加一个字段来表示消息的长度。接收方首先读取消息长度字段,然后根据长度字段的值读取相应长度的数据。Netty 提供了 LengthFieldBasedFrameDecoder 解码器来支持这种方式。LengthFieldBasedFrameDecoder 用于读取指定长度的字段来确定消息的长度,从而将接收到的数据流拆分为完整的消息。LengthFieldBasedFrameDecoder 的构造函数接受多个参数,其中包括消息的最大长度、长度字段的偏移量、长度字段的长度以及长度字段的调整值。它会根据这些参数解析接收到的数据流,读取长度字段,并根据长度字段的值切分出完整的消息。

```java
package com.fly.tcp.pack.len;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.LengthFieldBasedFrameDecoder;
import io.netty.handler.codec.LengthFieldPrepender;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.util.CharsetUtil;

/**
 * 基于消息长度的方式解决TCP粘包/拆包问题,Netty提供了
 * LengthFieldBasedFrameDecoder用于读取指定长度的字段
 * 来确定消息的长度,从而将接收到的数据流拆分为完整的消息
 */
public class LenServer {
    private static final int PORT = 8080;
    // 消息的最大长度
    private static final int MAX_FRAME_LENGTH = 1024;
    // 长度字段的偏移量
    private static final int LENGTH_FIELD_OFFSET = 0;
    // 长度字段的长度
    private static final int LENGTH_FIELD_LENGTH = 4;
    // 长度字段的调整值
    private static final int LENGTH_ADJUSTMENT = 0;
    // 需要跳过的字节数
    private static final int INITIAL_BYTES_TO_STRIP = 4;

    public static void main(String[] args) throws InterruptedException {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        /**
                         * 添加基于长度字段的帧解码器,能够准确地将接收到的数据流
                         * 拆分为完整的消息,以解决TCP粘包和拆包问题
                         */
                        // 使用LengthFieldBasedFrameDecoder解码器
                        pipeline.addLast(new LengthFieldBasedFrameDecoder(
                                MAX_FRAME_LENGTH,
                                LENGTH_FIELD_OFFSET,
                                LENGTH_FIELD_LENGTH,
                                LENGTH_ADJUSTMENT,
                                INITIAL_BYTES_TO_STRIP
                        ));
                        // 添加LengthFieldPrepender编码器,自动在消息前添加长度字段
                        pipeline.addLast(new LengthFieldPrepender(LENGTH_FIELD_LENGTH));
                        // 字符串解码器,用于将接收到的 ByteBuf 数据解码成字符串形式,方便消息的处理
                        pipeline.addLast(new StringDecoder(CharsetUtil.UTF_8));
                        // 添加自定义Handler
                        pipeline.addLast(new SimpleChannelInboundHandler<Object>() {
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, Object msg) throws Exception {
                                System.out.println("Received message: " + msg);
                            }
                        });
                    }
                });
        System.out.println("Server started on port " + PORT);
        // 绑定指定端口
        bootstrap.bind(PORT)
                // 阻塞当前线程,等待绑定操作完成,返回一个ChannelFuture对象
                .sync()
                // 获取当前 ServerChannel 对象
                .channel()
                // 获取关联的 CloseFuture 对象,用于异步关闭通知
                .closeFuture()
                // 阻塞等待Channel关闭完成
                .sync();
    }
}
```

```java
package com.fly.tcp.pack.len;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.LengthFieldBasedFrameDecoder;
import io.netty.handler.codec.LengthFieldPrepender;
import io.netty.util.CharsetUtil;

/**
 * 客户端类,由于服务端未发送消息给客户端,客户端无需添加
 * LengthFieldBasedFrameDecoder解码器
 */
public class LenClient {

    private static final String HOST = "localhost";
    private static final int PORT = 8080;
    private static final int MAX_FRAME_LENGTH = 1024; // 最大帧长度
    private static final int LENGTH_FIELD_OFFSET = 0; // 长度字段的偏移量
    private static final int LENGTH_FIELD_LENGTH = 4; // 长度字段的长度
    private static final int LENGTH_ADJUSTMENT = 0; // 长度字段的调整值
    private static final int INITIAL_BYTES_TO_STRIP = 4; // 需要跳过的字节数
    public static void main(String[] args) throws InterruptedException {
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();

                        // 使用LengthFieldBasedFrameDecoder解码器,根据长度字段划分消息边界
                        pipeline.addLast(new LengthFieldBasedFrameDecoder(
                                MAX_FRAME_LENGTH,
                                LENGTH_FIELD_OFFSET,
                                LENGTH_FIELD_LENGTH,
                                LENGTH_ADJUSTMENT,
                                INITIAL_BYTES_TO_STRIP
                        ));
                        // 添加LengthFieldPrepender编码器,自动在消息前添加长度字段
                        pipeline.addLast(new LengthFieldPrepender(LENGTH_FIELD_LENGTH));
                        pipeline.addLast(new SimpleChannelInboundHandler<ByteBuf>() {
                            /**
                             * 在与远程对等方建立连接并准备传输数据时被调用(仅调用一次)
                             */
                            @Override
                            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                ByteBuf message = ctx.alloc().buffer().writeBytes("Hello, server!".getBytes(CharsetUtil.UTF_8));
                                ctx.writeAndFlush(message);
                            }

                            /**
                             * 用于接受服务端发送消息时触发
                             */
                            @Override
                            protected void messageReceived(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
                                ByteBuf message = ctx.alloc().buffer().writeBytes("Hello, server!".getBytes(CharsetUtil.UTF_8));
                                ctx.writeAndFlush(message);
                            }
                        });
                    }
                });
        System.out.println("Connected to server " + HOST + ":" + PORT);
        // 连接服务端,指定HOST和端口
        bootstrap.connect(HOST, PORT)
                // 阻塞当前线程,等待绑定操作完成,返回一个ChannelFuture对象
                .sync()
                // 获取当前 ServerChannel 对象
                .channel()
                // 获取关联的 CloseFuture 对象,用于异步关闭通知
                .closeFuture()
                // 阻塞等待Channel关闭完成
                .sync();
    }
}
```

测试结果:

```txt
Server started on port 8080
Connected to server localhost:8080
Received message:Hello
```
