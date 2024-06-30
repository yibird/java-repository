## 索引的定义

## 索引分类及其实践

Mysql 的索引包含普通索引、唯一索引、全文索引、单列索引、多列索引(多列也叫联合索引或组合索引,是指根据多个表字段创建的索引)等。如果从功能逻辑上来看,索引有普通索引、唯一索引、全文索引四种。如果从物理实现方式来看,索引有聚簇索引和非聚簇索引两种。如果作用字段个数来看,索引分为单列索引和联合索引:

### 索引分类

- **普通索引**:普通索引是一种基本的索引类型,用于提高查询效率。普通索引并不具有唯一性约束,允许表中的多个记录拥有相同的索引值。

```sql
CREATE INDEX idx_employee_id ON employees (employee_id);🔄  ❓
```

- **唯一索引**:与普通索引类似,但具有唯一性约束,确保索引列的值在整个表中是唯一的。在业务开发中手机号、身份证都是唯一的,因此可以在这些唯一字段建立唯一索引提升查询效率。

```sql
CREATE UNIQUE INDEX idx_employee_phone ON employees (employee_phone);
```

- **联合索引**:联合索引也叫多列索引,是指基于多个列的索引。与单列索引不同,联合索引涉及到多个列,它可以包含两个或更多列,用于加速涉及这些列的查询。当使用 WHERE 根据多个列字段查询时,可以根据这些列建立联合索引。

```sql
CREATE INDEX idx_employee_department ON employees (employee_id, employee_name);  
```

- **全文索引**:全文索引可以用于在文本数据上进行全文本搜索。全文索引不同于普通索引,它支持更复杂的文本搜索操作,例如全文搜索、关键字搜索等。对于海量数据推荐使用专业的搜索引擎,例如 ElasticSearch 等等。
- **聚簇索引**:聚簇索引是一种特殊类型的索引,它决定了表的物理排序方式。聚簇索引将表的数据行存储在索引的叶子节点中,因此,表的数据存储和索引存储是混合在一起的。聚簇索引特点如下:
  - 一个表只能有一个聚簇索引:在 MySQL 中,每个表只能有一个聚簇索引。一般来说,聚簇索引通常是主键索引,但也可以是唯一索引。
  - 物理排序:聚簇索引决定了表的物理排序方式,因为表的数据行实际上存储在聚簇索引的叶子节点中。由于聚簇索引的物理排序方式,插入、更新和删除操作可能会导致数据行的移动,因此在频繁执行这些操作的表上,聚簇索引可能会导致性能问题。
  - 性能优势:由于聚簇索引将数据行和索引存储在一起,可以减少磁盘 I/O 操作,提高查询性能,特别是范围查询和顺序扫描。
  - InnoDB 存储引擎支持自动选择:聚簇索引在 InnoDB 存储引擎中得到广泛支持。在 InnoDB 中,如果没有显式地指定主键或唯一索引,系统将会选择一个唯一的索引作为聚簇索引。

```sql
# student_id是students表的主键列,因此因此它也是聚簇索引列。idx_grade 列是非聚簇索引列。在 InnoDB 存储引擎中,如果没有显式指定主键或唯一索引,系统会选择一个唯一的索引作为聚簇索引,通常是主键索引。
CREATE TABLE students (  
    student_id INT PRIMARY KEY, 
    student_name VARCHAR(255),
    grade INT,
    INDEX idx_grade (grade)
) ENGINE=InnoDB;
```

- **非聚簇索引**:非聚簇索引与聚簇索引相对应,与聚簇索引不同,非聚簇索引的叶子节点存储了指向实际数据行的指针,而不是将数据行直接存储在索引结构中。非聚簇索引特点:
  - 一个表允许有多个非聚簇索引:非聚簇与聚簇索引不同,一个表可以有多个非聚簇索引。这些索引可以包含在唯一索引、普通索引等中。
  - 物理排序与逻辑排序不同:由于非聚簇索引的叶子节点存储了指向实际数据行的指针,因此非聚簇索引的物理排序和逻辑排序可以是不同的。即表的数据行在磁盘上的物理存储顺序与非聚簇索引的逻辑排序不一定相同。
  - 适用于频繁更新的表:由于非聚簇索引不涉及数据行的物理排序,对表进行插入、更新和删除操作时,不会导致数据行的移动,因此在这些操作较频繁的表上,非聚簇索引可能更适用。
  - InnoDB 存储引擎:非聚簇索引在 InnoDB 存储引擎中得到广泛支持。InnoDB 存储引擎中的主键索引默认是聚簇索引,而其他索引是非聚簇索引。

```sql
# product_id是主键列,属于聚簇索引列,idx_price数据非聚簇索引列
CREATE TABLE products ( 
    product_id INT PRIMARY KEY, 
    product_name VARCHAR(255),
    price DECIMAL(10, 2),
    INDEX idx_price (price)
) ENGINE=InnoDB;
```

由于索引的实现是在存储引擎层面上的,不同的存储引擎支持的索引类型也不同,例如:

- InnoDB:支持 B-tree、Full-text 等索引,不支持 Hash 索引。
- MyISAM:支持 B-tree、Full-text 等索引,不支持 Hash 索引。
- Memory:支持 B-tree、Hash 等索引,不支持 Full-text 索引。
- NDB:支持 Hash 索引,不支持 B-tree、Full-text 等索引。
- Archive:不支持 B-tree、Hash、Full-text 等索引。

### 创建索引

创建索引的方式主要有创表时创建索引和通过 ALTER TABLE 在已存在表上创建索引两种方式。

#### 创建表时创建索引

```sql
CREATE TABLE table_name [col_name data_type] [UNIQUE | FULLTEXT | SPATIAL] [INDEX | KEY] [index_name] (col_name [length]) [ASC | DESC]
```

- UNIQUE、FULLTEXT 和 SPATIAL 为可选参数,分别表示唯一索引、全文索引和空间索引。
- INDEX 和 KEY 为同义词,两者作用一致,用来指定创建索引。
- index_name 用于指定索引名称,可选,如果未指定则 Mysql 默认以 col_name 为索引名。索引命名方式如下:
  - 创建主键索引时,索引命名格式为 pk+字段名,例如:pk_id、pk_stu_id 等等,pk 是 primary 的简写。
  - 创建唯一索引时,索引命名格式为 uk+字段名,例如:uk_uuid、uk_idcard,uk 是 unique 的简写。
  - 创建普通索引时,索引命名格式为 idx\_字段名,联合索引则以多个下划线分割多个字段,例如:idx_stuName、idx_stuName_stuNo、idx_stuName_address 等。
- length 为可选参数,表示索引的长度,只有字符串类型的字段才能指定索引长度。
- ASC 或 DESC 用于指定升序或降序的索引值存储。

```sql
# 1.创建普通索引。在book表book_name字段创建普通索引
CREATE TABLE book(
book_id INT,
book_name VARCHAR(100),
authors VARCHAR(100),
info VARCHAR(100),
comment VARCHAR(100),
create_at datetime,
INDEX(book_name)
);

# 查看表结构的索引信息,Key_name字段表示表中的索引名称
SHOW INDEX FROM book \G


# 2.创建唯一索引。在idCard字段创建唯一索引
CREATE TABLE superStudent(
id INT,
stu_name VARCHAR(100),
stu_no VARCHAR(100),
idCard CHAR(18),
UNIQUE INDEX uk_idCard(idCard)
);

# 查看表结构的索引信息
SHOW INDEX FROM superStudent \G


# 3.创建主键索引。设置字段为主键后Mysql会在该字段自动创建索引,在InnoDB中主键索引为聚簇索引。
# 注意:修改主键索引时,必须先删除原索引,在创建新索引
CREATE TABLE teacher(
id INT,
t_name VARCHAR(100),
t_no VARCHAR(100),
PRIMARY KEY(id)
);

# 查看表结构的索引信息
SHOW INDEX FROM teacher \G


# 4.创建单列索引。
CREATE TABLE doctor(
id INT,
d_name VARCHAR(100),
d_no VARCHAR(100),
# 指定索引长度为20
INDEX idx_d_name(d_name(20))
);

# 查看表结构的索引信息
SHOW INDEX FROM doctor \G


# 5.创建组合索引。在表中的id、name和age字段上建立组合索引
CREATE TABLE lawyer(
id INT,
name VARCHAR(100),
age VARCHAR(100),
INDEX idx_id_name_age(id,name,age)
);

# 查看表结构索引信息
SHOW INDEX FROM lawyer \G


# 6.创建全文索引。InnoDB在5.7支持全文索引,全文索引比 like + % 快 N 倍,但是可能存在精度问题,
# 如果字段值数据量较大,建议先添加数据再创建全文索引。
CREATE TABLE movie(
id INT,
name VARCHAR(100),
info VARCHAR(255),
create_at datetime,
FULLTEXT INDEX ft_info(info)
);

# 查看表结构索引信息
SHOW INDEX FROM movie \G
# 全文索引用match+against方式查询
SELECT * FROM movie WHERE MATCH(info) AGAINST ('查询字符串');

# 7.空间索引。创建空间索引要求字段必须为非空
CREATE TABLE location(
geo GEOMETRY NOT NULL,
SPATIAL INDEX spa_geo(geo)
) ENGINE=MyISAM;

# 查看表结构索引信息
SHOW INDEX FROM location \G

```

#### 创表后创建索引

在已经存在的表中创建索引可以使用`ALTER TABLE`语句或`CREATE INDEX`语句,`CREATE INDEX`被映射到一个`ALTER TABLE`语句上。ALTER TABLE 语句语法:

```sql
ALTER TABLE table_name ADD [UNIQUE | FULLTEXT | SPATIAL] [INDEX | KEY] [index_name] (col_name[length],...) [ASC | DESC]

# 例子:
CREATE TABLE driver(
id INT,
name VARCHAR(25)
);
ALTER TABLE driver ADD INDEX idx_name(name) ASC;
```

`CREATE TABLE`语句语法:

```sql
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name ON table_name (col_name[length],...) [ASC | DESC] 

# 例子:
CREATE TABLE nanny(
id INT,
name VARCHAR(25)
);
CREATE INDEX idx_name ON nanny(name) DESC;
```

MySQL 8.0 开始支持并行索引创建,通过并行化操作提高索引创建的速度,特别适用于大型表,例如:

```sql
ALTER TABLE employees ADD INDEX idx_parallel (last_name, first_name) ALGORITHM=INPLACE, LOCK=NONE;
```

### 删除索引

Mysql 支持 ALTER TABLE 和 DROP INDEX 两种语法删除索引,其语法如下:

```sql
# ALTER TABLE语法格式
ALTER TABLE table_name DROP INDEX index_name;
# 例子
ALTER TABLE driver DROP INDEX idx_name;

# DROP INDEX语法格式
DROP INDEX index_name ON table_name;
# 例子
DROP INDEX idx_name ON nanny;
```

## 索引适用场景

索引虽然可以提升查询效率,但索引也会占用额外的存储空间,滥用索引并不会带来查询效率的提升,而且也会影响查询效率,推荐在以下 11 种场景中创建索引。为了对比未创建索引和创建索引的查询效果,建议关闭 Mysql 查询缓存(Mysql 在 8.0.3 已弃用查询缓存,have_query_cache 变量也被弃用,其值始终为 NO),以免查询缓存影响到实际结果,测试数据量为 500w 条左右(4999800 条)。

```sql
# 注意:Mysql在8.0.3已弃用查询缓存,查询缓存适用于Mysql5.x
# 查看Mysql查询缓存是否开启,have_query_cache的值为NO表示已开启
show variables like '%query_cache%';

# 临时关闭Mysql查询缓存(会话级)
SET query_cache_type=0;

# 全局关闭Mysql查询缓存方式1:
SET global query_cache_type=0;
SET global query_cache_size=0;

# 全局关闭Mysql查询缓存方式2:在Mysql配置文件添加query_cache_type=0和query_cache_size=0
# vi my.cnf
query_cache_type=0
query_cache_size=0

```

### 字段的数值有唯一值

业务上具有唯一特性的字段,即使是组合字段,也必须建成唯一索引。虽然唯一索引影响了 insert 速度,这个速度损耗可以忽略,建立索引后合理使用索引查询效率会有一个质的飞跃。例如学生表的学生学号字段、用户表的身份证字段都推荐创建唯一索引以提高查询效率。

```sql
# 创建索引前查询耗时:2.725s
SELECT * FROM student WHERE stu_no='816685c2-b280-446d-88be-db8b5e2846af';

# 创建索引
ALTER TABLE student ADD INDEX idx_stu_no(stu_no);

# 创建索引后查询耗时:0.000s
EXPLAIN SELECT * FROM student WHERE stu_no='816685c2-b280-446d-88be-db8b5e2846af';

# 删除索引
DROP INDEX idx_stu_no ON student;
```

### 频繁作为 WHERE 查询的条件字段

如果某些字段在 SELECT 语句的 WHERE 条件中经常使用,推荐给这些字段创建索引,尤其大数据量的情况,创建普通或联合索引能大幅度提升查询效率。

```sql
# 创建索引前查询耗时:2.806s
SELECT * FROM student WHERE stu_name='Reuben Schumm';

# 在stu_name上创建索引
ALTER TABLE student ADD INDEX idx_stu_name(stu_name);

# 创建索引后查询耗时:0.000s
EXPLAIN SELECT * FROM student WHERE stu_name='Reuben Schumm';

# 删除索引
DROP INDEX idx_stu_name ON student;
```

### 经常使用 GROUP BY 和 ORDER BY 的列

索引就是让数据按照某种顺序进行存储或检索,当使用`GROUP BY`语句对数据进行分组,或使用`ORDER BY`语句对数据进行排序时,推荐在分组或排序的字段上创建索引,如果排序的列有多个,则推荐在这些列上创建联合索引。

```sql
# 创建索引前创建查询耗时:2.800s
SELECT course_id FROM student WHERE sex > 20  GROUP BY course_id ORDER BY course_id;

# 在sex和course_id添加联合索引
ALTER TABLE student ADD INDEX idx_sex_course_id(sex,course_id);

# 创建索引后查询耗时:0.001s,查看执行计划的key列使用了idx_sex_course_id索引
EXPLAIN SELECT course_id FROM student WHERE sex > 20  GROUP BY course_id ORDER BY course_id;

# 删除索引
DROP INDEX idx_sex_course_id ON student;
```

### UPDATE、DELETE 的 WHERE 条件列

对数据按照某些条件进行查询后再操作 `UPDATE` 或 `DELETE` 操作,如果对 WHERE 字段创建了索引,就能大幅度提升 `UPDATE` 和 `DELETE` 效率。这是因为 `UPDATE` 或 `DELETE` 时首先根据 WHERE 条件列检索目标记录,然后对检索后的记录进行 `UPDATE` 或 `DELETE`。如果进行 `UPDATE` 时,更新的字段是非索引字段,提升的效率会更明显,因为非索引字段更新不需要对索引进行维护。

```sql
# 创建索引前更新耗时:3.577000s
UPDATE student SET stu_no='qwefqwe-asd1-asdqwe-khjqwe-qeqweigqwe',sex=1 WHERE id = 4999001;

# 创建索引
ALTER TABLE student ADD INDEX idx_id(id);

# 创建索引后更新耗时:0.000s
EXPLAIN UPDATE student SET stu_no='asdqwe-asd1-kqweq-khjqwe-bvjdghd',sex=0 WHERE id = 4999001;

# 删除索引
DROP INDEX idx_id ON student;
```

### DISTINCT 字段创建索引

DISTINCT 可以对一个列或多个列去除重复数据,在去重列上添加索引能大幅度提升查询效率。去重后的结果会按递增顺序进行展示,这是因为索引会对数据按照某种顺序进行排序,所以在去重的时候也会快很多。

```sql
# 创建索引前查询耗时:2.596s
SELECT DISTINCT sex FROM student;

# 创建索引
ALTER TABLE student ADD INDEX idx_sex(sex);

# 创建索引后查询耗时:0.000s
EXPLAIN SELECT DISTINCT sex FROM student;

# 删除索引
DROP INDEX idx_sex ON student;
```

### 多表 JOIN 连接操作时,创建索引注意事项

- 连接表的数量尽量不要超过 3 张。因为每增加一张表就相当于增加了一次嵌套的循环,数量级增长会非常快,严重影响查询效率。
- 对 WHERE 条件列创建索引。因为 WHERE 才是对数据条件的过滤,如果在数据量非常大的情况下,没有 WHERE 条件过滤操作效率非常低下。
- 对用于连接的字段创建索引。并且该字段在多张表中的类型必须一致,例如 course_id 在 student 表和 course 表中都为 BIGINT 类型,而不能一个为 BIGINT 另一个为 VARCHAR 类型。

```sql
# 创建索引前查询耗时:2.411s
SELECT  student.stu_name,student.stu_no,course.course_name
FROM student JOIN course  ON student.course_id = course.id
WHERE student.stu_name='Jeffie Herman';

# 仅对stu_name字段创建索引
ALTER TABLE student ADD INDEX idx_stu_name(stu_name);

# 创建name索引后查询耗时:0.042s
SELECT  student.stu_name,student.stu_no,course.course_name
FROM student JOIN course  ON student.course_id = course.id
WHERE student.stu_name='Jeffie Herman';

# 在student和course表的连表字段创建索引
ALTER TABLE student ADD INDEX idx_id(id);
ALTER TABLE course ADD INDEX idx_id(id);

# 创建name和连表字段索引后查询耗时:0.000s
SELECT  student.stu_name,student.stu_no,course.course_name
FROM student JOIN course  ON student.course_id = course.id
WHERE student.stu_name='Jeffie Herman';

# 删除索引
DROP INDEX idx_stu_name ON student;
DROP INDEX idx_id ON student;
DROP INDEX idx_id ON course;
```

### 使用列的类型小的创建索引

在数据库中,选择列的数据类型时要尽可能使用较小的数据类型创建索引,这是因为较小的数据类型通常能提高索引的性能和效率:

- 减少存储空间:较小的数据类型占用的存储空间和内存更少,这意味着索引占用的磁盘空间和内存更少。在磁盘上占用更少的空间有助于减少 I/O 操作的开销,从而提高查询性能。
- 提高缓存命中率:较小的索引可以使更多的索引数据能够被缓存到内存中,这样在进行查询时可以减少磁盘访问的次数,从而提高查询速度。
- 加快比较操作:数据库在进行索引查找时需要对索引中的数据进行比较。较小的数据类型进行比较操作时,CPU 处理的速度更快,因为较小的数据类型通常意味着较少的字节需要处理。
- 减少索引层级:B-tree 和其他类似的数据结构用于存储索引时,较小的数据类型意味着可以在同样的空间内存储更多的索引值。这样可以减少树的层级深度,从而减少查找时的路径长度,提升查找速度。

### 使用字符串前缀创建索引

在 VARCHAR 字段上建立索引时,必须指定索引长度,没必要对全字段建立索引,根据实际文本区分度决定索引长度(Alibaba 开发手册规范)。指定索引长度的索引被称为前缀索引,例如 address 字段,如果不指定索引的长度或索引的长度过长,就达不到节省索引存储空间的目的。如果索引的长度过短,则导致索引的重复内容太多,字段的散列度(也称为选择性或区分度)会降低,索引的区分度越高则价值就越高,意味着对于检索的性价比就高。

Alibaba 开发手册推荐对于一般对字符串类型数据,索引长度推荐设置为 20,区分度会高达 90% 以上,可以使用 count(distinct left(列名, 索引长度))/count(\*)的区分度来确定。

```sql
# addres所有数据区分度:0.1251
select count(distinct address) / count(*) from student;

# 区分度为:0.0347、0.1190、0.1251、0.1251
select count(distinct left(address,10)) / count(*) as sub10,
count(distinct left(address,15)) / count(*) as sub11,
count(distinct left(address,20)) / count(*) as sub12,
count(distinct left(address,25)) / count(*) as sub13
from student;
```

### 区分度高(散列性高)的列适合作为索引

如果选择性(区分度)低,极端性情况下可能会扫描全部或者大多数索引,然后再回表,这样反而增加了 io 的消耗,这个过程可能不如直接走主键索引性能高。

### 使用最频繁的列放到联合索引的左侧

这样也可以较少的建立一些索引,同时,由于"最左前缀原则",可以增加联合索引的使用率。

### 在多个字段都要创建索引的情况下,联合索引优于单值索引

如果查询经常涉及多个列进行过滤和排序,使用联合索引可以加速涉及这些列的查询操作,而且联合索引可以成为覆盖索引(covering index),即索引包含了查询所需的所有列,从而避免回表操作。对于排序和范围查询,联合索引比单值索引更有效,例如,对于 ORDER BY col1, col2 的查询,联合索引 (col1, col2) 可以避免额外的排序操作。

## 禁止创建索引的常用场景

### where 中使用不到的字段,不建议创建索引

索引的主要目的是加速查询操作,特别是加速 WHERE 子句、排序(ORDER BY)和分组(GROUP BY)操作。如果字段不会出现在 WHERE 子句中,那么该字段的索引在过滤数据时没有用处,也就无法显著提高查询性能。而且创建索引会占用存储空间,并增加插入、更新、删除操作的额外开销。

### 数据量小的表最好不要使用索引

数据量少的表添加索引查询效率并不会有所提升,反而会有索引的占用空间消耗。

### 有大量重复数据的列上不要建立索引

有大量重复数据的列上不要建立索引,例如 sex,要在 100 万行数据中查找其中的 50 万行(比如性别为男的数据),查询数据时先会访问 50w 次索引,然后访问 50w 次表,访问次数的开销可能比全表扫描的开销还大。当数据重复度大,比如高于 10% 的时候,也不需要对该字段使用索引。

### 不建议用无序的值作为索引

例如身份证、UUID(在索引比较时需要转为 ASCII,并且插入时可能造成页分裂)、MD5、HASH、无序长字
符串等。

### 删除不再使用或者很少使用的索引

而且索引会占用存储空间,并增加插入、更新、删除操作的额外开销,因删除未使用的索引,从而避免影响插入、更新、删除性能。

### 不要定义冗余或重复的索引

```sql
CREATE TABLE person_info(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
birthday DATE NOT NULL,
phone_number CHAR(11) NOT NULL,
country varchar(100) NOT NULL,
PRIMARY KEY (id),
KEY idx_name_birthday_phone_number (name(10), birthday, phone_number),
KEY idx_name (name(10))
);
```

person_info 表中创建了两个索引,idx_name_birthday_phone_number 是一个根据 name、birthday、phone_number 字段创建的联合,idx_name 是根据 name 字段创建的索引,由于联合索引已包含 name 字段,所以 idx_name 索引是冗余的。

```sql
CREATE TABLE repeat_index_demo (
col1 INT PRIMARY KEY, col2 INT,
UNIQUE uk_idx_c1 (col1),
INDEX idx_c1 (col1)
);
```

重复索引是指在一个列上创建多个索引,col1 既是主键、又给它定义为一个唯一索引,还给它定义了一个普通索引,可是主键本身就会生成聚簇索引,所以定义的唯一索引和普通索引是重复的,这种情况要避免。

## 索引高级特性

### 覆盖索引（Covering Index）

### 索引下推

索引下推(Index Condition Pushdown, 简称 ICP)是 MySQL5.6 版本的新特性,用于优化数据查询。它能减少回表查询次数,提高查询效率。索引下推是通过把索引过滤条件下推到存储引擎,来减少 MySQL 存储引擎访问基表的次数以及 MySQL 服务层访问存储引擎的次数。索引下推可以将部分查询条件下推至存储引擎层面进行处理,从而减少需要返回给 MySQL 服务器层面的数据量,提高查询性能。索引下推工作原理:在传统的索引扫描过程中,MySQL 会先从索引中获取行指针,然后到表中获取完整的行数据,再根据 WHERE 条件进行过滤。而使用索引下推时,部分 WHERE 条件可以在存储引擎层应用,从而减少传递给 MySQL 服务器层的数据量。默认情况下,ICP 在 InnoDB 和 MyISAM 存储引擎中是开启的:

```sql
# 查询ICP是否启用,返回结果中index_condition_pushdown表示ICP,为on表示已启用
SHOW VARIABLES LIKE 'optimizer_switch';
# 启用ICP
SET optimizer_switch = 'index_condition_pushdown=on';
# 禁用ICP
SET optimizer_switch = 'index_condition_pushdown=off';
```

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(50),
    category VARCHAR(50),
    price DECIMAL(10, 2)
);

# 在category和price列上创建复合索引
CREATE INDEX idx_category_price ON products (category, price);

# 执行查询语句,在EXPLAIN输出结果中,如果Extra列包含Using index condition,则表示该查询使用了索引下推。
EXPLAIN SELECT * FROM products WHERE category = 'Electronics' AND price < 100;
```

在没有索引下推优化的情况下,MySQL 会先通过 idx_category_price 索引查找到所有 category = 'Electronics' 的行指针,然后回表获取完整的行数据,再根据 price < 100 进行过滤。使用索引下推优化后,MySQL 可以在存储引擎层先应用 price < 100 条件,只返回满足 category = 'Electronics' AND price < 100 条件的行指针,从而减少了回表次数,提高查询性能。
