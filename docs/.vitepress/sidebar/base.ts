
export default {
    text: "Java基础",
    collapsed: true,
    items: [
        {
            text: "类型(Type)",
            link: "/base/type.md"
        },
        {
            text: "集合(Collect)",
            collapsed: true,
            items: [
                {
                    text: 'Collection 类关系图'
                },
                {
                    text: 'Array'
                }
            ]
        },
        {
            text: "泛型(Genericity)",
            link: "/base/genericity.md"
        },
        {
            text: "注解(Annotation)",
            link: "/base/annotation.md"
        },
        {
            text: "异常(Exceptional)",
            link: "/base/exceptional.md"
        },
        {
            text: "反射(Reflect)",
            link: "/base/reflect.md"
        },
        {
            text: "Java IO(Input/Output)",
            collapsed: true,
            items: [
                {
                    text: 'Java IO - 分类(传输,操作)'
                },
                {
                    text: 'Java IO常见类'
                },
                {
                    text: "IO 模型 - Unix IO 模型"
                },
                {
                    text: "BIO"
                },
                {
                    text: "NIO"
                },
                {
                    text: "NIO之IO多路复用"
                },
                {
                    text: "AIO"
                }
            ]
        },
        {
            text: "Java网络编程",
            collapsed: true,
            items: []
        },
        {
            text: 'SPI机制'
        }
    ]
}