Netty 是一个基于 Java 的开源网络应用框架,提供了高性能、异步、事件驱动的网络编程模型。Netty 官方描述 Netty 是一个异步事件驱动的网络应用程序框架,用于快速开发可维护的高性能协议服务器和客户端。Netty 旨在简化网络应用程序的开发,并提供可靠的、可扩展的网络通信能力。Netty 的主要特点包括:

- 异步和事件驱动:Netty 采用基于事件驱动和异步的编程模型,使用事件和回调机制处理网络操作。这种模型能够高效地处理大量并发连接,提供更好的可伸缩性和性能。
- 高性能:Netty 的设计和实现注重性能和效率。它通过使用非阻塞 IO 和零拷贝技术等优化手段,提供了卓越的网络性能。
- 组件化和可重用性:Netty 的设计采用了组件化的思想,提供了一系列易于扩展和重用的组件,如编解码器、处理器、编解码器链、线程模型等,使开发者能够轻松地构建复杂的网络应用。
- 多种协议支持:Netty 支持多种网络协议,包括常见的 TCP、UDP、HTTP、WebSocket 等,提供了相应的编解码器和处理器,使开发者能够方便地开发不同协议的应用程序。
- 安全性:Netty 提供了一些安全性相关的组件和功能,如 SSL/TLS 支持、加密和解密等,帮助开发者构建安全的网络应用。

由于其优秀的性能和功能,Netty 广泛应用于构建高性能、可靠的网络服务器和客户端应用,特别适用于网络通信密集型的应用场景,如游戏服务器、聊天应用、实时通信、大规模分布式系统等。使用 Netty 作为网络通信框架的知名开源项目:

- Apache Kafka:一个分布式流处理平台和消息队列系统,使用 Netty 作为底层的网络传输框架。
- RocketMQ:一个分布式消息中间件,使用 Netty 实现了高性能的消息传输。
- gRPC:一个高性能的开源 RPC(远程过程调用)框架,使用 Netty 作为其底层的网络通信引擎。
- Dubbo:一个分布式服务框架,用于构建高性能和可扩展的分布式应用,提供了服务注册、发现、调用和负载均衡等功能,其底层使用
  Netty 作为网络通信框架。
- Spring Framework:一个广泛使用的 Java 应用程序开发框架,Netty 被用于实现 Spring WebFlux 模块的反应式编程。

## 1.Netty Hello

### 1.1 Netty 实现简单的消息收发

添加 Netty5 依赖:

```groovy
dependencies {
    implementation 'io.netty:netty-all:5.0.0.Alpha2'
}
```

```java
package com.fly;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;

/**
 * 使用Netty实现一个Hello服务,支持服务端与客户端简单的消息收发
 */
public class HelloServer {
    public static void main(String[] args) {
        /**
         * 创建两个EventLoopGroup(事件循环组),在Netty中,服务器通常接收两类任务:接收连接和处理连接的IO操作,
         * 为了高效地处理这些任务,Netty使用不同的线程组来分离接收连接和处理 I/O 操作的任务,以此
         * 来提高服务器的并发性能。其中:
         * - bossGroup:该线程组负责接受传入的连接。它会监听服务器绑定的端口,并接受客户端的连接请求。
         * 一旦有新的连接建立,bossGroup 将其注册到 workerGroup 中的线程进行进一步处理。
         * - workerGroup:该线程组负责处理已经建立的连接的 I/O 操作。一旦连接被接受并注册到
         * workerGroup 中,workerGroup 将负责处理连接的读取和写入操作。
         */
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            // 创建ServerBootstrap对象,用于配置和启动服务器
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            // 设置线程模型,Netty内部使用基于事件驱动和多线程的线程模型,称为 Reactor 线程模型
            serverBootstrap.group(bossGroup, workerGroup)
                    /**
                     * 设置通信通道(Channel),Channel是Netty中提供的一个抽象接口,
                     * 表示一个开放的连接,可以进行数据的读取和写入。Channel提供了
                     * 多个子接口以适应不同的网络通信需求和协议,常见的子接口如下:
                     * - SocketChannel:用于 TCP 网络套接字的 Channel 实现。
                     * 它提供了对 TCP 连接的读取和写入操作,以及对连接状态的管理。
                     * - ServerChannel:用于监听传入连接的 Channel 实现。
                     * 它可以接受传入的连接请求，并创建相应的 SocketChannel 用于处理这些连接。
                     * - UdtChannel:用于支持 UDT（User Datagram Protocol for Transactions）
                     * 协议的通信。UDT 是一种可靠的、高性能的数据传输协议,特别适用于对传输延迟
                     * 和可靠性有严格要求的应用。
                     * - DatagramChannel:用于 UDP 数据报套接字的 Channel 实现。
                     * 它提供了对 UDP 数据包的读取和写入操作，以及对多播和广播的支持。
                     *
                     * 其中SocketChannel接口的具体实现如下:
                     * - NioServerSocketChannel:基于 Java NIO 的 SocketChannel 实现,适用于 TCP 网络套接字。
                     * - OioSocketChannel:基于传统的阻塞 I/O 的 SocketChannel 实现,适用于旧版的 I/O 模型。
                     * - EpollSocketChannel:基于 Linux Epoll 的 SocketChannel 实现，
                     * 适用于 TCP 网络套接字。它提供了更高的性能和可伸缩性
                     */
                    .channel(NioServerSocketChannel.class)
                    /**
                     * handler()用于向 ChannelPipeline 末尾添加一个新的 ChannelHandler。
                     * ChannelHandler 是 Netty 中的处理器，用于实现具体的业务逻辑和数据处理。
                     * 它可以处理不同类型的事件，如连接建立、数据读取、数据写入等，并进行相应的操作和响应。
                     * 通过添加不同的 ChannelHandler，可以实现各种功能，如数据解码、数据编码、
                     * 业务逻辑处理、错误处理、日志记录等。
                     *
                     * ChannelPipeline 是 Netty 中的一个重要概念，它由一系列的 ChannelHandler
                     * 组成，用于处理传入和传出的数据、事件和状态变化。在ChannelPipeline中
                     * ChannelHandler被组织成一个处理链，用于对Channel的数据流进行处理。
                     * 当一个事件或数据通过ChannelPipeline传递时，会被依次经过各个ChannelHandler进行处理和转换。
                     */
                    .handler(new LoggingHandler(LogLevel.INFO))
                    /**
                     * childHandler() 方法是用于向 ServerChannel 的 ChildChannelPipeline 末尾
                     * 添加一个新的 ChannelHandler。在 Netty 的服务器端，通常会有一个
                     * ServerChannel 负责监听和接受客户端的连接请求。一旦有新的连接建立，
                     * ServerChannel 会创建一个对应的子 Channel，即 ChildChannel。ChildChannel
                     * 用于处理与客户端之间的具体通信，包括数据的读写和事件的处理。
                     * 与 handler() 方法不同，childHandler() 方法是针对每个新连接的子 Channel 进行处理，
                     * 而不是整个 ChannelPipeline。每个新连接都会有自己独立的 ChildChannelPipeline，
                     * 并且可以根据需要定制不同的数据处理逻辑。
                     *
                     * ChannelInitializer 是 Netty 中的一个特殊的 ChannelHandler，用于在 Channel 被注册到 EventLoop
                     * 后,对 Channel 进行初始化和配置。ChannelInitializer支持在Channel 注册后自定义配置 ChannelPipeline,
                     * 添加一系列的 ChannelHandler 来处理传入和传出的数据、事件和状态变化。ChannelInitializer抽象类提供了
                     * initChannel()方法用于自定义的 Channel 初始化逻辑,在initChannel方法中可以向 ChannelPipeline
                     * 添加各种 ChannelHandler，并配置它们的顺序和参数。
                     */
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        /**
                         * initChannel()方法自定义的 Channel 初始化逻辑
                         * @param ch           已注册的Channel
                         * @throws Exception
                         */
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            // 通过Channel获取Channel管道
                            ChannelPipeline pipeline = ch.pipeline();
                            // 在通道管道尾部添加通道处理器(ChannelHandler)
                            pipeline.addLast(new StringDecoder()); // 添加字符串解码器
                            pipeline.addLast(new StringEncoder()); // 添加字符串编码器
                            pipeline.addLast(new HelloServerHandler()); // 添加自定义处理器
                        }
                    });
                    // 绑定端口
                    serverBootstrap.bind(8888)
                            /**
                             * sync()用于阻塞等待服务器的启动完成。sync()返回一个ChannelFuture
                             * ,表示服务器的异步操作结果。
                             */
                            .sync()
                            // 获取Channel
                            .channel()
                            // 用于获取表示Channel关闭的ChannelFuture对象
                            .closeFuture()
                            .sync();

        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            /**
             * 释放资源。Netty提供了shutdownGracefully()和shutdownNow()用于关闭EventLoopGroup,
             * 两者区别如下:
             * - shutdownGracefully():用于优雅地关闭 Netty 的 EventLoopGroup,
             * shutdownGracefully()会等待所有正在处理的任务完成后再关闭 EventLoopGroup,而
             * - shutdownNow():用于立即关闭 Netty 的 EventLoopGroup,shutdownNow()并不会
             * 等待正在处理的任务完成。它会强制停止所有的线程，并丢弃尚未完成的任务。
             * 除此之外,Netty还提供了isShutdown()、isShuttingDown()判断EventLoopGroup是否被终结。
             */
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}
```

HelloServerHandler 用于字符串消息的收发。HelloServerHandler 继承了 SimpleChannelInboundHandler 类并重写了 messageReceived()方法,用于处理接收来自客户端的消息。

```java
package com.fly;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

/**
 * 自定义ChannelHandler(需要实现ChannelHandler接口),实现消息的收发。
 * SimpleChannelInboundHandler是ChannelInboundHandlerAdapter 的一个子类,
 * 间接性实现了ChannelHandler接口,用于处理特定类型的消息。SimpleChannelInboundHandler
 * 允许接收一个泛型,表示处理的消息类型。
 */
public class HelloServerHandler extends SimpleChannelInboundHandler<String> {

    /**
     * 用于处理接收到的消息
     * @param ctx           ChannelHandler上下文
     * @param msg           接收的消息
     * @throws Exception
     */
    @Override
    protected void messageReceived(ChannelHandlerContext ctx, String msg) throws Exception {
        System.out.println("receive client message:" + msg);
        /**
         * 将数据写入到与ChannelHandlerContext关联的Channel并刷新数据,
         * 注意:ChannelHandlerContext的write()只是将消息写入到对应的Channel的缓冲区中,
         * 并不会将消息发送至客户端,若要发送消息请使用flush()。flush()的作用是将
         * 所有待发送的数据从内部缓冲区刷新到底层的Socket缓冲区中,并尽可能快地发送给客户端。
         * writeAndFlush()用于向对象Channel写入数据,并将Channel中的数据刷新到底层的
         * Socket缓冲区中发送。
         *
         * Socket是计算机网络通信中的一种编程接口(网络通讯中抽象概念,表示一个网络连接的一端),它提供了一种
         * 通过网络进行数据传输的机制,用于在不同计算机之间建立网络连接,实现数据的发送和接收。
         * Socket编程可以用于各种网络协议,如TCP/IP、UDP、HTTP等。它提供了一种灵活的方式来实现网络应用程序,
         * 例如客户端-服务器模型、点对点通信等。
         */
        ctx.writeAndFlush("client reply message:I'm fine");
    }
}
```

### 1.2 Netty 启动步骤分析

Netty 启动步骤可以简单分为创建两个 EventLoopGroup(事件循环组)、创建并配置 ServerBootstrap、绑定端口并阻塞等待服务端启动完成、关闭 EventLoopGroup 组四个步骤:

- 创建 EventLoopGroup 组:在 Netty 中,服务器通常接收两类任务:接收连接和处理连接的 IO 操作,为了高效地处理这些任务,
  Netty 内部使用基于事件驱动和多线程的线程模型(称为 Reactor 线程模型),采用不同的线程组来分离接收连接和处理 I/O 操作的任务,以此来提高服务器的并发性能。其中:
  - bossGroup:该线程组负责接受传入的连接。它会监听服务器绑定的端口,并接受客户端的连接请求。 一旦有新的连接建立,bossGroup 将将其注册到 workerGroup 中的线程进行进一步处理。
  - workerGroup:该线程组负责处理已经建立的连接的 I/O 操作。一旦连接被接受并注册到 workerGroup 中,workerGroup 将负责处理连接的读取和写入操作。
- 创建 ServerBootstrap 对象:ServerBootstrap 用于配置和启动服务器。serverBootstrap 使用 group()方法设置线程模型,使用 channel()方法设置通讯通道,使用 handler 用于向 ChannelPipeline 末尾添加一个新的 ChannelHandler,使用 childHandler() 方法用于向 ServerChannel 的 ChildChannelPipeline 末尾添加一个新的 ChannelHandler。

  - group():Netty 在处理事件时,提供了串行和并行两种模式:
    - 串行模式:使用一个 EventLoop 来处理所有事件,相当于是一个线程。所有连接共用这个 EventLoop,事件将会串行地在这个线程上处理。
    - 并行模式:使用 parentGroup 和 childGroup 两个 EventLoop 来处理事件,parentGroup 负责接受传入的连接,childGroup 负责处理已经建立的连接的 I/O 操作,每个 EventLoop 绑定一个线程。连接可以分配到不同的 EventLoop,那么这些连接的事件将会并行地在不同的线程上处理。并行模式可以利用多核 CPU 提高系统整体的吞吐量。
  - channel():Channel 是 Netty 中提供的一个抽象接口,表示一个开放的连接,可以进行数据的读取和写入。Channel 提供了多个子接口以适应不同的网络通信需求和协议,例如 SocketChannel(用于 TCP 网络套接字的 Channel 实现)、UdtChannel(用于支持 UDT 协议的通信)、DatagramChannel(用于 UDP 数据报套接字的 Channel 实现),其中 SocketChannel 最为常用,SocketChannel 提供了三个子类:
    - NioServerSocketChannel:基于 Java NIO 的 SocketChannel 实现,适用于 TCP 网络套接字。
    - OioSocketChannel:基于传统的阻塞 I/O 的 SocketChannel 实现,适用于旧版的 I/O 模型。
    - EpollSocketChannel:基于 Linux Epoll 的 SocketChannel 实现,适用于 TCP 网络套接字,提供了更高的性能和可伸缩性。
  - handler():ChannelHandler 是 Netty 中的处理器,用于实现具体的业务逻辑和数据处理。它可以处理不同类型的事件,如连接建立、数据读取、数据写入等,并进行相应的操作和响应。通过添加不同的 ChannelHandler,可以实现各种功能,如数据解码、数据编码、业务逻辑处理、错误处理、日志记录等。ChannelPipeline 是 Netty 中的一个重要概念,它由一系列的 ChannelHandler 组成,用于处理传入和传出的数据、事件和状态变化。在 ChannelPipeline 中 ChannelHandler 被组织成一个处理链,用于对 Channel 的数据流进行处理。当一个事件或数据通过 ChannelPipeline 传递时,会被依次经过各个 ChannelHandler 进行处理和转换。
  - childHandler():在 Netty 的服务器端,通常会有一个 ServerChannel 负责监听和接受客户端的连接请求。一旦有新的连接建立,ServerChannel 会创建一个对应的子 Channel,即 ChildChannel。ChildChannel 用于处理与客户端之间的具体通信,包括数据的读写和事件的处理。与 handler() 方法不同,childHandler() 方法是针对每个新连接的子 Channel 进行处理,而不是整个 ChannelPipeline。每个新连接都会有自己独立的 ChildChannelPipeline,并且可以根据需要定制不同的数据处理逻辑。HelloServer 类使用 childHandler()注册了一个 ChannelInitializer,ChannelInitializer 是 Netty 中的一个特殊的 ChannelHandler,用于在 Channel 被注册到 EventLoop 后,对 Channel 进行初始化和配置。ChannelInitializer 支持在 Channel 注册后自定义配置 ChannelPipeline,添加一系列的 ChannelHandler 来处理传入和传出的数据、事件和状态变化。ChannelInitializer 抽象类提供了 initChannel()方法用于自定义的 Channel 初始化逻辑,在 initChannel 方法中可以向 ChannelPipeline 添加各种 ChannelHandler,并配置它们的顺序和参数。

- 绑定端口并阻塞等待服务端启动完成:ServerBootstrap 通过 bind()绑定端口,使用 sync()用于阻塞等待服务器的启动完成。sync()返回一个 ChannelFuture,表示服务器的异步操作结果。
- 关闭 EventLoopGroup 组:Netty 提供了 shutdownGracefully()和 shutdownNow()用于关闭 EventLoopGroup,两者区别如下:
  - shutdownGracefully():用于优雅地关闭 Netty 的 EventLoopGroup,shutdownGracefully()会等待所有正在处理的任务完成后再关闭 EventLoopGroup,而
  - shutdownNow():用于立即关闭 Netty 的 EventLoopGroup,shutdownNow()并不会等待正在处理的任务完成。它会强制停止所有的线程,并丢弃尚未完成的任务。

## 2.Reactor 模型

Reactor 模式是一种事件驱动的异步非阻塞 I/O 模型。它用于处理大量的并发连接,在高并发网络编程中很常用。Reactor 模式主要包含以下组件:

- Reactor(反应器):负责监听事件并分发事件,相当于服务端的主循环。
- Acceptor(处理器):接收客户端连接,并创建处理器。
- Handler(处理器):异步非阻塞地处理连接上的 IO 操作。

Reactor 模式的工作流程如下:

- Reactor 在一个线程中运行,监听客户端请求事件。
- 收到事件后,Reactor 会将该事件分发给对应的 Handler。
- Handler 在独立线程中异步处理该事件,finish 后会通知 Reactor。
- Reactor 接受到通知后向客户端发送响应结果。

Reactor 模式使得服务端能够异步非阻塞地处理大量客户端连接,充分利用多核 CPU。它是高并发网络编程的基础模型之一。Netty 框架中的 IO 线程模型也是基于 Reactor 模式实现的,这使其可以高效处理海量连接。根据 Reactor 和 Handler 的关系不同,Reactor 模式主要可以分为以下几种类型:

- 单 Reactor 单线程模型。
- 单 Reactor 多线程模型。
- 主从多线程 Reactor 模型。
- 多 Reactor 多线程模型。

### 2.1 单 Reactor 单线程模型

单 Reactor 单线程模型是 Reactor 模式最基本的模型,有一个 Reactor 和一个线程来处理所有事件。Reactor 负责监听事件,收到事件后在同一个线程 dispatch 给某个 Handler 处理。该模式虽然实现简单,但性能和并发处理能力有限。

```java
package com.fly.reactor.single;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * 单Reactor单线程模型,Reactor和Handler在同一个线程中,Reactor负责监听连接,
 * 收到连接后在同一个线程处理请求,虽然实现简单但无法实现异步和并发处理。
 */
public class SingleThreadReactor {
    /**
     * ServerSocket用于服务端提供网络服务,它工作在传输层(TCP)并负责建立Socket连接
     */
    private ServerSocket serverSocket;

    public SingleThreadReactor(int port) throws IOException {
        this.serverSocket = new ServerSocket(port);
    }

    public void serve() {
        // 如果serverSocket连接未关闭,则一直阻塞等待处理请求
        while (!serverSocket.isClosed()) {
            try {
                /**
                 * 阻塞等待会一直等待客户端连接,当接收到客户端连接请求时,会返回一个
                 * 新的Socket实例,Socket与指定客户端建立了点对点连接,可以用来发送接收数据。
                 * Socket与指定客户端建立了点对点连接,可以用来发送接收数据,
                 * 可以通过设置backlog参数来配置等待连接队列的大小
                 */
                Socket socket = serverSocket.accept();
                handleRequest(socket);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    void handleRequest(Socket socket) throws IOException {
        // 从Socket(套接字)获取输入流
        InputStream input = socket.getInputStream();
        // 根据输入流创建一个只读输入流
        InputStreamReader streamReader = new InputStreamReader(input, "UTF-8");
        OutputStream output = socket.getOutputStream();
        OutputStreamWriter streamWriter = new OutputStreamWriter(output, "UTF-8");
        /**
         * 根据Reader流创建缓冲区读取字符流,BufferedReader实现了缓冲读取机制,它会一次性读取大块
         * 数据到缓冲区,然后应用可以从缓冲区获取数据,实现了读取性能的大幅提升
         */
        BufferedReader reader = new BufferedReader(streamReader);
        /**
         * readLine()用于从字符输入流中读取一行内容,如果流中没有数据,
         * readLine()会进行阻塞等待
         */
        String message = reader.readLine();
        System.out.println("message:" + message);
        /**
         * PrintWriter类封装了输出流,提供了格式化打印字符串的高效便捷接口,
         * 支持所有基本数据类型、String、对象、char[]等多种数据类型输出。
         * PrintWriter使用内部缓存区存储数据以减少写操作的次数,以此来提高性能,
         * 并且支持自动刷新数据到Socket,无需手动flush。
         */
        PrintWriter writer = new PrintWriter(streamWriter, true);
        // 向客户端写入数据
        writer.println("Hello Client:" + message);
        reader.close();
        // 关闭套接字
        socket.close();
    }
}
```

```java
package com.fly.reactor.single;


import java.io.IOException;

/**
 * 单Reactor单线程模型启动类
 */
public class SingleThreadReactorBootstrap {
    public static void main(String[] args) throws IOException {
        SingleThreadReactor reactor = new SingleThreadReactor(8888);
        reactor.serve();
    }
}
```

在单 Reactor 单线程模型中,Reactor 和 Handler 在同一个线程中,Reactor 负责监听连接,收到连接后在同一个线程处理请求,虽然实现简单但无法实现异步和并发处理。

### 2.2 单 Reactor 多线程模型

Reactor 仍只有一个,但有多个线程来处理事件。Reactor 将请求分发给不同的 Handler,Handler 运行在不同线程上以实现并发处理。线程池可以用来管理 Handler 线程。

### 2.3 主从多线程 Reactor 模型

有一个主线程作为主 Reactor,其他线程作为从 Reactor。主 Reactor 负责监听连接事件,从 Reactor 负责 IO 读写。来自同一客户端的所有请求都由同一个从 Reactor 处理。

### 2.4 多 Reactor 多线程模型

有多个 Reactor,每个 Reactor 及其线程可以监听不同端口,或者监听同一端口的不同连接。多个 Reactor 实现任务分离,Reactor 线程负责监听,Handler 线程池负责处理 IO。

### 2.5 Netty Reactor 模型

Netty 提供单 Reactor 单线程、单 Reactor 多线程、主从 Reactor 多线程等线程模型:

- 单 Reactor 单线程:一个 Reactor 线程负责所有的事件处理,相当于一个线程池中只有一个线程,适用于小量简单连接。在 Netty 通过 EventLoopGroup 构造方法传入 1 表示单线程模式,例如:`EventLoopGroup group = new NioEventLoopGroup(1);`。在单线程模式下 ChannelPipeline(Channel 管道链)使用一个线程处理所有 Handler,会将所有的 Handler 添加到同一个 ChannelPipeline 中,这样所有事件都在一个线程中处理。

```java
// 通过EventLoopGroup构造方法传入1表示单线程模式
EventLoopGroup group = new NioEventLoopGroup(1);
ServerBootstrap bootstrap = new ServerBootstrap();
// 配置线程模型
bootstrap.group(group);
```

- 单 Reactor 多线程:一个 Reactor 线程监听事件,但根据事件类型派发给不同的 handler 线程池进行处理,提高吞吐量。

```java
/**
 * NioEventLoopGroup创建的线程数与以下几个参数相关:
 * - ioRatio:IO任务和非IO任务的执行线程数比例,默认8。
 *
 * - 初始化线程数:NioEventLoopGroup(int nThreads)支持构造函数
 * 指定初始化的线程数,默认是CPU核心数 * 2。
 *
 * - 启动时线程数:在Netty服务启动时,会调用NioEventLoopGroup的next()
 * 方法获取下一个EventLoop来处理Channel。这个过程中会延迟创建线程,
 * 线程数取决于处理的Channel数。
 *
 * - 最大线程数:通过调用setMaximumPoolSize()可以限制EventLoop的最大线程数。
 *
 * - 线程增长步长:在运行时可以通过步长逐渐增加线程数,防止创建过多空闲线程。
 */
EventLoopGroup group = new NioEventLoopGroup();
ServerBootstrap bootstrap = new ServerBootstrap();
// 配置线程模型为单Reactor多线程模型
bootstrap.group(group);
```

- 主从 Reactor 多线程:一个主 Reactor 线程监听连接事件,接收新连接后分离给从 Reactor 线程处理后续 IO 事件,减少主线程负载。主从 Reactor 多线程模式也是 Netty 最常规写法。

```java
/**
 * 创建两个EventLoopGroup,主Reactor负责接受传入的连接,用于分配给从Reactor,
 * 从Reactor用于IO处理
 */
EventLoopGroup bossGroup = new NioEventLoopGroup();
EventLoopGroup workerGroup = new NioEventLoopGroup();
ServerBootstrap bootstrap = new ServerBootstrap();
bootstrap.group(bossGroup, workerGroup);
```

- 主从 Reactor 多线程池:相比于主从 Reactor,从 Reactor 使用线程池而不是单线程,来处理 IO 事件,更灵活。

## ChannelHandler

ChannelHandler 是 Netty 提供的一个抽象接口,用于处理 I/O 事件或拦截 I/O 操作,并将其转发到 ChannelPipeline 中的下一个 Handler。ChannelHandler 具有多个子类(例如 ChannelHandlerAdapter、WebSocketFrameDecoder、WebSocketFrameEncoder 等),其中 ChannelHandlerAdapter 类是 ChannelHandler 的适配器类,提供了 ChannelHandler 的骨架实现,用于简化实现 ChannelHandler 接口的过程。在实际开发中通常不会直接实现 ChannelHandler 接口或继承 ChannelHandlerAdapter 类,而是扩展 ChannelHandlerAdapter 的子类,ChannelHandlerAdapter 提供大量子类,常用子类如下:

- SimpleChannelInboundHandler:一个抽象类,允许显式地仅处理特定类型的消息。
- IdleStateHandler:一个用于处理连接空闲状态的处理器。它可以检测连接在一段时间内没有读取或写入数据的情况,并触发 IdleStateEvent 事件。使用 IdleStateHandler 可以实现:
  - 心跳检测:通过定期发送心跳消息并检测对方是否响应,来判断连接是否存活。当连接的读取或写入空闲时间超过预设的阈值时,可以触发相应的事件,例如关闭连接或发送心跳消息。
  - 超时处理:对于长时间没有读取或写入数据的连接,可以设置超时时间,并在超时发生时执行相应的操作,如断开连接或发送超时通知。
- ReadTimeoutHandler:用于处理读超时事件,如果在一定时间内没有读取数据,则引发 ReadTimeoutException。
- WriteTimeoutHandler:用于处理写超时事件,如果在一定时间内没有写入数据时,引发 WriteTimeoutException。
- ChannelInitializer:一个特殊的 ChannelHandler,用于在 Channel 注册时初始化 Channel 的 Pipeline。它通常用于配置 Channel 的初始状态,例如添加各种处理器和编解码器。
- CorsHandler:用于处理跨源资源共享 (CORS) 请求,该 Handler 可以使用 CorsConfig 进行配置
- ChunkedWriteHandler:用于将大数据流分块写入到 Channel 中,以避免一次性写入大量数据导致的内存占用问题。ChannelHandler 添加了对异步写入大型数据流的支持,既不会花费大量内存,也不会出现 OutOfMemoryError。 在传输大数据流需要在 ChannelHandler 实现中进行复杂的状态管理,ChunkedWriteHandler 内部提供了复杂的状态管理功能,以便于更简单的发送大数据流。
- LoggingHandler:使用日志框架记录所有事件的 ChannelHandler。 默认情况下,所有事件都在 DEBUG 级别记录。
- SpdySessionHandler:用于管理 SPDY 会话中的流。
- WebSocketServerExtensionHandler:该处理程序协商并初始化 WebSocket 扩展。 它根据客户端所需的顺序协商扩展,确保成功协商的扩展在它们之间是一致的,并使用扩展解码器和编码器初始化通道管道。 在 `io.netty.handler.codec.http.websocketx.extensions.compression.WebSocketServerCompressionHandler` 中查找压缩扩展的基本实现。
- WebSocketClientExtensionHandler:该处理程序协商并初始化 WebSocket 扩展。 该实现按照定义的顺序与服务器协商扩展,确保成功协商的扩展在它们之间是一致的,并使用扩展解码器和编码器初始化通道管道。 在 `io.netty.handler.codec.http.websocketx.extensions.compression.WebSocketClientCompressionHandler` 中查找压缩扩展的基本实现。
