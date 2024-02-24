import{_ as a,o as s,c as l,O as n}from"./chunks/framework.1e38657f.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"base/exceptional.md","filePath":"base/exceptional.md","lastUpdated":1708793976000}'),o={name:"base/exceptional.md"},e=n(`<p>Java 异常机制是一种用于处理程序运行过程中出现的错误或异常情况的机制。它提供了一种结构化的方式来处理和传递异常,使得程序能够优雅地处理异常并维护代码的可靠性。</p><h2 id="异常架构图" tabindex="-1">异常架构图 <a class="header-anchor" href="#异常架构图" aria-label="Permalink to &quot;异常架构图&quot;">​</a></h2><h3 id="throwable" tabindex="-1">Throwable <a class="header-anchor" href="#throwable" aria-label="Permalink to &quot;Throwable&quot;">​</a></h3><p>Throwable 是 Java 语言中所有错误与异常的超类。Throwable 包含 Error(错误)和 Exception(异常)两个子类,它们通常用于指示发生了异常情况。Throwable 包含了其线程创建时线程执行堆栈的快照,它提供了 printStackTrace() 等接口用于获取堆栈跟踪数据等信息。</p><h3 id="error" tabindex="-1">Error <a class="header-anchor" href="#error" aria-label="Permalink to &quot;Error&quot;">​</a></h3><p>在 Java 中,Error 类是 Throwable 类的子类,用于表示严重错误,通常是由于系统或其他 JVM 问题引起的。与 Exception 不同,Error 通常是无法恢复的,因此在处理 Error 时,通常是将其抛出并让程序终止。常见的 Error 类型包括:</p><ul><li>OutOfMemoryError:内存不足错误,通常是由于程序耗尽了可用内存引起的。</li><li>StackOverflowError:栈溢出错误,通常是由于递归调用过程中出现无限循环引起的。</li><li>NoClassDefFoundError:类定义未找到错误,通常是由于类路径问题引起的。</li><li>LinkageError:链接错误,通常是由于编译和链接问题引起的。</li><li>AssertionError:断言错误,通常是由于使用断言机制检查程序错误性时出现的错误。</li></ul><h3 id="exception" tabindex="-1">Exception <a class="header-anchor" href="#exception" aria-label="Permalink to &quot;Exception&quot;">​</a></h3><p>在 Java 中,Exception 类是 Throwable 类的子类,用于表示程序运行时出现的异常情况。Exception 类通常是可以被捕获并处理的,因此程序通常会尝试在遇到异常时进行恢复,而不是直接终止。Exception 可以分为两大类型:</p><ul><li><p>编译时异常(Checked Exception):这类异常通常发生在编译时,需要在代码中进行处理。例如,IOException、SQLException 等。这些异常通常是由外部因素引起的,比如磁盘读写错误或数据库连接失败等,需要程序进行适当的恢复或提示用户解决问题。</p></li><li><p>运行时异常(Runtime Exception):这类异常通常是由程序逻辑错误引起的,比如空指针引用、除以零等。与编译时异常不同,运行时异常不需要在代码中进行处理,通常是由程序员错误引起的,需要通过代码调试和修复来解决。</p></li></ul><h2 id="异常基础" tabindex="-1">异常基础 <a class="header-anchor" href="#异常基础" aria-label="Permalink to &quot;异常基础&quot;">​</a></h2><h3 id="异常类型" tabindex="-1">异常类型 <a class="header-anchor" href="#异常类型" aria-label="Permalink to &quot;异常类型&quot;">​</a></h3><h3 id="异常关键字" tabindex="-1">异常关键字 <a class="header-anchor" href="#异常关键字" aria-label="Permalink to &quot;异常关键字&quot;">​</a></h3><ul><li>try 用于监听。将要被监听的代码(可能抛出异常的代码)放在 try 语句块之内,当 try 语句块内发生异常时,异常就被抛出。</li><li>catch 用于捕获异常。catch 用来捕获 try 语句块中发生的异常。</li><li>finally 语句块总是会被执行。它主要用于回收在 try 块里打开的物力资源(如数据库连接、网络连接和磁盘文件)。只有 finally 块,执行完成之后,才会回来执行 try 或者 catch 块中的 return 或者 throw 语句.如果 finally 中使用了 return 或者 throw 等终止方法的语句,则就不会跳回执行,直接停止。</li><li>throw:throw 关键字用于抛出异常。</li><li>throws:throws 关键字只能用在方法签名中,用于声明该方法可能抛出的异常。</li></ul><h3 id="使用-throws-声明异常" tabindex="-1">使用 throws 声明异常 <a class="header-anchor" href="#使用-throws-声明异常" aria-label="Permalink to &quot;使用 throws 声明异常&quot;">​</a></h3><h3 id="使用-throw-抛出异常" tabindex="-1">使用 throw 抛出异常 <a class="header-anchor" href="#使用-throw-抛出异常" aria-label="Permalink to &quot;使用 throw 抛出异常&quot;">​</a></h3><h3 id="自定义异常" tabindex="-1">自定义异常 <a class="header-anchor" href="#自定义异常" aria-label="Permalink to &quot;自定义异常&quot;">​</a></h3><h3 id="异常的捕获" tabindex="-1">异常的捕获 <a class="header-anchor" href="#异常的捕获" aria-label="Permalink to &quot;异常的捕获&quot;">​</a></h3><p>异常捕获处理的方法通常有:</p><ul><li>try-catch。</li><li>try-catch-finally。</li><li>try-finally。</li><li>try-with-resource。</li></ul><h4 id="try-catch" tabindex="-1">try-catch <a class="header-anchor" href="#try-catch" aria-label="Permalink to &quot;try-catch&quot;">​</a></h4><p>在一个 try-catch 语句块中可以捕获多个异常类型,并对不同类型的异常做出不同的处理。</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">readFile</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> filePath</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;font-style:italic;">try</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// code</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">catch</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">FileNotFoundException</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// handle FileNotFoundException</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">catch</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">IOException</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// handle IOException</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><details class="details custom-block"><summary>catch 捕获多个异常</summary><p>catch 捕获多个异常时,可以使用|分割多个异常。</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">readFile</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> filePath</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;font-style:italic;">try</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// code</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">catch</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">FileNotFoundException</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">UnknownHostException</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// handle FileNotFoundException or UnknownHostException</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">catch</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">IOException</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// handle IOException</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div></details><h4 id="try-with-resource" tabindex="-1">try-with-resource <a class="header-anchor" href="#try-with-resource" aria-label="Permalink to &quot;try-with-resource&quot;">​</a></h4><h2 id="异常实践" tabindex="-1">异常实践 <a class="header-anchor" href="#异常实践" aria-label="Permalink to &quot;异常实践&quot;">​</a></h2><h3 id="只针对不正常的情况才使用异常" tabindex="-1">只针对不正常的情况才使用异常 <a class="header-anchor" href="#只针对不正常的情况才使用异常" aria-label="Permalink to &quot;只针对不正常的情况才使用异常&quot;">​</a></h3><h3 id="在-finally-块中清理资源或者使用-try-with-resource-语句" tabindex="-1">在 finally 块中清理资源或者使用 try-with-resource 语句 <a class="header-anchor" href="#在-finally-块中清理资源或者使用-try-with-resource-语句" aria-label="Permalink to &quot;在 finally 块中清理资源或者使用 try-with-resource 语句&quot;">​</a></h3><h3 id="尽量使用标准的异常" tabindex="-1">尽量使用标准的异常 <a class="header-anchor" href="#尽量使用标准的异常" aria-label="Permalink to &quot;尽量使用标准的异常&quot;">​</a></h3><h3 id="对异常进行文档说明" tabindex="-1">对异常进行文档说明 <a class="header-anchor" href="#对异常进行文档说明" aria-label="Permalink to &quot;对异常进行文档说明&quot;">​</a></h3><h3 id="优先捕获最具体的异常" tabindex="-1">优先捕获最具体的异常 <a class="header-anchor" href="#优先捕获最具体的异常" aria-label="Permalink to &quot;优先捕获最具体的异常&quot;">​</a></h3><h3 id="不要捕获-throwable-类" tabindex="-1">不要捕获 Throwable 类 <a class="header-anchor" href="#不要捕获-throwable-类" aria-label="Permalink to &quot;不要捕获 Throwable 类&quot;">​</a></h3><h3 id="不要忽略异常" tabindex="-1">不要忽略异常 <a class="header-anchor" href="#不要忽略异常" aria-label="Permalink to &quot;不要忽略异常&quot;">​</a></h3><h3 id="不要记录并抛出异常" tabindex="-1">不要记录并抛出异常 <a class="header-anchor" href="#不要记录并抛出异常" aria-label="Permalink to &quot;不要记录并抛出异常&quot;">​</a></h3><h3 id="包装异常时不要抛弃原始的异常" tabindex="-1">包装异常时不要抛弃原始的异常 <a class="header-anchor" href="#包装异常时不要抛弃原始的异常" aria-label="Permalink to &quot;包装异常时不要抛弃原始的异常&quot;">​</a></h3><h3 id="不要使用异常控制程序的流程" tabindex="-1">不要使用异常控制程序的流程 <a class="header-anchor" href="#不要使用异常控制程序的流程" aria-label="Permalink to &quot;不要使用异常控制程序的流程&quot;">​</a></h3><h3 id="不要在-finally-块中使用-return" tabindex="-1">不要在 finally 块中使用 return <a class="header-anchor" href="#不要在-finally-块中使用-return" aria-label="Permalink to &quot;不要在 finally 块中使用 return&quot;">​</a></h3><p>try 块中的 return 语句执行成功后,并不会马上返回,而是继续执行 finally 块中的语句,如果此处存在 return 语句,则在此直接返回,会无情丢弃掉 try 块中的返回点。</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> x </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">checkReturn</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;font-style:italic;">try</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// x等于1,此处不返回</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">++</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">finally</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// 返回的结果是2</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">++</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div>`,39),t=[e];function r(p,c,i,y,h,D){return s(),l("div",null,t)}const F=a(o,[["render",r]]);export{A as __pageData,F as default};