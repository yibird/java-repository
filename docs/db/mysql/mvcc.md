MVCC,全称为Multi-Version Concurrency Control,即多版本并发控制。这是一种数据库管理系统中用于提升并发性能的机制。在支持MVCC的系统中,比如MySQL的InnoDB存储引擎,数据库会为数据维护多个版本,从而使得读操作和写操作可以基本上同时进行而不需要相互阻塞,大大提高了系统的并发能力。


## MVCC的工作原理
