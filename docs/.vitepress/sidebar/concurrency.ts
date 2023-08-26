export default {
  text: "Java 并发(Concurrency)",
  collapsed: true,
  items: [
    {
      text: "多线程基础",
      link: "/concurrency/thread.md",
    },
    {
      text: "线程池",
      link: "/concurrency/threadPool.md",
    },
    {
      text: "线程安全",
      link: "/concurrency/threadSafe.md",
    },
    {
      text: "ThreadLocal",
      link: "/concurrency/threadLocal.md",
    },
    {
      text: "JVM内置锁",
      link: "/concurrency/internalLock.md",
    },
    {
      text: "深入synchronized",
      link: "/concurrency/synchronized.md",
    },
    {
      text: "CAS原理与JUC原子类",
      link: "/concurrency/cas.md",
    },
    {
      text: "AQS",
      link: "/concurrency/AQS.md",
    },
    {
      text: "JUC并发工具类",
      collapsed: true,
      items: [
        {
          text: "CountDownLatch(倒时闩)",
          link: "/concurrency/juc/countDownLatch.md",
        },
        {
          text: "Semaphore(信号量)",
          link: "/concurrency/juc/semaphore.md",
        },
        {
          text: "CyclicBarrier(循环屏障)",
          link: "/concurrency/juc/cyclicBarrier.md",
        },
        {
          text: "Phaser(相位器)",
          link: "/concurrency/juc/phaser.md",
        },
      ],
    },
    {
      text: "JUC并发容器",
      collapsed: true,
      items: [
        {
          text: "CopyOnWriteArrayList",
          link: "/concurrency/juc/container/copyOnWriteArrayList.md",
        },
        {
          text: "ConcurrentHashMap",
          link: "/concurrency/juc/container/concurrentHashMap.md",
        },
      ],
    },
    {
      text: "高并发设计模式",
      link: "/concurrency/designPatterns.md",
    },
    {
      text: "CompletableFuture异步回调",
      link: "/concurrency/completableFuture.md",
    },
    {
      text: "高并发之异步编程",
      link: "/concurrency/asyncProgramming.md",
    },
    {
      text: "Disruptor框架",
      link: "/concurrency/disruptor.md",
    },
  ],
};
