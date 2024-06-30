优化 SQL 前应先通过性能分析工具分析 SQL,根据分析报告信息针对性的优化,大致流程如下:
数据库的优化分为 SQL 和索引优化、数据表结构优化、系统配置优化、硬件优化四个层面,优化效果从前往后逐层递减,优化成本从前往后增层递增,其中 SQL 语句和索引优化是效果最明显,成本最低的手段。

## 1.查看性能参数

Mysql 提供了 `SHOW STATUS`语句用于查看 MySQL 数据库服务器的 性能参数、执行频率等信息,语法如下:

```sql
SHOW [GLOBAL|SESSION] STATUS LIKE '参数';
```

常见的性能参数如下:

- Connections:Mysql 服务器连接数。
- Uptime:Mysql 服务器的上线时间。
- Slow_queries:慢查询的次数。
- Innodb_rows_read:执行 Select 查询返回的行数。
- Innodb_rows_inserted:执行 Insert 插入操作返回的函数。
- Innodb_rows_updated:执行 Update 更新操作返回的函数。
- Innodb_rows_deleted:执行 Delete 删除操作返回的函数。
- Com_select:查询操作的次数。
- Com_insert:插入操作的次数。
- Com_update:更新操作的次数。
- Com_delete:删除操作的次数。

```sql
####################### 例子

mysql> SHOW STATUS LIKE 'Connections';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Connections   | 170   |
+---------------+-------+
1 row in set (0.00 sec)

mysql> SHOW STATUS LIKE 'Slow_queries';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Slow_queries  | 0     |
+---------------+-------+
1 row in set (0.01 sec)

mysql> SHOW STATUS LIKE 'Innodb_rows_read';
+------------------+-----------+
| Variable_name    | Value     |
+------------------+-----------+
| Innodb_rows_read | 304151607 |
+------------------+-----------+
1 row in set (0.00 sec)
```

## 2.统计 SQL 查询的成本

- Last_query_const:用于查询优化器计算的最后一次编译查询的总成本,这对于比较同一查询的不同查询计划的成本很有用。该变量的默认值为 0,0 表示尚未编译查询。
- Last_query_partial_plans:查询优化器在前一个查询的执行计划构造中进行的迭代次数。

```sql
# 查询耗时:2.606s
SELECT * FROM student WHERE id = 3499021;

# 查看最后一次查询的成本,根据结果来看最后一次查询检索了520584个页
mysql> SHOW STATUS LIKE 'last_query_cost';
+-----------------+---------------+
| Variable_name   | Value         |
+-----------------+---------------+
| Last_query_cost | 520584.199000 |
+-----------------+---------------+
1 row in set (0.00 sec)

# 查询耗时:2.74s
SELECT * FROM student WHERE id BETWEEN 999008 AND 1209008;

# 查看最后一次查询的成本,根据结果来看最后一次查询检索了540584个页
mysql> SHOW STATUS LIKE 'last_query_cost';
+-----------------+---------------+
| Variable_name   | Value         |
+-----------------+---------------+
| Last_query_cost | 540584.199000 |
+-----------------+---------------+
1 row in set (0.00 sec)
```

检索页的数量并非越大查询越慢,这是因为查询时采用了顺序读取的方式将页面一次性加载到缓冲池中,然后再进行查找。虽然页数量(last_query_cost)增加了不少,但是通过缓冲池的机制,并没有增加多少查询时间。

## 3.开启慢查询日志

Mysql 慢查询日志用于记录查询时间(long_query_time)超过指定阈值,并且检查行数大于最小检查行数(min_examined_row_limit)的查询 SQL 语句。慢查询日志可用于查找需要很长时间执行的查询,当有大量慢查询语句时慢查询日志会频繁写入磁盘,从而影响 Mysql 服务器性能,一般推荐在生产环境关闭慢查询日志,因此慢日志查询是优化的候选者。慢查询日志有两个核心变量,当超过参数阈值 SQL 语句就会被写入慢日志中:

- min_examined_row_limit:min_examined_row_limit 表最小检查函数。min_examined_row_limit 的默认值为 0。
- long_query_time:长查询时间(单位秒),由于 min_examined_row_limit 的默认值,只有当 SQL 查询时间大于 long_query_time 时 SQL 语句才会被写入慢日志中,long_query_time 的默认值为 10s,也意味着 SQL 查询时间大于 10s 才会被写入慢日志。

```sql
# 查看慢日志查询是否开启,OFF表示关闭,ON表示开启
mysql> SHOW VARIABLES LIKE 'slow_query_log';
+----------------+-------+
| Variable_name  | Value |
+----------------+-------+
| slow_query_log | OFF   |
+----------------+-------+


############################# 关闭慢日志查询
# 关闭慢日志查询方式1(临时性)
SET GLOBAL slow_query_log=OFF;
# 关闭慢日志查询方式2(永久性),在Mysql配置文件中添加 slow_query_log=OFF 永久性关闭慢查询日志
[mysqld]
slow_query_log=OFF


############################# 开启慢日志查询
# 开启慢日志查询1(临时性)
SET GLOBAL slow_query_log=ON;
# 开启慢日志查询方式2(永久性),在Mysql配置文件中添加 slow_query_log=ON 永久性开启慢查询日志
[mysqld]
slow_query_log=OFF


############################# 查询慢日志参数
## min_examined_row_limit 默认值为 0
mysql> SHOW VARIABLES LIKE '%min_examined_row_limit%';
+------------------------+-------+
| Variable_name          | Value |
+------------------------+-------+
| min_examined_row_limit | 0     |
+------------------------+-------+

## long_query_time 默认值为 10s
mysql> SHOW VARIABLES LIKE '%long_query_time%';
+-----------------+-----------+
| Variable_name   | Value     |
+-----------------+-----------+
| long_query_time | 10.000000 |
+-----------------+-----------+

# 查看查询信息, slow_query_log_file 为慢日志存放路径
mysql> SHOW VARIABLES LIKE '%query%';
+------------------------------+---------------------------------------------------+
| Variable_name                | Value                                             |
+------------------------------+---------------------------------------------------+
| binlog_rows_query_log_events | OFF                                               |
| ft_query_expansion_limit     | 20                                                |
| have_query_cache             | NO                                                |
| long_query_time              | 1.000000                                          |
| query_alloc_block_size       | 8192                                              |
| query_prealloc_size          | 8192                                              |
| slow_query_log               | ON                                                |
| slow_query_log_file          | /usr/local/mysql/data/appledeMacBook-Pro-slow.log |
+------------------------------+---------------------------------------------------+
```

```sql
# 查看慢日志查询信息, slow_query_log_file 为慢日志存储位置
SHOW VARIABLES LIKE '%slow_query_log%';

# 开启慢日志查询,开启慢日志查询后会在mysql安装目录的data目录下生成一个日志文件
SET GLOBAL slow_query_log=ON;

# 设置长查询时间为1s,仅对新连接有效,设置后重新连接Mysql客户端
SET GLOBAL long_query_time = 1;


##################### 慢查询SQL例子
# 查询耗时:2.618s
SELECT * FROM student WHERE id = 111111;
# 查询耗时:4.82s
SELECT * FROM student WHERE id BETWEEN 999008 AND 1209008;
# 查询耗时:4.44s
SELECT * FROM student WHERE sex=1;
# 查询耗时:3.94s
SELECT * FROM student WHERE stu_name LIKE '%s';
# 查询耗时:2.76s
SELECT * FROM student WHERE stu_no LIKE '28d7c4c3-61e1-4f01-a674-b1b079d4ada5';


# 查询慢查询数量
mysql> SHOW STATUS LIKE 'slow_queries';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Slow_queries  | 5     |
+---------------+-------+
1 row in set (0.01 sec)
```

除了设置慢查询配置外,MySQL 内置了 mysqldumpslow 用于解析 MySQL 慢查询日志文件并归并慢日志信息,mysqldumpslow 可以分析日志、查找、分析 SQL。mysqldumpslow 参数如下:

- -a: 不将数字抽象成 N,字符串抽象成 S -s: 是表示按照何种方式排序：
  - c: 访问次数。
  - l: 锁定时间。
  - r: 返回记录。
  - t: 查询时间。
  - al:平均锁定时间。
  - ar:平均返回记录数。
  - at:平均查询时间 (默认方式)
  - ac:平均查询次数。
- -t: 即为返回前面多少条的数据。
- -g::后边搭配一个正则匹配模式,大小写不敏感的；

```sql
admin@appledeMacBook-Pro data % mysqldumpslow -s t -t 5 /usr/local/mysql/data/appledeMacBook-Pro-slow.log

Reading mysql slow query log from /usr/local/mysql/data/appledeMacBook-Pro-slow.log
Count: 2  Time=4.63s (9s)  Lock=0.00s (0s)  Rows=3232158.0 (6464316), root[root]@localhost
  SELECT * FROM student WHERE sex=N

Count: 1  Time=3.94s (3s)  Lock=0.00s (0s)  Rows=427736.0 (427736), root[root]@localhost
  SELECT * FROM student WHERE stu_name LIKE 'S'

Count: 1  Time=2.94s (2s)  Lock=0.00s (0s)  Rows=210001.0 (210001), root[root]@localhost
  SELECT * FROM student WHERE id BETWEEN N AND N

Count: 1  Time=2.76s (2s)  Lock=0.00s (0s)  Rows=1.0 (1), root[root]@localhost
  SELECT * FROM student WHERE stu_no LIKE 'S'

Count: 1  Time=2.72s (2s)  Lock=0.00s (0s)  Rows=1.0 (1), root[root]@localhost
  SELECT * FROM student WHERE id = N

```

mysqldumpslow 常用命令例子:

```shell
# 获取返回记录集最多的10个SQL
mysqldumpslow -s r -t 10 /usr/local/mysql/data/appledeMacBook-Pro-slow.log

# 获取访问次数最多的10个SQL
mysqldumpslow -s c -t 10 /usr/local/mysql/data/appledeMacBook-Pro-slow.log

# 获取按照时间排序的前10条里面含有左连接的查询语句
mysqldumpslow -s t -t 10 -g "left join" /usr/local/mysql/data/appledeMacBook-Pro-slow.log

# 另外建议在使用这些命令时结合 | 和more 使用,否则有可能出现爆屏情况
mysqldumpslow -s r -t 10 /usr/local/mysql/data/appledeMacBook-Pro-slow.log | more
```

## 4.查看 SQL 执行成本

`SHOW PROFILE`和`SHOW PROFILES`语句显示分析信息,用于展示在当前会话过程中执行的语句的资源使用情况 。`SHOW PROFILE`和`SHOW PROFILES`可能在未来的版本被删除,Mysql 官方推荐使用性能模式进行查询分析。

```sql
# 查看profile是否开启,OFF表示关闭,ON表示开启
mysql> SHOW VARIABLES LIKE 'profiling';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| profiling     | OFF   |
+---------------+-------+

# 开启profile
set profiling='ON';

# 关闭profile
set profiling='OFF';

# 查看当前会话所有 profile
mysql> show profiles;
+----------+------------+---------------------------------+
| Query_ID | Duration   | Query                           |
+----------+------------+---------------------------------+
|        1 | 0.00197000 | SHOW VARIABLES LIKE 'profiling' |
+----------+------------+---------------------------------+

# 最近一次查询的开销
show profile;
```

```sql


########################## show profile 例子
SELECT * FROM student WHERE id = 111111;
# 最近一次查询的开销
mysql> show profile;
+--------------------------------+----------+
| Status                         | Duration |
+--------------------------------+----------+
| starting                       | 0.000116 |
| Executing hook on transaction  | 0.000007 |
| starting                       | 0.000011 |
| checking permissions           | 0.000007 |
| Opening tables                 | 0.000055 |
| init                           | 0.000008 |
| System lock                    | 0.000069 |
| optimizing                     | 0.000033 |
| statistics                     | 0.000034 |
| preparing                      | 0.000025 |
| executing                      | 2.636977 |
| end                            | 0.000018 |
| query end                      | 0.000003 |
| waiting for handler commit     | 0.000009 |
| closing tables                 | 0.000008 |
| freeing items                  | 0.000024 |
| logging slow query             | 0.000081 |
| cleaning up                    | 0.000024 |
+--------------------------------+----------+
```

`SHOW PROFILE`结果列信息说明:

- Executing hook on transaction:执行事务钩子。
- checking permissions:检查权限。
- Opening tables:打开表。
- init:数据表初始化。
- System lock:系统加锁。
- optimizing:优化 SQL。
- statistics:统计 SQL。
- preparing:SQL 预处理。
- executing:执行 SQL 语句。
- query end:查询结束。
- waiting for handler commit:等待提交事务。
- closing tables:关闭表。
- freeing items:释放数据项。
- logging slow query:SQL 慢日志查询写入数据。
- cleaning up:清理数据。

`SHOW PROFILE` 常用查询参数:

- ALL:显示所有的开销信息。
- BLOCK IO:显示块 IO 开销。
- CONTEXT SWITCHES:上下文切换开销。
- CPU:显示 CPU 开销信息。
- IPC:显示发送和接收开销信息。
- MEMORY:显示内存开销信息。
- PAGE FAULTS:显示页面错误开销信息。
- SOURCE:显示和 Source_function、Source_file、Source_line 相关的开销信息。
- SWAPS:显示交换次数开销信息。

```sql
# 2 表示 PROFILE的query_id,可通过 SHOW PROFILES 查询
mysql> show profile cpu,block io for query 2;
+---------------+----------+----------+------------+--------------+---------------+
| Status        | Duration | CPU_user | CPU_system | Block_ops_in | Block_ops_out |
+---------------+----------+----------+------------+--------------+---------------+
| starting      | 0.000079 | 0.000068 |   0.000012 |            0 |             0 |
| freeing items | 0.000022 | 0.000011 |   0.000010 |            0 |             0 |
| cleaning up   | 0.000007 | 0.000005 |   0.000003 |            0 |             0 |
+---------------+----------+----------+------------+--------------+---------------+
```

## 5.分析查询语句

EXPLAIN(执行计划)用于显示来自 MySQL 优化器的有关语句执行计划的信息,执行计划可以解释 MySQL 如何处理 SQL 查询语句,包括有关表如何连接以及以何种顺序连接的信息。

:::tip
版本说明:MySQL 5.6.3 以前只能 EXPLAIN SELECT;MYSQL 5.6.3 以后就可以 EXPLAIN SELECT、UPDATE、DELETE 在 5.7 以前的版本中,想要显示 partitions 需要使用 explain partitions 命令;想要显示 filtered 需要使用 explain extended 命令。在 5.7 版本后,默认 explain 直接显示 partitions 和 filtered 中的信息。
:::

EXPLAIN 语法如下:

```sql
// 形式1
EXPLAIN SELECT select_options;
// 形式2
DESCRIBE SELECT select_options;
```

### 5.1 EXPLAIN 输出列说明

```sql
# EXPLAIN 例子
mysql> EXPLAIN SELECT * FROM student WHERE id = 111111;
+----+-------------+---------+------------+------+---------------+------+---------+------+---------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows    | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+---------+----------+-------------+
|  1 | SIMPLE      | student | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 4851282 |    10.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+---------+----------+-------------+
```

EXPLAIN 语句输出的各个列的作用如下:

| 列名          | 描述                                                      |
| ------------- | --------------------------------------------------------- |
| id            | 在一个大的查询语句中每个 SELECT 关键字都对应一个唯一的 id |
| select_type   | SELECT 关键字对应的查询类型                               |
| table         | 当前查询的表名                                            |
| partitions    | 查询数据的分区                                            |
| type          | 针对单表的连接类型                                        |
| possible_keys | 可供选择的索引                                            |
| key           | 当前查询使用的索引                                        |
| key_len       | 当前查询使用的索引长度                                    |
| ref           | 与索引比较的列                                            |
| rows          | 估计要检查的行数                                          |
| filtered      | 按表条件过滤的行百分比                                    |
| Extra         | 一些额外的信息                                            |

- **id**:SELECT 标识,在一个大的查询语句中每个 SELECT 关键字都对应一个唯一的 id。id 相同可以认为是一组,从上往下顺序执行,在所有组中,id 值越大,执行优先级就越高。每一个独立的 id 都表示一次独立的查询,一个 sql 的查询次数越少越好。
- **select_type**:SELECT(查询)类型,可选值如下:
  - SIMPLE:表示简单的 SELECT(包含连表查询),SQL 语句不包含 UNION 或子查询。例如:`EXPLAIN SELECT * FROM t1;`或`EXPLAIN SELECT * FROM s1 INNER JOIN s2;`。
  - PRIMARY:表示最外层 SELECT。例如:`EXPLAIN SELECT * FROM s1 UNION SELECT * FROM s2;`
  - UNION:表示 UNION 语句中的第二条或更高一条 SELECT 语句。
  - DEPENDENT UNION:表示 UNION 语句中的第二个或更高一个 SELECT 语句,取决于外部查询。
  - UNION RESULT:表示 UNION 语句的结果。
  - SUBQUERY:表示子查询的结果做为外层 SELECT 第一个 WHERE 的条件。例如:`EXPLAIN SELECT * FROM s1 WHERE key1 IN (SELECT key1 FROM s2) OR key3 = 'a';`。
  - DEPENDENT SUBQUERY:表示子查询的结果做为外层 SELECT 第一个 WHERE 的条件,但子查询的结果取决于外部查询。例如:`EXPLAIN SELECT * FROM s1 WHERE key1 IN (SELECT key1 FROM s2 WHERE s1.key2 = s2.key2) OR key3 = 'a';`。
  - DERIVED:表示派生表,派生表的结果集由其他表查询得到。例如:`EXPLAIN SELECT * FROM (SELECT key1, count(*) as c FROM s1 GROUP BY key1) AS derived_s1 where c > 1;`。
  - DEPENDENT DERIVED:表示依赖于另一个表的派生表。
  - MATERIALIZED:物化子查询。例如:`EXPLAIN SELECT * FROM s1 WHERE key1 IN (SELECT key1 FROM s2);`。
  - UNCACHEABLE SUBQUERY:表示一个子查询,其结果无法缓存,必须需要外部查询的每一行重新计算。
  - UNCACHEABLE UNION:表示 UNION 中属于不可缓存子查询的第二个或以后的条件。
- **table**:查询表名,可能是真实表名,也可能是表的别名。
- **partitions**:匹配的分区信息。
- **type**:type 表示针对单表的连接类型。可选值如下:

  - system:表示查询表只有一行(系统表)数据。const 这是连接类型的一个特例。

    ```sql
    CREATE TABLE t(i int) Engine=MyISAM;
    # 仅插入一行数据
    INSERT INTO t VALUES(1);

    # 查询表执行计划,连接类型(type)为system
    mysql> EXPLAIN SELECT * FROM t;
    +----+-------------+-------+------------+--------+---------------+------+---------+------+------+----------+-------+
    | id | select_type | table | partitions | type   | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
    +----+-------------+-------+------------+--------+---------------+------+---------+------+------+----------+-------+
    |  1 | SIMPLE      | t     | NULL       | system | NULL          | NULL | NULL    | NULL |    1 |   100.00 | NULL  |
    +----+-------------+-------+------------+--------+---------------+------+---------+------+------+----------+-------+
    ```

    - const:表示查询表最多有一个匹配行,在查询开始时读取。因为只有一行,所以这一行中列的值可以被优化器的其余部分视为常量。 const 表非常快,因为它们只被读取一次。

    ```sql
    CREATE TABLE s(
        id INT PRIMARY KEY AUTO_INCREMENT,
        s_name VARCHAR(30)
    );
    INSERT INTO s(s_name) VALUES('哈哈哈'),('呵呵呵'),('呜呜呜');

    # 查询表执行计划,连接类型(type)为const,因为id是主键,被创建了主键索引
    mysql> EXPLAIN SELECT * FROM s WHERE id=2;
    +----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
    | id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
    +----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
    |  1 | SIMPLE      | s     | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
    +----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
    ```

    - eq_ref:表示对于前面表中的每一行组合,从该表中读取一行。除了 system 和 const 类型之外,这是最好的连接类型。当联接查询连接字段已建立索引,并且索引是主键索引或唯一的非空索引时,使用该类型。

    ```sql
    DROP TABLE IF EXISTS s1;
    DROP TABLE IF EXISTS s2;
    CREATE TABLE s1(id INT PRIMARY KEY AUTO_INCREMENT);
    INSERT INTO s1 VALUES(),(),();
    CREATE TABLE s2(id INT);
    INSERT INTO s2 VALUES(1),(2),(3);

    # s1表的连接类型为eq_ref,s1和s2采用内连接方式连表查询,s2作为驱动表,s1作为被驱动表,
    # 由于s1表的id字段建立了主键索引,所以s1表的连接类型(type)为eq_ref,表明在访问s1表的时候可以通过主键的等值匹配来进行访问。
    mysql> EXPLAIN SELECT * FROM s1 INNER JOIN s2 ON s1.id=s2.id;
    +----+-------------+-------+------------+--------+---------------+---------+---------+---------------+------+----------+-------------+
    | id | select_type | table | partitions | type   | possible_keys | key     | key_len | ref           | rows | filtered | Extra       |
    +----+-------------+-------+------------+--------+---------------+---------+---------+---------------+------+----------+-------------+
    |  1 | SIMPLE      | s2    | NULL       | ALL    | NULL          | NULL    | NULL    | NULL          |    3 |   100.00 | Using where |
    |  1 | SIMPLE      | s1    | NULL       | eq_ref | PRIMARY       | PRIMARY | 4       | test_db.s2.id |    1 |   100.00 | Using index |
    +----+-------------+-------+------------+--------+---------------+---------+---------+---------------+------+----------+-------------
    ```

  - ref:对于先前表中的每个行组合,从该表中读取具有匹配索引值的所有行。ref 如果连接仅使用索引的最左前缀或索引不是主键或 UNIQUE 索引(换句话说,如果连接不能基于索引值选择单行)则使用。如果使用的索引只匹配几行,这是一个很好的连接类型。

  ```sql
    DROP TABLE IF EXISTS s1;
    CREATE TABLE s1(
    s_name VARCHAR(30) NOT NULL,
    INDEX idx_s_name(s_name)
    );
    INSERT INTO s1 VALUES('呵呵呵'),('呜呜呜'),('嘻嘻嘻');

    # s1表的s_name字段建立了普通索引,满足仅使用索引最左前缀,且索引不是主键索引或唯一索引,所以连接类型为ref
    mysql> EXPLAIN SELECT * FROM s1 WHERE s_name='呜呜呜';
    +----+-------------+-------+------------+------+---------------+------------+---------+-------+------+----------+-------------+
    | id | select_type | table | partitions | type | possible_keys | key        | key_len | ref   | rows | filtered | Extra       |
    +----+-------------+-------+------------+------+---------------+------------+---------+-------+------+----------+-------------+
    |  1 | SIMPLE      | s1    | NULL       | ref  | idx_s_name    | idx_s_name | 122     | const |    1 |   100.00 | Using index |
    +----+-------------+-------+------------+------+---------------+------------+---------+-------+------+----------+-------------+
  ```

  - fulltext:表示连接是使用 FULLTEXT(全文)索引执行的。
  - ref_or_null:ref_or_null 连接类型类似于 ref,但 MySQL 会额外搜索包含空值的行,这种连接类型优化最常用于解析子查询。

  ```sql
    DROP TABLE IF EXISTS s1;
    CREATE TABLE s1(
    s_name VARCHAR(30),
    INDEX idx_s_name(s_name)
    );
    INSERT INTO s1 VALUES('呵呵呵'),('呜呜呜'),('嘻嘻嘻');

    # s1的连接类型为ref_or_null,因为s_name字段建立了索引,且在WHERE条件用索引字段判断 OR s_name IS NULL
    mysql> EXPLAIN SELECT * FROM s1 WHERE s_name='呜呜呜' OR s_name IS NULL;
    +----+-------------+-------+------------+-------------+---------------+------------+---------+-------+------+----------+--------------------------+
    | id | select_type | table | partitions | type        | possible_keys | key        | key_len | ref   | rows | filtered | Extra                    |
    +----+-------------+-------+------------+-------------+---------------+------------+---------+-------+------+----------+--------------------------+
    |  1 | SIMPLE      | s1    | NULL       | ref_or_null | idx_s_name    | idx_s_name | 123     | const |    2 |   100.00 | Using where; Using index |
    +----+-------------+-------+------------+-------------+---------------+------------+---------+-------+------+----------+--------------------------+
  ```

  - index_merge:该连接类型表示表明使用了索引合并优化。例如:

  ```sql
    DROP TABLE IF EXISTS s1;
    CREATE TABLE s1(
    s_name VARCHAR(30),
    s_no  VARCHAR(30),
    INDEX idx_s_name(s_name),
    INDEX idx_s_no(s_no)
    );
    INSERT INTO s1(s_name,s_no) VALUES('呵呵呵','n1'),('呜呜呜','n2'),('嘻嘻嘻','n3');

    # 查询使用了idx_s_name和idx_s_no两个索引,Mysql会对查询进行索引合并优化,连接类型为index_merge
    mysql> EXPLAIN SELECT * FROM s1 WHERE s_name='呜呜呜' OR s_no ='n3';
    +----+-------------+-------+------------+-------------+---------------------+---------------------+---------+------+------+----------+-----------------------------------------------+
    | id | select_type | table | partitions | type        | possible_keys       | key                 | key_len | ref  | rows | filtered | Extra                                         |
    +----+-------------+-------+------------+-------------+---------------------+---------------------+---------+------+------+----------+-----------------------------------------------+
    |  1 | SIMPLE      | s1    | NULL       | index_merge | idx_s_name,idx_s_no | idx_s_name,idx_s_no | 123,123 | NULL |    2 |   100.00 | Using union(idx_s_name,idx_s_no); Using where |
    +----+-------------+-------+------------+-------------+---------------------+---------------------+---------+------+------+----------+-----------------------------------------------+
  ```

  - unique_subquery:unique_subquery 表示子查询唯一索引,该类型只是一个索引查找功能,完全替代子查询以提高效率。例如:

  ```sql
    DROP TABLE IF EXISTS s1;
    DROP TABLE IF EXISTS s2;
    CREATE TABLE s1(
        key1 INT,
        key2 INT,
        key3 VARCHAR(20),
        INDEX idx_key3(key3)
    );
    CREATE TABLE s2(
        id INT PRIMARY KEY,
        key1 INT,
        key2 INT,
        key3 INT,
        INDEX idx_key1(key1)
    );

    # s2以id作为主键,并在key1建立了索引,当s2被做为子查询时,s2的连接类型为unique_subquery
    mysql>  EXPLAIN SELECT * FROM s1 WHERE key2 IN (SELECT id FROM s2 where s1.key1
    = s2.key1) OR key3 = 'a';
    +----+--------------------+-------+------------+-----------------+------------------+---------+---------+------+------+----------+-------------+
    | id | select_type        | table | partitions | type            | possible_keys    | key     | key_len | ref  | rows | filtered | Extra       |
    +----+--------------------+-------+------------+-----------------+------------------+---------+---------+------+------+----------+-------------+
    |  1 | PRIMARY            | s1    | NULL       | ALL             | idx_key3         | NULL    | NULL    | NULL |    1 |   100.00 | Using where |
    |  2 | DEPENDENT SUBQUERY | s2    | NULL       | unique_subquery | PRIMARY,idx_key1 | PRIMARY | 4       | func |    1 |   100.00 | Using where |
    +----+--------------------+-------+------------+-----------------+------------------+---------+---------+------+------+----------+-------------+
  ```

  - index_subquery:index_subquery 表示子查询索引,此连接类型类似于 unique_subquery,它替换 IN 子查询,但它适用于以下形式的子查询中的非唯一索引。例如:

  ```sql
    DROP TABLE IF EXISTS s1;
    DROP TABLE IF EXISTS s2;
    CREATE TABLE s1(
        key1 INT,
        key2 INT,
        key3 VARCHAR(20),
        INDEX idx_key3(key3)
    );
    CREATE TABLE s2(
        key1 INT,
        key2 INT,
        key3 INT,
        INDEX idx_key3(key3),
        INDEX idx_key1(key1)
    );

    # s2在key1和key3字段上都创建了普通索引,s2作为子查询返回key3,外层SELECT通过IN 匹配 s2中key3的结果集,所以s2的连接方式是index_subquery
    mysql> EXPLAIN SELECT * FROM s1 WHERE key2 IN (SELECT key3 FROM s2 WHERE s1.key1 = s2.key1) OR key3 = 'a';
    +----+--------------------+-------+------------+----------------+-------------------+----------+---------+------+------+----------+-------------+
    | id | select_type        | table | partitions | type           | possible_keys     | key      | key_len | ref  | rows | filtered | Extra       |
    +----+--------------------+-------+------------+----------------+-------------------+----------+---------+------+------+----------+-------------+
    |  1 | PRIMARY            | s1    | NULL       | ALL            | idx_key3          | NULL     | NULL    | NULL |    1 |   100.00 | Using where |
    |  2 | DEPENDENT SUBQUERY | s2    | NULL       | index_subquery | idx_key3,idx_key1 | idx_key3 | 5       | func |    1 |   100.00 | Using where |
    +----+--------------------+-------+------------+----------------+-------------------+----------+---------+------+------+----------+-------------+
  ```

  - range:使用索引选择行,仅检索给定范围内的行。输出行中的索引列指示使用哪个索引,key_len 包含所使用的最长键部分,此类型的 ref 列为空。当使用索引列使用 `=`、`<>`、`>`、`>=`、`<`、`<=`、`IS NULL`、`<=>`、`BETWEEN AND`、`LIKE`、`IN()`运算符与常量进行比较时,连接类型为 range。

  ```sql
    DROP TABLE IF EXISTS s1;
    CREATE TABLE s1(
        key1 VARCHAR(30),
        INDEX idx_key1(key1)
    );
    INSERT INTO s1(key1) VALUES('a'),('b'),('c'),('d');

    # 连接类型为range
    mysql> EXPLAIN SELECT * FROM s1 WHERE key1 in('a','b');
    +----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+--------------------------+
    | id | select_type | table | partitions | type  | possible_keys | key      | key_len | ref  | rows | filtered | Extra                    |
    +----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+--------------------------+
    |  1 | SIMPLE      | s1    | NULL       | range | idx_key1      | idx_key1 | 123     | NULL |    2 |   100.00 | Using where; Using index |
    +----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+--------------------------+

    # 连接类型为range
    EXPLAIN SELECT * FROM s1 WHERE key1 > 'a' AND key1 < 'b';
  ```

  - index:连接类型与 index 相同 ALL,只是扫描了索引树。当查询仅使用属于单个索引的列时,MySQL 可以使用此连接类型。index 分为如下两种情况:
    - 如果查询的索引是覆盖索引(覆盖索引是指通过联合索引在表中),并且可以用于满足表中所需的所有数据,则只扫描索引树。仅扫描索引通常比扫描所有表数据(ALL)都快,因为索引的大小通常小于表数据。
    - 使用从索引读取数据以按索引顺序查找数据行来执行全表扫描。使用索引不显示在 Extra 列中。

  ```sql
    # 情况1:索引是覆盖索引,且查询出全表中所有数据
    DROP TABLE IF EXISTS s2;
    CREATE TABLE s2(
        key1 INT,
        key2 INT,
        # 创建覆盖索引,覆盖索引是指在查询中所有使用字段上都是创建了索引,在执行计划中Extra 为 Using index,说明使用了覆盖索引
        INDEX idx_key1_key2(key1,key2)
    );

    mysql> EXPLAIN SELECT * FROM s2;
    +----+-------------+-------+------------+-------+---------------+---------------+---------+------+------+----------+-------------+
    | id | select_type | table | partitions | type  | possible_keys | key           | key_len | ref  | rows | filtered | Extra       |
    +----+-------------+-------+------------+-------+---------------+---------------+---------+------+------+----------+-------------+
    |  1 | SIMPLE      | s2    | NULL       | index | NULL          | idx_key1_key2 | 10      | NULL |    1 |   100.00 | Using index |
    +----+-------------+-------+------------+-------+---------------+---------------+---------+------+------+----------+-------------+

    # 情况2:
    DROP TABLE IF EXISTS s1;
    CREATE TABLE s1(
        key1 INT not NULL,
        key2 INT,
        INDEX idx_key1(key1 ASC)
    );
    INSERT INTO s2(key1,key2) VALUES(1,2);
    EXPLAIN SELECT * FROM s1  ORDER BY key1 ASC;
  ```

  - ALL:表示扫描全表数据(会扫描表中每一行数据),ALL 连接类型的效率特别低效,推荐在表中添加索引来避免全表扫描。

  ```sql
    DROP TABLE IF EXISTS s1;
    CREATE TABLE s1(
    key1 VARCHAR(30)
    );

    mysql> EXPLAIN SELECT * FROM s1;
    +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
    | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
    +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
    |  1 | SIMPLE      | s1    | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    1 |   100.00 | NULL  |
    +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
  ```

  阿里巴巴开发手册规定:**SQL 性能优化的目标至少要达到 range 级别,要求是 ref 级别,最好是 const 级别**。

- **key_len**:key_len 表示实际使用到的索引长度(单位:byte)。根据 key_len,可以判断索引使用情况,比如在使用组合索引的时候,判断是否所有的索引字段是否都被查询用到,当 key 为 Null 时 key_length 的值也为 Null。
  Mysql 的 key_len 计算规则:

  - key_len 由索引列数据类型本身占用空间+额外空间(如果索引列可以为空或者索引列是变长类型计算 key_len 需要加上额外空间)。
  - 如果索引列可以为空,则在索引列数据类型本身占用空间基础上加 1。比如索引(`id`,`num_1`) id 列占用 4 个字节,num_1 列占用 4 个字节,且两列都可以为空,所以 key_len=4+4+2=10。
  - 如果索引列是变长的(比如 varchar,varbinary),则在索引列数据类型本身占用空间的基础上再加 2,比如索引(`name_3`,`name_4`),name_3 占用字节数 4\*10,name_4 占用字节数 40,name_3 可以为空,并且 name_3,name_4 两列都是变长类型,所以 key_len=40+40+1+2+2=85。
  - 如果索引列是字符型,则索引列数据类型本身占用空间跟字符集有关,比如 VARCHAR(M) 类型占用空间为 M \* Maxlen 。Maxlen 表示某个字符集中表示一个字符最多需要使用的字节数,在 utf8 字符编码下 Maxlen 为 3,在 utf8mb4 字符编码下 Maxlen 为 4。
  - 如果索引列是字符型,则索引列数据类型本身占用空间跟字符集有关,比如 VARCHAR(M) 类型占用空间为 M \* Maxlen。

- **ref**:当使用索引列等值查询时,与索引列进行等值匹配的对象信息。
- **rows**:预估的需要读取的记录行数。
- **filtered**:某个表经过搜索条件过滤后剩余记录条数的百分比。
- **Extra**:一些额外的信息。

### 5.2 EXPLAIN 四种输出格式

### 5.3 SHOW WARNINGS 的使用

## 6.分析优化器执行计划

## 7.MySQL 监控分析视图

MySQL 8.0 新特性包含了 sys 模式,sys 模式提供了一组帮助 DBA 和开发人员解释性能模式收集的数据的对象。sys schema 表示 sys 模式视图,sys Schema 包含许多以各种方式汇总性能模式表的视图,这些视图中的大多数都是成对出现的,因此该对中的一个成员与另一个成员具有相同的名称,并加上一个 x$ 前缀。例如`host_summary_by_file_io` 视图汇总了按主机分组的文件 I/O。

```sql
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+----------+------------+
| host       | ios      | io_latency |
+------------+----------+------------+
| background | 16103537 | 19.97 min  |
| localhost  |  8616563 | 2.17 min   |
+------------+----------+------------+

mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+----------+------------------+
| host       | ios      | io_latency       |
+------------+----------+------------------+
| background | 16103537 | 1198116975751968 |
| localhost  |  8616563 |  130150949160048 |
+------------+----------+------------------+
```

### 7.1 Sys schema 视图摘要

- 主机相关:以 host_summary 开头,主要汇总了 IO 延迟的信息。
- Innodb 相关:以 innodb 开头,汇总了 innodb buffer 信息和事务等待 innodb 锁的信息。
- I/o 相关:以 io 开头,汇总了等待 I/O、I/O 使用量情况。
- 内存使用情况:以 memory 开头,从主机、线程、事件等角度展示内存的使用情况。
- 连接与会话信息:processlist 和 session 相关视图,总结了会话相关信息。
- 表相关:以 schema_table 开头的视图,展示了表的统计信息。
- 索引信息:统计了索引的使用情况,包含冗余索引和未使用的索引情况。
- 语句相关:以 statement 开头,包含执行全表扫描、使用临时表、排序等的语句信息。
- 用户相关:以 user 开头的视图,统计了用户使用的文件 I/O、执行语句统计信息。
- 等待事件相关信息:以 wait 开头,展示等待事件的延迟情况。

### 7.2 Sys schema 视图使用场景

表相关:

```sql
# 1.查询表的访问量
select table_schema,table_name,sum(io_read_requests+io_write_requests) as io from sys.schema_table_statistics group by table_schema,table_name order by io desc;

# 2.查询占用bufferpool较多的表
select object_schema,object_name,allocated,data from sys.innodb_buffer_stats_by_table order by allocated limit 10;

# 3.查看表的全表扫描情况
select * from sys.statements_with_full_table_scans where db='dbname';
```

SQL 语句相关:

```sql
# 1. 监控SQL执行的频率
select db,exec_count,query from sys.statement_analysis order by exec_count desc;

# 2. 监控使用了排序的SQL
select db,exec_count,first_seen,last_seen,query from sys.statements_with_sorting limit 1;

# 3. 监控使用了临时表或者磁盘临时表的SQL
select db,exec_count,tmp_tables,tmp_disk_tables,query from sys.statement_analysis where tmp_tables>0 or tmp_disk_tables >0 order by (tmp_tables+tmp_disk_tables) desc;
```

索引相关:

```sql
# 1.查询冗余索引
select * from sys.schema_redundant_indexes;

# 2.查询未使用过的索引
select * from sys.schema_unused_indexes;

# 3. 查询索引的使用情况
select index_name,rows_selected,rows_inserted,rows_updated,rows_deleted
from sys.schema_index_statistics where table_schema='dbname' ;
```

查看 IO 监控信息:

```sql
# 1. 查看消耗磁盘IO的文件
select file,avg_read,avg_write,avg_read+avg_write as avg_io from sys.io_global_by_file_by_bytes order by avg_read limit 10;
```

查看 Innodb 相关信息:

```sql
# 1. 行锁阻塞情况
select * from sys.innodb_lock_waits;
```
