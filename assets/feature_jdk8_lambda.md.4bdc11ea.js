import{_ as s,o as a,c as n,O as l}from"./chunks/framework.1e38657f.js";const i=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"feature/jdk8/lambda.md","filePath":"feature/jdk8/lambda.md","lastUpdated":1708792908000}'),o={name:"feature/jdk8/lambda.md"},p=l(`<h2 id="_1-lambda" tabindex="-1">1.Lambda <a class="header-anchor" href="#_1-lambda" aria-label="Permalink to &quot;1.Lambda&quot;">​</a></h2><h3 id="_1-1-lambda-表达式介绍" tabindex="-1">1.1 Lambda 表达式介绍 <a class="header-anchor" href="#_1-1-lambda-表达式介绍" aria-label="Permalink to &quot;1.1 Lambda 表达式介绍&quot;">​</a></h3><p>Java Lambda 表达式是 Java 8 引入的一种函数式编程特性。它允许我们将函数作为一种方法参数传递,并以简洁的方式编写匿名函数。Lambda 表达式可以用来替代繁琐的匿名内部类,可以使代码更加简洁、易读和易于维护。Lambda 表达式的本质是函数式接口的实例,函数式接口是指在一个接口中只包含一个抽象方法的接口,例如 Runnbale、Consumer 等接口。函数式接口使用@FunctionalInterface 注解标识是否是函数式接口,如果一个函数式接口拥有超过一个的抽象方法,使用@FunctionalInterface 注解则会在提示错误。以 Runnable 接口的源码为例:</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">FunctionalInterface</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Runnable</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    /**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * When an object implementing interface &lt;code&gt;Runnable&lt;/code&gt; is used</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * to create a thread, starting the thread causes the object&#39;s</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * &lt;code&gt;run&lt;/code&gt; method to be called in that separately executing</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * thread.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * &lt;p&gt;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * The general contract of the method &lt;code&gt;run&lt;/code&gt; is that it may</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * take any action whatsoever.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     *</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * </span><span style="color:#F78C6C;font-style:italic;">@see</span><span style="color:#676E95;font-style:italic;">     java.lang.Thread#run()</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">abstract</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">run</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h3 id="_1-2-lambda-表达式的构成" tabindex="-1">1.2 Lambda 表达式的构成 <a class="header-anchor" href="#_1-2-lambda-表达式的构成" aria-label="Permalink to &quot;1.2 Lambda 表达式的构成&quot;">​</a></h3><p>lambda 表达式由抽象方法的形参列表、箭头符、方法主体 3 个部分组成,使用 lambda 表示式实际上是对函数式接口抽象方法的重写,其格式如下:</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// args表示形参列表(即方法参数列表),-&gt;表示箭头</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">args</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">-&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 方法体</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span></span></code></pre></div><p>Lambda 虽然可以简化代码,但它提供了更加简洁的写法:</p><ul><li>当方法体中只有一条语句时(非 return 语句)可省略一对{}号。</li></ul><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Test</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">[]</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">args</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// 普通写法</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Runnable</span><span style="color:#A6ACCD;"> r1</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Runnable</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Override</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">run</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">                System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">我叫zxp</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#A6ACCD;">        r1</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">run</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// lambda表达式写法:当方法体中只有一条语句时(非 return 语句,可省略方法体的{}</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Runnable</span><span style="color:#A6ACCD;"> r2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">-&gt;</span><span style="color:#A6ACCD;"> System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">我叫zxp</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">        r2</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">run</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><ul><li>当方法体中只有语句且是 return 语句时可省略 return 关键字和一对{}号。</li></ul><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Test</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">[]</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">args</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">       </span><span style="color:#676E95;font-style:italic;">// 普通写法</span></span>
<span class="line"><span style="color:#A6ACCD;">       </span><span style="color:#C792EA;">Predicate</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> p</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">Predicate</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">&gt;()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// test 方法用于条件判断</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Override</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">boolean</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">test</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">s</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> s</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">length</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">5</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#A6ACCD;">    System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">p</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">test</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">zxpHello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">));</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">         * lambda表达式写法:当方法体中只有语句且是 return 语句时可省略 return 关键字</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">         * 和一对{}号,可省略方法体的return语句和{}</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">         */</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Predicate</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> p </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> s </span><span style="color:#C792EA;">-&gt;</span><span style="color:#A6ACCD;"> s</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">length</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">5</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">        System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">p</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">test</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">zxpHello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">));</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// true</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><ul><li><p>当形参参数只有一个时可省略()号。</p></li><li><p>当有多个形参参数且方法体有多条语句时,不能省略()和{}。</p></li></ul><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Test</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">static</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">[]</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">args</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// 普通写法</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">BinaryOperator</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> b1</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">BinaryOperator</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">&gt;()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#676E95;font-style:italic;">// 字符串拼接</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Override</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">apply</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">s</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">s2</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">                </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> s </span><span style="color:#89DDFF;">+</span><span style="color:#A6ACCD;"> s2</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#A6ACCD;">        System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">b1</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">hello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;"> world!</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">));</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// hello world!</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// 使用lambda表达式:当有多个形参参数且方法体有多条语句时,不能省略()和{}</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">BinaryOperator</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> b2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">s</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;">s2</span><span style="color:#89DDFF;">)</span><span style="color:#C792EA;">-&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">那是真的强</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> s </span><span style="color:#89DDFF;">+</span><span style="color:#A6ACCD;"> s2</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#A6ACCD;">        System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">println</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">b2</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">hello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;"> world!</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">));</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// hello world!</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="_2-方法引用与构造器引用" tabindex="-1">2.方法引用与构造器引用 <a class="header-anchor" href="#_2-方法引用与构造器引用" aria-label="Permalink to &quot;2.方法引用与构造器引用&quot;">​</a></h2><p>JDK 中的方法引用和构造器引用是 Lambda 表达式的一种扩展,用于更简洁地表示已经存在的方法或构造器。</p><h3 id="_2-1-方法引用-method-reference" tabindex="-1">2.1 方法引用(Method Reference) <a class="header-anchor" href="#_2-1-方法引用-method-reference" aria-label="Permalink to &quot;2.1 方法引用(Method Reference)&quot;">​</a></h3><p>方法引用允许直接引用已经存在的方法,可以看作是 Lambda 表达式的一种简化形式。通过方法引用,可以将一个方法作为值传递，而不需要显式地编写 Lambda 表达式。方法引用的语法如下:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">类名::方法名</span></span>
<span class="line"><span style="color:#A6ACCD;">对象::方法名</span></span>
<span class="line"><span style="color:#A6ACCD;">类名::静态方法名</span></span></code></pre></div><h3 id="_2-2-构造器引用-constructor-reference" tabindex="-1">2.2 构造器引用(Constructor Reference) <a class="header-anchor" href="#_2-2-构造器引用-constructor-reference" aria-label="Permalink to &quot;2.2 构造器引用(Constructor Reference)&quot;">​</a></h3><h2 id="_3-函数式接口" tabindex="-1">3.函数式接口 <a class="header-anchor" href="#_3-函数式接口" aria-label="Permalink to &quot;3.函数式接口&quot;">​</a></h2><p>函数式接口是指在一个接口中只包含一个抽象方法的接口,Java 提供了@FunctionalInterface 注解用于标识接口是否是函数式接口。函数式接口支持定义默认方法、静态方法及 Object 类 public 修饰的方法。JDK8 新增的函数式接口位于 java.util.function 包下,常用的函数式接口:</p><ul><li><p><code>Runnable</code>:<code>Runnable</code> 内部提供了<code>void run()</code>方法,表示无任何输入且无任何输出的操作。</p></li><li><p><code>Callable&lt;V&gt;</code>:<code>Callable&lt;V&gt;</code>提供了<code>V call() throws Exception</code>方法,表示一个不接受输入参数并且具有返回结果的操作。与<code>Supplier&lt;T&gt;</code>接口类似。</p></li><li><p><code>Consumer&lt;T&gt;</code>: <code>Consumer&lt;T&gt;</code>提供了<code>void accept(T t)</code>方法,表示一个消费形的操作,它接受一个输入参数并且不返回结果的操作。</p></li><li><p><code>Supplier&lt;T&gt;</code>:<code>Supplier&lt;T&gt;</code>提供了<code>T get()</code>方法,表示一个供给型的操作,它不接受输入参数,但返回一个结果。</p></li><li><p><code>Function&lt;T, R&gt;</code>:<code>Function&lt;T, R&gt;</code>提供了<code>Function&lt;T, R&gt;</code>方法,表示一个接受一个输入参数并产生一个结果的操作。</p></li><li><p><code>Predicate&lt;T&gt;</code>:<code>Predicate&lt;T&gt;</code>提供了<code>boolean test(T t)</code>方法,表示一个断言型的操作,它接受一个输入参数并返回一个布尔值结果。</p></li><li><p><code>BiConsumer&lt;T, U&gt;</code>:<code>BiConsumer&lt;T, U&gt;</code>提供了<code>void accept(T t, U u)</code>方法,接受两个输入参数并且不返回结果的操作。</p></li><li><p><code>BiPredicate&lt;T, U&gt;</code>:<code>BiPredicate&lt;T, U&gt;</code>提供了<code>boolean test(T t, U u)</code>方法,它接受两个输入参数并返回布尔值结果的操作。</p></li><li><p><code>BiFunction&lt;T, U, R&gt;</code>:<code>BiFunction&lt;T, U, R&gt;</code>提供了<code>R apply(T t, U u)</code>,它接受两个输入参数并返回结果的操作。</p></li><li><p><code>BinaryOperator&lt;T&gt;</code>:<code>BinaryOperator&lt;T&gt;</code>提供了继承自<code>BiFunction&lt;T, U, R&gt;</code>的<code>T apply(T t1, T t2)</code>方法,它接受两个输入参数并返回与参数类型相同的结果的操作。</p></li><li><p><code>UnaryOperator&lt;T&gt;</code>:<code>UnaryOperator&lt;T&gt;</code>提供了继承自<code>Function&lt;T, R&gt;</code>接口的<code>T apply(T t)</code>方法,表示一个接受一个输入参数并产生一个相同类型结果的操作。</p></li></ul>`,23),e=[p];function t(c,r,y,D,F,A){return a(),n("div",null,e)}const d=s(o,[["render",t]]);export{i as __pageData,d as default};
