import{_ as t,o as a,c as n,O as s}from"./chunks/framework.1e38657f.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"caseInterview/base.md","filePath":"caseInterview/base.md","lastUpdated":1708792908000}'),l={name:"caseInterview/base.md"},e=s(`<h2 id="java-中基础类型有哪些" tabindex="-1">Java 中基础类型有哪些? <a class="header-anchor" href="#java-中基础类型有哪些" aria-label="Permalink to &quot;Java 中基础类型有哪些?&quot;">​</a></h2><p>在 Java 中类型可分为基本类型(也称原始类型)和引用类型:</p><ul><li>基本类型:int、boolean、byte、char、short、float、long、double。</li><li>引用类型:包括类、接口、数组等。注意:引用类型的变量存储的是对象的引用,而不是对象本身。</li></ul><p>Java 为基本类型提供了对应的包装类型,包装类型属于引用类型,其默认值都为 null。基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成,即基本类型赋值给包装类型称为装箱,包装类型赋值给基本类型称为拆箱。</p><table><thead><tr><th>类型</th><th>占用大小(字节)</th><th>默认值</th><th>取值范围</th><th>描述</th><th>对应的包装类型</th></tr></thead><tbody><tr><td>boolean</td><td>1</td><td>false</td><td>true 或者 false</td><td>用于表示布尔值</td><td>Boolean</td></tr><tr><td>byte</td><td>1</td><td>0</td><td>-128 到 127</td><td>用于表示字节流数据</td><td>Byte</td></tr><tr><td>char</td><td>2</td><td>空</td><td>0 到 65535</td><td>用于表示 Unicode 字符</td><td>Char</td></tr><tr><td>short</td><td>2</td><td>0</td><td>-32768 到 32767</td><td>用于表示较小的整数</td><td>Short</td></tr><tr><td>int</td><td>4</td><td>0</td><td>-2147483648 到 2147483647</td><td>用于表示整数</td><td>Integer</td></tr><tr><td>float</td><td>4</td><td>0.0</td><td>±1.4e-45 到 ±3.4e+38</td><td>用于表示单精度浮点数</td><td>Float</td></tr><tr><td>long</td><td>8</td><td>0</td><td>-9223372036854775808 到 9223372036854775807</td><td>用于表示较大的整数</td><td>Long</td></tr><tr><td>double</td><td>8</td><td>0.0</td><td>±4.9e-324 到 ±1.8e+308</td><td>用于表示双精度浮点数</td><td>Double</td></tr></tbody></table><h2 id="什么是拆箱和装箱" tabindex="-1">什么是拆箱和装箱? <a class="header-anchor" href="#什么是拆箱和装箱" aria-label="Permalink to &quot;什么是拆箱和装箱?&quot;">​</a></h2><h2 id="类型转换" tabindex="-1">类型转换 <a class="header-anchor" href="#类型转换" aria-label="Permalink to &quot;类型转换&quot;">​</a></h2><h2 id="与-equal-的区别" tabindex="-1">== 与 equal()的区别 <a class="header-anchor" href="#与-equal-的区别" aria-label="Permalink to &quot;== 与 equal()的区别&quot;">​</a></h2><h2 id="int-与-integer-的区别" tabindex="-1">int 与 Integer 的区别? <a class="header-anchor" href="#int-与-integer-的区别" aria-label="Permalink to &quot;int 与 Integer 的区别?&quot;">​</a></h2><ul><li>int 属于基本类型,指向存储的数值,而 Integer 是 int 的包装类,属于引用类型,指向 Integer 实例化后的对象。</li><li>Integer 声明的变量必须实例化后才能使用,int 声明的变量无需实例化也能使用。</li><li>int 的默认值为 0,Integer 的默认值为 null。</li></ul><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// (1).Integer变量实际上是对一个Integer对象的引用,所以两个通过new实例化的Integer永不相等</span></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> n1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Integer</span><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> n2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Integer</span><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">n1 </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> n2</span><span style="color:#89DDFF;">);</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// false</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (2).Integer变量与int变量比较时,只要数值相等,则比较结果为true。包装类型与基本类型比较时,Java会自动将包装类型拆箱为基本类型,然后进行比较</span></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> n3 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">100</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> n4 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">100</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">n3 </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> n4</span><span style="color:#89DDFF;">);</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (3).通过new实例化声明的Integer变量与Integer声明的变量比较时,结果为false。通过new实例化声明的Integer变量指向JVM内存区域堆中新创建的对象,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 而Integer声明的变量指向Integer内部静态常量池中cache数组存储的指向堆的Integer对象,两者引用的内存地址不同</span></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> x </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">100</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> y </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Integer</span><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">100</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">x </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> y</span><span style="color:#89DDFF;">);</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// false</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (4).两个Integer声明的变量比较时,如果两个变量的值在-128到127之间,则比较结果为true,超出该区间结果为false。为了提升初始化性能,Integer内部使用静态常量池</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 初始化了-128到127区间的数值,当Integer声明的变量数值相同时,本质上指向的是同一块内存地址</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> int1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">100</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> int2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">100</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">int1 </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> int2</span><span style="color:#89DDFF;">);</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// true,由于Integer数值范围处于-128到127之间,因此int1与int2复用静态常量池Integer对象,指向同一块内存地址</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> int3 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">128</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> int4 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">128</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">int3 </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> int4</span><span style="color:#89DDFF;">);</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// false</span></span></code></pre></div><h2 id="string-为什么被设计成不可变的" tabindex="-1">String 为什么被设计成不可变的? <a class="header-anchor" href="#string-为什么被设计成不可变的" aria-label="Permalink to &quot;String 为什么被设计成不可变的?&quot;">​</a></h2><p>String.class 使用 final 关键字修饰,final 修饰类时表示该类无法被继承,其主要原因如下:</p><ul><li><strong>可以缓存 hash 值</strong>。String 在 Java 中经常用作 Map 的 key,如果字符串是可变的,那么它的值被修改后,可能会导致 Map 中出现错误的 Key-Value 对。String 不可变的特性可以使得 hash 值也不可变,因此只需要进行一次计算。</li><li><strong>String Pool 的需要</strong>。如果一个 String 对象已经被创建过了,那么就会从 String Pool 中取得引用。只有 String 是不可变的,才可能使用 String Pool。不可变字符串可以被缓存,因为它们的值永远不会改变,所以可以在多个地方重复使用,提高性能。</li><li><strong>提升安全性</strong>。String 的不可变性还可以提高字符串的安全性,例如在网络传输中,不可变的字符串可以防止被篡改。</li><li><strong>线程安全</strong>。String 不可变性天生具备线程安全,因此可以在多个线程中安全地使用。</li></ul><h2 id="stringbuilder-与-stringbuffer-的区别" tabindex="-1">StringBuilder 与 StringBuffer 的区别? <a class="header-anchor" href="#stringbuilder-与-stringbuffer-的区别" aria-label="Permalink to &quot;StringBuilder 与 StringBuffer 的区别?&quot;">​</a></h2><p>由于 String 对象是不可变对象,因此对字符串进行修改操作时(例如字符串拼接、替换)总是会生成新的 String 对象,所以其性能相对较差。为此,JDK 专门提供了 StringBuffer 和 StringBuilder 分别用于创建和修改字符串。两者区别如下:</p><ul><li>可变性。从可变性方面来看,String 属于不可变,而 StringBuilder 和 StringBuffer 都属于可变的。</li><li>线程安全。从线程安全方面来看,由于 String 具有不可变性,因此是线程安全的;StringBuilder 内部没有使用锁机制来保证线程安全,因此是非线程安全的;而 StringBuffer 内部使用 synchronized(同步机制)进行同步访问,因此是线程安全的。在不需要保证线程安全的场景下,推荐使用 StringBuilder,因其内部没有加锁,所以性能相对更好。</li></ul><table><thead><tr><th>对比项</th><th>String</th><th>StringBuilder</th><th>StringBuffer</th></tr></thead><tbody><tr><td>可变性</td><td>不可变</td><td>可变</td><td>可变</td></tr><tr><td>线程安全</td><td>是</td><td>否</td><td>是,内部采用 synchronized 保证线程安全</td></tr><tr><td>是否加锁</td><td>否</td><td>否</td><td>是</td></tr></tbody></table><h2 id="string-拼接字符串的方式有哪些" tabindex="-1">String 拼接字符串的方式有哪些? <a class="header-anchor" href="#string-拼接字符串的方式有哪些" aria-label="Permalink to &quot;String 拼接字符串的方式有哪些?&quot;">​</a></h2><p>在 Java 中大致有六种方式拼接字符串:</p><ul><li>通过+拼接字符串。</li><li>通过 String.concat()拼接字符串。</li><li>使用 StringBuffer 或者 StringBuilder 拼接字符串。</li><li>使用 String.format()拼接字符串。String.format()是一个用于格式化字符串的方法,String.format()方法以一个格式化字符串作为参数,然后根据格式化字符串中的占位符和参数类型,将传入的参数进行格式化,并返回一个格式化后的字符串。String.format() 方法的格式串中的占位符都以百分号(%)开始,后面紧跟一个转换字符,用于指定参数类型和格式化选项。String.format() 方法的占位符有以下几种: <ul><li>%s 表示字符串类型。</li><li>%c 表示字符类型。</li><li>%b 表示布尔类型。</li><li>%d 表示整数类型(十进制)。</li><li>%o 表示整数类型(八进制)。</li><li>%x 表示整数类型(十六进制)。</li><li>%f 表示浮点数类型。</li><li>%e 表示科学计数法类型。</li><li>%t 表示日期时间类型。</li><li>%% 表示百分号(%)本身。</li><li>%n 表示换行符。</li></ul></li><li>使用 String.join()连接字符串。</li><li>使用 StringJoiner 连接字符串。StringJoiner 是 Java 8 中的一个新特性,它是一个用于将多个字符串连接起来的工具类。它可以将多个字符串按照指定的分隔符连接起来,同时可以在连接的字符串前后添加指定的前缀和后缀。StringJoiner 类提供了方便的 API 来完成这些任务,使字符串的处理变得更加方便和高效。</li></ul><h2 id="new-string-abc-创建了几个对象" tabindex="-1">new String(&quot;abc&quot;)创建了几个对象? <a class="header-anchor" href="#new-string-abc-创建了几个对象" aria-label="Permalink to &quot;new String(&quot;abc&quot;)创建了几个对象?&quot;">​</a></h2><h2 id="jdk8-和-jdk9-的-string-有什么区别" tabindex="-1">JDK8 和 JDK9 的 String 有什么区别? <a class="header-anchor" href="#jdk8-和-jdk9-的-string-有什么区别" aria-label="Permalink to &quot;JDK8 和 JDK9 的 String 有什么区别?&quot;">​</a></h2><ul><li>内部存储结构不同。在 JDK8 内部使用 char 数组存储数据,但在 JDK9 中内部使用 byte 数组存储数据。使用 char 数组存储数据每个字符占用 2 个字节的存储空间(UTF-16 编码);JDK9 使用 byte 数组存储数据,对于只包含 ASCII 字符的字符串,每个字符只需要一个字节的存储空间,相比于每个字符需要两个字节的存储空间,可以将内存使用减少一半。这种优化在处理大量字符串对象时尤为显著,特别是在应用程序需要存储大量文本数据时,可以降低内存占用并提升整体性能。</li><li>COMPACT_STRINGS:JDK 9 引入了一个名为 COMPACT_STRINGS(压缩字符串)的新特性。它允许 String 类在某些情况下以较低的内存开销存储字符串。具体来说,当字符串仅包含拉丁字母(Latin-1 字符集)时,String 类使用单字节存储每个字符,从而节省了内存。</li><li>其他改进:JDK 9 还对字符串类进行了其他一些改进,包括更好的 Unicode 支持、更高效的 substring 操作、更好的正则表达式性能等。</li></ul><h2 id="java-的权限修饰符有哪些" tabindex="-1">Java 的权限修饰符有哪些? <a class="header-anchor" href="#java-的权限修饰符有哪些" aria-label="Permalink to &quot;Java 的权限修饰符有哪些?&quot;">​</a></h2><p>Java 中的访问权限修饰符用于控制类、接口、成员变量和方法的访问权限。Java 提供了四种访问权限修饰符:</p><ul><li>public(公共的):使用 public 修饰时,表示在任何地方都可以访问,没有访问限制。public 修饰符通常用于修饰公有属性和方法,以供其他类调用。</li><li>default(默认的):当不使用权限修饰符时,表示在同一包内可以访问,其他包中的类无法访问。</li><li>protected(受保护的):使用 protected 修饰时,表示在同一包内和子类中可以访问,其他包中的类无法访问。protected 修饰符通常用于会被子类继承的方法和属性。</li><li>private(私有的):使用 private 修饰时,表示仅在同一类中可以访问,其他类无法访问。private 修饰符通常用于类内部私有方法和属性,以确保外部不可访问。</li></ul><p>四种权限修饰符的作用范围如下:</p><table><thead><tr><th>修饰符</th><th>同一个类</th><th>同一个包</th><th>不同包的子类</th><th>不同包的非子类</th></tr></thead><tbody><tr><td>public</td><td>√</td><td>√</td><td>√</td><td>√</td></tr><tr><td>protected</td><td>√</td><td>√</td><td>√</td><td></td></tr><tr><td>default</td><td>√</td><td>√</td><td></td><td></td></tr><tr><td>private</td><td>√</td><td></td><td></td><td></td></tr></tbody></table><h2 id="final、finalize、finally-的区别" tabindex="-1">final、finalize、finally 的区别? <a class="header-anchor" href="#final、finalize、finally-的区别" aria-label="Permalink to &quot;final、finalize、finally 的区别?&quot;">​</a></h2><ul><li>final:Java 的关键字之一, 用于声明不可变的变量,也可以用于修饰类、方法或变量。 <ul><li>final 修饰实例变量时,该变量必须在创建对象时进行初始化,并且一旦被赋值后就不能再修改;修饰静态变量时,该变量必须在声明时或静态初始化块中进行初始化,并且一旦被赋值后就不能再修改;修饰局部变量时,该变量必须在声明时进行初始化,并且一旦被赋值后就不能再修改。</li><li>final 修饰方法时,该方法无法被子类重写。</li><li>final 修饰类时,该类无法被继承。</li></ul></li><li>finalize():finalize() 是 Object 类中的一个方法,用于在对象被垃圾收集器回收之前执行一些清理操作,该方法在对象被垃圾收集时会被自动调用。由于 finalize()的执行取决垃圾收集器的调度,如果不触发垃圾回收(GC)finalize()将永远都不会执行。因此,不推荐使用 finalize()进行资源释放,更好的做法是使用 try-with-resources 或 finally 块来确保资源的正确释放。</li><li>finally:finally 是 Java 异常处理关键字,用于定义在 try 块或 try-catch 块执行之后总是执行的代码块,通常用于资源释放,例如关闭数据库连接、关闭 IO 流等操作。</li></ul><h2 id="什么是反射机制" tabindex="-1">什么是反射机制? <a class="header-anchor" href="#什么是反射机制" aria-label="Permalink to &quot;什么是反射机制?&quot;">​</a></h2><p>Java 反射机制是指在 Java 应用运行中,对于任意一个类,都可以获取该类的所有属性和方法; 对于任意一个对象,都可以调用它的任意一个方法和属性。这种在运行时动态获取的信息以及动态调用对象的方法的功能称为 Java 语言的反射机制。</p><h2 id="什么是类型擦除" tabindex="-1">什么是类型擦除? <a class="header-anchor" href="#什么是类型擦除" aria-label="Permalink to &quot;什么是类型擦除?&quot;">​</a></h2><h2 id="java-bio、nio、aio-是什么" tabindex="-1">Java BIO、NIO、AIO 是什么? <a class="header-anchor" href="#java-bio、nio、aio-是什么" aria-label="Permalink to &quot;Java BIO、NIO、AIO 是什么?&quot;">​</a></h2><h2 id="什么是-spi-机制" tabindex="-1">什么是 SPI 机制? <a class="header-anchor" href="#什么是-spi-机制" aria-label="Permalink to &quot;什么是 SPI 机制?&quot;">​</a></h2>`,36),o=[e];function r(i,p,c,d,y,D){return a(),n("div",null,o)}const A=t(l,[["render",r]]);export{C as __pageData,A as default};
