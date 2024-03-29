## SQL 语句优化

### 常用查询优化策略

#### 避免使用 SELECT \*

#### 使用 UNION ALL 代替 UNION

### 关联查询优化

### 子查询优化

### 排序优化

### GROUP BY 优化

### 分页查询优化

## 索引优化

### 索引失效场景

### 覆盖索引

### 索引下推

### 1.禁止使用 SELECT \*

### 小表驱动大表

### 使用 UNION ALL 代替 UNION

### WHERE 语句注意事项

- 避免在 WHERE 子句中使用函数:使用函数可能导致无法使用索引,应尽量避免在 WHERE 子句中对列进行函数操作,以充分利用索引。
- 避免在 WHERE 子句中使用 OR:OR 操作符通常会导致全表扫描,影响性能,应尽量使用 IN 或者 UNION 来替代。
- 避免在 WHERE 子句中对字段进行运算:在 WHERE 子句中进行字段运算可能导致无法使用索引,影响查询性能。

### ORDER BY 语句注意事项

- 避免在 ORDER BY 子句中使用表达式或函数:ORDER BY 子句中使用表达式或函数可能导致无法使用索引,应尽量避免在 ORDER BY 中使用函数或表达式。
- 使用索引覆盖:如果 ORDER BY 的列上存在索引,并且查询中只选择了索引列，数据库可以使用索引覆盖（Index Covering）来避免回表操作，提高排序的性能。

### LIMIT 分页

当一次性查询大量数据并返回时,会消耗大量 CPU、内存、带宽等资源,增加 MySQL 服务器压力,极端情况下可能会导致内存溢出,通过 LIMIT 语句可以限制结果集返回条数,可以有效的减少资源消耗和网络传输延迟。LIMIT 的原理是在查询的执行过程中，限制返回的结果集的行数。数据库引擎在执行查询时，会按照查询条件和排序要求获取所有符合条件的记录，然后通过 LIMIT 来截取一定数量的记录返回给用户。当 LIMIT 偏移量很大时,数据库引擎需要跳过大量的记录才能达到指定的偏移位置,这可能导致性能下降。此时,推荐使用游标分页或范围查询等策略进行优化。
