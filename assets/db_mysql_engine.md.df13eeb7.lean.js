import{_ as l,o as n,c as t,z as e}from"./chunks/framework.1e38657f.js";const S=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"db/mysql/engine.md","filePath":"db/mysql/engine.md","lastUpdated":1708792908000}'),s={name:"db/mysql/engine.md"},a=e("p",null,"Mysql 常用存储引擎如下:",-1),o=e("ul",null,[e("li",null,"InnoDB:InnoDB 是 MySQL 的默认存储引擎，支持事务、行级锁定、外键等特性。它被广泛用于事务处理和大型数据库应用,因为它提供了高度的数据完整性和并发性。"),e("li",null,"MyISAM:MyISAM 是 MySQL 的另一种常见存储引擎，它不支持事务，但在读密集的应用中表现得很好。MyISAM 对于一些只读或者读写比较少的应用场景可能是一个合适的选择。"),e("li",null,"MEMORY (HEAP):MEMORY 存储引擎将表的数据存储在内存中,对于需要快速读写的临时表或缓存表非常有用。然而，由于数据存储在内存中，当 MySQL 服务重启时，数据会丢失。"),e("li",null,"NDB Cluster:NDB Cluster 存储引擎是 MySQL Cluster 的一部分，用于支持分布式存储和高可用性。它适用于需要水平扩展和高可用性的应用。"),e("li",null,"ARCHIVE:ARCHIVE 存储引擎用于进行高压缩的存储，适用于归档数据，但不支持索引，对于只需要进行周期性查询的历史数据存储是一个合适的选择。"),e("li",null,"BLACKHOLE:BLACKHOLE 存储引擎不会保存数据，而是将写入的数据丢弃。它通常用于测试和重定向数据流的场景。"),e("li",null,"CSV:CSV 存储引擎以 CSV 格式存储数据，适用于需要与其他应用程序之间进行数据交换的场景。"),e("li",null,"Federated:Federated 存储引擎允许在一个 MySQL 服务器上使用表，而数据实际上存储在另一个 MySQL 服务器上。这使得在分布式环境中进行查询变得更容易。")],-1),i=[a,o];function r(d,c,u,M,_,p){return n(),t("div",null,i)}const m=l(s,[["render",r]]);export{S as __pageData,m as default};
