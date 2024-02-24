import{_ as s,o as a,c as l,O as n}from"./chunks/framework.1e38657f.js";const h=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"db/mysql/transation.md","filePath":"db/mysql/transation.md","lastUpdated":1708792908000}'),e={name:"db/mysql/transation.md"},o=n(`<h2 id="_1-事务基础" tabindex="-1">1.事务基础 <a class="header-anchor" href="#_1-事务基础" aria-label="Permalink to &quot;1.事务基础&quot;">​</a></h2><p>数据库事务是指作为单个逻辑工作单元执行的一系列操作,要么所有操作全部执行,要么所有操作都不执行。通过事务特性可以确保事务内的单元操作全部执行成功或全部执行失败,以简化错误恢复并提升应用可靠性。</p><h3 id="_1-1-事务四大特性" tabindex="-1">1.1 事务四大特性 <a class="header-anchor" href="#_1-1-事务四大特性" aria-label="Permalink to &quot;1.1 事务四大特性&quot;">​</a></h3><p>事务分为四个特性,简称 ACID:</p><ul><li><strong>原子性(Atomicity)</strong>:原子性指事务是一个不可分割的工作单位,要么全部执行,要么全部不执行。如果事务中的任何一步操作失败,整个事务都会被回滚到事务开始前的状态,保证数据库的一致性。</li><li><strong>一致性(Consistency)</strong>:一致性指事务将数据库从一种一致性状态转移到另一种一致性状态。在事务开始前和事务结束后,数据库的完整性约束没有被破坏。</li><li><strong>隔离性(Isolation)</strong>:隔离性指一个事务的执行不能被其他事务干扰。即每个事务在操作数据时,就像系统中不存在其他事务一样。隔离性可以防止多个事务并发执行时由于交叉执行而导致数据不一致。</li><li><strong>持久性(Durability)</strong>:持久性指事务一旦提交,其结果就是永久性的,即使系统故障也不应该丢失提交事务的结果。通常通过将事务的操作结果持久化到磁盘上的数据库中来实现。</li></ul><h3 id="_1-2-事务的状态" tabindex="-1">1.2 事务的状态 <a class="header-anchor" href="#_1-2-事务的状态" aria-label="Permalink to &quot;1.2 事务的状态&quot;">​</a></h3><p>事务在其生命周期中会经历不同的状态。这些状态通常包括以下几个:</p><ul><li><strong>活动状态（Active）</strong>:事务的活动状态是指事务已经开始并正在执行的状态。在这个阶段，事务可能会执行一系列的数据库操作。</li><li><strong>部分提交状态（Partially Committed）</strong>:在事务执行完所有的操作后，但在事务正式提交之前，事务处于部分提交状态。在这个状态下，系统已经保证了事务的原子性，但还未确认事务的完成。</li><li><strong>提交状态（Committed）</strong>:事务在提交状态表示事务已经成功执行并且已经将其结果永久保存到数据库中。在这个状态下，事务被认为是完成的，并且对数据库的更改变得永久。</li><li><strong>失败状态（Failed）</strong>:如果在事务执行过程中发生了错误，事务可能会进入失败状态。在这个状态下，事务已经被中止，它的效果被撤销，数据库回滚到事务开始前的状态。</li><li><strong>中止状态（Aborted/Rolled Back）</strong>:中止状态表示事务已经被撤销或回滚。这可能是因为事务自身发生错误，或者因为系统故障等原因导致事务无法完成。</li><li><strong>挂起状态（Suspended）</strong>:在某些情况下，事务可能会被挂起，即暂时中断执行。这可以是由于系统资源不足、等待锁的释放等原因。</li><li><strong>完成状态（Terminated）</strong>:事务在完成状态表示事务的整个生命周期已经结束。这可能是因为事务已经成功提交，或者因为事务中止或回滚。</li></ul><p>这些状态描述了事务在执行过程中的不同阶段和结果。数据库管理系统通过维护事务的状态来确保事务的 ACID 特性，保障数据的一致性和可靠性。</p><h2 id="_2-事务分类" tabindex="-1">2.事务分类 <a class="header-anchor" href="#_2-事务分类" aria-label="Permalink to &quot;2.事务分类&quot;">​</a></h2><p>在 MySQL 中,事务可以分为显性事务和隐性事务两种,显性事务下需要手动开启、回滚或提交事务,隐性事务下每一个 SQL 都被视为一个事务,并且会自动提交。默认情况下 MySQL 启用自动提交,这意味着每个 SQL 语句都会自动成为一个事务,并且会立即提交,即每个 SQL 语句都会触发一个隐性事务。</p><h3 id="_2-1-显性事务" tabindex="-1">2.1 显性事务 <a class="header-anchor" href="#_2-1-显性事务" aria-label="Permalink to &quot;2.1 显性事务&quot;">​</a></h3><p>显性事务是通过使用 SQL 的 BEGIN、COMMIT 和 ROLLBACK 语句显式地开始、提交和回滚的事务。在显性事务中,必须明确指定事务的开始和结束点，以及何时提交或回滚事务。</p><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">-- 开始事务</span></span>
<span class="line"><span style="color:#F78C6C;">BEGIN</span><span style="color:#A6ACCD;">;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">-- 执行一系列 SQL 操作</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">-- 提交事务</span></span>
<span class="line"><span style="color:#F78C6C;">COMMIT</span><span style="color:#A6ACCD;">;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">-- 或者回滚事务</span></span>
<span class="line"><span style="color:#F78C6C;">ROLLBACK</span><span style="color:#A6ACCD;">;</span></span></code></pre></div><p>除了使用 BEGIN 开启一个显性事务外,MySQL 也支持通过<code>START TRANSACTION</code>开启事务,相较于 BEGIN<code>START TRANSACTION</code>支持修饰符,例如:</p><ul><li><code>READ ONLY</code>:标识当前事务是一个只读事务,即该事务只能进行数据库读操作,无法进行写操作。</li><li><code>READ WRITE</code>:标识当前事务是一个读写事务,读写事务既支持数据库读操作,又支持数据库写操作。</li><li><code>WITH CONSISTENT SNAPSHOT</code>:一种用于获取可重复读隔离级别下一致性快照的选项。它确保在整个事务执行期间读取的数据都是一致的,即使其他并发事务在进行修改。</li></ul><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">-- 开启一个只读事务</span></span>
<span class="line"><span style="color:#F78C6C;">START TRANSACTION</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">READ</span><span style="color:#A6ACCD;"> ONLY;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">-- 开启只读事务和一致性读</span></span>
<span class="line"><span style="color:#F78C6C;">START TRANSACTION</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">READ</span><span style="color:#A6ACCD;"> ONLY,</span><span style="color:#F78C6C;">WITH</span><span style="color:#A6ACCD;"> CONSISTENT </span><span style="color:#F78C6C;">SNAPSHOT</span><span style="color:#A6ACCD;">;</span></span></code></pre></div><p>通过 COMMIT 提交事务后,对数据的修改是永久性的,在一些复杂事务执行过程中,可能需要回滚多次或回滚到某一步骤,MySQL 允许通过 SAVEPOINT(保存点)记录多个需要回滚的步骤点,以便于根据 SAVEPOINT 回滚到执行步骤。</p><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">-- 创建保存点</span></span>
<span class="line"><span style="color:#A6ACCD;">SAVEPOINT 保存点名称;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">-- 删除保存点</span></span>
<span class="line"><span style="color:#A6ACCD;">RELEASE SAVEPOINT 保存点名称;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">-- 回滚到指定保存点</span></span>
<span class="line"><span style="color:#A6ACCD;">RALLBACK </span><span style="color:#F78C6C;">TO</span><span style="color:#A6ACCD;"> 保存点名称;</span></span></code></pre></div><h3 id="_2-2-隐性事务" tabindex="-1">2.2 隐性事务 <a class="header-anchor" href="#_2-2-隐性事务" aria-label="Permalink to &quot;2.2 隐性事务&quot;">​</a></h3><p>隐性事务(Implicit Transaction)是在没有显式指定事务的开始和结束点的情况下,MySQL 自动管理事务的一种方式。在隐性事务中,每个 SQL 语句都被视为一个事务,并且会自动提交。这意味着每个 SQL 语句都在其自己的事务中执行,无需显式地调用 BEGIN、COMMIT 或 ROLLBACK。隐性事务通常在设置了自动提交模式(autocommit)时发生。默认情况下,MySQL 是启用自动提交的,可以通过设置 autocommit 的值来控制是否启用隐性事务,<code>SET autocommit = 0</code>表示禁用自动提交,<code>SET autocommit = 1</code>表示启用自动提交。MySQL 默认是启用自动提交的,这意味着每个 SQL 语句都会自动成为一个事务，并且会立即提交。因此，每个 SQL 语句都会触发一个隐性事务,隐性事务的触发时机包括以下几种情况:</p><ul><li>SQL 语句执行:每个 SQL 语句的执行都被视为一个事务，并且会自动提交。</li><li>DDL 语句执行:数据定义语言（DDL）语句（例如 CREATE TABLE、ALTER TABLE）执行时也会触发隐性事务。这些语句通常会隐式地提交之前的事务。</li><li>事务控制:执行一个事务但未提交或回滚,此时使用<code>START TRANSACTION</code>或<code>BEGIN</code>开启另一个事务时,会隐式的提交上一个事务。例如:</li></ul><div class="language-sql"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">BEGIN</span><span style="color:#A6ACCD;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F78C6C;">SELECT</span><span style="color:#A6ACCD;"> ....</span></span>
<span class="line"><span style="color:#F78C6C;">UPDATE</span><span style="color:#A6ACCD;"> ....</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">-- 省略其他sql</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F78C6C;">BEGIN</span><span style="color:#A6ACCD;">; </span><span style="color:#676E95;font-style:italic;">-- 由于上一个事务未提交或回滚,使用BEGIN开启新事务时,会隐式的提交上一个事务</span></span></code></pre></div><ul><li>锁定语句的执行:使用<code>LOCK TABLES</code>、<code>UNLOCK TABLES</code>等锁定语句也会隐式地提交之前的事务。</li><li>加载语句:使用<code>LOAD DATA</code>批量导入数据时,也会触发隐式地提交之前的事务。</li><li>MySQL 复制语句:当使用<code>START SLAVE</code>、<code>STOP SLAVE</code>、<code>RESET SLAVE</code>、<code>CHANGE MASTER TO</code>等会触发隐式地提交之前的事务。</li></ul><h2 id="_3-事务的隔离级别" tabindex="-1">3.事务的隔离级别 <a class="header-anchor" href="#_3-事务的隔离级别" aria-label="Permalink to &quot;3.事务的隔离级别&quot;">​</a></h2><p>由于数据库是共享资源,在并发环境下执行多个事务可能会出现数据不一致性问题,例如出现脏读、幻读等情况,事务隔离级别可以确保并发执行事务时保证数据一致性,它提供了一种灵活的方式来平衡数据一致性和并发性能。较高的隔离级别通常会引入更多的锁定和资源竞争，可能导致性能下降，而较低的隔离级别可能会牺牲一致性以提高并发性能,因此,在实际开发中需要根据具体业务场景选择合适的事务隔离级别。</p><h3 id="_3-1-数据并发问题" tabindex="-1">3.1 数据并发问题 <a class="header-anchor" href="#_3-1-数据并发问题" aria-label="Permalink to &quot;3.1 数据并发问题&quot;">​</a></h3><ul><li><p>脏读(Dirty Read):脏读是指一个事务读取到了另一个事务未提交的数据。通过使用适当的事务隔离级别，可以避免脏读，确保一个事务只能读取到已经提交的数据。</p></li><li><p>不可重复读（Non-repeatable Read）:不可重复读是指在同一个事务内，多次读取同一行的数据时，得到的结果不一致。通过使用较高的事务隔离级别，如 REPEATABLE READ，可以避免不可重复读。</p></li><li><p>幻读（Phantom Read）:幻读是指在同一个事务内，多次查询时，得到的结果集不一致，可能包含了其他事务插入的新数据。使用较高的隔离级别，如 SERIALIZABLE，可以避免幻读。</p></li></ul><h3 id="_3-2-sql-四种事务隔离级别" tabindex="-1">3.2 SQL 四种事务隔离级别 <a class="header-anchor" href="#_3-2-sql-四种事务隔离级别" aria-label="Permalink to &quot;3.2 SQL 四种事务隔离级别&quot;">​</a></h3><h3 id="_3-3-mysql-四种事务隔离级别" tabindex="-1">3.3 MySQL 四种事务隔离级别 <a class="header-anchor" href="#_3-3-mysql-四种事务隔离级别" aria-label="Permalink to &quot;3.3 MySQL 四种事务隔离级别&quot;">​</a></h3>`,30),t=[o];function p(i,c,r,d,C,A){return a(),l("div",null,t)}const S=s(e,[["render",p]]);export{h as __pageData,S as default};
