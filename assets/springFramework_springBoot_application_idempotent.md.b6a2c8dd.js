import{_ as e,o as a,c as t,O as o}from"./chunks/framework.1e38657f.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"springFramework/springBoot/application/idempotent.md","filePath":"springFramework/springBoot/application/idempotent.md","lastUpdated":1708792908000}'),i={name:"springFramework/springBoot/application/idempotent.md"},n=o('<p><strong>幂等性问题是指在进行操作时,多次执行操作所产生的结果相同,即多次执行操作不会产生额外的影响或改变</strong>。例如 GET 请求仅从服务器获取资源,而非对服务器上的资源进行修改,因此 GET 请求是幂等性的;POST、DEL 等请求每次请求会对服务器上的资源进行修改,属于非幂等性。如果一个操作不保证幂等性,那么多次执行该操作可能会导致意外的结果。对于一个不保证幂等性的网络请求,如果在网络传输过程中出现了重试、超时、网络中断等问题,那么服务器可能会收到多个相同的请求,从而导致数据的重复插入、多次扣款等问题,进而影响到系统的正常运行。例如用户快速点击下单,即使 UI 层面做了限制,仍无法避免重复下单,用户可以第三方工具模拟重复下单,如果接口无法保证幂等性,此时数据库可能会产生多条下单数据,进行多次扣款。解决幂等性的常用方案如下:</p><ul><li>Token 机制:在每个请求中添加一个 Token,用于标识该请求的唯一性。服务器在处理请求时,先检查该 Token 是否已经被使用过,如果已经被使用过,则表示该请求已经被处理过,可以直接返回处理结果。生成 Token 后可以将 Token 存储在 Redis 中,得益于 Redis 出色的性能和可用性,基于 Token 实现幂等性不仅性能好、支持高并发,而且适用于分布式环境。</li><li>乐观锁机制:在数据库中使用乐观锁机制,每次更新操作都需要带上版本号,在更新时校验版本号是否匹配,如果不匹配则拒绝更新操作。</li><li>select +insert 机制:写入或更新数据前,首先查询数据是否存在,若存在则直接返回,不存在这写入数据,以此来保证数据写入的正确性。这种方式常用于并发量不高或防止任务重复执行的场景。</li><li>悲观锁机制:悲观锁机制是一种并发控制的方法，它假定在并发情况下会发生冲突，因此在访问共享资源之前会先锁定资源，直到当前操作完成后才会释放锁，其他线程必须等待锁的释放才能继续访问资源。首先为操作资源添加唯一标识(唯一 ID 或者业务标识),在处理接口请求时,使用悲观锁机制锁定资源,确保在当前操作完成之前其他线程无法访问相同的资源。在资源被锁定的情况下,检查是否已经执行过相同标识符的操作,如果有相同的标识符则说明出现了幂等性问题,则直接返回,否则正常执行业务逻辑,最终释放悲观锁。注意:悲观锁可能会导致性能瓶颈(悲观锁会锁定共享资源,导致其他线程阻塞等待,而且悲观锁的锁粒度很大,悲观锁通常需要锁定整个资源或数据库行,即使修改小部分数据仍会锁定数据行,导致其他并发操作无法同时进行,降低了并发性),特别是在高并发的情况下。</li><li>去重表:每次插入或更新数据时,先查询去重表是否已经存在记录,然后再操作业务。</li><li>数据库唯一索引。为业务表相关字段建立唯一索引,避免业务多次写入,但无法保证业务多次修改。</li><li>状态机:通过使用状态机的方式,可以根据操作的状态和状态转换规则来保证幂等性。状态机可以明确地定义操作的各个阶段和可能的结果,使得操作的重复执行不会对系统状态造成影响。</li></ul><h2 id="_1-token-机制实现幂等性" tabindex="-1">1.Token 机制实现幂等性 <a class="header-anchor" href="#_1-token-机制实现幂等性" aria-label="Permalink to &quot;1.Token 机制实现幂等性&quot;">​</a></h2><h2 id="_2-基于乐观锁实现幂等性" tabindex="-1">2.基于乐观锁实现幂等性 <a class="header-anchor" href="#_2-基于乐观锁实现幂等性" aria-label="Permalink to &quot;2.基于乐观锁实现幂等性&quot;">​</a></h2><h2 id="_3-基于悲观锁实现幂等性" tabindex="-1">3.基于悲观锁实现幂等性 <a class="header-anchor" href="#_3-基于悲观锁实现幂等性" aria-label="Permalink to &quot;3.基于悲观锁实现幂等性&quot;">​</a></h2><h2 id="_4-基于状态机实现幂等性" tabindex="-1">4.基于状态机实现幂等性 <a class="header-anchor" href="#_4-基于状态机实现幂等性" aria-label="Permalink to &quot;4.基于状态机实现幂等性&quot;">​</a></h2>',6),r=[n];function l(s,_,d,c,p,h){return a(),t("div",null,r)}const T=e(i,[["render",l]]);export{k as __pageData,T as default};
