export default {
  text: "Java基础",
  collapsed: true,
  items: [
    {
      text: "类型(Type)",
      link: "/base/type.md",
    },
    {
      text: "集合(Collect)",
      collapsed: true,
      items: [
        {
          text: "Collection 类关系图",
          link: "/base/collect/collection.md",
        },
        {
          text: "ArrayList",
          link: "/base/collect/arrayList.md",
        },
        {
          text: "LinkedList",
          link: "/base/collect/linkedList.md",
        },
        {
          text: "Stack & Queue",
          link: "/base/collect/stack&Queue.md",
        },
        {
          text: "PriorityQueue",
          link: "/base/collect/priorityQueue.md",
        },
        {
          text: "HashSet & HashMap",
        },
        {
          text: "LinkedHashSet & Map",
        },
        {
          text: "TreeSet & TreeMap",
          link: "/base/collect/tree.md",
        },
      ],
    },
    {
      text: "泛型(Genericity)",
      link: "/base/genericity.md",
    },
    {
      text: "注解(Annotation)",
      link: "/base/annotation.md",
    },
    {
      text: "异常(Exceptional)",
      link: "/base/exceptional.md",
    },
    {
      text: "反射(Reflect)",
      link: "/base/reflect.md",
    },
    {
      text: "Java IO(Input/Output)",
      collapsed: true,
      items: [
        {
          text: "IO 模型 - Unix IO 模型",
          link: "/base/io/unixIOModel.md",
        },
        {
          text: "BIO",
          link: "/base/io/bio.md",
        },
        {
          text: "NIO",
          link: "/base/io/nio.md",
        },
        {
          text: "NIO之IO多路复用",
        },
        {
          text: "AIO",
        },
        {
          text: "Netty",
          collapsed: true,
          items: [
            {
              text: "Netty介绍",
              link: "/base/io/netty/introduce.md",
            },
            {
              text: "Netty解决TCP粘包/拆包",
              link: "/base/io/netty/glueAndUnpack.md",
            },
            {
              text: "Netty之编解码",
              link: "/base/io/netty/codec.md",
            },
            {
              text: "Netty之TCP协议",
              link: "/base/io/netty/tcp.md",
            },
            {
              text: "Netty之UDP协议",
              link: "/base/io/netty/udp.md",
            },
            {
              text: "Netty之Http协议",
              link: "/base/io/netty/http.md",
            },
            {
              text: "Netty之WebSocket协议",
              link: "/base/io/netty/webSocket.md",
            },
            {
              text: "Netty之自定义私有协议",
              link: "/base/io/netty/customProtocol.md",
            },
          ],
        },
      ],
    },
    {
      text: "Java网络编程",
      collapsed: true,
      items: [],
    },
    {
      text: "SPI机制",
      link: "../../base/spi.md",
    },
  ],
};
